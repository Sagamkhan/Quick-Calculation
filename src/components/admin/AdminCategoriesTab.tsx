import React, { useState } from 'react';
import {
  FolderPlus,
  Layers,
  Trash2,
  Edit3,
  CheckCircle2,
  Tag,
  Hash,
  Palette
} from 'lucide-react';
import { AdminCategory } from '../AdminCMS';
import { BlogPost } from '../../data/blogPosts';

interface AdminCategoriesTabProps {
  categories: AdminCategory[];
  articles: BlogPost[];
  onCreateCategory: (cat: Omit<AdminCategory, 'id'>) => void;
  onDeleteCategory: (id: string) => void;
}

export default function AdminCategoriesTab({
  categories,
  articles,
  onCreateCategory,
  onDeleteCategory
}: AdminCategoriesTabProps) {
  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [badgeColor, setBadgeColor] = useState<string>('cyan');

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(autoSlug);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateCategory({
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      badgeColor
    });

    setName('');
    setSlug('');
    setDescription('');
    setBadgeColor('cyan');
  };

  // Compute article count for each category
  const getCategoryCount = (categoryName: string) => {
    return articles.filter((a) => a.category.toLowerCase() === categoryName.toLowerCase()).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Category Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
          <FolderPlus className="w-4 h-4 text-cyan-400" />
          <span>Create New Category</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              CATEGORY NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Health & Fitness"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 font-medium"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              URL SLUG
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. health-fitness"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 font-mono text-xs focus:outline-none focus:border-cyan-500"
            />
            <span className="text-[10px] text-slate-500 font-mono block mt-1">
              Route: /category/{slug || 'slug'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description for archive header & SEO meta description..."
              rows={3}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 font-semibold mb-1">
              BADGE ACCENT COLOR
            </label>
            <select
              value={badgeColor}
              onChange={(e) => setBadgeColor(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="cyan">Cyan Accent (High Contrast)</option>
              <option value="emerald">Emerald Green (Finance / Health)</option>
              <option value="indigo">Indigo Blue (Dev / Tech)</option>
              <option value="purple">Purple / Violet (Creative)</option>
              <option value="amber">Amber Gold (Math / Warning)</option>
              <option value="rose">Rose Red (Security / Important)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
          >
            Save Category
          </button>
        </form>
      </div>

      {/* Existing Categories List */}
      <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Active Categories ({categories.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Synced with public /blogs filter
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const count = getCategoryCount(cat.name);
            return (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{cat.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      {count} {count === 1 ? 'post' : 'posts'}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-1 rounded bg-rose-500/10 text-rose-400 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] font-mono text-cyan-400 block truncate">
                  /category/{cat.slug}
                </span>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description || 'No description provided.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
