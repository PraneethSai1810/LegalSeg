import { FileText, HelpCircle, Scale, Shield, Brain, CheckCircle, MinusCircle } from "lucide-react";

export const RHETORICAL_ROLES = {
  FACTS: {
    id: 'facts',
    name: 'Facts',
    color: '#2196F3',
    bgColor: 'rgba(33, 150, 243, 0.15)',
    icon: FileText,  // Changed from '📋'
    description: 'Factual statements and background information'
  },
  ISSUES: {
    id: 'issues',
    name: 'Issues',
    color: '#00BCD4',
    bgColor: 'rgba(0, 188, 212, 0.15)',
    icon: HelpCircle,  // Changed from '❓'
    description: 'Legal issues and questions to be resolved'
  },
  ARGUMENT_PETITIONER: {
    id: 'argument_petitioner',
    name: 'Argument (Petitioner)',
    color: '#FF9800',
    bgColor: 'rgba(255, 152, 0, 0.15)',
    icon: Scale,  // Changed from '⚖️'
    description: "Petitioner's arguments and claims"
  },
  ARGUMENT_RESPONDENT: {
    id: 'argument_respondent',
    name: 'Argument (Respondent)',
    color: '#FF5722',
    bgColor: 'rgba(255, 87, 34, 0.15)',
    icon: Shield,  // Changed from '🛡️'
    description: "Respondent's counter-arguments"
  },
  REASONING: {
    id: 'reasoning',
    name: 'Reasoning',
    color: '#4CAF50',
    bgColor: 'rgba(76, 175, 80, 0.15)',
    icon: Brain,  // Changed from '🧠'
    description: 'Legal reasoning and analysis by the court'
  },
  DECISION: {
    id: 'decision',
    name: 'Decision',
    color: '#F44336',
    bgColor: 'rgba(244, 67, 54, 0.15)',
    icon: CheckCircle,  // Changed from '⚡'
    description: 'Final decision or ruling'
  },
  NONE: {
    id: 'none',
    name: 'None',
    color: '#9E9E9E',
    bgColor: 'rgba(158, 158, 158, 0.15)',
    icon: MinusCircle,  // Changed from '➖'
    description: 'Unclassified or non-legal content'
  }
};

export const getRoleById = (id) => {
  return Object.values(RHETORICAL_ROLES).find(role => role.id === id);
};

export const getAllRoles = () => {
  return Object.values(RHETORICAL_ROLES);
};