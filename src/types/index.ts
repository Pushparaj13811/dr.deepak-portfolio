// Database Models
export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface Profile {
  id: number;
  full_name: string;
  title: string;
  tagline: string;
  about_text_short: string | null;
  about_text: string | null;
  specialization: string | null;
  photo_base64: string | null;
  years_experience: number;
  surgeries_count: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  year: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: number;
  position: string;
  organization: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  proficiency: number;
  category: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: number;
  title: string;
  issuer: string | null;
  year: string | null;
  description: string | null;
  image_base64: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string | null;
  image_base64: string;
  category: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  message: string | null;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export interface ContactInfo {
  id: number;
  email: string;
  phone: string | null;
  address: string | null;
  permanent_address: string | null;
  description: string | null;
  working_hours: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_base64: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: number;
  expires_at: string;
  created_at: string;
}

// API Request/Response Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    username: string;
  };
}

export interface AppointmentRequest {
  full_name: string;
  email: string;
  phone?: string;
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface ServiceFormData {
  title: string;
  description?: string;
  icon?: string;
}

export interface EducationFormData {
  degree: string;
  institution: string;
  year?: string;
  description?: string;
}

export interface ExperienceFormData {
  position: string;
  organization: string;
  start_date?: string;
  end_date?: string;
  description?: string;
}

export interface SkillFormData {
  name: string;
  proficiency: number;
  category?: string;
}

export interface AwardFormData {
  title: string;
  issuer?: string;
  year?: string;
  description?: string;
  image_base64?: string;
}

export interface PortfolioFormData {
  title: string;
  description?: string;
  image_base64: string;
  category: string;
}

export interface ProfileFormData {
  full_name: string;
  title: string;
  tagline: string;
  about_text_short?: string;
  about_text?: string;
  specialization?: string;
  photo_base64?: string;
  years_experience: number;
  surgeries_count: number;
}

export interface ContactFormData {
  email: string;
  phone?: string;
  address?: string;
  permanent_address?: string;
  description?: string;
  working_hours?: string;
}

export interface SocialLinkFormData {
  platform: string;
  url: string;
  icon?: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image_base64?: string;
  published: boolean;
}
