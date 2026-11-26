import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  CheckCircle2,
  Layers,
  Upload,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { HeroSlide } from '../../types';
import { api } from '../../lib/api';

interface PageHeaderEditorProps {
  page: 'about' | 'services' | 'portfolio' | 'blog' | 'articles' | 'contact' | 'process';
  pageLabel: string;
  pageRoute: string;
  defaultSlide?: HeroSlide;
  defaultSlides?: HeroSlide[]; // backwards compatibility
}

export const PageHeaderEditor: React.FC<PageHeaderEditorProps> = ({
  page,
  pageLabel,
  pageRoute,
  defaultSlide,
  defaultSlides = [],
}) => {
  const fallback = defaultSlide || defaultSlides[0] || {
    title: '',
    description: '',
    media: '',
  };

  const [header, setHeader] = useState<HeroSlide>(fallback);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [uploadingMedia, setUploadingMedia] = useState<boolean>(false);

  useEffect(() => {
    loadHeader();
  }, [page]);

  const loadHeader = async () => {
    try {
      setLoading(true);
      const res = await api.getPageHeader(page);
      if (res?.slides && res.slides.length > 0) {
        setHeader(res.slides[0]);
      } else {
        setHeader(fallback);
      }
    } catch (err: any) {
      console.warn(`[PageHeaderEditor] Failed to load header for ${page}:`, err);
      setHeader(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (field: keyof HeroSlide, value: string) => {
    setHeader((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUploadMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMedia(true);
      const res = await api.uploadMedia(file, `headers/${page}`);
      if (res?.cloudError) {
        alert(`Cloudinary Notice:\n${res.cloudError}\n\nThe image was saved locally.`);
      }
      if (res?.url) {
        handleUpdate('media', res.url);
      }
    } catch (err: any) {
      alert(`Media upload failed: ${err.message}`);
    } finally {
      setUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      // Save as single slide for this page header
      await api.savePageHeader(page, {
        slides: [
          {
            title: header.title || '',
            description: header.description || '',
            media: header.media || '',
          },
        ],
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save ${pageLabel} header: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 bg-slate-900/60 border border-slate-800 rounded-2xl">
        <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
        <span className="ml-2 text-xs text-slate-400">Loading {pageLabel} header banner...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900/90 border border-purple-500/30 rounded-2xl space-y-5 shadow-xl shadow-purple-950/20">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{pageLabel} Page Header Banner</span>
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <h4 className="text-sm font-bold text-white">Edit Header Banner</h4>
            <a
              href={`http://localhost:5173${pageRoute}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1 hover:underline"
            >
              <span>Preview {pageRoute}</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-600/25 transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : savedSuccess ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>Saved Header!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Header</span>
            </>
          )}
        </button>
      </div>

      {/* Single Slide Edit Form (No multiple slide tabs, no Add/Remove slide) */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Header Headline / Title
              </label>
              <input
                type="text"
                value={header.title || ''}
                onChange={(e) => handleUpdate('title', e.target.value)}
                placeholder={`e.g. ${pageLabel} Showcase`}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Header Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={header.description || ''}
                onChange={(e) => handleUpdate('description', e.target.value)}
                placeholder="Enter description text displayed in the header banner..."
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Background Image / Formulation Media
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={header.media || ''}
                  onChange={(e) => handleUpdate('media', e.target.value)}
                  placeholder="/images/... or https://..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono text-[11px]"
                  required
                />
                <label className="px-3.5 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                  {uploadingMedia ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingMedia ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadMedia}
                    className="hidden"
                    disabled={uploadingMedia}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Uncropped formulation preview */}
          {header.media ? (
            <div className="p-3.5 rounded-xl border border-slate-800 bg-black/60 flex flex-col items-center justify-center space-y-2">
              <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Banner Image Preview</span>
                </span>
                <a
                  href={header.media}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-medium hover:underline flex items-center gap-1 text-[11px]"
                >
                  <span>Open Full Size</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="w-full max-h-56 flex items-center justify-center overflow-hidden rounded-lg bg-black/80">
                <img
                  src={header.media}
                  alt={header.title}
                  className="max-h-52 w-auto max-w-full object-contain rounded"
                />
              </div>
              <p className="text-[10px] font-mono text-slate-500 truncate w-full px-1">{header.media}</p>
            </div>
          ) : (
            <div className="h-56 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 flex items-center justify-center text-slate-500 text-xs">
              No background image set for this page header
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
