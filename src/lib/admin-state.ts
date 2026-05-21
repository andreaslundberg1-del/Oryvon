// State management for admin panel
// Handles Draft/Save/Publish/Undo/Reset functionality

import { AdminConfig, defaultAdminConfig } from './admin-config';
import { supabase } from './supabase';

export type SaveState = 'draft' | 'saved' | 'published';

export interface AdminState {
  config: AdminConfig;
  saveState: SaveState;
  hasUnsavedChanges: boolean;
  undoStack: AdminConfig[];
  lastSaveTime?: Date;
  lastPublishTime?: Date;
}

export class AdminStateManager {
  private state: AdminState;
  private listeners: Set<(state: AdminState) => void> = new Set();
  private storageKey = 'oryvon_admin_draft';
  private supabaseKey = 'oryvon_admin_config';

  constructor(initialConfig?: AdminConfig) {
    this.state = {
      config: initialConfig || defaultAdminConfig,
      saveState: 'saved',
      hasUnsavedChanges: false,
      undoStack: [],
      lastSaveTime: new Date(),
    };
    this.loadDraft();
  }

  // Subscribe to state changes
  subscribe(listener: (state: AdminState) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Get current state
  getState(): AdminState {
    return { ...this.state };
  }

  // Get current config
  getConfig(): AdminConfig {
    return JSON.parse(JSON.stringify(this.state.config));
  }

  // Update config (for draft changes)
  updateConfig(updater: (config: AdminConfig) => AdminConfig) {
    // Save current state to undo stack
    this.state.undoStack.push(JSON.parse(JSON.stringify(this.state.config)));
    if (this.state.undoStack.length > 50) {
      this.state.undoStack.shift();
    }

    // Apply update
    this.state.config = updater(this.state.config);
    this.state.hasUnsavedChanges = true;
    this.state.saveState = 'draft';
    
    // Auto-save to localStorage for draft
    this.saveDraft();
    
    this.notify();
  }

  // Update specific section config
  updateSectionConfig<K extends keyof AdminConfig>(
    section: K,
    updater: (config: AdminConfig[K]) => AdminConfig[K]
  ) {
    this.updateConfig(config => ({
      ...config,
      [section]: updater(config[section]),
    }));
  }

  // Draft - changes only in preview, saved to localStorage
  async draft() {
    this.state.saveState = 'draft';
    this.saveDraft();
    this.notify();
    return this.state.config;
  }

  // Save - persist to localStorage
  async save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state.config));
      this.state.saveState = 'saved';
      this.state.hasUnsavedChanges = false;
      this.state.lastSaveTime = new Date();
      this.notify();
      return true;
    } catch (error) {
      console.error('Failed to save config:', error);
      return false;
    }
  }

  // Publish - save to Supabase (live site)
  async publish() {
    try {
      const { data, error } = await supabase
        .from('admin_config')
        .upsert({
          id: 'global',
          config: this.state.config,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Clear draft after successful publish
      localStorage.removeItem(this.storageKey);
      
      this.state.saveState = 'published';
      this.state.hasUnsavedChanges = false;
      this.state.lastPublishTime = new Date();
      this.notify();
      
      return true;
    } catch (error) {
      console.error('Failed to publish config:', error);
      return false;
    }
  }

  // Undo - restore previous draft
  undo() {
    if (this.state.undoStack.length === 0) return false;

    const previousConfig = this.state.undoStack.pop();
    if (previousConfig) {
      this.state.config = previousConfig;
      this.state.hasUnsavedChanges = true;
      this.state.saveState = 'draft';
      this.saveDraft();
      this.notify();
      return true;
    }
    return false;
  }

  // Reset - restore to published state
  async reset() {
    try {
      const { data, error } = await supabase
        .from('admin_config')
        .select('config')
        .eq('id', 'global')
        .single();

      if (error) throw error;

      if (data?.config) {
        this.state.config = data.config;
        this.state.saveState = 'saved';
        this.state.hasUnsavedChanges = false;
        this.state.undoStack = [];
        localStorage.removeItem(this.storageKey);
        this.notify();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to reset config:', error);
      return false;
    }
  }

  // Load draft from localStorage
  private loadDraft() {
    try {
      const draft = localStorage.getItem(this.storageKey);
      if (draft) {
        this.state.config = JSON.parse(draft);
        this.state.saveState = 'draft';
        this.state.hasUnsavedChanges = true;
        this.notify();
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }

  // Save draft to localStorage
  private saveDraft() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.state.config));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }

  // Load published config from Supabase
  async loadPublished() {
    try {
      const { data, error } = await supabase
        .from('admin_config')
        .select('config')
        .eq('id', 'global')
        .single();

      if (error) throw error;

      if (data?.config) {
        this.state.config = data.config;
        this.state.saveState = 'published';
        this.state.hasUnsavedChanges = false;
        this.state.lastPublishTime = new Date();
        this.notify();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to load published config:', error);
      return false;
    }
  }
}

// Singleton instance
let adminStateManager: AdminStateManager | null = null;

export function getAdminStateManager(): AdminStateManager {
  if (!adminStateManager) {
    adminStateManager = new AdminStateManager();
  }
  return adminStateManager;
}

export function resetAdminStateManager() {
  adminStateManager = null;
}
