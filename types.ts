
export type PathType = 'redemption' | 'decline' | 'suspense' | 'warmth' | 'start';

export interface Choice {
  id: string;
  text: string;
  subtext: string;
  nextId: string;
  path: PathType;
}

export interface StoryNode {
  id: string;
  title: string;
  content: string[];
  choices: Choice[];
}

export interface User {
  username: string;
  isGuest: boolean;
}

export interface UserChoice {
  nodeId: string;
  path: PathType;
  choiceText: string;
  timestamp: number;
}

export interface FeedbackData {
  agency: number;
  emotion: number;
  comment: string;
}

export interface AIAnalysisReport {
  overview: string;
  persona: {
    tag: string;
    description: string;
    matchRate: number;
  };
  recommendations: string[];
  message: string;
}
