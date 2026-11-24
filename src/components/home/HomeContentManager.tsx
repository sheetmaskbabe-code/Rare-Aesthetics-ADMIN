import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Layers,
  ExternalLink,
  Info,
  Star,
  MessageSquareQuote,
  Columns,
} from 'lucide-react';
import { HomePageContent, HeroSlide, Testimonial } from '../../types';
import { api } from '../../lib/api';

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    title: 'Ethereal Formulations',
    description:
      'Transforming innovative cosmetic ideas into thoughtfully developed beauty products through formulation and research.',
    media: '/images/1795270027987-WhatsApp_Image_2026-11-19_at_16.29.40__2_.jpeg',
  },
  {
    title: 'Rose Mirage',
    description:
      'Where science meets the art of beauty — clinical cosmetic chemistry tailored for discerning founders and brands.',
    media: '/images/mra-products.jpg',
  },
  {
    title: 'Velvet Mystique',
    description:
      'Sensory-rich textures engineered with high-potency bio-compatible actives and premium sensory elegance.',
    media: '/images/custom-bottles.jpg',
  },
  {
    title: 'Signature Sheet Masks',
    description:
      'Targeted skincare innovation and thoughtfully developed sheet mask treatments crafted for discerning beauty founders.',
    media: '/images/mra-sheetmasks.jpg',
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: 'My Rare Aesthetics brought clinical precision and distinctive luxury together seamlessly for our product line.',
    author: 'Founder & Formulator',
    role: 'Pretoria Beauty Brand',
    rating: 5,
  },
];

export const HomeContentManager: React.FC = () => {
  const [content, setContent] = useState<HomePageContent>({});
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [layoutMode, setLayoutMode] = useState<'side-by-side' | 'hero' | 'testimonials' | 'about'>('side-by-side');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingSlideMedia, setUploadingSlideMedia] = useState(false);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await api.getHomeContent();
      const initialSlides =
        data?.heroSlides && data.heroSlides.length > 0 ? data.heroSlides : DEFAULT_SLIDES;
      const initialTestimonials =
        data?.testimonials && data.testimonials.length > 0 ? data.testimonials : DEFAULT_TESTIMONIALS;
      setContent({
        testimonialsEyebrow: 'TESTIMONIALS',
        testimonialsTitle: 'Client voices',
        testimonialsDescription: 'Genuine testimonials will be featured here once approved by the business.',
        ...data,
        heroSlides: initialSlides,
        testimonials: initialTestimonials,
      });
    } catch (err: any) {
      console.warn('Failed to load home content:', err);
    } finally {
      setLoading(false);
    }
  };

  const slides = content.heroSlides || DEFAULT_SLIDES;
  const currentSlide = slides[activeSlideIdx] || slides[0] || DEFAULT_SLIDES[0];

  const handleUpdateCurrentSlide = (field: keyof HeroSlide, value: string) => {
    const updated = [...slides];
    updated[activeSlideIdx] = {
      ...updated[activeSlideIdx],
      [field]: value,
    };
    setContent({ ...content, heroSlides: updated });
  };

  const handleUploadSlideMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingSlideMedia(true);
      const uploaded = await api.uploadMedia(file, 'hero');
      if (uploaded?.cloudError) {
        alert(`Cloudinary Notice:\n${uploaded.cloudError}\n\nYour Cloudinary key lacks "create" permission. The image was safely saved locally.`);
      }
      if (uploaded?.url) {
        handleUpdateCurrentSlide('media', uploaded.url);
      }
    } catch (err: any) {
      alert(`Media upload failed: ${err.message}`);
    } finally {
      setUploadingSlideMedia(false);
      e.target.value = '';
    }
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      title: `New Formulation ${slides.length + 1}`,
      description: 'Custom formulation and research description for discerning beauty brands.',
      media: '/images/custom-bottles.jpg',
    };
    const updated = [...slides, newSlide];
    setContent({ ...content, heroSlides: updated });
    setActiveSlideIdx(updated.length - 1);
  };

  const handleDeleteSlide = (idx: number) => {
    if (slides.length <= 1) {
      alert('You must have at least one hero slide.');
      return;
    }
    const updated = slides.filter((_, i) => i !== idx);
    setContent({ ...content, heroSlides: updated });
    setActiveSlideIdx(Math.max(0, idx - 1));
  };

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      quote: 'My Rare Aesthetics brought clinical precision and distinctive luxury together seamlessly for our product line.',
      author: 'Founder & Formulator',
      role: 'Beauty Brand Client',
      rating: 5,
    };
    const currentList = content.testimonials || [];
    setContent({ ...content, testimonials: [...currentList, newTestimonial] });
  };

  const handleUpdateTestimonial = (idx: number, field: keyof Testimonial, value: any) => {
    const currentList = [...(content.testimonials || [])];
    currentList[idx] = {
      ...currentList[idx],
      [field]: value,
    };
    setContent({ ...content, testimonials: currentList });
  };

  const handleDeleteTestimonial = (idx: number) => {
    const currentList = (content.testimonials || []).filter((_, i) => i !== idx);
    setContent({ ...content, testimonials: currentList });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await api.saveHomeContent(content);
      setContent(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
      </div>
    );
  }

  const renderHeroSlider = () => (
    <div className="p-6 bg-slate-900/90 border border-purple-500/30 rounded-2xl space-y-6 shadow-xl shadow-purple-950/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Hero Slider Showcase (Interactive WebGL Tabs)</span>
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Edit Slides & Background Formulations
          </h4>
        </div>

        <button
          type="button"
          onClick={handleAddSlide}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-purple-300 border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Slide</span>
        </button>
      </div>

      {/* Slide Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {slides.map((s, idx) => {
          const isActive = idx === activeSlideIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlideIdx(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-semibold'
                  : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>Slide 0{idx + 1}:</span>
              <span className="truncate max-w-[120px]">{s.title || `Slide ${idx + 1}`}</span>
            </button>
          );
        })}
      </div>

      {/* Active Slide Form */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
          <span className="text-xs font-bold text-slate-200">
            Editing Slide {activeSlideIdx + 1} of {slides.length}
          </span>

          {slides.length > 1 && (
            <button
              type="button"
              onClick={() => handleDeleteSlide(activeSlideIdx)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
              title="Delete this slide"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Slide</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Slide Headline / Title
            </label>
            <input
              type="text"
              value={currentSlide.title || ''}
              onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
              placeholder="e.g. Ethereal Formulations"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Slide Subtitle / Description
            </label>
            <textarea
              rows={3}
              value={currentSlide.description || ''}
              onChange={(e) => handleUpdateCurrentSlide('description', e.target.value)}
              placeholder="Transforming innovative cosmetic ideas into thoughtfully developed beauty products..."
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              required
            />
          </div>

          {/* Background Image / Media */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Slide Background Image / Formulation Media
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentSlide.media || ''}
                onChange={(e) => handleUpdateCurrentSlide('media', e.target.value)}
                placeholder="/images/... or https://..."
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                required
              />
              <label className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                {uploadingSlideMedia ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{uploadingSlideMedia ? '...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadSlideMedia}
                  className="hidden"
                  disabled={uploadingSlideMedia}
                />
              </label>
            </div>

            {/* Full Uncropped Image Preview */}
            {currentSlide.media && (
              <div className="mt-3 relative rounded-xl border border-slate-800 bg-slate-950 p-3 flex flex-col items-center justify-center">
                <div className="w-full max-h-72 flex items-center justify-center overflow-hidden rounded-lg bg-black/60 p-2">
                  <img
                    src={currentSlide.media}
                    alt="Slide Background Preview"
                    className="max-h-64 w-auto max-w-full object-contain rounded-md"
                  />
                </div>
                <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                  <span className="truncate max-w-[200px] font-mono text-[10px]">
                    {currentSlide.media}
                  </span>
                  <a
                    href={currentSlide.media}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 font-medium hover:underline flex items-center gap-1"
                  >
                    <span>Open Full</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeroCta = () => (
    <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Hero Call To Action Buttons</span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Primary Button Text (Left)
          </label>
          <input
            type="text"
            value={content.heroCtaPrimaryText || ''}
            onChange={(e) => setContent({ ...content, heroCtaPrimaryText: e.target.value })}
            placeholder="Explore Our Services"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Primary Button Link
          </label>
          <input
            type="text"
            value={content.heroCtaPrimaryLink || ''}
            onChange={(e) => setContent({ ...content, heroCtaPrimaryLink: e.target.value })}
            placeholder="/services"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Secondary Button Text (Right)
          </label>
          <input
            type="text"
            value={content.heroCtaSecondaryText || ''}
            onChange={(e) => setContent({ ...content, heroCtaSecondaryText: e.target.value })}
            placeholder="Book a Consultation"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Secondary Button Link
          </label>
          <input
            type="text"
            value={content.heroCtaSecondaryLink || ''}
            onChange={(e) => setContent({ ...content, heroCtaSecondaryLink: e.target.value })}
            placeholder="/book"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  );

  const renderClientVoices = () => (
    <div className="p-6 bg-slate-900/90 border border-slate-800/80 rounded-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Homepage Client Voices</span>
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Customer Testimonials & Verified Reviews
          </h4>
        </div>

        <button
          type="button"
          onClick={handleAddTestimonial}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-purple-300 border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Section Header Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Section Eyebrow</label>
          <input
            type="text"
            value={content.testimonialsEyebrow || ''}
            onChange={(e) => setContent({ ...content, testimonialsEyebrow: e.target.value })}
            placeholder="TESTIMONIALS"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Section Title</label>
          <input
            type="text"
            value={content.testimonialsTitle || ''}
            onChange={(e) => setContent({ ...content, testimonialsTitle: e.target.value })}
            placeholder="Client voices"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Section Subtitle / Description</label>
        <input
          type="text"
          value={content.testimonialsDescription || ''}
          onChange={(e) => setContent({ ...content, testimonialsDescription: e.target.value })}
          placeholder="Genuine testimonials will be featured here once approved by the business."
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Testimonials List */}
      <div className="space-y-4 pt-2">
        {(!content.testimonials || content.testimonials.length === 0) ? (
          <div className="text-center py-8 bg-slate-950/60 border border-dashed border-slate-800 rounded-xl">
            <p className="text-xs text-slate-500">No client testimonials added yet. Click &ldquo;Add Testimonial&rdquo; above.</p>
          </div>
        ) : (
          content.testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5 relative group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleUpdateTestimonial(idx, 'rating', star)}
                      className="cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          star <= (t.rating || 5)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-[10px] text-slate-400 ml-1.5 font-medium">
                    ({t.rating || 5} Stars)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTestimonial(idx)}
                  className="text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Client Quote / Review
                </label>
                <textarea
                  rows={2}
                  value={t.quote}
                  onChange={(e) => handleUpdateTestimonial(idx, 'quote', e.target.value)}
                  placeholder="Enter what the client said about your formulation or consulting..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 italic"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Author / Client Name
                  </label>
                  <input
                    type="text"
                    value={t.author}
                    onChange={(e) => handleUpdateTestimonial(idx, 'author', e.target.value)}
                    placeholder="e.g. Founder & Formulator"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Company / Brand Role
                  </label>
                  <input
                    type="text"
                    value={t.role || ''}
                    onChange={(e) => handleUpdateTestimonial(idx, 'role', e.target.value)}
                    placeholder="e.g. Pretoria Beauty Brand"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5" />
        <span>Homepage Introduction / About Section</span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Eyebrow Tag</label>
          <input
            type="text"
            value={content.aboutEyebrow || ''}
            onChange={(e) => setContent({ ...content, aboutEyebrow: e.target.value })}
            placeholder="ABOUT US"
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
          <input
            type="text"
            value={content.aboutTitle || ''}
            onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })}
            placeholder="Discover the Science Behind Beautiful Products."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Summary Description</label>
        <textarea
          rows={3}
          value={content.aboutDescription || ''}
          onChange={(e) => setContent({ ...content, aboutDescription: e.target.value })}
          className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Paragraph 1</label>
          <textarea
            rows={3}
            value={content.aboutParagraph1 || ''}
            onChange={(e) => setContent({ ...content, aboutParagraph1: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Paragraph 2</label>
          <textarea
            rows={3}
            value={content.aboutParagraph2 || ''}
            onChange={(e) => setContent({ ...content, aboutParagraph2: e.target.value })}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">About Section Image</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={content.aboutImage || ''}
            onChange={(e) => setContent({ ...content, aboutImage: e.target.value })}
            placeholder="/images/... or URL"
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
          <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
            {uploadingAboutImage ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>Upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  setUploadingAboutImage(true);
                  const up = await api.uploadMedia(f, 'about');
                  if (up?.url) setContent({ ...content, aboutImage: up.url });
                } catch (err: any) {
                  alert(err.message);
                } finally {
                  setUploadingAboutImage(false);
                  e.target.value = '';
                }
              }}
              className="hidden"
              disabled={uploadingAboutImage}
            />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSave} className="space-y-6 w-full max-w-[1440px] pb-16">
      {/* Top Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Homepage Hero & Content Editor</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Changes saved here update the live homepage slider, client testimonials, images, and call-to-actions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-950/80 border border-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setLayoutMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                layoutMode === 'side-by-side'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('hero')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                layoutMode === 'hero'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Hero Slider</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('testimonials')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                layoutMode === 'testimonials'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Client Voices</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('about')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                layoutMode === 'about'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>About Teaser</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Layout */}
      {layoutMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Hero Slider Showcase & Hero CTA */}
          <div className="space-y-6">
            {renderHeroSlider()}
            {renderHeroCta()}
          </div>

          {/* Right Column: Homepage Client Voices & Homepage About Section */}
          <div className="space-y-6">
            {renderClientVoices()}
            {renderAboutSection()}
          </div>
        </div>
      ) : layoutMode === 'hero' ? (
        <div className="space-y-6 max-w-4xl">
          {renderHeroSlider()}
          {renderHeroCta()}
        </div>
      ) : layoutMode === 'testimonials' ? (
        <div className="space-y-6 max-w-4xl">
          {renderClientVoices()}
        </div>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {renderAboutSection()}
        </div>
      )}
    </form>
  );
};
