export interface BreakdownItem {
  aspect: string;
  status: 'Excelente' | 'Bom' | 'Atenção' | 'Crítico';
  feedback: string;
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  breakdown: BreakdownItem[];
  strengths: string[];
  improvements: string[];
  drillRecommendation: string;
}

export enum AnalysisState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}