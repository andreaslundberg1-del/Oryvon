"use client";

import React from 'react';

interface TimelineEvent {
  id: string;
  title: string;
  date?: string;
  description?: string;
  universe_id?: string;
}

interface TimelinePreviewProps {
  events: TimelineEvent[];
  theme?: "dark" | "light" | "cinematic";
}

export function TimelinePreview({ events, theme = "cinematic" }: TimelinePreviewProps) {
  const getBgClass = () => {
    switch (theme) {
      case "dark": return "bg-black/90";
      case "light": return "bg-white";
      case "cinematic": return "bg-gradient-to-b from-black/95 via-black/90 to-black/95";
    }
  };

  const getLineColor = () => {
    switch (theme) {
      case "dark": return "bg-white/20";
      case "light": return "bg-gray-300";
      case "cinematic": return "bg-amber-500/30";
    }
  };

  const getNodeColor = () => {
    switch (theme) {
      case "dark": return "bg-white/40";
      case "light": return "bg-gray-500";
      case "cinematic": return "bg-amber-500/60";
    }
  };

  const getTitleColor = () => {
    switch (theme) {
      case "dark": return "text-white";
      case "light": return "text-gray-900";
      case "cinematic": return "text-amber-400";
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case "dark": return "text-white/70";
      case "light": return "text-gray-600";
      case "cinematic": return "text-white/70";
    }
  };

  const getDateColor = () => {
    switch (theme) {
      case "dark": return "text-white/40";
      case "light": return "text-gray-500";
      case "cinematic": return "text-white/40";
    }
  };

  return (
    <div className={`w-full h-full min-h-[400px] ${getBgClass()} p-8 relative overflow-hidden`}>
      <div className="mb-6">
        <h2 className={`font-mono text-2xl tracking-[0.3em] ${theme === "light" ? "text-gray-900" : "text-amber-400"}`}>
          TIMELINE
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-px" />

        {/* Events */}
        <div className="space-y-8">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex items-start gap-6">
              {/* Node */}
              <div className={`absolute left-6 w-3 h-3 rounded-full ${getNodeColor()} -translate-x-1/2 shadow-[0_0_10px_rgba(245,158,11,0.5)]`} />

              {/* Content */}
              <div className="ml-12 flex-1">
                {event.date && (
                  <span className={`font-mono text-[10px] uppercase tracking-widest block mb-2 ${getDateColor()}`}>
                    {event.date}
                  </span>
                )}
                <h3 className={`font-mono text-sm tracking-widest mb-2 ${getTitleColor()}`}>
                  {event.title}
                </h3>
                {event.description && (
                  <p className={`font-mono text-xs ${getTextColor()}`}>
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {events.length === 0 && (
            <div className="text-center py-12">
              <p className={`font-mono text-sm ${getDateColor()}`}>
                No timeline events yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
