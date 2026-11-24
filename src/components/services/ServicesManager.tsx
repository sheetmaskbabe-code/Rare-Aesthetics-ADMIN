import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  FlaskConical,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  Sparkles,
  Layers,
  Image as ImageIcon,
  FileText,
  X,
  Check,
} from 'lucide-react';
import { PageHeaderEditor } from '../common/PageHeaderEditor';
import { HeroSlide } from '../../types';
import { api } from '../../lib/api';

const DEFAULT_SERVICES_SLIDE: HeroSlide = {
  title: 'Cosmetic Formulation',
  description:
    'Turn concept briefs into refined, manufacturable cosmetic formulas with sensory excellence and active potency.',
  media: '/images/1795270027986-WhatsApp_Image_2026-11-19_at_16.29.40__1_.jpeg',
};

export interface ServiceOffering {
  id: string;
  title: string;
  short: string;
  description?: string;
  benefits?: string[];
  icon: string;
  image: string;
}

export const ServicesManager: React.FC = () => {
  const [eyebrow, setEyebrow] = useState('OUR CAPABILITIES');
  const [title, setTitle] = useState('End-to-End Cosmetic Development');
  const [description, setDescription] = useState(
    'Explore our specialized formulation, evaluation, regulatory, and production coordination services.'
  );
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
  const [editingDetailIdx, setEditingDetailIdx] = useState<number | null>(null);

  useEffect(() => {
    loadServicesContent();
  }, []);

  const loadServicesContent = async () => {
    try {
      setLoading(true);
      const res = await api.getServicesContent();
      if (res) {
        if (res.eyebrow) setEyebrow(res.eyebrow);
        if (res.title) setTitle(res.title);
        if (res.description) setDescription(res.description);
        if (res.services && res.services.length > 0) {
          setServices(res.services);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load services content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateService = (idx: number, field: keyof ServiceOffering, value: any) => {
    const updated = [...services];
    updated[idx] = {
      ...updated[idx],
      [field]: value,
    };
    setServices(updated);
  };

  const handleAddBenefit = (serviceIdx: number) => {
    const updated = [...services];
    const currentBenefits = updated[serviceIdx].benefits || [];
    updated[serviceIdx] = {
      ...updated[serviceIdx],
      benefits: [...currentBenefits, 'New tailored formulation benefit'],
    };
    setServices(updated);
  };

  const handleUpdateBenefit = (serviceIdx: number, benefitIdx: number, val: string) => {
    const updated = [...services];
    const currentBenefits = [...(updated[serviceIdx].benefits || [])];
    currentBenefits[benefitIdx] = val;
    updated[serviceIdx] = {
      ...updated[serviceIdx],
      benefits: currentBenefits,
    };
    setServices(updated);
  };

  const handleRemoveBenefit = (serviceIdx: number, benefitIdx: number) => {
    const updated = [...services];
    const currentBenefits = (updated[serviceIdx].benefits || []).filter((_, i) => i !== benefitIdx);
    updated[serviceIdx] = {
      ...updated[serviceIdx],
      benefits: currentBenefits,
    };
    setServices(updated);
  };

  const handleAddService = () => {
    const newService: ServiceOffering = {
      id: `service-${Date.now()}`,
      title: 'New Cosmetic Service',
      short: 'Describe your specialized formulation, testing, or production offering here.',
      description: 'Comprehensive cosmetic formulation and scientific guidance for beauty innovators.',
      benefits: ['Custom formulation tailored to your brand vision', 'Certified quality assurance'],
      icon: 'flask',
      image: '/images/custom-bottles.jpg',
    };
    setServices([...services, newService]);
  };

  const handleDeleteService = (idx: number) => {
    if (services.length <= 1) {
      alert('You must have at least one service offering.');
      return;
    }
    setServices(services.filter((_, i) => i !== idx));
  };

  const handleUploadServiceImage = async (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingIdx(idx);
      const res = await api.uploadMedia(file, 'services');
      if (res?.cloudError) {
        alert(`Cloudinary Notice:\n${res.cloudError}\n\nThe image was saved locally.`);
      }
      if (res?.url) {
        handleUpdateService(idx, 'image', res.url);
      }
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploadingIdx(null);
      e.target.value = '';
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await api.saveServicesContent({
        eyebrow,
        title,
        description,
        services,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save services content: ${err.message}`);
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

  return (
    <div className="space-y-6 w-full max-w-[1440px] pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-purple-400" />
            <span>Services Page Content & Capabilities CMS</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the header banner, section headings, and the &ldquo;Our Capabilities&rdquo; service cards.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <a
            href="http://localhost:5173/services"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-purple-300 border border-slate-700 transition-colors"
          >
            <span>Preview Live Services</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center justify-center gap-1.5 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving Services...</span>
              </>
            ) : savedSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Services Page</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 1. Services Page Single Header Banner */}
      <PageHeaderEditor
        page="services"
        pageLabel="Services"
        pageRoute="/services"
        defaultSlide={DEFAULT_SERVICES_SLIDE}
      />

      {/* 2. OUR CAPABILITIES & SERVICES OFFERINGS (The user's screenshot section) */}
      <div className="p-6 bg-slate-900/90 border border-slate-800/80 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Capabilities Section</span>
            </span>
            <h4 className="text-sm font-bold text-white mt-0.5">
              Section Headings & Service Cards Grid
            </h4>
          </div>

          <button
            type="button"
            onClick={handleAddService}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-purple-300 border border-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Service</span>
          </button>
        </div>

        {/* Section Headings Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Section Eyebrow</label>
            <input
              type="text"
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="OUR CAPABILITIES"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 uppercase tracking-wider"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Section Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="End-to-End Cosmetic Development"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Section Subtitle / Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explore our specialized formulation, evaluation, regulatory, and production coordination services."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
          />
        </div>

        {/* Services Cards Editor Grid */}
        <div className="pt-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
            <span className="text-xs font-bold text-slate-300">
              Service Cards ({services.length} Total Services)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {services.map((service, idx) => (
              <div
                key={service.id || idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3.5 relative group hover:border-slate-700 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                      Card #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteService(idx)}
                      className="text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer flex items-center gap-1"
                      title="Remove this service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  {/* Service Title */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Service Title
                    </label>
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => handleUpdateService(idx, 'title', e.target.value)}
                      placeholder="e.g. Product Development and Formulation"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                      required
                    />
                  </div>

                  {/* Service Short Summary */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Card Summary Description
                    </label>
                    <textarea
                      rows={3}
                      value={service.short}
                      onChange={(e) => handleUpdateService(idx, 'short', e.target.value)}
                      placeholder="Brief description shown on the services card..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed text-slate-300"
                      required
                    />
                  </div>

                  {/* Service Image & Upload */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Card Image URL / Media
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={service.image || ''}
                        onChange={(e) => handleUpdateService(idx, 'image', e.target.value)}
                        placeholder="/images/... or https://..."
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-white focus:outline-none focus:border-purple-500 font-mono"
                        required
                      />
                      <label className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-semibold rounded-xl cursor-pointer flex items-center gap-1 transition-colors shrink-0">
                        {uploadingIdx === idx ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                        <span>{uploadingIdx === idx ? '...' : 'Upload'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadServiceImage(idx, e)}
                          className="hidden"
                          disabled={uploadingIdx === idx}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Image thumbnail */}
                  {service.image && (
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-slate-800 bg-black/60">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                      <a
                        href={service.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm text-[10px] text-white rounded hover:bg-black flex items-center gap-1"
                      >
                        <span>Full Size</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Service Icon
                    </label>
                    <select
                      value={service.icon || 'flask'}
                      onChange={(e) => handleUpdateService(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="flask">Flask (Chemistry & Formulation)</option>
                      <option value="shield">Shield (Regulatory & Compliance)</option>
                      <option value="factory">Factory (Manufacturing & Scale)</option>
                      <option value="search">Search (Market Research)</option>
                      <option value="leaf">Leaf (Clean Chemistry & Botanical)</option>
                      <option value="check">Check (Safety & Evaluation)</option>
                      <option value="microscope">Microscope (Clinical Trials)</option>
                      <option value="gauge">Gauge (Performance Evaluation)</option>
                      <option value="trend">Trend (Intelligence Analysis)</option>
                      <option value="spark">Spark (Brand Strategy & Identity)</option>
                      <option value="package">Package (Packaging Sourcing)</option>
                      <option value="clock">Clock (Project Management)</option>
                      <option value="layers">Layers (Reverse Engineering)</option>
                      <option value="badge">Badge (Quality Management)</option>
                    </select>
                  </div>

                  {/* Edit Card Inside Info (Detail & Benefits Button) */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="text-purple-300 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                        <span>{(service.benefits || []).length} Benefits</span>
                      </span>
                      <span className="truncate max-w-[130px] text-slate-500 font-mono text-[10px]">
                        /{service.id}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setEditingDetailIdx(idx)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Edit Inside Info (Detail & Benefits)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETAIL INFO MODAL (Inner Card Info Editor) */}
      {editingDetailIdx !== null && services[editingDetailIdx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Card #{editingDetailIdx + 1} Inner Detail Page Editor</span>
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {services[editingDetailIdx].title || 'Service Offering'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Edit the content displayed when a client clicks this card on the website
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingDetailIdx(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slug & Link */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Service URL Slug / ID
                </label>
                <a
                  href={`http://localhost:5173/services/${services[editingDetailIdx].id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <span>Preview /services/{services[editingDetailIdx].id}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input
                type="text"
                value={services[editingDetailIdx].id}
                onChange={(e) =>
                  handleUpdateService(
                    editingDetailIdx,
                    'id',
                    e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-')
                  )
                }
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-purple-500"
                placeholder="product-development-formulation"
              />
            </div>

            {/* Full Detailed Description (About this service) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  About This Service (Full Detailed Description)
                </label>
                <span className="text-[11px] text-slate-500">
                  Displayed under &quot;About this service&quot;
                </span>
              </div>
              <textarea
                rows={5}
                value={services[editingDetailIdx].description ?? ''}
                onChange={(e) =>
                  handleUpdateService(editingDetailIdx, 'description', e.target.value)
                }
                placeholder="We create innovative cosmetic products tailored to your brand's vision. Our expert team combines industry insights with advanced formulation techniques to develop high-quality, effective products that reflect your unique aesthetic. From concept to creation, we ensure excellence at every step."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed text-slate-200"
              />
            </div>

            {/* Benefits List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-slate-300">
                    Key Benefits ({(services[editingDetailIdx].benefits || []).length})
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Bullet points displayed under the &quot;Benefits&quot; heading on the detail page
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddBenefit(editingDetailIdx)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium cursor-pointer transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Benefit</span>
                </button>
              </div>

              <div className="space-y-2">
                {(services[editingDetailIdx].benefits || []).map((benefit, bIdx) => (
                  <div
                    key={bIdx}
                    className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded-xl"
                  >
                    <span className="w-5 h-5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-mono flex items-center justify-center shrink-0">
                      {bIdx + 1}
                    </span>
                    <input
                      type="text"
                      value={benefit}
                      onChange={(e) =>
                        handleUpdateBenefit(editingDetailIdx, bIdx, e.target.value)
                      }
                      className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                      placeholder="Enter benefit bullet point..."
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(editingDetailIdx, bIdx)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Remove benefit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Click &apos;Done&apos; then save changes on the main page
              </span>
              <button
                type="button"
                onClick={() => setEditingDetailIdx(null)}
                className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/25 cursor-pointer transition-all"
              >
                Done Editing Card Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
