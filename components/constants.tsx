
import { Project, Service } from '../types';

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neon Drift Odyssey',
    category: 'Animation',
    imageUrl: 'https://picsum.photos/seed/drift/800/1000',
    description: 'A stylistic 2D animation short featuring cyber-noir aesthetics.'
  },
  {
    id: '2',
    title: 'Minimalist Tech Identity',
    category: 'Logo Design',
    imageUrl: 'https://picsum.photos/seed/logo1/800/1000',
    description: 'Visual identity for a silicon valley startup focusing on AI.'
  },
  {
    id: '3',
    title: 'Enchanted Forest Narrative',
    category: 'Illustration',
    imageUrl: 'https://picsum.photos/seed/forest/800/1000',
    description: 'Digital painting for a fantasy graphic novel.'
  },
  {
    id: '4',
    title: 'Action Sports Highlight',
    category: 'Editing',
    imageUrl: 'https://picsum.photos/seed/edit/800/1000',
    description: 'High-energy rhythmic editing for a professional skate brand.'
  },
  {
    id: '5',
    title: 'Abstract Character Design',
    category: 'Illustration',
    imageUrl: 'https://picsum.photos/seed/char/800/1000',
    description: 'A series of vibrant character studies for an indie game.'
  },
  {
    id: '6',
    title: 'Flow Motion Typography',
    category: 'Animation',
    imageUrl: 'https://picsum.photos/seed/typo/800/1000',
    description: 'Experimental kinetic typography animation.'
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
