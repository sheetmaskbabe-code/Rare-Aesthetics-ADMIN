import {
  BlogPost,
  PortfolioItem,
  Enquiry,
  MediaAsset,
  HomePageContent,
  AboutPageContent,
  SiteSettings,
  SystemHealth,
  PageHeader,
} from '../types';

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined) || '';
const API_BASE = rawApiUrl ? `${rawApiUrl.replace(/\/$/, '')}/api` : '/api';
const TOKEN_KEY = 'mra_admin_token';
const ADMIN_KEY = 'Rare1357';

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY),
  setToken: (token: string, remember: boolean = true) => {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
    }
  },
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
  },
  isAuthenticated: () => Boolean(localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)),
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authStorage.getToken();
  const headers = new Headers(options.headers || {});

  headers.set('x-admin-key', ADMIN_KEY);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const errorMsg = (typeof data === 'object' && data?.error) || data?.message || res.statusText || 'Request failed';
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  async login(
    password: string
  ): Promise<{ requireOtp?: boolean; email?: string; success?: boolean; token?: string; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }
    return data;
  },

  async verifyOtp(otp: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to verify code');
    }
    return data;
  },

  async resendOtp(password: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to resend code');
    }
    return data;
  },

  // Health
  async getHealth(): Promise<SystemHealth> {
    return request<SystemHealth>('/health');
  },

  // Blog Posts
  async getPosts(): Promise<BlogPost[]> {
    const res = await request<{ posts: BlogPost[] }>('/posts?all=true');
    return res.posts || [];
  },

  async savePost(post: Partial<BlogPost>): Promise<BlogPost> {
    const res = await request<{ post: BlogPost }>('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
    return res.post;
  },

  async deletePost(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/posts/${id}`, {
      method: 'DELETE',
    });
  },

  // Portfolio
  async getPortfolio(): Promise<PortfolioItem[]> {
    const res = await request<{ portfolio: PortfolioItem[] }>('/portfolio?all=true');
    return res.portfolio || [];
  },

  async savePortfolioItem(item: Partial<PortfolioItem>): Promise<PortfolioItem> {
    const res = await request<{ item: PortfolioItem }>('/portfolio', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return res.item;
  },

  async deletePortfolioItem(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/portfolio/${id}`, {
      method: 'DELETE',
    });
  },

  // Enquiries
  async getEnquiries(): Promise<Enquiry[]> {
    const res = await request<{ enquiries: Enquiry[] }>('/enquiries');
    return res.enquiries || [];
  },

  async updateEnquiryStatus(
    id: string,
    status: Enquiry['status'],
    notes?: string
  ): Promise<Enquiry> {
    const res = await request<{ enquiry: Enquiry }>(`/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
    return res.enquiry;
  },

  async deleteEnquiry(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/enquiries/${id}`, {
      method: 'DELETE',
    });
  },

  async sendConfirmationEmail(id: string): Promise<{ success: boolean; mailResult: any }> {
    return request<{ success: boolean; mailResult: any }>(`/enquiries/${id}/send-confirmation`, {
      method: 'POST',
    });
  },

  // Media
  async getMedia(): Promise<MediaAsset[]> {
    const res = await request<{ media: MediaAsset[] }>('/upload');
    return res.media || [];
  },

  async uploadMedia(file: File, folder: string = 'general'): Promise<MediaAsset & { url: string; publicId?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const res = await request<any>('/upload', {
      method: 'POST',
      body: formData,
    });

    const url = res.url || res.media?.url || res.mediaItem?.url || '';
    const publicId = res.publicId || res.media?.publicId || res.mediaItem?.publicId || '';

    return {
      url,
      publicId,
      originalName: file.name,
      ...res.media,
      ...res.mediaItem,
      ...res,
    };
  },

  async deleteMedia(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/upload/${id}`, {
      method: 'DELETE',
    });
  },

  // Page Headers
  async getPageHeaders(): Promise<Record<string, PageHeader>> {
    const res = await request<any>('/headers');
    return res.headers || {};
  },

  async getPageHeader(page: string): Promise<PageHeader> {
    const res = await request<any>(`/headers/${page}`);
    return res.header || { page, slides: [] };
  },

  async savePageHeader(
    page: string,
    data: { slides: any[]; title?: string; description?: string }
  ): Promise<PageHeader> {
    const res = await request<any>(`/headers/${page}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.header || { page, slides: data.slides };
  },

  // Home Page Content
  async getHomeContent(): Promise<HomePageContent> {
    const res = await request<any>('/home');
    return res.home || res.content || {};
  },

  async saveHomeContent(content: HomePageContent): Promise<HomePageContent> {
    const res = await request<any>('/home', {
      method: 'POST',
      body: JSON.stringify(content),
    });
    return res.home || res.content || content;
  },

  // About Page Content
  async getAboutContent(): Promise<AboutPageContent> {
    const res = await request<{ content?: AboutPageContent; about?: AboutPageContent }>('/about');
    return res.about || res.content || {};
  },

  async saveAboutContent(content: AboutPageContent): Promise<AboutPageContent> {
    const res = await request<{ content?: AboutPageContent; about?: AboutPageContent }>('/about', {
      method: 'POST',
      body: JSON.stringify(content),
    });
    return res.about || res.content || content;
  },

  // Services Page Content
  async getServicesContent(): Promise<{
    eyebrow?: string;
    title?: string;
    description?: string;
    services?: any[];
  }> {
    const res = await request<any>('/services-content');
    return res.content || {};
  },

  async saveServicesContent(payload: any): Promise<any> {
    const res = await request<any>('/services-content', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.content;
  },

  // Process Page & Our Approach Content
  async getProcessContent(): Promise<{
    eyebrow?: string;
    title?: string;
    description?: string;
    steps?: any[];
  }> {
    const res = await request<any>('/process-content');
    return res.content || {};
  },

  async saveProcessContent(payload: any): Promise<any> {
    const res = await request<any>('/process-content', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.content;
  },

  // Settings
  async getSettings(): Promise<SiteSettings> {
    const res = await request<{ settings: SiteSettings }>('/settings');
    return res.settings || {};
  },

  async saveSettings(settings: SiteSettings): Promise<SiteSettings> {
    const res = await request<{ settings: SiteSettings }>('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
    return res.settings;
  },
};
