"use client";

import React, { useState } from 'react';
import { Plus, Copy, Trash2, Eye, EyeOff, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';

export interface Section {
  id: string;
  name: string;
  type: 'hero' | 'portals' | 'timeline' | 'universe' | 'character' | 'media' | 'custom';
  visible: boolean;
  order: number;
}

interface SectionManagerProps {
  sections: Section[];
  onChange: (sections: Section[]) => void;
}

export function SectionManager({ sections, onChange }: SectionManagerProps) {
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const handleAddSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      name: 'New Section',
      type: 'custom',
      visible: true,
      order: sections.length,
    };
    onChange([...sections, newSection]);
  };

  const handleDuplicateSection = (section: Section) => {
    const newSection: Section = {
      ...section,
      id: `${section.id}-copy-${Date.now()}`,
      name: `${section.name} (Copy)`,
      order: sections.length,
    };
    onChange([...sections, newSection]);
  };

  const handleDeleteSection = (id: string) => {
    onChange(sections.filter(s => s.id !== id));
  };

  const handleToggleVisible = (id: string) => {
    onChange(sections.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ));
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedSection(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedSection || draggedSection === targetId) return;

    const draggedIndex = sections.findIndex(s => s.id === draggedSection);
    const targetIndex = sections.findIndex(s => s.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, removed);

    // Update order values
    newSections.forEach((s, i) => ({ ...s, order: i }));

    onChange(newSections);
    setDraggedSection(null);
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
  };

  const getSectionIcon = (type: Section['type']) => {
    switch (type) {
      case 'hero': return '🏠';
      case 'portals': return '🌀';
      case 'timeline': return '⏳';
      case 'universe': return '🌌';
      case 'character': return '👤';
      case 'media': return '📺';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Sections</h3>
        <button
          onClick={handleAddSection}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-mono uppercase tracking-wider transition-all"
        >
          <Plus size={14} /> Add Section
        </button>
      </div>

      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={(e) => handleDragStart(e, section.id)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, section.id)}
            onDragEnd={handleDragEnd}
            className={`bg-black/40 border border-white/10 rounded-lg overflow-hidden transition-all ${
              draggedSection === section.id ? 'border-amber-500/50 bg-amber-500/5' : 'hover:border-white/20'
            } ${!section.visible ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-3 p-3">
              <GripVertical className="w-4 h-4 text-white/30 cursor-grab" />
              <span className="text-lg">{getSectionIcon(section.type)}</span>
              
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={section.name}
                  onChange={(e) => {
                    const newSections = sections.map(s =>
                      s.id === section.id ? { ...s, name: e.target.value } : s
                    );
                    onChange(newSections);
                  }}
                  className="w-full bg-transparent text-white text-sm font-mono uppercase tracking-wider focus:outline-none"
                />
              </div>

              <button
                onClick={() => toggleExpanded(section.id)}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                {expandedSections.has(section.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <button
                onClick={() => handleToggleVisible(section.id)}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                {section.visible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>

              <button
                onClick={() => handleDuplicateSection(section)}
                className="text-white/40 hover:text-white/70 transition-colors"
              >
                <Copy size={16} />
              </button>

              <button
                onClick={() => handleDeleteSection(section.id)}
                className="text-red-400/60 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {expandedSections.has(section.id) && (
              <div className="px-3 pb-3 space-y-3 border-t border-white/10 pt-3">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Section Type</label>
                  <select
                    value={section.type}
                    onChange={(e) => {
                      const newSections = sections.map(s =>
                        s.id === section.id ? { ...s, type: e.target.value as Section['type'] } : s
                      );
                      onChange(newSections);
                    }}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-500/50 focus:outline-none transition-all"
                  >
                    <option value="hero">Hero</option>
                    <option value="portals">Portals</option>
                    <option value="timeline">Timeline</option>
                    <option value="universe">Universe</option>
                    <option value="character">Character</option>
                    <option value="media">Media</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Order</label>
                  <input
                    type="number"
                    min="0"
                    max={sections.length - 1}
                    value={section.order}
                    onChange={(e) => {
                      const newOrder = parseInt(e.target.value) || 0;
                      const newSections = [...sections].sort((a, b) => a.order - b.order);
                      const movedSection = newSections.find(s => s.id === section.id);
                      if (movedSection) {
                        movedSection.order = newOrder;
                        newSections.sort((a, b) => a.order - b.order);
                        newSections.forEach((s, i) => ({ ...s, order: i }));
                        onChange(newSections);
                      }
                    }}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:border-amber-500/50 focus:outline-none transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
