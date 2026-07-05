export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  categorySlug: string;
  icon: string;
  keywords: string[];
  trending?: boolean;
  latest?: boolean;
  popular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  toolCount: number;
  color: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: number;
  tags: string[];
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export type PageSlug =
  | 'home'
  | 'all-tools'
  | 'categories'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'blog'
  | 'admin'
  | 'tool'
  | 'blog-post'
  | 'search'
  | 'category-detail';