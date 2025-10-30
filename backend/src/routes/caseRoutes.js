import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cases
 *   description: Endpoints for document upload, listing, and retrieval
 */

const UPLOADS_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${Date.now()}-${uuidv4()}${ext}`);
  },
});
const upload = multer({ storage });

function generateMockResults(filename) {
  const mockSentences = [
    { text: "The petitioner filed a case...", roleId: "facts", confidence: 92 },
    { text: "The main issue is whether...", roleId: "issues", confidence: 88 },
    { text: "The petitioner argues...", roleId: "argument_petitioner", confidence: 85 },
    { text: "The respondent contends...", roleId: "argument_respondent", confidence: 87 },
    { text: "The court considers Section 56...", roleId: "reasoning", confidence: 94 },
    { text: "After careful consideration...", roleId: "decision", confidence: 96 },
  ];
  return {
    sentences: mockSentences.map((s, i) => ({ ...s, originalIndex: i })),
    summary: "This is a mock legal summary.",
    avgConfidence: Math.round(mockSentences.reduce((a, b) => a + b.confidence, 0) / mockSentences.length),
  };
}

function requireUser(req, res, next) {
  if (req.user) return next();
  if (req.body && req.body.userId) return next();
  return res.status(401).json({ message: "Unauthorized" });
}

/**
 * @swagger
 * /api/cases/upload:
 *   post:
 *     summary: Upload a case document or text
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               text:
 *                 type: string
 *                 example: The petitioner submitted...
 *               userId:
 *                 type: string
 *                 example: 652fb8c91a3c4a76a8cd4c72
 *     responses:
 *       201: { description: Case uploaded successfully }
 *       400: { description: User not found }
 *       401: { description: Unauthorized }
 *       500: { description: Server error }
 */
router.post("/upload", upload.single("file"), requireUser, async (req, res) => {
  try {
    const userId = (req.user && (req.user._id || req.user.id)) || req.body.userId;
    if (!userId) return res.status(400).json({ message: "User not found" });

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found in DB" });

    const docId = uuidv4();
    const originalName = req.file ? req.file.originalname : (req.body.title || `pasted-${docId}.txt`);
    const storedFilename = req.file ? req.file.filename : null;

    if (!req.file && req.body.text) {
      const txtName = `${Date.now()}-${docId}.txt`;
      fs.writeFileSync(path.join(UPLOADS_DIR, txtName), req.body.text, "utf8");
    }

    const results = generateMockResults(originalName);

    const caseRecord = {
      id: docId,
      title: originalName,
      storedFilename,
      date: new Date(),
      sentenceCount: results.sentences.length,
      status: "completed",
      results,
    };

    user.cases = [caseRecord, ...(user.cases || [])];
    await user.save();

    return res.status(201).json({ document: caseRecord, results });
  } catch (err) {
    console.error("Error in /api/cases/upload:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/cases:
 *   get:
 *     summary: Get all uploaded cases for the logged-in user
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: false
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of user's documents }
 *       400: { description: User not provided }
 *       404: { description: User not found }
 *       500: { description: Server error }
 */
router.get("/", requireUser, async (req, res) => {
  try {
    const userId = (req.user && (req.user._id || req.user.id)) || req.query.userId;
    if (!userId) return res.status(400).json({ message: "User not provided" });

    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ documents: user.cases || [] });
  } catch (err) {
    console.error("Error in GET /api/cases:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * @swagger
 * /api/cases/{id}:
 *   get:
 *     summary: Get a specific case by ID
 *     tags: [Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Case details retrieved }
 *       404: { description: Case not found }
 *       500: { description: Server error }
 */
router.get("/:id", requireUser, async (req, res) => {
  try {
    const userId = (req.user && (req.user._id || req.user.id)) || req.query.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const doc = (user.cases || []).find((c) => c.id === req.params.id);
    if (!doc) return res.status(404).json({ message: "Case not found" });

    return res.json({ document: doc });
  } catch (err) {
    console.error("Error in GET /api/cases/:id:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
