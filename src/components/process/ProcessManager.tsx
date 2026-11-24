import React, { useState, useEffect } from 'react';
import {
  Workflow,
  ExternalLink,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle,
  Loader2,
  Layers,
  Compass,
  Upload,
  RotateCcw,
  Sliders,
  Eye,
  Check,
} from 'lucide-react';
import { HeroSlide, ProcessPageContent, ProcessStep } from '../../types';
import { api } from '../../lib/api';

const DEFAULT_PROCESS_SLIDES: HeroSlide[] = [
  {
    title: 'Structured Process',
    description:
      'A clear, research-driven development journey from discovery and formulation to commercial product launch.',
    media: '/images/process-bottles.jpg',
  },
  {
    title: 'Discovery & Briefing',
    description:
      'Establishing your brand vision, performance targets, active ingredient preferences, and product roadmap.',
    media:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Concept & Formulation',
    description:
      'Transforming creative ideas into bench-tested prototypes with meticulous attention to luxury sensory feel.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Testing & Stability',
    description:
      'Rigorous microbiological, stability, and compatibility testing ensuring uncompromising safety and efficacy.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Scale & Manufacturing',
    description:
      'Seamless batch scaling, contract manufacturer liaison, and packaging assembly coordination.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Launch Readiness',
    description:
      'Final quality audits, regulatory compliance checks, and market delivery alignment.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
];

const DEFAULT_STEPS: ProcessStep[] = [
  {
    step: '01',
    tag: 'Phase 01',
    title: 'Turning Your Vision Into Beauty Innovation',
    description:
      'At My Rare Aesthetics, every great beauty product begins with a vision. We believe that behind every successful cosmetic brand is a unique idea, a passion for innovation and a desire to make a difference in the beauty industry. Our journey begins by understanding your vision, your brand identity and the goals you want to achieve. We take the time to listen, collaborate and develop a clear direction that reflects your brand’s individuality.',
    proceedText: 'Proceed to phase 02',
    isAction: false,
  },
  {
    step: '02',
    tag: 'Phase 02',
    title: 'Where Creativity Meets Cosmetic Science',
    description:
      'We bring creativity and scientific expertise together to transform ideas into thoughtfully developed cosmetic products. Our approach combines ingredient research, innovative formulation techniques and an understanding of evolving beauty trends. From skincare essentials to specialised cosmetic formulations, we focus on developing products that align with your brand’s vision, quality expectations and target audience.',
    proceedText: 'Proceed to phase 03',
    isAction: false,
  },
  {
    step: '03',
    tag: 'Phase 03',
    title: 'Excellence in Every Formulation',
    description:
      'Quality is at the heart of everything we do. We pay close attention to ingredient selection, formulation development and product evaluation to support the creation of high-quality cosmetic products. By exploring innovative ingredients and sustainable formulation approaches where suitable, we aim to help brands develop products that meet modern consumer expectations and reflect responsible beauty innovation.',
    proceedText: 'Proceed to phase 04',
    isAction: false,
  },
  {
    step: '04',
    tag: 'Phase 04',
    title: 'From Concept to Manufacturing',
    description:
      'Developing a cosmetic product involves more than creating a formula. It requires careful planning, research, evaluation and coordination. At My Rare Aesthetics, we support your journey through the different stages of product development, from initial concept and formulation to testing, packaging considerations and manufacturing support. Every stage is approached with attention to detail, helping bring structure, clarity and direction to your product development journey.',
    proceedText: 'Proceed to phase 05',
    isAction: false,
  },
  {
    step: '05',
    tag: 'Phase 05',
    title: 'Supporting Quality, Safety and Compliance',
    description:
      'We understand the importance of developing cosmetic products with quality and regulatory considerations in mind. Our approach incorporates relevant ingredient and formulation safety considerations, product evaluation and regulatory support within the agreed project scope. We aim to help businesses better understand the requirements involved in developing and preparing cosmetic products for their intended markets.',
    proceedText: 'Proceed to phase 06',
    isAction: false,
  },
  {
    step: '06',
    tag: 'Phase 06',
    title: 'Building Brands That Stand Out',
    description:
      'Your brand deserves more than an ordinary product. It deserves a distinctive identity, a thoughtful formulation and a clear vision. We work alongside beauty entrepreneurs, emerging businesses and established brands to support their product development ambitions. Through collaboration, research and strategic guidance, we help transform creative ideas into meaningful opportunities within the competitive beauty industry.',
    proceedText: 'Proceed to phase 07',
    isAction: false,
  },
  {
    step: '07',
    tag: 'Phase 07',
    title: "Let's Create Something Extraordinary",
    description:
      'Whether you are starting your first skincare brand, expanding an existing cosmetic collection or exploring a new product concept, My Rare Aesthetics is here to support your journey. We believe that innovation begins with collaboration, and every successful product starts with a conversation. Together, let’s turn your vision into a beauty experience that reflects your brand and inspires confidence.',
    proceedText: 'Proceed to phase 08',
    isAction: false,
  },
  {
    step: '08',
    tag: 'Next Step · Engagement',
    title: 'Begin Your Project Journey',
    description:
      'Connect with our team to discuss your formulation goals, packaging considerations, and production roadmap. We partner with emerging and established beauty innovators across South Africa and beyond.',
    proceedText: '',
    isAction: true,
    actionText: 'Book a Consultation',
    actionUrl: '/contact',
    secondaryActionText: 'Start a Conversation',
    secondaryActionUrl: '/contact',
  },
];

type ViewSection = 'all' | 'hero' | 'approach' | 'steps';

export const ProcessManager: React.FC = () => {
  // Process Content (Approach & Steps)
  const [content, setContent] = useState<ProcessPageContent>({
    eyebrow: 'Our Approach',
    title: 'The Pathway to Beauty Innovation',
    description:
      'A disciplined, collaborative framework uniting visionary creativity, cosmetic science, quality formulation, and commercial execution.',
    steps: DEFAULT_STEPS,
  });

  // Hero Slider state (Lumina WebGL multi-slide)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_PROCESS_SLIDES);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const [uploadingSlideMedia, setUploadingSlideMedia] = useState<boolean>(false);
  const [savingHero, setSavingHero] = useState<boolean>(false);
  const [heroSaveSuccess, setHeroSaveSuccess] = useState<boolean>(false);

  // General & View State
  const [activeView, setActiveView] = useState<ViewSection>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [savingAll, setSavingAll] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [processRes, headerRes] = await Promise.allSettled([
        api.getProcessContent(),
        api.getPageHeader('process'),
      ]);

      if (processRes.status === 'fulfilled' && processRes.value) {
        const res = processRes.value;
        setContent({
          eyebrow: res.eyebrow || 'Our Approach',
          title: res.title || 'The Pathway to Beauty Innovation',
          description:
            res.description ||
            'A disciplined, collaborative framework uniting visionary creativity, cosmetic science, quality formulation, and commercial execution.',
          steps: res.steps && res.steps.length > 0 ? res.steps : DEFAULT_STEPS,
        });
      }

      if (headerRes.status === 'fulfilled' && headerRes.value?.slides && headerRes.value.slides.length > 0) {
        setHeroSlides(headerRes.value.slides);
      } else {
        setHeroSlides(DEFAULT_PROCESS_SLIDES);
      }
    } catch (err) {
      console.error('Failed to load process data:', err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // HERO SLIDER HANDLERS
  // -------------------------------------------------------------
  const currentSlide = heroSlides[activeSlideIdx] || heroSlides[0] || {
    title: '',
    description: '',
    media: '',
  };

  const handleUpdateCurrentSlide = (field: keyof HeroSlide, value: string) => {
    const updated = [...heroSlides];
    updated[activeSlideIdx] = { ...updated[activeSlideIdx], [field]: value };
    setHeroSlides(updated);
  };

  const handleAddSlide = () => {
    const nextNum = (heroSlides.length + 1).toString().padStart(2, '0');
    const newSlide: HeroSlide = {
      title: `Phase ${nextNum} - New Development Focus`,
      description: 'Describe the key activities, formulation goals, or sensory focus for this stage.',
      media: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
    };
    const updated = [...heroSlides, newSlide];
    setHeroSlides(updated);
    setActiveSlideIdx(updated.length - 1);
  };

  const handleDeleteSlide = (indexToDelete: number) => {
    if (heroSlides.length <= 1) {
      alert('You must have at least one hero slide in the showcase.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove slide ${indexToDelete + 1}?`)) return;

    const updated = heroSlides.filter((_, idx) => idx !== indexToDelete);
    setHeroSlides(updated);
    if (activeSlideIdx >= updated.length) {
      setActiveSlideIdx(Math.max(0, updated.length - 1));
    }
  };

  const handleMoveSlide = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= heroSlides.length) return;

    const updated = [...heroSlides];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setHeroSlides(updated);
    setActiveSlideIdx(targetIdx);
  };

  const handleUploadSlideMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingSlideMedia(true);
      const uploaded = await api.uploadMedia(file, 'headers/process');
      if (uploaded?.cloudError) {
        alert(`Cloudinary Notice:\n${uploaded.cloudError}\n\nThe image was saved locally.`);
      }
      if (uploaded?.url) {
        handleUpdateCurrentSlide('media', uploaded.url);
      }
    } catch (err: any) {
      alert(`Slide media upload failed: ${err.message}`);
    } finally {
      setUploadingSlideMedia(false);
      e.target.value = '';
    }
  };

  const handleResetDefaultSlides = () => {
    if (
      !window.confirm(
        'Reset all Process Hero slides back to the 6 luxury formulation defaults?'
      )
    )
      return;
    setHeroSlides(DEFAULT_PROCESS_SLIDES);
    setActiveSlideIdx(0);
  };

  const handleSaveHeroSlider = async () => {
    try {
      setSavingHero(true);
      setHeroSaveSuccess(false);
      await api.savePageHeader('process', {
        slides: heroSlides,
        title: 'Development Methodology Header Showcase',
        description: 'WebGL shader tabs hero slider illustrating the cosmetic chemistry formulation lifecycle',
      });
      setHeroSaveSuccess(true);
      setTimeout(() => setHeroSaveSuccess(false), 3500);
    } catch (err: any) {
      alert(`Failed to save Process Hero Slider: ${err.message}`);
    } finally {
      setSavingHero(false);
    }
  };

  // -------------------------------------------------------------
  // APPROACH CONTENT & STEP HANDLERS
  // -------------------------------------------------------------
  const handleStepChange = (index: number, field: keyof ProcessStep, value: any) => {
    const updated = [...content.steps];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, steps: updated });
  };

  const handleAddStep = () => {
    const nextNum = (content.steps.length + 1).toString().padStart(2, '0');
    const newStep: ProcessStep = {
      step: nextNum,
      tag: `Phase ${nextNum}`,
      title: `Phase ${nextNum} - Innovation Stage`,
      description: 'Describe the key activities, formulation research, and goals for this phase.',
      proceedText: `Proceed to phase ${String(content.steps.length + 2).padStart(2, '0')}`,
      isAction: false,
    };
    setContent({ ...content, steps: [...content.steps, newStep] });
  };

  const handleRemoveStep = (index: number) => {
    if (!window.confirm('Are you sure you want to remove this process phase?')) return;
    const updated = content.steps.filter((_, i) => i !== index);
    setContent({ ...content, steps: updated });
  };

  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= content.steps.length) return;

    const updated = [...content.steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setContent({ ...content, steps: updated });
  };

  // -------------------------------------------------------------
  // SAVE ALL (HERO SLIDER + APPROACH + STEPS)
  // -------------------------------------------------------------
  const handleSaveAll = async () => {
    try {
      setSavingAll(true);
      setSaveSuccess(false);

      await Promise.all([
        api.savePageHeader('process', {
          slides: heroSlides,
          title: 'Development Methodology Header Showcase',
          description: 'WebGL shader tabs hero slider illustrating the cosmetic chemistry formulation lifecycle',
        }),
        api.saveProcessContent(content),
      ]);

      setSaveSuccess(true);
      setHeroSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setHeroSaveSuccess(false);
      }, 4000);
    } catch (err: any) {
      alert(`Failed to save all process changes: ${err.message}`);
    } finally {
      setSavingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="text-xs font-medium">Loading Process CMS & Hero Slider...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-[1440px] pb-24">
      {/* Top Main Banner & Controls */}
      <div className="bg-slate-900/80 border border-slate-800/80 p-5 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 backdrop-blur-sm shadow-xl shadow-black/30">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Process & Approach CMS</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Live Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize the interactive WebGL Hero Slider, the "Our Approach" framework headline, and the development journey phases.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="http://localhost:5173/process"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-purple-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Live Process Page</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={savingAll}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            {savingAll ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle className="w-4 h-4 text-emerald-300" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{savingAll ? 'Saving Live...' : saveSuccess ? 'All Changes Saved Live!' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Quick View Mode Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveView('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'all'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>All Sections</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('hero')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'hero'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>Hero Slider Showcase</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950/60 text-purple-200 border border-purple-400/30">
            {heroSlides.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('approach')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'approach'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-purple-300" />
          <span>Our Approach Framework</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('steps')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeView === 'steps'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-purple-300" />
          <span>Journey Phases</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-950/60 text-purple-200 border border-purple-400/30">
            {content.steps?.length || 0}
          </span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* SECTION 1: PROCESS HERO SLIDER SHOWCASE (Interactive Lumina) */}
      {/* ============================================================= */}
      {(activeView === 'all' || activeView === 'hero') && (
        <div className="bg-slate-900/95 border border-purple-500/30 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-purple-950/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Hero Showcase
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {heroSlides.length} Interactive Slides
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Process Hero Slider Showcase (WebGL Tabs)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Full control over the luxury shader carousel at the top of the Process page: customize titles, descriptions, and formulation media.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleResetDefaultSlides}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
                title="Reset all slides to the 6 default formulation slides"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleAddSlide}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slide</span>
              </button>

              <button
                type="button"
                onClick={handleSaveHeroSlider}
                disabled={savingHero}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 disabled:opacity-50 cursor-pointer"
              >
                {savingHero ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : heroSaveSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{savingHero ? 'Saving...' : heroSaveSuccess ? 'Hero Saved!' : 'Save Hero Slider'}</span>
              </button>
            </div>
          </div>

          {/* Slide Selector Pills */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Select Slide to Edit ({heroSlides.length} Total)
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {heroSlides.map((slide, idx) => {
                const isActive = idx === activeSlideIdx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                        : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-mono text-[11px] opacity-80">0{idx + 1}:</span>
                    <span className="truncate max-w-[140px]">{slide.title || `Slide ${idx + 1}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Slide Form Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600/30 border border-purple-500/40 font-mono text-xs font-bold text-purple-300">
                  {String(activeSlideIdx + 1).padStart(2, '0')}
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Active Slide Settings
                  </span>
                  <h4 className="text-sm font-bold text-white truncate max-w-md">
                    {currentSlide.title || `Slide ${activeSlideIdx + 1}`}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Reorder Buttons */}
                <button
                  type="button"
                  onClick={() => handleMoveSlide(activeSlideIdx, 'left')}
                  disabled={activeSlideIdx === 0}
                  title="Move Slide Earlier"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveSlide(activeSlideIdx, 'right')}
                  disabled={activeSlideIdx === heroSlides.length - 1}
                  title="Move Slide Later"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>

                {heroSlides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(activeSlideIdx)}
                    title="Remove Slide"
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer ml-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Title & Description */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Slide Headline / Title
                  </label>
                  <input
                    type="text"
                    value={currentSlide.title || ''}
                    onChange={(e) => handleUpdateCurrentSlide('title', e.target.value)}
                    placeholder="e.g. Structured Process"
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Displayed prominently on this slide in the hero shader banner.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Slide Subtitle / Description
                  </label>
                  <textarea
                    rows={4}
                    value={currentSlide.description || ''}
                    onChange={(e) => handleUpdateCurrentSlide('description', e.target.value)}
                    placeholder="A clear, research-driven development journey from discovery and formulation to commercial product launch..."
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                    required
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Descriptive narrative detailing this step of your product development craft.
                  </p>
                </div>
              </div>

              {/* Right Column: Media URL & Upload & Preview */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Slide Background Image / Formulation Media
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={currentSlide.media || ''}
                      onChange={(e) => handleUpdateCurrentSlide('media', e.target.value)}
                      placeholder="/images/... or https://..."
                      className="flex-1 px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono text-[11px] focus:outline-none focus:border-purple-500"
                      required
                    />
                    <label className="px-3.5 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
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
                  <p className="text-[11px] text-slate-500 mt-1">
                    Upload a high-resolution cosmetic photo or supply an image path/URL.
                  </p>
                </div>

                {/* Live Image Preview */}
                {currentSlide.media ? (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-2">
                    <div className="w-full h-44 flex items-center justify-center overflow-hidden rounded-lg bg-black/70">
                      <img
                        src={currentSlide.media}
                        alt="Slide Background Preview"
                        className="max-h-40 w-auto max-w-full object-contain rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/600x400/201426/d5b2dd?text=Image+Preview+Unavailable';
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
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
                ) : (
                  <div className="h-44 rounded-xl border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-500">
                    No image configured for this slide
                  </div>
                )}
              </div>
            </div>

            {/* Slide Action Bar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Slide {activeSlideIdx + 1} of {heroSlides.length}
              </span>

              <button
                type="button"
                onClick={handleSaveHeroSlider}
                disabled={savingHero}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {savingHero ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : heroSaveSuccess ? (
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>{savingHero ? 'Saving Hero...' : heroSaveSuccess ? 'Hero Saved Live!' : 'Save Hero Slider'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 2: "OUR APPROACH" FRAMEWORK HEADING & INTRO           */}
      {/* ============================================================= */}
      {(activeView === 'all' || activeView === 'approach') && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Core Process Framework
                </span>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  "Our Approach" Section Heading & Intro
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={savingAll}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer self-start sm:self-auto"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Approach</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-4 space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={content.eyebrow || ''}
                onChange={(e) => setContent({ ...content, eyebrow: e.target.value })}
                placeholder="e.g. Our Approach"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-slate-500">
                The small label appearing above the main heading (e.g. "Our Approach").
              </p>
            </div>

            <div className="md:col-span-8 space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Main Headline Title
              </label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="e.g. The Pathway to Beauty Innovation"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              />
              <p className="text-[11px] text-slate-500">
                Primary headline for the process framework.
              </p>
            </div>

            <div className="md:col-span-12 space-y-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Framework Subtitle & Description
              </label>
              <textarea
                rows={3}
                value={content.description || ''}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
                placeholder="A disciplined, collaborative framework uniting visionary creativity, cosmetic science..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
              />
              <p className="text-[11px] text-slate-500">
                Introductory paragraph guiding clients through your cosmetic development journey.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* SECTION 3: DEVELOPMENT JOURNEY PHASES & CTA CARDS            */}
      {/* ============================================================= */}
      {(activeView === 'all' || activeView === 'steps') && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/40 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Development Journey Phases
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {content.steps?.length || 0} Stages
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Edit each stage's step number, title, and detailed scope of work.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handleAddStep}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Phase</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={savingAll}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Phases</span>
              </button>
            </div>
          </div>

          {/* Phase Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.steps.map((step, idx) => {
              const isCta = Boolean(step.isAction);

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
                    isCta
                      ? 'bg-gradient-to-br from-purple-950/40 via-slate-900 to-slate-950 border-purple-500/40 shadow-lg shadow-purple-950/30'
                      : 'bg-slate-950/60 border-slate-800/90 hover:border-slate-700/80'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Card Header & Controls */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-purple-600/30 border border-purple-500/40 font-mono text-xs font-bold text-purple-300">
                          {step.step || (idx + 1).toString().padStart(2, '0')}
                        </span>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {isCta ? 'Call-to-Action Card' : `Phase ${step.step}`}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                            {step.title || 'Untitled Phase'}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveStep(idx, 'up')}
                          disabled={idx === 0}
                          title="Move Up"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveStep(idx, 'down')}
                          disabled={idx === content.steps.length - 1}
                          title="Move Down"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          title="Remove Phase"
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Step #
                        </label>
                        <input
                          type="text"
                          value={step.step || ''}
                          onChange={(e) => handleStepChange(idx, 'step', e.target.value)}
                          placeholder="01"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono text-center focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Eyebrow / Tag
                        </label>
                        <input
                          type="text"
                          value={step.tag || ''}
                          onChange={(e) => handleStepChange(idx, 'tag', e.target.value)}
                          placeholder={isCta ? 'Next Step · Engagement' : `Phase ${step.step}`}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="sm:col-span-6">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Phase Title
                        </label>
                        <input
                          type="text"
                          value={step.title || ''}
                          onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                          placeholder="e.g. Turning Your Vision Into Beauty Innovation"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                        Phase Detailed Description
                      </label>
                      <textarea
                        rows={4}
                        value={step.description || ''}
                        onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                        placeholder="Comprehensive overview of this development phase..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                      />
                    </div>

                    {!isCta && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Proceed To Text / Footer Label
                        </label>
                        <input
                          type="text"
                          value={step.proceedText || ''}
                          onChange={(e) => handleStepChange(idx, 'proceedText', e.target.value)}
                          placeholder={`Proceed to phase ${String(Number(step.step) + 1).padStart(2, '0')}`}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    )}

                    {/* CTA Card Options */}
                    <div className="pt-2 border-t border-slate-800/60">
                      <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] text-slate-400 hover:text-white">
                        <input
                          type="checkbox"
                          checked={Boolean(step.isAction)}
                          onChange={(e) => handleStepChange(idx, 'isAction', e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500/40"
                        />
                        <span>Make this card an Engagement Call-To-Action card (Buttons)</span>
                      </label>

                      {step.isAction && (
                        <div className="mt-3 space-y-3 pt-1">
                          {/* Primary Button */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                            <div>
                              <label className="block text-[10px] font-semibold text-purple-300 mb-1">
                                Primary Button Text
                              </label>
                              <input
                                type="text"
                                value={step.actionText || ''}
                                onChange={(e) => handleStepChange(idx, 'actionText', e.target.value)}
                                placeholder="e.g. Book a Consultation"
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-purple-300 mb-1">
                                Primary Button Link URL
                              </label>
                              <input
                                type="text"
                                value={step.actionUrl || ''}
                                onChange={(e) => handleStepChange(idx, 'actionUrl', e.target.value)}
                                placeholder="e.g. /contact"
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono text-[11px] focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </div>

                          {/* Secondary Button */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                                Secondary Button Text
                              </label>
                              <input
                                type="text"
                                value={step.secondaryActionText || ''}
                                onChange={(e) => handleStepChange(idx, 'secondaryActionText', e.target.value)}
                                placeholder="e.g. Start a Conversation"
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-purple-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-300 mb-1">
                                Secondary Button Link URL
                              </label>
                              <input
                                type="text"
                                value={step.secondaryActionUrl || ''}
                                onChange={(e) => handleStepChange(idx, 'secondaryActionUrl', e.target.value)}
                                placeholder="e.g. /contact"
                                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono text-[11px] focus:outline-none focus:border-purple-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Save Action Bar */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {content.steps.length} development stages configured.
            </span>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={savingAll}
              className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {savingAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle className="w-4 h-4 text-emerald-300" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingAll ? 'Saving...' : saveSuccess ? 'Saved Live to Website!' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
