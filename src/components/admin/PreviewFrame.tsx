"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useLivePreview } from '@/contexts/LivePreviewContext';

type PreviewDevice = "desktop" | "tablet" | "mobile";

interface PreviewFrameProps {
  route: string;
  device: PreviewDevice;
  onScaleChange?: (scale: number) => void;
  previewData?: any; // Draft state to send to iframe
  explicitScale?: number; // Optional explicit scale to override internal calculation
  useContext?: boolean; // Enable context usage for real-time updates
}

export function PreviewFrame({ route, device, onScaleChange, previewData, explicitScale, useContext: useContextEnabled = false }: PreviewFrameProps) {
  const previewContext = useContextEnabled ? useLivePreview() : null;
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [scrollStart, setScrollStart] = useState({ x: 0, y: 0 });

  // Use context draft data if enabled, otherwise use prop
  const currentPreviewData = useContextEnabled ? previewContext?.state.draftData : previewData;

  const getViewportConfig = () => {
    switch (device) {
      case "desktop": 
        return { width: 1920, height: 1080, frameClass: "rounded-lg" }; // Standard desktop resolution
      case "tablet": 
        return { width: 768, height: 1024, frameClass: "rounded-2xl" }; // Standard tablet resolution
      case "mobile": 
        return { width: 390, height: 844, frameClass: "rounded-[2.5rem]" }; // Standard mobile resolution
    }
  };

  const viewportConfig = getViewportConfig();

  // Build absolute URL for preview iframe
  // Use NEXT_PUBLIC_SITE_URL if available, otherwise fallback to window.location.origin
  const getBaseUrl = () => {
    // Try environment variable first (for production)
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }
    // Fallback to current origin (for local development)
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    // Last resort for SSR
    return 'http://localhost:3000';
  };

  const baseUrl = getBaseUrl();
  const previewUrl = `${baseUrl}${route.startsWith('/') ? route : '/' + route}?previewWidth=${viewportConfig.width}`;

  // Calculate scale based on container dimensions to fit entire viewport
  useEffect(() => {
    if (explicitScale !== undefined) {
      // Use explicit scale if provided
      setScale(explicitScale);
      if (onScaleChange) {
        onScaleChange(explicitScale);
      }
    } else if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight || 600; // Default height if not available
      
      // Calculate scale based on both width and height constraints
      const widthScale = containerWidth / viewportConfig.width;
      const heightScale = containerHeight / viewportConfig.height;
      
      // Always use fit mode to ensure entire viewport fits
      const calculatedScale = Math.min(1, widthScale, heightScale);
      
      setScale(calculatedScale);
      if (onScaleChange) {
        onScaleChange(calculatedScale);
      }
    }
  }, [device, viewportConfig.width, viewportConfig.height, onScaleChange, explicitScale]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (explicitScale !== undefined) {
        // Use explicit scale if provided
        setScale(explicitScale);
        if (onScaleChange) {
          onScaleChange(explicitScale);
        }
      } else if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight || 600;
        
        const widthScale = containerWidth / viewportConfig.width;
        const heightScale = containerHeight / viewportConfig.height;
        
        // Always use fit mode to ensure entire viewport fits
        const calculatedScale = Math.min(1, widthScale, heightScale);
        
        setScale(calculatedScale);
        if (onScaleChange) {
          onScaleChange(calculatedScale);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [device, viewportConfig.width, viewportConfig.height, onScaleChange, explicitScale]);

  // Inject CSS to hide all dev/debug overlays in iframe
  const hideDevOverlays = () => {
    if (iframeRef.current?.contentWindow) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        // Create or update style element
        let style = iframeDoc.getElementById('oryvon-preview-hide-dev');
        if (!style) {
          style = iframeDoc.createElement('style');
          style.id = 'oryvon-preview-hide-dev';
          iframeDoc.head.appendChild(style);
        }
        
        style.textContent = `
          /* Next.js dev indicator */
          .nextjs-dev-indicator,
          [data-nextjs-dev-indicator],
          .__nextjs-dev-indicator__,
          [data-nextjs-dev-indicator] * {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            position: absolute !important;
            left: -9999px !important;
            top: -9999px !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
          }
          
          /* React dev tools overlay */
          .react-devtools-highlighter,
          .react-devtools-hook-name,
          .react-devtools-highlight-overlay {
            display: none !important;
          }
          
          /* Any fixed position elements with red background */
          div[style*="position: fixed"],
          div[style*="position:fixed"],
          [style*="z-index"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
          }
          
          /* Remove all badges with red background */
          [class*="badge"],
          [class*="indicator"],
          [class*="dev"] {
            display: none !important;
          }
          
          /* Hide any element with red background color */
          [style*="background: red"],
          [style*="background:red"],
          [style*="background-color: red"],
          [style*="background-color:red"],
          [style*="background: #f"],
          [style*="background:#f"] {
            display: none !important;
          }
        `;
      }
    }
  };

  const handleIframeLoad = () => {
    hideDevOverlays();
    // Re-apply CSS periodically to ensure it stays hidden
    const interval = setInterval(hideDevOverlays, 1000);
    
    // Store interval on the iframe ref to clear it later
    if (iframeRef.current) {
      (iframeRef.current as any).devHideInterval = interval;
    }
  };

  // Send preview data to iframe via postMessage
  useEffect(() => {
    if (iframeRef.current?.contentWindow && previewData) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: "ORYVON_PREVIEW_UPDATE",
          payload: previewData,
        },
        "*"
      );
    }
  }, [previewData]);

  // Handle mouse wheel scrolling inside iframe
  const handleWheel = (e: React.WheelEvent) => {
    // Allow iframe to handle scrolling naturally, don't prevent default
    // Only prevent propagation to parent container
    e.stopPropagation();
    
    // Let the iframe handle its own scrolling via native browser behavior
    // Don't manually scroll - let the iframe's native scrolling work
  };

  // Handle drag start for touch-like scrolling
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only enable drag scrolling for mobile and tablet
    if (device === 'desktop') return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    
    if (iframeRef.current?.contentWindow) {
      const iframeWindow = iframeRef.current.contentWindow;
      setScrollStart({
        x: iframeWindow.scrollX,
        y: iframeWindow.scrollY
      });
    }
  };

  // Handle drag move for touch-like scrolling
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || device === 'desktop') return;
    
    e.preventDefault();
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    if (iframeRef.current?.contentWindow) {
      const iframeWindow = iframeRef.current.contentWindow;
      iframeWindow.scrollTo(
        scrollStart.x - deltaX,
        scrollStart.y - deltaY
      );
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Add global event listeners for drag scrolling
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || device === 'desktop') return;
      
      e.preventDefault();
      
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      if (iframeRef.current?.contentWindow) {
        const iframeWindow = iframeRef.current.contentWindow;
        iframeWindow.scrollTo(
          scrollStart.x - deltaX,
          scrollStart.y - deltaY
        );
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, scrollStart, device]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (iframeRef.current) {
        const interval = (iframeRef.current as any).devHideInterval;
        if (interval) {
          clearInterval(interval);
        }
      }
    };
  }, []);

  // Send draft data to iframe when it changes
  useEffect(() => {
    if (iframeRef.current?.contentWindow && currentPreviewData) {
      iframeRef.current.contentWindow.postMessage({
        type: 'PREVIEW_DATA_UPDATE',
        data: currentPreviewData
      }, '*');
    }
  }, [currentPreviewData]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{
        height: `${viewportConfig.height * scale + 40}px`, // Fixed height based on scale
      }}
    >
      {/* Device Frame with border and glow */}
      <div
        className={`relative bg-black shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/10 ${viewportConfig.frameClass}`}
        style={{
          width: `${viewportConfig.width}px`,
          height: `${viewportConfig.height}px`,
          transformOrigin: 'center',
          transform: `scale(${scale})`,
          boxShadow: '0 0 40px rgba(245, 158, 11, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.5)',
          cursor: device === 'desktop' ? 'default' : (isDragging ? 'grabbing' : 'grab'),
          overflow: 'hidden', // Hide overflow on frame
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Device frame glow effect */}
        <div className="absolute inset-0 pointer-events-none rounded-inherit bg-gradient-to-b from-white/5 to-transparent" />
        
        {/* Iframe with explicit viewport width and scrolling enabled */}
        <iframe
          ref={iframeRef}
          src={previewUrl}
          className="w-full h-full border-0 rounded-inherit"
          style={{
            backgroundColor: '#020102',
            width: `${viewportConfig.width}px`,
            height: `${viewportConfig.height}px`,
            overflow: 'auto',
            overflowY: 'auto',
            overflowX: 'hidden', // Hide horizontal scroll, content should fit
          }}
          title="Live Preview"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
          scrolling="yes"
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
}
