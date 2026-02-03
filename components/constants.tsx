
import { Project, Service } from '../types';

export const PROJECTS: Project[] = [
  {
    id: 'store-logo-v1',
    title: 'STORE LOGO',
    category: 'Logo Design',
    imageUrl: 'https://images.unsplash.com/photo-1770135939978-12ec7363a3de?q=80&w=2000&auto=format&fit=crop',
    description: 'This is a logo design created for a store. It represents the store’s identity and is designed to look professional, simple, and memorable.'
  },
  {
    id: 'store-logo-v2',
    title: 'STORE LOGO',
    category: 'Logo Design',
    imageUrl: 'https://images.unsplash.com/photo-1770137013310-0f100329e186?q=80&w=2000&auto=format&fit=crop',
    description: 'A detailed presentation of the store identity, showcasing the professional and clean aesthetic of the brand across secondary applications.'
  },
  {
    id: 'store-logo-v3',
    title: 'STORE LOGO',
    category: 'Logo Design',
    imageUrl: 'https://images.unsplash.com/photo-1770137013294-4d2869814f6e?q=80&w=2000&auto=format&fit=crop',
    description: 'A clean and modern store logo identity emphasizing minimalist aesthetics and professional brand presence.'
  },
  {
    id: 'fenix-illustration',
    title: 'FENIX ILLUSTRATION 🦊',
    category: 'Illustration',
    imageUrl: 'https://images.unsplash.com/photo-1770137098751-f8a66174c1a4?w=2000&auto=format&fit=crop',
    description: 'A premium digital illustration piece that combines intricate detail with cinematic lighting and composition.'
  },
  {
    id: 'cat-illustration',
    title: 'CAT ILLUSTRATION 😻',
    category: 'Illustration',
    imageUrl: 'https://images.unsplash.com/photo-1770137013352-aa5db6f6bcbd?w=2000&auto=format&fit=crop',
    description: 'A vibrant and expressive digital illustration featuring a stylized cat character with cinematic lighting.'
  },
  {
    id: 'thumbnail-editing',
    title: 'THUMBNAIL',
    category: 'Editing',
    imageUrl: 'https://images.unsplash.com/photo-1770137098448-5b16ef7f2346?w=2000&auto=format&fit=crop',
    description: 'Professional high-retention thumbnail design with advanced color grading and attention-grabbing visual elements.'
  }
];

export const SERVICES: Service[] = [
  {
    title: '2D Animation',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    description: 'Bringing stories to life through fluid motion, frame-by-frame precision, and captivating narrative flow.',
    features: ['Frame-by-frame', 'Motion Graphics', 'Character Rigging']
  },
  {
    title: 'Illustration',
    icon: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
    description: 'Bespoke digital artwork that captures mood, atmosphere, and intricate details for any medium.',
    features: ['Digital Painting', 'Concept Art', 'Comic Art']
  },
  {
    title: 'Logo Design',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    description: 'Crafting timeless brand identities that communicate values through geometric and organic shapes.',
    features: ['Minimalism', 'Typography', 'Brand Systems']
  },
  {
    title: 'Video Editing',
    icon: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
    description: 'Dynamic post-production with rhythmic pacing, color grading, and seamless transitions.',
    features: ['Color Grading', 'VFX', 'Sound Design']
  }
];
