"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Edit2, Type, Image as ImageIcon, Square, X, Check } from 'lucide-react';

export interface EditableElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'background';
  selector: string;
  value: string;
  configPath: string[];
}

interface LiveEditModeProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onElementEdit: (element: EditableElement, value: string) => void;
}

export function LiveEditMode({ enabled, onEnabledChange, onElementEdit }: LiveEditModeProps) {
  const [selectedElement, setSelectedElement] = useState<EditableElement | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const handleElementClick = (e: MouseEvent) => {
    if (!enabled || isEditing) return;

    const target = e.target as HTMLElement;
    const element = identifyEditableElement(target);
    
    if (element) {
      setSelectedElement(element);
      setEditValue(element.value);
      setIsEditing(true);
    }
  };

  const identifyEditableElement = (element: HTMLElement): EditableElement | null => {
    // Check if element has data-editable attribute
    if (element.hasAttribute('data-editable')) {
      const type = element.getAttribute('data-editable-type') as EditableElement['type'];
      const id = element.getAttribute('data-editable-id') || `element-${Date.now()}`;
      const selector = getSelector(element);
      const configPath = (element.getAttribute('data-config-path') || '').split('.');
      
      let value = '';
      if (type === 'text') {
        value = element.textContent || '';
      } else if (type === 'image') {
        value = (element as HTMLImageElement).src || '';
      } else if (type === 'button') {
        value = element.textContent || '';
      } else if (type === 'background') {
        value = element.style.backgroundImage || '';
      }

      return { id, type, selector, value, configPath };
    }

    // Check parent elements
    let parent = element.parentElement;
    while (parent && parent !== document.body) {
      if (parent.hasAttribute('data-editable')) {
        return identifyEditableElement(parent);
      }
      parent = parent.parentElement;
    }

    return null;
  };

  const getSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    if (element.className) return `.${element.className.split(' ')[0]}`;
    return element.tagName.toLowerCase();
  };

  const handleSaveEdit = () => {
    if (selectedElement) {
      onElementEdit(selectedElement, editValue);
      setIsEditing(false);
      setSelectedElement(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedElement(null);
    setEditValue('');
  };

  useEffect(() => {
    if (enabled) {
      document.addEventListener('click', handleElementClick, true);
      return () => document.removeEventListener('click', handleElementClick, true);
    }
  }, [enabled, isEditing]);

  useEffect(() => {
    if (enabled) {
      // Add hover indicators to editable elements
      const addHoverListeners = () => {
        const editableElements = document.querySelectorAll('[data-editable]');
        editableElements.forEach((el) => {
          el.addEventListener('mouseenter', () => {
            setHoveredElement(getSelector(el as HTMLElement));
            (el as HTMLElement).style.outline = '2px solid #f59e0b';
            (el as HTMLElement).style.cursor = 'pointer';
          });
          el.addEventListener('mouseleave', () => {
            setHoveredElement(null);
            (el as HTMLElement).style.outline = '';
            (el as HTMLElement).style.cursor = '';
          });
        });
      };

      addHoverListeners();
      return () => {
        const editableElements = document.querySelectorAll('[data-editable]');
        editableElements.forEach((el) => {
          el.removeEventListener('mouseenter', () => {});
          el.removeEventListener('mouseleave', () => {});
          (el as HTMLElement).style.outline = '';
          (el as HTMLElement).style.cursor = '';
        });
      };
    }
  }, [enabled]);

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => onEnabledChange(!enabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
            enabled
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/50'
              : 'bg-black/60 border border-white/20 text-white/70 hover:bg-black/80'
          }`}
        >
          <Edit2 size={16} />
          {enabled ? 'Live Edit ON' : 'Live Edit OFF'}
        </button>
      </div>

      {/* Edit Modal */}
      {isEditing && selectedElement && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-black/90 border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {selectedElement.type === 'text' && <Type size={20} className="text-amber-400" />}
                {selectedElement.type === 'image' && <ImageIcon size={20} className="text-amber-400" />}
                {selectedElement.type === 'button' && <Square size={20} className="text-amber-400" />}
                {selectedElement.type === 'background' && <Square size={20} className="text-amber-400" />}
                <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">
                  Edit {selectedElement.type}
                </h3>
              </div>
              <button
                onClick={handleCancelEdit}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">
                  {selectedElement.type === 'image' || selectedElement.type === 'background' ? 'URL' : 'Content'}
                </label>
                {selectedElement.type === 'image' || selectedElement.type === 'background' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
                    placeholder="/Images/image.jpg"
                  />
                ) : (
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all min-h-[100px] resize-none"
                    placeholder="Enter content..."
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Element Selector</label>
                <code className="block w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-amber-400 text-xs font-mono">
                  {selectedElement.selector}
                </code>
              </div>

              {selectedElement.configPath.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Config Path</label>
                  <code className="block w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white/60 text-xs font-mono">
                    {selectedElement.configPath.join('.')}
                  </code>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 text-xs font-mono uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-amber-400 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Check size={14} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hover Indicator */}
      {enabled && hoveredElement && (
        <div className="fixed bottom-4 left-4 z-50 bg-black/90 border border-white/10 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <Edit2 size={14} className="text-amber-400" />
            <span className="text-xs font-mono text-white/70">{hoveredElement}</span>
          </div>
        </div>
      )}
    </>
  );
}

// Helper hook to make elements editable
export function useEditable(elementRef: React.RefObject<HTMLElement>, options: {
  type: EditableElement['type'];
  configPath: string[];
}) {
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.setAttribute('data-editable', 'true');
    element.setAttribute('data-editable-type', options.type);
    element.setAttribute('data-config-path', options.configPath.join('.'));
  }, [elementRef, options]);
}
