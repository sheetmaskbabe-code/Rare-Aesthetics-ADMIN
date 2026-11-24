import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  Check,
  X,
  Loader2,
  Calendar,
  User,
  Clock,
  Sparkles,
} from 'lucide-react';
import { BlogPost, HeroSlide } from '../../types';
import { api } from '../../lib/api';
import { PageHeaderEditor } from '../common/PageHeaderEditor';

const DEFAULT_BLOG_SLIDES: HeroSlide[] = [
  {
    title: 'Editorial & Insights',
    description:
      'Perspectives on cosmetic science, luxury formulation craft, ingredient research, and beauty brand building.',
    media:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Formulation Notes',
    description:
      'Deep dives into biocompatible actives, sensory rheology, and next-generation cosmetic textures.',
    media:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Ingredient Scrutiny',
    description:
      'Evidence-backed analysis of clean chemistry, stability profiles, and clinical efficacy standards.',
    media:
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Brand Innovation',
    description:
      'Strategic frameworks for positioning niche and prestige cosmetic brands in competitive retail landscapes.',
    media:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Regulatory Horizons',
    description:
      'Navigating evolving cosmetic guidelines, documentation best practices, and compliance protocols.',
    media:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=2000&q=80',
  },
  {
    title: 'Behind the Bench',
    description:
      'Reflections from cosmetic development laboratories, formulation iterations, and batch scale-ups.',
    media:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=2000&q=80',
  },
];

interface BlogManagerProps {
  blogs: BlogPost[];
  onRefresh: () => void;
}

export const BlogManager: React.FC<BlogManagerProps> = ({ blogs, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))];

  const filtered = blogs.filter((b) => {
    const matchSearch =
      (b.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.excerpt || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.category || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const handleOpenNew = () => {
    const newId = `post-${Date.now()}`;
    setCurrentPost({
      id: newId,
      slug: `new-post-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      category: 'Cosmetic Science',
      author: 'Lindi-Grace',
      readTime: '4 min read',
      image: '',
      coverImage: '',
      published: true,
      date: new Date().toISOString().split('T')[0],
    });
    setIsEditing(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost({
      ...post,
      image: post.image || post.coverImage || '',
      coverImage: post.coverImage || post.image || '',
    });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const uploaded = await api.uploadMedia(file, 'blogs');
      const newUrl = uploaded?.url;
      if (uploaded?.cloudError) {
        alert(`Cloudinary Notice:\n${uploaded.cloudError}\n\nYour Cloudinary key lacks "create" permission. The image was safely saved locally.`);
      }
      if (newUrl) {
        setCurrentPost((prev) => ({
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
    if (!currentPost.title || !currentPost.id) {
      alert('Post ID and Title are required');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...currentPost,
        image: currentPost.image || currentPost.coverImage || '',
        coverImage: currentPost.coverImage || currentPost.image || '',
      };
      await api.savePost(payload);
      setIsEditing(false);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to save post: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      setDeletingId(id);
      await api.deletePost(id);
      onRefresh();
    } catch (err: any) {
      alert(`Failed to delete post: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      await api.savePost({
        ...post,
        published: !post.published,
      });
      onRefresh();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Blog Page Header Slider Editor */}
      <PageHeaderEditor
        page="blog"
        pageLabel="Blog / Insights"
        pageRoute="/blog"
        defaultSlides={DEFAULT_BLOG_SLIDES}
      />

      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search posts..."
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
          <span>New Article</span>
        </button>
      </div>

      {/* Posts List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          <p className="text-xs text-slate-400">No blog posts found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((post) => {
            const id = post.id || post._id || '';
            return (
              <div
                key={id}
                className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
              >
                <div>
                  {/* Cover Image */}
                  <div className="h-44 bg-slate-950 relative overflow-hidden">
                    {(post.image || post.coverImage) ? (
                      <img
                        src={post.image || post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-mono">
                        No cover image
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-[10px] font-bold text-purple-300 uppercase tracking-wider border border-purple-500/20">
                        {post.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                          post.published
                            ? 'bg-emerald-500/90 text-white shadow'
                            : 'bg-slate-800/90 text-slate-400'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h4 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {post.excerpt || post.content}
                    </p>

                    <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-500 pt-3 border-t border-slate-800/60">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author || 'Admin'}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime || '3 min'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {post.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(post)}
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

      {/* Edit/Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">
                {currentPost.title ? `Edit Article: ${currentPost.title}` : 'Create New Article'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Post ID / Key</label>
                  <input
                    type="text"
                    value={currentPost.id || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, id: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={currentPost.slug || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={currentPost.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setCurrentPost({
                      ...currentPost,
                      title,
                      slug: currentPost.slug || slug,
                    });
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <input
                    type="text"
                    value={currentPost.category || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Author</label>
                  <input
                    type="text"
                    value={currentPost.author || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Read Time</label>
                  <input
                    type="text"
                    value={currentPost.readTime || ''}
                    onChange={(e) => setCurrentPost({ ...currentPost, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Cover Image & Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentPost.image || currentPost.coverImage || ''}
                    onChange={(e) =>
                      setCurrentPost({
                        ...currentPost,
                        image: e.target.value,
                        coverImage: e.target.value,
                      })
                    }
                    placeholder="https://... or upload below"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                  <label className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                {(currentPost.image || currentPost.coverImage) && (
                  <div className="mt-3 relative rounded-xl border border-slate-800 bg-slate-950/70 p-2.5 flex flex-col items-center justify-center overflow-hidden">
                    <div className="w-full max-h-80 flex items-center justify-center overflow-hidden rounded-lg bg-black/50 p-1">
                      <img
                        src={currentPost.image || currentPost.coverImage}
                        alt="Full Preview"
                        className="max-h-72 w-auto max-w-full object-contain rounded-md"
                      />
                    </div>
                    <div className="w-full flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                      <span className="truncate max-w-[280px] font-mono text-[10px]">
                        {currentPost.image || currentPost.coverImage}
                      </span>
                      <a
                        href={currentPost.image || currentPost.coverImage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 font-medium hover:underline"
                      >
                        Open Full Image &rarr;
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Excerpt</label>
                <textarea
                  rows={2}
                  value={currentPost.excerpt || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  placeholder="Summary for blog card..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Article Content</label>
                <textarea
                  rows={6}
                  value={currentPost.content || ''}
                  onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
                  placeholder="Markdown or formatted text..."
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={Boolean(currentPost.published)}
                    onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500/40"
                  />
                  <span>Publish immediately (visible to public)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Article</span>
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
