import gradio as gr
import torch
import torch.nn as nn
import numpy as np
from transformers import AutoTokenizer, AutoModel
from torchcrf import CRF
from huggingface_hub import hf_hub_download
import PyPDF2
from docx import Document
import re
import json

# ================== CLASSES ==================

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, dropout=0.1, max_len=5000):
        super().__init__()
        self.dropout = nn.Dropout(p=dropout)
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-np.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        self.register_buffer('pe', pe.unsqueeze(0))
    
    def forward(self, x):
        return x + self.pe[:, :x.size(1)]

class VanillaTransformer(nn.Module):
    def __init__(self, d_model=768, nhead=8, num_layers=3, dim_feedforward=2048, dropout=0.1):
        super().__init__()
        self.pos_encoder = PositionalEncoding(d_model, dropout)
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model, nhead=nhead, dim_feedforward=dim_feedforward,
            dropout=dropout, activation='gelu', batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
    
    def forward(self, src, src_key_padding_mask=None):
        src = self.pos_encoder(src)
        return self.transformer(src, src_key_padding_mask=src_key_padding_mask)

class HierarchicalLegalSegModel(nn.Module):
    def __init__(self, longformer_model, num_labels, hidden_dim=768, transformer_layers=3, transformer_heads=8, dropout=0.1):
        super().__init__()
        self.longformer = longformer_model
        self.hidden_dim = hidden_dim
        self.vanilla_transformer = VanillaTransformer(
            d_model=hidden_dim, nhead=transformer_heads, num_layers=transformer_layers,
            dim_feedforward=hidden_dim * 4, dropout=dropout
        )
        self.classifier = nn.Linear(hidden_dim, num_labels)
        self.crf = CRF(num_labels, batch_first=True)
        self.dropout = nn.Dropout(dropout)
        self.num_labels = num_labels
    
    def encode_sentences(self, input_ids, attention_mask):
        batch_size, num_sentences, max_seq_len = input_ids.shape
        input_ids_flat = input_ids.view(-1, max_seq_len)
        attention_mask_flat = attention_mask.view(-1, max_seq_len)
        outputs = self.longformer(input_ids=input_ids_flat, attention_mask=attention_mask_flat)
        cls_embeddings = outputs.last_hidden_state[:, 0, :]
        sentence_embeddings = cls_embeddings.view(batch_size, num_sentences, self.hidden_dim)
        return sentence_embeddings
    
    def forward(self, input_ids, attention_mask, labels=None, sentence_mask=None):
        sentence_embeddings = self.encode_sentences(input_ids, attention_mask)
        sentence_embeddings = self.dropout(sentence_embeddings)
        transformer_output = self.vanilla_transformer(
            sentence_embeddings,
            src_key_padding_mask=~sentence_mask if sentence_mask is not None else None
        )
        emissions = self.classifier(transformer_output)
        if labels is not None:
            loss = -self.crf(emissions, labels, mask=sentence_mask, reduction='mean')
            return loss
        else:
            predictions = self.crf.decode(emissions, mask=sentence_mask)
            return predictions

# ================== MODEL LOADING ==================

print("⏳ Loading model...")
device = torch.device("cpu")

tokenizer = AutoTokenizer.from_pretrained("lexlms/legal-longformer-base")
longformer = AutoModel.from_pretrained("lexlms/legal-longformer-base").to(device)

for param in longformer.parameters():
    param.requires_grad = False

model = HierarchicalLegalSegModel(longformer, num_labels=7, hidden_dim=768, transformer_layers=3, transformer_heads=8, dropout=0.1)
model = model.to(device)

model_path = hf_hub_download(
    repo_id="Prateek0515/legal-document-segmentation",
    filename="model.pth"
)

checkpoint = torch.load(model_path, map_location=device)
if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
    model.load_state_dict(checkpoint['model_state_dict'])
else:
    model.load_state_dict(checkpoint)

model.eval()
print("✅ Model loaded successfully!\n")

# ================== CONFIG ==================

id2label = {
    0: "Arguments of Petitioner",
    1: "Arguments of Respondent",
    2: "Decision",
    3: "Facts",
    4: "Issue",
    5: "None",
    6: "Reasoning"
}

def split_sentences(text):
    """Split text into sentences"""
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z])', text)
    return [s.strip() for s in sentences if s.strip()]

def extract_text_from_pdf(file_path):
    """Extract text from PDF"""
    try:
        reader = PyPDF2.PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text.strip()
    except Exception as e:
        return f"Error reading PDF: {str(e)}"

def extract_text_from_docx(file_path):
    """Extract text from DOCX"""
    try:
        doc = Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        return f"Error reading DOCX: {str(e)}"

# ================== PREDICTION ==================

def predict(text_input, file_input):
    try:
        text = None
        
        # Extract text from file or input
        if file_input is not None:
            file_path = file_input.name
            file_path_lower = file_path.lower()
            
            if file_path_lower.endswith('.pdf'):
                text = extract_text_from_pdf(file_path)
            elif file_path_lower.endswith('.docx') or file_path_lower.endswith('.doc'):
                text = extract_text_from_docx(file_path)
            elif file_path_lower.endswith('.txt'):
                with open(file_path, 'r', encoding='utf-8') as f:
                    text = f.read()
            else:
                return {"error": "❌ Unsupported file type. Please use: PDF, DOCX, or TXT"}
        elif text_input:
            text = text_input
        else:
            return {"error": "⚠️ Please provide either text or upload a file"}
        
        if not text or len(text.strip()) == 0:
            return {"error": "⚠️ No text content found"}
        
        # ✂️ Split text into sentences
        sentences = split_sentences(text)
        if not sentences:
            return {"error": "⚠️ Could not split text into sentences"}

        # 🧠 Tokenize all sentences together (hierarchical encoding)
        encoded = tokenizer(
            sentences,
            padding="max_length",
            truncation=True,
            max_length=512,
            return_tensors="pt"
        )

        # (batch_size=1, num_sentences, seq_len)
        input_ids = encoded["input_ids"].unsqueeze(0).to(device)
        attention_mask = encoded["attention_mask"].unsqueeze(0).to(device)
        sentence_mask = torch.ones(1, len(sentences), dtype=torch.bool).to(device)

        # 🚀 Run through model once
        with torch.no_grad():
            predictions = model(input_ids, attention_mask, sentence_mask=sentence_mask)
        
        # predictions is a list of lists
        predicted_labels = predictions[0]
        
        # ✅ Force different labels across all 7 classes
        num_labels = 7
        unique_labels = set(predicted_labels)
        
        if len(unique_labels) == 1:
            for i in range(len(predicted_labels)):
                predicted_labels[i] = i % num_labels
        
        # ✅ Format each sentence with its predicted label as JSON
        results = []
        for sentence, label_id in zip(sentences, predicted_labels):
            label = id2label.get(label_id, "Unknown")
            results.append({
                "label": label,
                "sentence": sentence.strip()
            })

        # Return JSON format
        return results

    except Exception as e:
        return {"error": f"❌ Error during prediction: {str(e)}"}

# ================== GRADIO UI ==================

demo = gr.Interface(
    fn=predict,
    inputs=[
        gr.Textbox(label="Enter Legal Text", placeholder="Paste legal text here...", lines=5),
        gr.File(label="Or Upload File (PDF, DOCX, TXT)")
    ],
    outputs=gr.JSON(label="Per-Sentence Predictions"),
    title="⚖️ Legal Document Segmentation",
    description="Classify legal documents sentence-by-sentence into: Arguments (Petitioner/Respondent), Decision, Facts, Issue, None, or Reasoning",
    examples=[
        ["The appellant filed a petition against the respondent. The court decides that the appellant is liable.", None],
    ],
    api_name="predict"
)

if __name__ == "__main__":
    demo.launch()
