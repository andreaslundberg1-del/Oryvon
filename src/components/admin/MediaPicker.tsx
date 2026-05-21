"use client";

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FolderOpen, Trash2, Check } from 'lucide-react';

interface MediaPickerProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export function MediaPicker({ value, onChange, label, accept = 'image/*', maxSize = 5 }: MediaPickerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [libraryDragging, setLibraryDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const libraryFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert('Please select an image or video file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use XMLHttpRequest for upload progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.success && response.url) {
              onChange(response.url);
              setUploadProgress(100);
              // Add to uploaded images library
              setUploadedImages(prev => [response.url, ...prev]);
            } else {
              throw new Error(response.error || 'Upload failed');
            }
          } catch (e) {
            console.error('Parse error:', e);
            alert('Upload failed. Please try again.');
          }
        } else {
          throw new Error('Upload failed');
        }
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        console.error('Upload error');
        setIsUploading(false);
        setUploadProgress(0);
        alert('Upload failed. Please try again.');
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
      
    } catch (error) {
      console.error('Upload failed:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Upload failed. Please try again.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    setPreviewError(false);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">{label}</label>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 ${
          isDragging
            ? 'border-amber-500/50 bg-amber-500/5'
            : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30'
        }`}
      >
        {isUploading ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-amber-500/50 border-t-amber-500 rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-xs font-mono text-white/60">Uploading... {uploadProgress}%</p>
            </div>
            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500/50 to-amber-500 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : value ? (
          <div className="space-y-3">
            {/* Image Preview */}
            <div className="relative group">
              <img
                src={value}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg border border-white/10"
                onError={() => setPreviewError(true)}
                onLoad={() => setPreviewError(false)}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  title="Replace image"
                >
                  <Upload size={16} className="text-white" />
                </button>
                <button
                  onClick={handleRemove}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                  title="Remove image"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={value}
                onChange={handleUrlChange}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
                placeholder="Image URL"
              />
              <button
                onClick={() => setShowLibrary(true)}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors"
                title="Open media library"
              >
                <FolderOpen size={16} className="text-white/60" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <ImageIcon size={24} className="text-white/40" />
              </div>
            </div>
            <div>
              <p className="text-sm font-mono text-white/60 mb-1">Drop image here</p>
              <p className="text-xs font-mono text-white/30">or click to browse</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all"
            >
              <Upload size={14} className="text-amber-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400">Upload</span>
            </button>
            <button
              onClick={() => setShowLibrary(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
            >
              <FolderOpen size={14} className="text-white/60" />
              <span className="text-xs font-mono uppercase tracking-wider text-white/60">Media Library</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black/90 border border-white/10 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-mono uppercase tracking-widest text-amber-400">Media Library</h3>
              <button
                onClick={() => setShowLibrary(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-white/60" />
              </button>
            </div>

            {/* Upload from computer button */}
            <div className="mb-6">
              <button
                onClick={() => libraryFileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-all"
              >
                <Upload size={16} className="text-amber-400" />
                <span className="text-sm font-mono uppercase tracking-wider text-amber-400">Upload from computer</span>
              </button>
              <input
                ref={libraryFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleFileSelect(files[0]);
                  }
                }}
                className="hidden"
              />
            </div>

            {/* Drag and drop area */}
            <div
              onDrop={(e) => {
                e.preventDefault();
                setLibraryDragging(false);
                const files = Array.from(e.dataTransfer.files);
                if (files.length > 0) {
                  handleFileSelect(files[0]);
                }
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setLibraryDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setLibraryDragging(false);
              }}
              className={`mb-6 border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                libraryDragging
                  ? 'border-amber-500/50 bg-amber-500/5'
                  : 'border-white/10 bg-black/20'
              }`}
            >
              <div className="text-center">
                <Upload size={32} className="text-white/40 mx-auto mb-3" />
                <p className="text-sm font-mono text-white/60 mb-1">Drag and drop images here</p>
                <p className="text-xs font-mono text-white/30">PNG, JPG, JPEG, WEBP, SVG</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-4 gap-4">
                {/* Uploaded images */}
                {uploadedImages.map((url, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      onChange(url);
                      setShowLibrary(false);
                    }}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border border-white/10 group-hover:border-amber-500/50 transition-colors"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Check size={24} className="text-amber-400" />
                    </div>
                  </div>
                ))}

                {/* Sample media items */}
                {[
                  '/Images/oryndor_symbol.png',
                  '/Images/logo.png',
                  '/Images/background.jpg',
                  '/Images/hero-bg.jpg',
                ].map((url, index) => (
                  <div
                    key={`sample-${index}`}
                    onClick={() => {
                      onChange(url);
                      setShowLibrary(false);
                    }}
                    className="relative group cursor-pointer"
                  >
                    <img
                      src={url}
                      alt={`Media ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg border border-white/10 group-hover:border-amber-500/50 transition-colors"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Check size={24} className="text-amber-400" />
                    </div>
                  </div>
                ))}
              </div>

              {uploadedImages.length === 0 && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs font-mono text-white/40 text-center">
                    Upload images to add them to your media library. They will appear here after upload.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
