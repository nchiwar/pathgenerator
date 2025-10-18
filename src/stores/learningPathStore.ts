import { create } from 'zustand';

export interface Course {
  id: string;
  path_id: string;
  title: string;
  description: string | null;
  provider: string | null;
  difficulty: string | null;
  duration_weeks: number | null;
  url: string | null;
  phase: string;
  sequence_order: number;
  progress?: number;
}

export interface LearningPath {
  id: string;
  user_id: string;
  career_goal: string;
  skill_level: string;
  weekly_hours: number;
  duration_months: number;
  current_skills: string[];
  created_at: string;
  courses?: Course[];
}

interface LearningPathState {
  currentPath: LearningPath | null;
  allPaths: LearningPath[];
  setCurrentPath: (path: LearningPath | null) => void;
  setAllPaths: (paths: LearningPath[]) => void;
  addPath: (path: LearningPath) => void;
}

export const useLearningPathStore = create<LearningPathState>((set) => ({
  currentPath: null,
  allPaths: [],
  setCurrentPath: (path) => set({ currentPath: path }),
  setAllPaths: (paths) => set({ allPaths: paths }),
  addPath: (path) => set((state) => ({ 
    allPaths: [path, ...state.allPaths],
    currentPath: path 
  })),
}));
