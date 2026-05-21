"use client";

import React from 'react';
import { Type, Link as LinkIcon, Plus, Trash2, GripVertical } from 'lucide-react';
import { PortalsContentConfig, PortalCard } from '@/lib/admin-config';

interface PortalsContentSectionProps {
  config: PortalsContentConfig;
  onChange: (config: PortalsContentConfig) => void;
}

export function PortalsContentSection({ config, onChange }: PortalsContentSectionProps) {
  const handleChange = (field: keyof PortalsContentConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleCardChange = (index: number, card: PortalCard) => {
    const newCards = [...config.portalCards];
    newCards[index] = card;
    handleChange('portalCards', newCards);
  };

  const handleAddCard = () => {
    const newCard: PortalCard = {
      id: `portal-${Date.now()}`,
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      category: '',
      featured: false,
      visible: true,
      order: config.portalCards.length,
    };
    handleChange('portalCards', [...config.portalCards, newCard]);
  };

  const handleRemoveCard = (index: number) => {
    const newCards = config.portalCards.filter((_, i) => i !== index);
    handleChange('portalCards', newCards);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Content</h3>
      </div>

      {/* Show Featured Only Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Show Featured Only</label>
        <button
          onClick={() => handleChange('showFeaturedOnly', !config.showFeaturedOnly)}
          className={`w-12 h-6 rounded-full transition-all duration-300 ${
            config.showFeaturedOnly ? 'bg-amber-500' : 'bg-white/10'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
              config.showFeaturedOnly ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Max Featured Count */}
      {config.showFeaturedOnly && (
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Max Featured Count</label>
          <input
            type="number"
            min="1"
            max="20"
            value={config.maxFeaturedCount}
            onChange={(e) => handleChange('maxFeaturedCount', parseInt(e.target.value) || 6)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
          />
        </div>
      )}

      {/* Portal Cards */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Portal Cards</label>
          <button
            onClick={handleAddCard}
            className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-mono uppercase tracking-wider transition-all"
          >
            <Plus size={14} /> Add Portal
          </button>
        </div>

        {config.portalCards.map((card, index) => (
          <div key={card.id} className="bg-black/30 border border-white/10 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-white/30" />
                <span className="text-xs font-mono text-white/50 uppercase tracking-wider">Portal {index + 1}</span>
              </div>
              <button
                onClick={() => handleRemoveCard(index)}
                className="text-red-400/60 hover:text-red-400"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/30">Title</label>
              <input
                type="text"
                value={card.title}
                onChange={(e) => handleCardChange(index, { ...card, title: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all text-sm"
                placeholder="Portal Title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/30">Description</label>
              <textarea
                value={card.description}
                onChange={(e) => handleCardChange(index, { ...card, description: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all text-sm min-h-[80px] resize-none"
                placeholder="Portal description..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/30">Image URL</label>
              <input
                type="text"
                value={card.imageUrl}
                onChange={(e) => handleCardChange(index, { ...card, imageUrl: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all text-sm"
                placeholder="/Images/portal.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/30">Link</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={card.link}
                  onChange={(e) => handleCardChange(index, { ...card, link: e.target.value })}
                  className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all text-sm"
                  placeholder="/universe/elydria"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-white/30">Category</label>
              <input
                type="text"
                value={card.category}
                onChange={(e) => handleCardChange(index, { ...card, category: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all text-sm"
                placeholder="Universe"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`featured-${card.id}`}
                  checked={card.featured}
                  onChange={(e) => handleCardChange(index, { ...card, featured: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor={`featured-${card.id}`} className="text-xs font-mono text-white/60 uppercase tracking-wider">Featured</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`visible-${card.id}`}
                  checked={card.visible}
                  onChange={(e) => handleCardChange(index, { ...card, visible: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <label htmlFor={`visible-${card.id}`} className="text-xs font-mono text-white/60 uppercase tracking-wider">Visible</label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
