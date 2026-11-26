export interface BlogPost {
  _id?: string;
  id: string;
  slug?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string[];
  author?: string;
  readTime?: string;
  image?: string;
  coverImage?: string;
  published: boolean;
  type?: 'article' | 'blog';
  date?: string;
  createdAt?: string;
  link?: string;
  buttonText?: string;
}

export interface PortfolioItem {
  _id?: string;
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  description: string;
  category: string;
  tags?: string[];
  image?: string;
  coverImage?: string;
  galleryImages?: string[];
  client?: string;
  year?: string;
  order?: number;
  featured?: boolean;
  link?: string;
  buttonText?: string;
  createdAt?: string;
}

export interface Enquiry {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  attachment?: string;
  attachmentName?: string;
  status: 'new' | 'contacted' | 'in-progress' | 'closed' | 'accepted' | 'declined';
  notes?: string;
  createdAt: string;
}

export interface MediaAsset {
  _id?: string;
  publicId?: string;
  url: string;
  folder?: string;
  originalName: string;
  fileSize?: number;
  resourceType?: string;
  cloudError?: string;
  createdAt?: string;
}

export interface HeroSlide {
  _id?: string;
  title: string;
  description: string;
  media: string;
}

export interface Testimonial {
  _id?: string;
  quote: string;
  author: string;
  role?: string;
  rating?: number;
}

export interface HomePageContent {
  id?: string;
  heroSlides?: HeroSlide[];
  heroCtaPrimaryText?: string;
  heroCtaPrimaryLink?: string;
  heroCtaSecondaryText?: string;
  heroCtaSecondaryLink?: string;

  aboutEyebrow?: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutParagraph1?: string;
  aboutParagraph2?: string;
  aboutImage?: string;
  aboutLinkText?: string;
  aboutLinkUrl?: string;

  featureEyebrow?: string;
  featureTitle?: string;
  featureDescription?: string;
  featureButtonText?: string;
  featureButtonLink?: string;
  featureImage?: string;

  testimonialsEyebrow?: string;
  testimonialsTitle?: string;
  testimonialsDescription?: string;
  testimonialsPlaceholder?: string;
  testimonials?: Testimonial[];
  [key: string]: any;
}

export interface AboutPageContent {
  companyEyebrow?: string;
  companyTitle?: string;
  companyParagraph1?: string;
  companyParagraph2?: string;
  companyParagraph3?: string;
  companyImage?: string;

  founderEyebrow?: string;
  founderName?: string;
  founderTitle?: string;
  founderBio1?: string;
  founderBio2?: string;
  founderBio3?: string;
  founderImage?: string;
  featuredIn?: string;

  missionTitle?: string;
  missionText?: string;
  visionTitle?: string;
  visionText?: string;

  philosophyEyebrow?: string;
  philosophyTitle?: string;
  philosophyDescription?: string;
  philosophyPoints?: string[];

  [key: string]: any;
}

export interface SiteSettings {
  siteName?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  [key: string]: any;
}

export interface SystemHealth {
  status: string;
  timestamp?: string;
  services: {
    mongodb: {
      status: string;
      connected: boolean;
    };
    cloudinary: {
      configured: boolean;
    };
  };
}

export interface PageHeader {
  _id?: string;
  page: 'home' | 'about' | 'services' | 'portfolio' | 'blog' | 'contact' | 'process';
  title?: string;
  description?: string;
  slides: HeroSlide[];
}

export interface ProcessStep {
  step: string;
  tag?: string;
  title: string;
  description: string;
  proceedText?: string;
  isAction?: boolean;
  actionText?: string;
  actionUrl?: string;
  secondaryActionText?: string;
  secondaryActionUrl?: string;
}

export interface ProcessPageContent {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  steps: ProcessStep[];
}

export type AdminTab =
  | 'overview'
  | 'enquiries'
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'articles'
  | 'blogs'
  | 'contact'
  | 'process'
  | 'settings';
