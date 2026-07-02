export interface Patient {
  name: string;
  age: string;
  gender: string;
}

export interface LabParameter {
  parameter: string;
  value: string;
  reference: string;
  interpretation: string;
}

export interface Question {
  questionText: string;
  options: string[];
  correctIndex: number;
  correctExplanation: string;
  incorrectExplanation: string;
  repassLinkUrl: string;
  repassLinkLabel: string;
}

export interface DatoCurioso {
  trivia: string;
  reference: string;
  linkUrl: string;
  linkLabel: string;
}

export interface GlossaryItem {
  term: string;
  definition: string;
}

export interface ClinicalCase {
  title: string;
  patient: Patient;
  narrative: string;
  diseaseDefinition: string;
  laboratory: LabParameter[];
  questions: Question[];
  datoCurioso: DatoCurioso;
  glossary: GlossaryItem[];
}

export interface ThemeInfo {
  id: string;
  number: number;
  name: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
  suggestedPathology: string;
}
