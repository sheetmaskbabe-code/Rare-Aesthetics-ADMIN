import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  User,
  Sparkles,
  Building2,
  Target,
  Compass,
  Upload,
  Plus,
  Trash2,
  Quote,
  Eye,
} from 'lucide-react';
import { AboutPageContent, HeroSlide } from '../../types';
import { api } from '../../lib/api';
import { PageHeaderEditor } from '../common/PageHeaderEditor';

const DEFAULT_ABOUT_SLIDES: HeroSlide[] = [
  {
    title: 'Science & Luxury',
    description:
      'Science-led beauty development crafted with an unapologetic touch of luxury and clinical precision.',
    media:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Founded with Purpose',
    description:
      'Founded by Lindi-Grace in Pretoria to empower beauty innovators from initial concept to commercial shelves.',
    media:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Sensory Formulations',
    description:
      'Harmonizing high-potency bio-compatible actives with indulgent textures and distinctive sensory elegance.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Evidence & Testing',
    description:
      'Rigorous stability assessments, raw ingredient scrutiny, and quality-driven cosmetic science.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Batch to Scale',
    description:
      'Translating bench-scale prototype successes into seamless commercial contract manufacturing readiness.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Art of Rare Beauty',
    description:
      'We believe beautiful products emerge where scientific rigor meets the brand imagination of founders.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
];

const DEFAULT_PHILOSOPHY_POINTS = [
  'Research before formulation decisions',
  'Sensory experience as a design priority',
  'Quality-focused development processes',
  'Clear communication and project coordination',
  'Brand identity aligned with product reality',
  'Practical pathways toward manufacturing readiness',
];

export const AboutContentManager: React.FC = () => {
  const [content, setContent] = useState<AboutPageContent>({
    philosophyPoints: DEFAULT_PHILOSOPHY_POINTS,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingCompany, setUploadingCompany] = useState(false);
  const [uploadingFounder, setUploadingFounder] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await api.getAboutContent();
      const loaded = data && typeof data === 'object' ? data : {};
      if (!Array.isArray(loaded.philosophyPoints) || loaded.philosophyPoints.length === 0) {
        loaded.philosophyPoints = DEFAULT_PHILOSOPHY_POINTS;
      }
      setContent(loaded);
    } catch (err: any) {
      console.warn('Failed to load about content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.saveAboutContent(content || {});
      const safeUpdated = updated && typeof updated === 'object' ? updated : content || {};
      if (!Array.isArray(safeUpdated.philosophyPoints) || safeUpdated.philosophyPoints.length === 0) {
        safeUpdated.philosophyPoints = content?.philosophyPoints || DEFAULT_PHILOSOPHY_POINTS;
      }
      setContent(safeUpdated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCompanyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingCompany(true);
      const res = await api.uploadMedia(file, 'about');
      if (res?.cloudError) {
        alert(`Cloudinary Notice:\n${res.cloudError}\n\nThe image was saved locally.`);
      }
      if (res?.url) {
        setContent((prev) => ({ ...(prev || {}), companyImage: res.url }));
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingCompany(false);
      e.target.value = '';
    }
  };

  const handleFounderImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingFounder(true);
      const res = await api.uploadMedia(file, 'about');
      if (res?.cloudError) {
        alert(`Cloudinary Notice:\n${res.cloudError}\n\nThe image was saved locally.`);
      }
      if (res?.url) {
        setContent((prev) => ({ ...(prev || {}), founderImage: res.url }));
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingFounder(false);
      e.target.value = '';
    }
  };

  const handleAddPhilosophyPoint = () => {
    const currentPoints =
      Array.isArray(content?.philosophyPoints) && content.philosophyPoints.length > 0
        ? content.philosophyPoints
        : [...DEFAULT_PHILOSOPHY_POINTS];
    setContent({
      ...(content || {}),
      philosophyPoints: [...currentPoints, 'New formulation & development principle'],
    });
  };

  const handleUpdatePhilosophyPoint = (idx: number, val: string) => {
    const currentPoints =
      Array.isArray(content?.philosophyPoints) && content.philosophyPoints.length > 0
        ? [...content.philosophyPoints]
        : [...DEFAULT_PHILOSOPHY_POINTS];
    currentPoints[idx] = val;
    setContent({ ...(content || {}), philosophyPoints: currentPoints });
  };

  const handleRemovePhilosophyPoint = (idx: number) => {
    const currentPoints =
      Array.isArray(content?.philosophyPoints) && content.philosophyPoints.length > 0
        ? [...content.philosophyPoints]
        : [...DEFAULT_PHILOSOPHY_POINTS];
    if (currentPoints.length <= 1) {
      alert('You must have at least one philosophy point.');
      return;
    }
    setContent({
      ...(content || {}),
      philosophyPoints: currentPoints.filter((_, i) => i !== idx),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  const safeContent = content || {};
  const philosophyPoints =
    Array.isArray(safeContent.philosophyPoints) && safeContent.philosophyPoints.length > 0
      ? safeContent.philosophyPoints
      : DEFAULT_PHILOSOPHY_POINTS;

  return (
    <div className="space-y-8 w-full max-w-[1440px] pb-24">
      {/* 1. TOP SINGLE BANNER / HEADER EDITOR */}
      <PageHeaderEditor
        page="about"
        pageLabel="About Us"
        pageRoute="/about"
        defaultSlides={DEFAULT_ABOUT_SLIDES}
      />

      <form onSubmit={handleSave} className="space-y-8">
        {/* Sticky Control Header */}
        <div className="sticky top-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/95 backdrop-blur-md border border-purple-500/20 p-5 rounded-2xl shadow-xl shadow-black/40">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>About Page Narrative & Sections CMS</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live editing for The Company, Founder Profile, Mission & Vision, and Philosophy
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Saved Successfully!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save About Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. THE COMPANY & STORY SECTION */}
        <div className="p-6 sm:p-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. The Company & Story Section
                </h4>
                <p className="text-xs text-slate-400">
                  Controls the introductory company overview and lab atmosphere image
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-slate-800 text-purple-300 border border-slate-700">
              #company-story
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={content?.companyEyebrow ?? 'The company'}
                onChange={(e) => setContent({ ...(content || {}), companyEyebrow: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="The company"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Headline / Main Title
              </label>
              <input
                type="text"
                value={content?.companyTitle ?? 'Cosmetic product development & consulting'}
                onChange={(e) => setContent({ ...(content || {}), companyTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Cosmetic product development & consulting"
              />
            </div>
          </div>

          {/* Company Image with Upload & Preview */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Company Laboratory / Atmosphere Image
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-24 h-28 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                <img
                  src={
                    content?.companyImage ||
                    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt="Company atmosphere preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={content?.companyImage || ''}
                  onChange={(e) => setContent({ ...(content || {}), companyImage: e.target.value })}
                  placeholder="Image URL or upload a new photo"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                  {uploadingCompany ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Company Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyImageUpload}
                    disabled={uploadingCompany}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Company Story Paragraphs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Narrative Paragraph 1
              </label>
              <textarea
                rows={3}
                value={
                  content?.companyParagraph1 ??
                  'My Rare Aesthetics is a Pretoria-based consultancy focused on cosmetic product development, formulation, manufacturing support and brand-minded consulting.'
                }
                onChange={(e) => setContent({ ...(content || {}), companyParagraph1: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Narrative Paragraph 2
              </label>
              <textarea
                rows={3}
                value={
                  content?.companyParagraph2 ??
                  'We partner with founders and brands across the globe, from North America, Europe, Australia, The Middle East and Africa who want to move from idea to an innovative cosmetic product with clarity and care'
                }
                onChange={(e) => setContent({ ...(content || {}), companyParagraph2: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Narrative Paragraph 3
              </label>
              <textarea
                rows={3}
                value={
                  content?.companyParagraph3 ??
                  'Our work is rooted in luxury presentation and scientific care: clear process, quality-focused development, and respect for the artistry of beauty brands.'
                }
                onChange={(e) => setContent({ ...(content || {}), companyParagraph3: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 3. FOUNDER PROFILE & BIOGRAPHY */}
        <div className="p-6 sm:p-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  2. Founder Profile & Leadership
                </h4>
                <p className="text-xs text-slate-400">
                  Founder photograph, credentials, biography narrative and media features
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-slate-800 text-pink-300 border border-slate-700">
              Founder Profile
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={content?.founderEyebrow ?? 'Founder'}
                onChange={(e) => setContent({ ...(content || {}), founderEyebrow: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="Founder"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Founder Full Name
              </label>
              <input
                type="text"
                value={content?.founderName ?? 'Lindi-Grace'}
                onChange={(e) => setContent({ ...(content || {}), founderName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="Lindi-Grace"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Professional Title & Credentials
              </label>
              <input
                type="text"
                value={
                  content?.founderTitle ??
                  'Cosmetic Chemist | Beauty Innovator | Founder of The RA Group'
                }
                onChange={(e) => setContent({ ...(content || {}), founderTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="Cosmetic Chemist | Beauty Innovator"
              />
            </div>
          </div>

          {/* Founder Photo with Upload & Preview */}
          <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Founder Portrait Photo
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-24 h-28 rounded-lg overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                <img
                  src={content?.founderImage || '/images/director.jpg'}
                  alt="Founder portrait preview"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                <input
                  type="text"
                  value={content?.founderImage || ''}
                  onChange={(e) => setContent({ ...(content || {}), founderImage: e.target.value })}
                  placeholder="Image URL or upload portrait"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 rounded-lg text-xs font-medium cursor-pointer transition-colors">
                  {uploadingFounder ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Founder Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFounderImageUpload}
                    disabled={uploadingFounder}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Founder Bio Paragraphs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Biography Paragraph 1
              </label>
              <textarea
                rows={3}
                value={
                  content?.founderBio1 ??
                  'Probably wearing a sheet mask, practising yoga, or experimenting with the next big skincare innovation. Passionate about the science behind beauty, I believe that great skincare is where creativity, research, and innovation come together.'
                }
                onChange={(e) => setContent({ ...(content || {}), founderBio1: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Biography Paragraph 2
              </label>
              <textarea
                rows={3}
                value={
                  content?.founderBio2 ??
                  'Building The RA Group, with a vision to redefine the beauty and cosmetics industry through innovative formulations, premium-quality products, and science-backed skincare solutions.'
                }
                onChange={(e) => setContent({ ...(content || {}), founderBio2: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Biography Paragraph 3
              </label>
              <textarea
                rows={3}
                value={
                  content?.founderBio3 ??
                  'From developing effective skincare and haircare formulations to exploring new beauty trends, every idea begins with curiosity and a commitment to excellence. My mission is to create products that inspire confidence, celebrate individuality, and make beauty more accessible.'
                }
                onChange={(e) => setContent({ ...(content || {}), founderBio3: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                "Featured In" Publications
              </label>
              <input
                type="text"
                value={content?.featuredIn ?? 'Glamour | ELLE | Grazia | Cosmopolitan | POPSUGAR'}
                onChange={(e) => setContent({ ...(content || {}), featuredIn: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="Glamour | ELLE | Grazia | Cosmopolitan | POPSUGAR"
              />
            </div>
          </div>
        </div>

        {/* 4. MISSION & VISION SECTION (The 2 Cards) */}
        <div className="p-6 sm:p-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  3. Mission & Vision Cards
                </h4>
                <p className="text-xs text-slate-400">
                  Edit the two side-by-side Mission and Vision cards displayed on the About page
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-slate-800 text-emerald-300 border border-slate-700">
              Company Pillars
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mission Card */}
            <div className="p-5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-3.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <Target className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Mission Card</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Card Title</label>
                <input
                  type="text"
                  value={content?.missionTitle ?? 'Mission'}
                  onChange={(e) => setContent({ ...(content || {}), missionTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Mission"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mission Statement / Description
                </label>
                <textarea
                  rows={4}
                  value={
                    content?.missionText ??
                    'To help beauty brands transform innovative ideas into thoughtfully developed cosmetic products through formulation, research, testing support and manufacturing coordination.'
                  }
                  onChange={(e) => setContent({ ...(content || {}), missionText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Vision Card */}
            <div className="p-5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-3.5">
              <div className="flex items-center gap-2 text-indigo-400">
                <Compass className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Vision Card</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Card Title</label>
                <input
                  type="text"
                  value={content?.visionTitle ?? 'Vision'}
                  onChange={(e) => setContent({ ...(content || {}), visionTitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                  placeholder="Vision"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Vision Statement / Description
                </label>
                <textarea
                  rows={4}
                  value={
                    content?.visionText ??
                    'To be a trusted partner for beauty entrepreneurs and established brands seeking premium, science-informed product development with elegance and clarity.'
                  }
                  onChange={(e) => setContent({ ...(content || {}), visionText: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. PHILOSOPHY & PRINCIPLES SECTION */}
        <div className="p-6 sm:p-7 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                  4. Philosophy & Principles Section
                </h4>
                <p className="text-xs text-slate-400">
                  Section headline, philosophy statement, and core formulation principles
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddPhilosophyPoint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Principle</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={content?.philosophyEyebrow ?? 'Philosophy'}
                onChange={(e) => setContent({ ...(content || {}), philosophyEyebrow: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="Philosophy"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Section Headline
              </label>
              <input
                type="text"
                value={content?.philosophyTitle ?? 'Our approach to cosmetic innovation'}
                onChange={(e) => setContent({ ...(content || {}), philosophyTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                placeholder="Our approach to cosmetic innovation"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Philosophy Statement / Description
            </label>
            <textarea
              rows={2}
              value={
                content?.philosophyDescription ??
                'We believe beautiful products are born where scientific rigour meets brand imagination.'
              }
              onChange={(e) => setContent({ ...(content || {}), philosophyDescription: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
            />
          </div>

          {/* Philosophy Principles Dynamic List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                Core Principles & Beliefs ({philosophyPoints.length})
              </label>
              <span className="text-[11px] text-slate-500">
                Displayed in the 2-column checklist on the About page
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {philosophyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-slate-950 border border-slate-800 rounded-xl"
                >
                  <span className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-400 text-[11px] font-mono flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => handleUpdatePhilosophyPoint(idx, e.target.value)}
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                    placeholder="Enter principle"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhilosophyPoint(idx)}
                    title="Remove principle"
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving All About Content...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
