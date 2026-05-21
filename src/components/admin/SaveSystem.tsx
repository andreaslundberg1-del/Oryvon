"use client";

import React, { useState, useEffect } from 'react';
import { Save, Undo, RotateCcw, CloudUpload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface SaveSystemProps {
  onDraft: () => void;
  onSave: () => void;
  onPublish: () => void;
  onUndo: () => void;
  onReset: () => void;
  hasUnsavedChanges: boolean;
  isDrafting: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  lastSaveTime?: Date;
  lastPublishTime?: Date;
}

export function SaveSystem({
  onDraft,
  onSave,
  onPublish,
  onUndo,
  onReset,
  hasUnsavedChanges,
  isDrafting,
  isSaving,
  isPublishing,
  lastSaveTime,
  lastPublishTime,
}: SaveSystemProps) {
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (hasUnsavedChanges || isSaving || isPublishing) {
      setShowStatus(true);
    }
  }, [hasUnsavedChanges, isSaving, isPublishing]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, isSaving, isPublishing]);

  const formatTime = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)] p-2">
        {/* Draft Button */}
        <button
          onClick={onDraft}
          disabled={isDrafting}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            isDrafting
              ? 'bg-white/5 cursor-not-allowed opacity-50'
              : 'bg-white/5 hover:bg-white/10 hover:border-amber-500/30'
          } border border-transparent`}
          title="Create draft (local only)"
        >
          <FileText className="w-4 h-4 text-white/60" />
          <span className="text-white/80 text-sm font-medium">Draft</span>
        </button>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            isSaving
              ? 'bg-amber-500/20 cursor-not-allowed opacity-50'
              : 'bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-500/30'
          } border border-amber-500/20`}
          title="Save to localStorage"
        >
          <Save className="w-4 h-4 text-amber-500" />
          <span className="text-amber-400 text-sm font-medium">Save</span>
        </button>

        {/* Publish Button */}
        <button
          onClick={onPublish}
          disabled={isPublishing}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
            isPublishing
              ? 'bg-green-500/20 cursor-not-allowed opacity-50'
              : 'bg-green-500/10 hover:bg-green-500/20 hover:border-green-500/30'
          } border border-green-500/20`}
          title="Publish to live site"
        >
          <CloudUpload className="w-4 h-4 text-green-500" />
          <span className="text-green-400 text-sm font-medium">Publish</span>
        </button>

        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!hasUnsavedChanges}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
            !hasUnsavedChanges
              ? 'bg-white/5 cursor-not-allowed opacity-50'
              : 'bg-white/5 hover:bg-white/10 hover:border-white/20'
          } border border-transparent`}
          title="Undo last change"
        >
          <Undo className="w-4 h-4 text-white/60" />
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          disabled={!hasUnsavedChanges}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 ${
            !hasUnsavedChanges
              ? 'bg-white/5 cursor-not-allowed opacity-50'
              : 'bg-white/5 hover:bg-red-500/10 hover:border-red-500/30'
          } border border-transparent`}
          title="Reset to published state"
        >
          <RotateCcw className="w-4 h-4 text-white/60" />
        </button>

        {/* Status Indicator */}
        {showStatus && (
          <div className="flex items-center gap-2 px-3 py-2 bg-black/60 rounded-lg border border-white/10">
            {isPublishing && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Publishing...</span>
              </>
            )}
            {isSaving && !isPublishing && (
              <>
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-amber-400 text-xs font-medium">Saving...</span>
              </>
            )}
            {isDrafting && !isSaving && !isPublishing && (
              <>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-blue-400 text-xs font-medium">Drafting...</span>
              </>
            )}
            {hasUnsavedChanges && !isDrafting && !isSaving && !isPublishing && (
              <>
                <AlertCircle className="w-3 h-3 text-amber-500" />
                <span className="text-amber-400 text-xs font-medium">Unsaved changes</span>
              </>
            )}
            {!hasUnsavedChanges && !isDrafting && !isSaving && !isPublishing && lastSaveTime && (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-green-400 text-xs font-medium">Saved {formatTime(lastSaveTime)}</span>
              </>
            )}
            {!hasUnsavedChanges && !isDrafting && !isSaving && !isPublishing && lastPublishTime && (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-green-400 text-xs font-medium">Published {formatTime(lastPublishTime)}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
