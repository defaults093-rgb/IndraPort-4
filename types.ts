
export type Category = 'Animation' | 'Illustration' | 'Logo Design' | 'Editing';

export interface Project {
  id: string;
  title: string;
  category: Category;
  imageUrl: string;
  videoUrl?: string; // Support for MP4/WebM clips
  description: string;
}

export interface Service {
  title: string;
  icon: string;
  description: string;
  features: string[];
}
