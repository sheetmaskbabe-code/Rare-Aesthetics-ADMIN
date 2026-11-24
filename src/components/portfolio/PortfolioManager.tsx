import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Star,
  X,
  Tag,
  Briefcase,
  Workflow,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Save,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { PortfolioItem, HeroSlide, ProcessPageContent, ProcessStep } from '../../types';
import { api } from '../../lib/api';
import { PageHeaderEditor } from '../common/PageHeaderEditor';

const DEFAULT_PORTFOLIO_SLIDES: HeroSlide[] = [
  {
    title: 'Radiant Skincare',
    description:
      'Clinical cosmetic formulations developed with sensory distinction and certified active potency.',
    media:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Luxury Packaging',
    description:
      'Custom bottle, jar, and pump component sourcing tailored for high-end luxury shelf appeal.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Bespoke Formulation',
    description:
      'Tailor-made emulsions, serums, and creams balancing botanical luxury with biological efficacy.',
    media:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Brand Development',
    description:
      'Elevating founder vision into distinctive brand identity, visual presence, and market positioning.',
    media:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Product Launch',
    description:
      'Guiding commercial launches from lab bench testing to batch manufacturing readiness.',
    media:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Clean Chemistry',
    description:
      'Next-generation green chemistry and bio-compatible cosmetic development in Pretoria.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
];

interface PortfolioManagerProps {
  portfolio: PortfolioItem[];
  onRefresh: () => void;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({
  portfolio,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<PortfolioItem>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showProcessModal, setShowProcessModal] = useState(false);
  const [editingDetailItem, setEditingDetailItem] = useState<PortfolioItem | null>(null);
  const [savingDetail, setSavingDetail] = useState(false);
  const [uploadingDetailImage, setUploadingDetailImage] = useState(false);
  const [processContent, setProcessContent] = useState<ProcessPageContent>({
    eyebrow: 'Our Approach',
    title: 'The Pathway to Beauty Innovation',
    description:
      'A disciplined, collaborative framework uniting visionary creativity, cosmetic science, quality formulation, and commercial execution.',
    steps: [],
  });
  const [loadingProcess, setLoadingProcess] = useState(false);
  const [savingProcess, setSavingProcess] = useState(false);
  const [processSaveSuccess, setProcessSaveSuccess] = useState(false);

  const handleOpenProcessModal = async () => {
    setShowProcessModal(true);
    try {
      setLoadingProcess(true);
      const res = await api.getProcessContent();
      if (res && res.steps) {
        setProcessContent({
          eyebrow: res.eyebrow || 'Our Approach',
          title: res.title || 'The Pathway to Beauty Innovation',
          description: res.description || '',
          steps: res.steps,
        });
      }
    } catch (err) {
      console.error('Failed to load process data:', err);
    } finally {
      setLoadingProcess(false);
    }
  };

  const handleSaveProcess = async () => {
    try {
      setSavingProcess(true);
      setProcessSaveSuccess(false);
      await api.saveProcessContent(processContent);
      setProcessSaveSuccess(true);
      setTimeout(() => setProcessSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save process steps: ${err.message}`);
    } finally {
      setSavingProcess(false);
    }
  };

  const handleProcessStepChange = (index: number, field: keyof ProcessStep, value: any) => {
    const updated = [...processContent.steps];
    updated[index] = { ...updated[index], [field]: value };
    setProcessContent({ ...processContent, steps: updated });
  };

  const handleAddProcessStep = () => {
    const nextNum = (processContent.steps.length + 1).toString().padStart(2, '0');
    const newStep: ProcessStep = {
      step: nextNum,
      tag: `Phase ${nextNum}`,
      title: `Phase ${nextNum} - Development Stage`,
      description: 'Describe the key activities and formulation targets for this phase.',
      proceedText: `Proceed to phase ${(processContent.steps.length + 2).toString().padStart(2, '0')}`,
      isAction: false,
    };
    setProcessContent({ ...processContent, steps: [...processContent.steps, newStep] });
  };

  const handleRemoveProcessStep = (index: number) => {
    if (!window.confirm('Are you sure you want to delete this process phase?')) return;
    const updated = processContent.steps.filter((_, i) => i !== index);
    setProcessContent({ ...processContent, steps: updated });
  };

  const handleMoveProcessStep = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= processContent.steps.length) return;
    const updated = [...processContent.steps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setProcessContent({ ...processContent, steps: updated });
  };

  const handleOpenItemDetail = (item: PortfolioItem) => {
    setEditingDetailItem({ ...item });
  };

  const handleSaveDetailItem = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingDetailItem) return;
    try {
      setSavingDetail(true);
      await api.savePortfolioItem(editingDetailItem);
      onRefresh();
      setEditingDetailItem(null);
    } catch (err: any) {
      alert(`Failed to save inner detail: ${err.message}`);
    } finally {
      setSavingDetail(false);
    }
  };

  const handleDetailImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingDetailItem) return;

    try {
      setUploadingDetailImage(true);
      const uploaded = await api.uploadMedia(file, 'portfolio');
      const newUrl = uploaded?.url;
      if (uploaded?.cloudError) {
        alert(
          `Cloudinary Notice:\n${uploaded.cloudError}\n\nYour Cloudinary key lacks "create" permission. The image was safely saved locally.`
        );
      }
      if (newUrl) {
        setEditingDetailItem((prev) =>
          prev
            ? {
                ...prev,
                image: newUrl,
                coverImage: newUrl,
              }
            : null
        );
      }
    } catch (err: any) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingDetailImage(false);
      e.target.value = '';
    }
  };

  const categories = ['all', ...Array.from(new Set(portfolio.map((p) => p.category).filter(Boolean)))];

  const filtered = portfolio.filter((item) => {
    const matchSearch =
      (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleOpenNew = () => {
    const newId = `portfolio-${Date.now()}`;
    setCurrentItem({
      id: newId,
      slug: `item-${Date.now()}`,
      title: '',
      subtitle: '',
      description: '',
      category: 'Cosmetic Formulation',
      client: '',
      year: new Date().getFullYear().toString(),
      image: '',
      coverImage: '',
      featured: true,
      order: portfolio.length + 1,
    });
    setIsEditing(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setCurrentItem({
      ...item,
      image: item.image || item.coverImage || '',
      coverImage: item.coverImage || item.image || '',
    });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploaded = await api.uploadMedia(file, 'portfolio');
      const newUrl = uploaded?.url;
      if (uploaded?.cloudError) {
        alert(`Cloudinary Notice:\n${uploaded.cloudError}\n\nYour Cloudinary key lacks "create" permission. The image was safely saved locally.`);
      }
      if (newUrl) {
        setCurrentItem((prev) => ({
          ...prev,
          image: newUrl,
          coverImage: newUrl,
        }));
      } else {
        alert('Upload succeeded but no image URL was returned.');
      }
    } catch (err: any) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem.title || !currentItem.id) {
      alert('Item ID and Title are required');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...currentItem,
        image: currentItem.image || currentItem.coverImage || '',
        coverImage: currentItem.coverImage || currentItem.image || '',
      };
      await api.savePortfolioItem(payload);
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to save portfolio item: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio showcase?')) return;

    try {
      setDeletingId(id);
      await api.deletePortfolioItem(id);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete item: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (item: PortfolioItem) => {
    try {
      await api.savePortfolioItem({
        ...item,
        featured: !item.featured,
      });
      onRefresh();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Page Header Slider Editor */}
      <PageHeaderEditor
        page="portfolio"
        pageLabel="Portfolio"
        pageRoute="/portfolio"
        defaultSlides={DEFAULT_PORTFOLIO_SLIDES}
      />

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search portfolio..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  selectedCategory === c
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          <p className="text-xs text-slate-400">No portfolio projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const id = item.id || item._id || '';
            return (
              <div
                key={id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  <div className="h-44 bg-slate-950 relative overflow-hidden">
                    {(item.image || item.coverImage) ? (
                      <img
                        src={item.image || item.coverImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                        No image preview
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-purple-300 uppercase tracking-wider border border-purple-500/20">
                        {item.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleToggleFeatured(item)}
                        title={item.featured ? 'Featured on homepage' : 'Not featured'}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                          item.featured
                            ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                            : 'bg-slate-900/80 text-slate-500 hover:text-slate-200'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5">
                    <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h4>
                    {item.subtitle && (
                      <p className="text-[11px] text-purple-400 font-medium mt-0.5">{item.subtitle}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-500 pt-3 border-t border-slate-800/60">
                      {item.client && <span>Client: {item.client}</span>}
                      {item.year && <span>• Year: {item.year}</span>}
                    </div>
                  </div>
                </div>

                {/* Edit Inside Info button for EVERY card in Portfolio */}
                <div className="px-5 pb-3 pt-1">
                  {(item.id === 'portfolio-process' || item.link === '/process' || item.title?.toLowerCase().includes('process')) ? (
                    <button
                      type="button"
                      onClick={handleOpenProcessModal}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold cursor-pointer transition-all shadow-sm hover:shadow"
                    >
                      <Workflow className="w-3.5 h-3.5" />
                      <span>Edit Inside Phases (Phase 01 - 08 Cards)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenItemDetail(item)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-purple-600/20 text-slate-200 hover:text-purple-300 border border-slate-700/80 hover:border-purple-500/40 text-xs font-semibold cursor-pointer transition-all shadow-sm hover:shadow"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                      <span>Edit Inside Info (Detail & Overview)</span>
                    </button>
                  )}
                </div>

                <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">ID: {item.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deletingId === id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      {deletingId === id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Modal - Big Spacious Layout */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl xl:max-w-6xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden my-4 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Portfolio Showcase Editor
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {currentItem.title ? `Edit: ${currentItem.title}` : 'Add Portfolio Item'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If editing the Process item, show a callout button to open the Phase cards editor */}
            {(currentItem.id === 'portfolio-process' || currentItem.link === '/process' || currentItem.title?.toLowerCase().includes('process')) && (
              <div className="mx-6 sm:mx-7 mt-5 p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">This portfolio showcase links to the Process Page (/process)</h4>
                    <p className="text-[11px] text-slate-400">Click to edit the 8 innovation phases (Phase 01 Turning Your Vision..., Phase 02, etc.)</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOpenProcessModal}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer shrink-0"
                >
                  Edit Phase 01 - 08 Cards
                </button>
              </div>
            )}

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Left Column: Form Details */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Item ID / Key</label>
                      <input
                        type="text"
                        value={currentItem.id || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, id: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        placeholder="e.g. portfolio-process"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                      <input
                        type="text"
                        value={currentItem.category || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        placeholder="e.g. Formulation, Packaging"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={currentItem.title || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      placeholder="e.g. Our Process"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={currentItem.subtitle || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      placeholder="e.g. Natural Emulsion with Barrier Support"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={currentItem.client || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, client: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        placeholder="e.g. Private Label Studio"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Year</label>
                      <input
                        type="text"
                        value={currentItem.year || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, year: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        placeholder="e.g. 2026"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Target Page Link</label>
                      <input
                        type="text"
                        value={currentItem.link || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, link: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                        placeholder="e.g. /process or /contact"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={currentItem.buttonText || ''}
                        onChange={(e) => setCurrentItem({ ...currentItem, buttonText: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        placeholder="e.g. LEARN MORE"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Formula Highlights</label>
                    <textarea
                      rows={5}
                      value={currentItem.description || ''}
                      onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                      placeholder="Comprehensive project overview and formula highlights..."
                      required
                    />
                  </div>

                  <div className="pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-slate-300 hover:text-white transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(currentItem.featured)}
                        onChange={(e) => setCurrentItem({ ...currentItem, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500/40"
                      />
                      <span className="font-medium">Feature on Homepage and Highlights</span>
                    </label>
                  </div>
                </div>

                {/* Right Column: Big High-Resolution Image Preview & Uploader */}
                <div className="lg:col-span-5 flex flex-col space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Showcase Image
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={currentItem.image || currentItem.coverImage || ''}
                        onChange={(e) =>
                          setCurrentItem({
                            ...currentItem,
                            image: e.target.value,
                            coverImage: e.target.value,
                          })
                        }
                        placeholder="Image URL or upload"
                        className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <label className="px-3.5 py-2.5 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-semibold text-purple-300 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                        {uploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Big Image Preview Box */}
                  <div className="relative rounded-2xl border border-slate-800 bg-slate-950/70 p-3 flex flex-col items-center justify-center min-h-[360px] max-h-[460px] overflow-hidden">
                    {(currentItem.image || currentItem.coverImage) ? (
                      <div className="w-full h-full flex-1 flex flex-col items-center justify-center">
                        <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-black/60 p-2 min-h-[280px]">
                          <img
                            src={currentItem.image || currentItem.coverImage}
                            alt="Full Preview"
                            className="max-h-[340px] w-auto max-w-full object-contain rounded-lg shadow-lg"
                          />
                        </div>
                        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-2.5 px-1">
                          <span className="truncate max-w-[220px] font-mono text-[10px] text-slate-400">
                            {currentItem.image || currentItem.coverImage}
                          </span>
                          <a
                            href={currentItem.image || currentItem.coverImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 font-medium hover:underline inline-flex items-center gap-1 shrink-0"
                          >
                            Open Full Image ↗
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 text-slate-500">
                        <Upload className="w-10 h-10 mx-auto mb-2 opacity-30 text-purple-400" />
                        <p className="text-xs">No image provided</p>
                        <p className="text-[10px] text-slate-600 mt-1">Upload an image or paste a URL above</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROCESS PHASES (PHASE 01 - 08) MODAL */}
      {showProcessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-5xl xl:max-w-6xl bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden my-4 max-h-[94vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Workflow className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Process Framework Editor
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    Edit Process Journey Phases (Phase 01 - 08 Cards)
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="http://localhost:5173/process"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-purple-300 border border-slate-700 transition-colors"
                >
                  <span>Preview /process</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => setShowProcessModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              {loadingProcess ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                  <span>Loading process phases...</span>
                </div>
              ) : (
                <>
                  {/* Section Intro Controls */}
                  <div className="p-5 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                        "Our Approach" Section Header
                      </span>
                      {processSaveSuccess && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Saved Live to Website!</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Eyebrow Tag
                        </label>
                        <input
                          type="text"
                          value={processContent.eyebrow || ''}
                          onChange={(e) =>
                            setProcessContent({ ...processContent, eyebrow: e.target.value })
                          }
                          placeholder="Our Approach"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="md:col-span-8">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Headline Title
                        </label>
                        <input
                          type="text"
                          value={processContent.title || ''}
                          onChange={(e) =>
                            setProcessContent({ ...processContent, title: e.target.value })
                          }
                          placeholder="The Pathway to Beauty Innovation"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                        />
                      </div>
                      <div className="md:col-span-12">
                        <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                          Framework Subtitle / Description
                        </label>
                        <textarea
                          rows={2}
                          value={processContent.description || ''}
                          onChange={(e) =>
                            setProcessContent({ ...processContent, description: e.target.value })
                          }
                          placeholder="A disciplined, collaborative framework..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Header Bar for Phases */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Development Journey Phases ({processContent.steps.length} configured)
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Edit each phase title, number, detailed scope of work, and next step links.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddProcessStep}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Phase</span>
                    </button>
                  </div>

                  {/* Phase Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {processContent.steps.map((step, idx) => {
                      const isCta = Boolean(step.isAction);

                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
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
                                  onClick={() => handleMoveProcessStep(idx, 'up')}
                                  disabled={idx === 0}
                                  title="Move Up"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveProcessStep(idx, 'down')}
                                  disabled={idx === processContent.steps.length - 1}
                                  title="Move Down"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 transition-colors cursor-pointer"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveProcessStep(idx)}
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
                                  onChange={(e) =>
                                    handleProcessStepChange(idx, 'step', e.target.value)
                                  }
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
                                  onChange={(e) =>
                                    handleProcessStepChange(idx, 'tag', e.target.value)
                                  }
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
                                  onChange={(e) =>
                                    handleProcessStepChange(idx, 'title', e.target.value)
                                  }
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
                                onChange={(e) =>
                                  handleProcessStepChange(idx, 'description', e.target.value)
                                }
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
                                  onChange={(e) =>
                                    handleProcessStepChange(idx, 'proceedText', e.target.value)
                                  }
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
                                  onChange={(e) =>
                                    handleProcessStepChange(idx, 'isAction', e.target.checked)
                                  }
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
                                        onChange={(e) =>
                                          handleProcessStepChange(idx, 'actionText', e.target.value)
                                        }
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
                                        onChange={(e) =>
                                          handleProcessStepChange(idx, 'actionUrl', e.target.value)
                                        }
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
                                        onChange={(e) =>
                                          handleProcessStepChange(
                                            idx,
                                            'secondaryActionText',
                                            e.target.value
                                          )
                                        }
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
                                        onChange={(e) =>
                                          handleProcessStepChange(
                                            idx,
                                            'secondaryActionUrl',
                                            e.target.value
                                          )
                                        }
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
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                {processContent.steps.length} process phases configured.
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowProcessModal(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveProcess}
                  disabled={savingProcess}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {savingProcess ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : processSaveSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-300" />
                      <span>Saved Live to Website!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save All Phase Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* INDIVIDUAL PORTFOLIO CARD INNER DETAIL MODAL */}
      {editingDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl bg-slate-900 border border-purple-500/40 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden my-4 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                    Inner Detail Page Editor
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">
                    {editingDetailItem.title || 'Portfolio Item'}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {editingDetailItem.link && (
                  <a
                    href={`http://localhost:5173${editingDetailItem.link.startsWith('/') ? editingDetailItem.link : `/${editingDetailItem.link}`}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-purple-300 border border-slate-700 transition-colors"
                  >
                    <span>Preview Live Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setEditingDetailItem(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDetailItem} className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Column: Text & Settings */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={editingDetailItem.title || ''}
                      onChange={(e) =>
                        setEditingDetailItem({ ...editingDetailItem, title: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={editingDetailItem.subtitle || ''}
                      onChange={(e) =>
                        setEditingDetailItem({ ...editingDetailItem, subtitle: e.target.value })
                      }
                      placeholder="e.g. Bespoke formulation and packaging design"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Page Destination URL / Link
                      </label>
                      <input
                        type="text"
                        value={editingDetailItem.link || ''}
                        onChange={(e) =>
                          setEditingDetailItem({ ...editingDetailItem, link: e.target.value })
                        }
                        placeholder="e.g. /portfolio/custom-sprays-formulations"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono text-[11px] focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Button Action Text
                      </label>
                      <input
                        type="text"
                        value={editingDetailItem.buttonText || ''}
                        onChange={(e) =>
                          setEditingDetailItem({ ...editingDetailItem, buttonText: e.target.value })
                        }
                        placeholder="e.g. LEARN MORE"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Client Name
                      </label>
                      <input
                        type="text"
                        value={editingDetailItem.client || ''}
                        onChange={(e) =>
                          setEditingDetailItem({ ...editingDetailItem, client: e.target.value })
                        }
                        placeholder="e.g. Private Label Studio"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={editingDetailItem.year || ''}
                        onChange={(e) =>
                          setEditingDetailItem({ ...editingDetailItem, year: e.target.value })
                        }
                        placeholder="e.g. 2026"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Inside Detail Overview & Full Scope Description
                    </label>
                    <textarea
                      rows={6}
                      value={editingDetailItem.description || ''}
                      onChange={(e) =>
                        setEditingDetailItem({
                          ...editingDetailItem,
                          description: e.target.value,
                        })
                      }
                      placeholder="Comprehensive overview and technical details displayed when clients view this project..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                      required
                    />
                  </div>
                </div>

                {/* Right Column: Image Preview & Upload */}
                <div className="md:col-span-5 flex flex-col space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Project Showcase Image
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingDetailItem.image || ''}
                        onChange={(e) =>
                          setEditingDetailItem({ ...editingDetailItem, image: e.target.value })
                        }
                        placeholder="Image URL or upload"
                        className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                      />
                      <label className="px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-semibold text-purple-300 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                        {uploadingDetailImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>{uploadingDetailImage ? '...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleDetailImageUpload}
                          className="hidden"
                          disabled={uploadingDetailImage}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 flex flex-col items-center justify-center min-h-[260px] max-h-[360px] overflow-hidden">
                    {editingDetailItem.image ? (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-black/60 p-2 min-h-[200px]">
                          <img
                            src={editingDetailItem.image}
                            alt={editingDetailItem.title}
                            className="max-h-[260px] w-auto max-w-full object-contain rounded-lg shadow-lg"
                          />
                        </div>
                        <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                          <span className="truncate max-w-[200px] font-mono text-[10px]">
                            {editingDetailItem.image}
                          </span>
                          <a
                            href={editingDetailItem.image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 font-medium hover:underline inline-flex items-center gap-1 shrink-0"
                          >
                            Open Full ↗
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 text-slate-500">
                        <Upload className="w-8 h-8 mx-auto mb-2 opacity-30 text-purple-400" />
                        <p className="text-xs">No image provided</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingDetailItem(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingDetail}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {savingDetail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Inside Info</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
