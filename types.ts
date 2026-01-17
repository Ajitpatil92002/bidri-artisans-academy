
export enum AppView {
  LANDING = 'LANDING',
  COURSE_OVERVIEW = 'COURSE_OVERVIEW',
  LESSON_VIEW = 'LESSON_VIEW'
}

export interface ContentSection {
  type: 'text' | 'image' | 'list' | 'heading';
  content: string;
  items?: string[];
  caption?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: number;
  image: string;
  contentSections: ContentSection[];
  keyMaterials?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  modules: Module[];
}
