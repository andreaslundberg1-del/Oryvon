"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface PreviewState {
  isOpen: boolean;
  device: DeviceType;
  size: number;
  draftData: any;
}

interface LivePreviewContextType {
  state: PreviewState;
  setIsOpen: (isOpen: boolean) => void;
  setDevice: (device: DeviceType) => void;
  setSize: (size: number) => void;
  setDraftData: (data: any) => void;
  updateDraftField: (path: string, value: any) => void;
}

const LivePreviewContext = createContext<LivePreviewContextType | undefined>(undefined);

export function LivePreviewProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PreviewState>({
    isOpen: true,
    device: 'desktop',
    size: 50,
    draftData: {},
  });

  const setIsOpen = (isOpen: boolean) => {
    setState(prev => ({ ...prev, isOpen }));
  };

  const setDevice = (device: DeviceType) => {
    setState(prev => ({ ...prev, device }));
  };

  const setSize = (size: number) => {
    setState(prev => ({ ...prev, size }));
  };

  const setDraftData = (data: any) => {
    setState(prev => ({ ...prev, draftData: data }));
  };

  const updateDraftField = (path: string, value: any) => {
    setState(prev => {
      const newData = { ...prev.draftData };
      const keys = path.split('.');
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      return { ...prev, draftData: newData };
    });
  };

  return (
    <LivePreviewContext.Provider value={{ state, setIsOpen, setDevice, setSize, setDraftData, updateDraftField }}>
      {children}
    </LivePreviewContext.Provider>
  );
}

export function useLivePreview() {
  const context = useContext(LivePreviewContext);
  if (!context) {
    throw new Error('useLivePreview must be used within LivePreviewProvider');
  }
  return context;
}
