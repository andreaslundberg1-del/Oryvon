"use client";
import React, { useId, useMemo, useState } from 'react';

interface OryvonLogoProps {
  size?: number;
  variant?: 'icon' | 'horizontal' | 'vertical';
  showTagline?: boolean;
  className?: string;
}

function CosmicO({ size, style = {}, isParentHovered = false }: { size: number; style?: React.CSSProperties; isParentHovered?: boolean }) {
  return (
    <span 
      className="inline-block relative align-middle select-none pointer-events-none transition-transform duration-700" 
      style={{ 
        width: size, 
        height: size, 
        marginTop: '-0.1em', 
        marginLeft: '0.04em', 
        marginRight: '0.45em', 
        transform: isParentHovered ? 'scale(1.12)' : 'scale(1)',
        ...style 
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="gold-dot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#ffe9a3" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#c59635" stopOpacity="0" />
          </radialGradient>
          
          {/* Animated liquid gold ring gradient */}
          <linearGradient id="gold-ring-grad-animated" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff">
              <animate attributeName="offset" values="0;0.5;0" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="30%" stopColor="#ffe9a3">
              <animate attributeName="offset" values="0.2;0.7;0.2" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="70%" stopColor="#c59635">
              <animate attributeName="offset" values="0.5;0.9;0.5" dur="6s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ffffff">
              <animate attributeName="offset" values="0.8;1;0.8" dur="6s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        
        {/* Subtle coordinate ticks outside the O */}
        <circle cx="50" cy="50" r="48" stroke="#ffe9a3" strokeWidth="0.45" strokeDasharray="1 8" opacity="0.45" />
        
        {/* Distant outer orbit ring */}
        <circle cx="50" cy="50" r="42" stroke="#eed078" strokeWidth="0.55" strokeDasharray="4 6" opacity="0.38" />
        
        {/* ── Active Portal Core Outer Ring ── */}
        <circle 
          cx="50" 
          cy="50" 
          r="37" 
          stroke="#eed078" 
          strokeWidth="0.4" 
          strokeDasharray="2 10" 
          opacity={isParentHovered ? 0.75 : 0.35} 
          style={{
            transformOrigin: '50px 50px',
            animation: 'spin-slow 15s linear infinite',
          }}
        />
        
        {/* Main circular geometric O ring */}
        <circle 
          cx="50" 
          cy="50" 
          r="32" 
          stroke="url(#gold-ring-grad-animated)" 
          strokeWidth="6.8" 
        />
        
        {/* Main circular geometric O ring glow overlay - GPU opacity transition */}
        <circle 
          cx="50" 
          cy="50" 
          r="32" 
          stroke="url(#gold-ring-grad-animated)" 
          strokeWidth="8.0" 
          opacity={isParentHovered ? 0.88 : 0}
          className="transition-opacity duration-500 ease-out"
          style={{
            filter: 'drop-shadow(0 0 4px rgba(245,158,11,0.65))',
          }}
        />
        
        {/* ── Active Portal Core Inner Energetic Ring ── */}
        <circle 
          cx="50" 
          cy="50" 
          r="26" 
          stroke="#eed078" 
          strokeWidth="0.6" 
          strokeDasharray="4 4" 
          opacity={isParentHovered ? 0.85 : 0.45} 
          style={{
            transformOrigin: '50px 50px',
            animation: 'spin-slow 8s linear infinite reverse',
          }}
        />
        
        {/* Inner coordinate orbit ring */}
        <circle cx="50" cy="50" r="21" stroke="#eed078" strokeWidth="0.75" opacity="0.5" strokeDasharray="1 3" />
        
        {/* Subtle crosshairs lines inside the O */}
        <line x1="50" y1="13" x2="50" y2="87" stroke="#eed078" strokeWidth="0.6" opacity="0.35" />
        <line x1="13" y1="50" x2="87" y2="50" stroke="#eed078" strokeWidth="0.6" opacity="0.35" />
        
        {/* Elegant central celestial glowing node */}
        <circle 
          cx="50" 
          cy="50" 
          r={isParentHovered ? 16 : 13} 
          fill="url(#gold-dot-glow)" 
          opacity={isParentHovered ? 1.0 : 0.95} 
          className="transition-all duration-500"
        />
        <circle cx="50" cy="50" r="3.2" fill="#ffffff" />
      </svg>
    </span>
  );
}

// Cache the filtered transparent image globally
let cachedTransparentSrc: string | null = null;

export default function OryndorLogo({ size = 48, variant = 'horizontal', showTagline = false, className = '' }: OryvonLogoProps) {
  const uid = useId().replace(/:/g, '');
  const [transparentSrc, setTransparentSrc] = React.useState<string>(cachedTransparentSrc || '/Images/oryndor_symbol.png');
  const [isHovered, setIsHovered] = useState(false);

  React.useEffect(() => {
    if (cachedTransparentSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/Images/oryndor_symbol.png';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r > 248 && g > 248 && b > 248) {
          data[i + 3] = 0; // Alpha = 0
        }
      }
      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL('image/png');
      cachedTransparentSrc = dataUrl;
      setTransparentSrc(dataUrl);
    };
  }, []);

  const tickLines = useMemo(() => {
    const lines = [];
    for (let deg = 0; deg < 360; deg += 10) {
      if (deg === 0 || deg === 180 || deg === 90 || deg === 270) continue;
      const rad = ((deg - 90) * Math.PI) / 180;
      lines.push({
        x1: (50 + 6 * Math.cos(rad)).toFixed(4),
        y1: (50 + 6 * Math.sin(rad)).toFixed(4),
        x2: (50 + 44 * Math.cos(rad)).toFixed(4),
        y2: (50 + 44 * Math.sin(rad)).toFixed(4),
      });
    }
    return lines;
  }, []);

  const icon = (
    <div 
      style={{ width: size, height: size }} 
      className="relative select-none group pointer-events-none"
    >
      {/* Background ambient gold aura */}
      <div 
        className="absolute inset-0 rounded-full blur-[40px] transition-all duration-1000 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(255, 233, 163, 0.70) 0%, rgba(201, 147, 58, 0.42) 45%, rgba(138, 88, 12, 0.15) 75%, transparent 100%)',
          transform: 'scale(1.5)',
          opacity: isHovered ? 1.0 : 0.8,
          animation: 'breathing-gold-glow-logo 5s ease-in-out infinite alternate',
        }}
      />
      
      {/* Astrolabe graphic */}
      <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]"
        style={{ animation: 'logo-levitate-logo 7s ease-in-out infinite alternate' }}
      >
        <defs>
          <linearGradient id={`${uid}-metallic-sheen-logo`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#eed078" stopOpacity="0" />
            <stop offset="42%" stopColor="#eed078" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="58%" stopColor="#eed078" stopOpacity="0" />
            <stop offset="100%" stopColor="#eed078" stopOpacity="0" />
          </linearGradient>

          {/* Liquid Gold Logo Text Sheen */}
          <linearGradient id="logo-text-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff">
              <animate attributeName="offset" values="0;0.5;0" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="30%" stopColor="#ffe9a3">
              <animate attributeName="offset" values="0.1;0.6;0.1" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="70%" stopColor="#c59635">
              <animate attributeName="offset" values="0.4;0.9;0.4" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#ffffff">
              <animate attributeName="offset" values="0.7;1;0.7" dur="8s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <filter id={`${uid}-node-glow-logo`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={`${uid}-flare-light-logo`} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Astrolabe Rings & Lines */}
        <g stroke="#eed078" fill="none" strokeLinecap="round">
          {tickLines.map((line, idx) => (
            <line 
              key={idx} 
              x1={line.x1} 
              y1={line.y1} 
              x2={line.x2} 
              y2={line.y2} 
              strokeWidth="0.25" 
              opacity="0.18" 
            />
          ))}
          <circle cx="50" cy="50" r="14.5" strokeWidth="0.45" opacity="0.35" />
          <circle cx="50" cy="50" r="32" strokeWidth="0.55" opacity="0.4" />
          <circle cx="50" cy="50" r="41" strokeWidth="0.4" opacity="0.32" />
          <circle cx="50" cy="50" r="47.5" strokeWidth="0.3" opacity="0.25" />
          
          <circle 
            cx="50" 
            cy="50" 
            r="35" 
            strokeWidth="0.65" 
            strokeDasharray="1 6" 
            opacity="0.4"
            style={{
              transformOrigin: '50px 50px',
              animation: `spin-astrolabe-counter-logo ${isHovered ? '25s' : '70s'} linear infinite`,
            }}
          />
          <line x1="6" y1="50" x2="94" y2="50" strokeWidth="0.35" opacity="0.2" />
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            strokeWidth="0.5" 
            strokeDasharray="2 12" 
            opacity="0.35"
            style={{
              transformOrigin: '50px 50px',
              animation: `spin-astrolabe-clock-logo ${isHovered ? '35s' : '90s'} linear infinite`,
            }}
          />
        </g>

        {/* Orbit Nodes / Glowing Spark Particles */}
        <g fill="#eed078" opacity="0.75">
          <circle cx="45" cy="85" r="0.65" style={{ animation: 'spark-float-logo-1 7s ease-in-out infinite' }} filter={`url(#${uid}-node-glow-logo)`} />
          <circle cx="55" cy="75" r="0.85" style={{ animation: 'spark-float-logo-2 6s ease-in-out infinite', animationDelay: '1.5s' }} filter={`url(#${uid}-node-glow-logo)`} />
          <circle cx="35" cy="65" r="0.55" style={{ animation: 'spark-float-logo-3 8s ease-in-out infinite', animationDelay: '0.5s' }} filter={`url(#${uid}-node-glow-logo)`} />
          <circle cx="65" cy="55" r="0.75" style={{ animation: 'spark-float-logo-4 7.5s ease-in-out infinite', animationDelay: '2s' }} filter={`url(#${uid}-node-glow-logo)`} />
          <circle cx="48" cy="45" r="0.65" style={{ animation: 'spark-float-logo-1 9s ease-in-out infinite', animationDelay: '1s' }} filter={`url(#${uid}-node-glow-logo)`} />
          <circle cx="52" cy="35" r="0.85" style={{ animation: 'spark-float-logo-2 6.5s ease-in-out infinite', animationDelay: '2.5s' }} filter={`url(#${uid}-node-glow-logo)`} />
        </g>

        {/* Majestic Vertical Needle Ray through center (Matches reference image) */}
        <g stroke="none" opacity={isHovered ? 0.95 : 0.75} className="transition-opacity duration-700">
          <line x1="50" y1="2" x2="50" y2="98" stroke="#eed078" strokeWidth="0.55" opacity="0.85" />
          <ellipse cx="50" cy="50" rx="0.8" ry="48" fill="#ffffff" filter={`url(#${uid}-flare-light-logo)`} opacity="0.38" />
          <ellipse cx="50" cy="50" rx="1.6" ry="16" fill="#eed078" filter={`url(#${uid}-flare-light-logo)`} opacity="0.5" />
        </g>

        {/* Central Symbol Emblem - sized to sit perfectly inside the outer astrolabe framing */}
        <image 
          href={transparentSrc} 
          x="15" 
          y="15" 
          width="70" 
          height="70" 
          style={{ 
            transformOrigin: 'center', 
            transition: 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)',
            filter: isHovered 
              ? 'drop-shadow(0 0 20px rgba(255, 233, 163, 1.0)) drop-shadow(0 0 10px rgba(201, 147, 58, 0.95)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.6))'
              : 'drop-shadow(0 0 10px rgba(255, 233, 163, 0.8)) drop-shadow(0 0 5px rgba(201, 147, 58, 0.65))'
          }}
          className={isHovered ? 'scale-[1.06]' : 'scale-[1]'}
        />

        {/* Glowing north-star flare element */}
        <g stroke="none" style={{ transformOrigin: '50px 6.2px', animation: 'flare-pulse-logo 4s ease-in-out infinite alternate' }}>
          <ellipse cx="50" cy="6.2" rx="4.5" ry="0.65" fill="#ffffff" filter={`url(#${uid}-flare-light-logo)`} />
          <ellipse cx="50" cy="6.2" rx="0.65" ry="4.5" fill="#ffffff" filter={`url(#${uid}-flare-light-logo)`} />
          <circle cx="50" cy="6.2" r="1.3" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );

  return (
    <div 
      className={`flex flex-col items-center select-none cursor-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: 'translate3d(0, 0, 0)', // hardware acceleration
        willChange: 'transform',
      }}
    >
      {/* ── Outer Floating Cosmic Spark Embers (On Logo Hover) ── */}
      <div className="relative flex flex-col items-center" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
            {Array.from({ length: 8 }).map((_, i) => {
              // Deterministic values based on index to prevent flickering on parent scroll re-renders
              const xPos = -45 + ((i * 13) % 91);
              const delayVal = (i * 0.22).toFixed(2);
              const durVal = 1.4 + ((i * 7) % 15) / 10;
              return (
                <div
                  key={i}
                  className="absolute w-[2px] h-[2px] rounded-full bg-amber-400"
                  style={{
                    left: '50%',
                    bottom: '10px',
                    boxShadow: '0 0 6px #ffe9a3, 0 0 3px #c59635',
                    animation: 'logo-spark-drift linear infinite',
                    animationDelay: `${delayVal}s`,
                    animationDuration: `${durVal}s`,
                    ['--logo-spark-x' as any]: `${xPos}px`,
                    willChange: 'transform, opacity',
                  }}
                />
              );
            })}
          </div>
        )}

        {variant === 'icon' && (
          <div className="transition-transform duration-700 hover:scale-105" style={{ transform: 'translateZ(0)', willChange: 'transform' }}>
            {icon}
          </div>
        )}

        {variant === 'horizontal' && (
          <div className="flex items-center gap-4 group">
            <div className="transition-transform duration-700 group-hover:scale-105">
              {icon}
            </div>
            
            {/* Sleek golden divider line */}
            <div 
              className="w-[1.5px] transition-all duration-700 bg-gradient-to-b from-transparent via-amber-500/25 to-transparent group-hover:via-amber-400"
              style={{ height: size * 0.85 }}
            />
            
            <div className="flex flex-col leading-none gap-[5px] whitespace-nowrap">
              <span 
                className="font-normal tracking-[0.45em] transition-all duration-700 text-white"
                style={{
                  fontSize: size * 0.46,
                  fontFamily: "'Cinzel', 'Times New Roman', serif",
                  background: 'linear-gradient(135deg, #ffffff 0%, #ffe9a3 40%, #c59635 75%, #ffffff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                  whiteSpace: 'nowrap',
                  filter: 'drop-shadow(0 2px 8px rgba(197,150,53,0.2))',
                }}
              >
                ORYVON
              </span>
              <span 
                className="tracking-[0.42em] uppercase font-light font-sans transition-all duration-700" 
                style={{ 
                  fontSize: size * 0.14, 
                  color: isHovered ? 'rgba(238,208,120,0.8)' : 'rgba(238,208,120,0.45)',
                  letterSpacing: isHovered ? '0.45em' : '0.42em',
                  textShadow: isHovered ? '0 0 8px rgba(245,158,11,0.2)' : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                THE DIMENSIONAL ARCHIVE
              </span>
            </div>
          </div>
        )}

        {variant === 'vertical' && (
          <div className="flex flex-col items-center">
            <div className="mb-4 transition-transform duration-700">
              {icon}
            </div>
            
            {/* O R Y V O N Title */}
            <span 
              className="font-normal tracking-[0.55em] text-center block mr-[-0.55em] transition-all duration-700 text-white"
              style={{
                fontSize: size * 0.35,
                fontFamily: "'Cinzel', 'Times New Roman', serif",
                background: 'linear-gradient(135deg, #ffffff 0%, #ffe9a3 40%, #c59635 75%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
                whiteSpace: 'nowrap',
                filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.6))',
              }}
            >
              ORYVON
            </span>

            {showTagline && (
              <div className="flex flex-col items-center w-full">
                {/* Styled divider line with central amber glowing dot */}
                <div className="flex items-center justify-center w-full my-4 relative transition-all duration-700" style={{ width: isHovered ? size * 2.1 : size * 1.8 }}>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
                  <div 
                    className="w-[5px] h-[5px] rounded-full bg-amber-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(245,158,11,0.7)] transition-all duration-500" 
                    style={{
                      transform: isHovered ? 'translate(-50%, -50%) scale(1.6)' : 'translate(-50%, -50%) scale(1)',
                      boxShadow: isHovered ? '0 0 15px rgba(245,158,11,1), 0 0 5px #fff' : '0 0 8px rgba(245,158,11,0.9)',
                    }}
                  />
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
                </div>
                
                {/* Subtext tagline */}
                <span 
                  className="tracking-[0.45em] uppercase text-center font-light block font-mono transition-all duration-700" 
                  style={{ 
                    fontSize: size * 0.08, 
                    letterSpacing: isHovered ? '0.48em' : '0.45em',
                    color: isHovered ? 'rgba(238,208,120,0.75)' : 'rgba(238,208,120,0.45)',
                    textShadow: isHovered ? '0 0 8px rgba(245,158,11,0.1)' : 'none',
                  }}
                >
                  WORLDS EVOLVE. STORIES ENDURE.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes logo-levitate-logo {
          0% { transform: translateY(0); }
          100% { transform: translateY(-5px); }
        }
        @keyframes breathing-gold-glow-logo {
          0% { opacity: 0.25; transform: scale(1.2); }
          100% { opacity: 0.55; transform: scale(1.35); }
        }
        @keyframes spin-astrolabe-clock-logo {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-astrolabe-counter-logo {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes flare-pulse-logo {
          0% { opacity: 0.55; transform: scale(0.85); }
          100% { opacity: 0.95; transform: scale(1.15); }
        }
        @keyframes spark-float-logo-1 {
          0% { opacity: 0; transform: translate(-5px, 20px); }
          30% { opacity: 0.65; }
          70% { opacity: 0.45; }
          100% { opacity: 0; transform: translate(5px, -50px); }
        }
        @keyframes spark-float-logo-2 {
          0% { opacity: 0; transform: translate(3px, 15px); }
          40% { opacity: 0.75; }
          80% { opacity: 0.35; }
          100% { opacity: 0; transform: translate(-3px, -45px); }
        }
        @keyframes spark-float-logo-3 {
          0% { opacity: 0; transform: translate(-8px, 10px); }
          35% { opacity: 0.55; }
          75% { opacity: 0.25; }
          100% { opacity: 0; transform: translate(2px, -40px); }
        }
        @keyframes spark-float-logo-4 {
          0% { opacity: 0; transform: translate(6px, 25px); }
          25% { opacity: 0.7; }
          65% { opacity: 0.3; }
          100% { opacity: 0; transform: translate(-6px, -55px); }
        }
        @keyframes logo-spark-drift {
          0% {
            transform: translate(0, 0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translate(var(--logo-spark-x), -60px) scale(1.2);
            opacity: 0;
          }
        }
        .hover-glow-text {
          transition: text-shadow 0.7s, letter-spacing 0.7s, transform 0.7s;
        }
        .group:hover .hover-glow-text {
          text-shadow: 0 0 10px rgba(255,233,163,0.6), 0 0 20px rgba(197,150,53,0.3);
        }
      `}</style>
    </div>
  );
}
