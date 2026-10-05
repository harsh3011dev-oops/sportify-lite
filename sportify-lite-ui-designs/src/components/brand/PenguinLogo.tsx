import React from 'react';

interface PenguinLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'logo' | 'icon' | 'empty' | 'loading' | 'listening';
  showWordmark?: boolean;
}

export const PenguinLogo: React.FC<PenguinLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'icon',
  showWordmark = false,
}) => {
  const sizeMap = {
    xs: 20,
    sm: 28,
    md: 36,
    lg: 48,
    xl: 72,
    hero: 120,
  };

  const px = sizeMap[size];

  // SVG Penguin with modern studio headphones & sleek aesthetic
  const renderPenguinSvg = () => (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-10 transition-transform duration-300"
    >
      <defs>
        {/* Headphone Neon Glow Gradient */}
        <linearGradient id="neonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        {/* Penguin Sleek Charcoal Body Gradient */}
        <linearGradient id="penguinBody" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#1e222d" />
          <stop offset="40%" stopColor="#111318" />
          <stop offset="100%" stopColor="#08090b" />
        </linearGradient>

        {/* Penguin Chest Gradient */}
        <linearGradient id="penguinChest" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* Beak Gradient */}
        <linearGradient id="beakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        {/* Subtle drop shadow for depth */}
        <filter id="headphoneShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Headphone Arch / Band (Over the head) */}
      <path
        d="M26 44 C26 22, 74 22, 74 44"
        stroke="url(#neonGlow)"
        strokeWidth="6"
        strokeLinecap="round"
        filter="url(#headphoneShadow)"
      />
      {/* Headphone Inner Cushion Band */}
      <path
        d="M32 40 C32 26, 68 26, 68 40"
        stroke="#27272a"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Outer Penguin Silhouette / Wings */}
      <path
        d="M50 18 C33 18, 23 32, 23 58 C23 75, 29 86, 50 86 C71 86, 77 75, 77 58 C77 32, 67 18, 50 18 Z"
        fill="url(#penguinBody)"
      />

      {/* Subtle Metallic Rim on Back */}
      <path
        d="M50 20 C35 20, 25 34, 25 58 C25 73, 30 84, 50 84"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* White Chest Patch */}
      <path
        d="M50 36 C42 36, 36 46, 36 62 C36 76, 42 82, 50 82 C58 82, 64 76, 64 62 C64 46, 58 36, 50 36 Z"
        fill="url(#penguinChest)"
      />

      {/* Modern Stylish Shades / Eyes (Sophisticated look) */}
      <rect x="40" y="32" width="7" height="3" rx="1.5" fill="#0f172a" />
      <rect x="53" y="32" width="7" height="3" rx="1.5" fill="#0f172a" />
      {/* Eye catchlights */}
      <circle cx="42" cy="33" r="0.8" fill="#38bdf8" />
      <circle cx="55" cy="33" r="0.8" fill="#38bdf8" />

      {/* Sleek Minimalist Beak */}
      <polygon points="50,38 46,43 54,43" fill="url(#beakGrad)" />

      {/* Left Ear Cup (Studio Headphone) */}
      <g filter="url(#headphoneShadow)">
        <rect x="20" y="38" width="10" height="20" rx="5" fill="#18181b" />
        <rect x="22" y="40" width="6" height="16" rx="3" fill="#27272a" />
        <circle cx="25" cy="48" r="3" fill="url(#neonGlow)" />
      </g>

      {/* Right Ear Cup (Studio Headphone) */}
      <g filter="url(#headphoneShadow)">
        <rect x="70" y="38" width="10" height="20" rx="5" fill="#18181b" />
        <rect x="72" y="40" width="6" height="16" rx="3" fill="#27272a" />
        <circle cx="75" cy="48" r="3" fill="url(#neonGlow)" />
      </g>

      {/* Left Wing Rest Position */}
      <path
        d="M24 50 C20 58, 20 68, 26 74"
        stroke="#111827"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Right Wing Rest Position */}
      <path
        d="M76 50 C80 58, 80 68, 74 74"
        stroke="#111827"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Tiny Feet */}
      <ellipse cx="44" cy="85" rx="4" ry="2" fill="#d97706" />
      <ellipse cx="56" cy="85" rx="4" ry="2" fill="#d97706" />

      {/* Ambient Sound Waves for listening/empty variants */}
      {(variant === 'listening' || variant === 'empty') && (
        <>
          <path
            d="M12 43 C9 46, 9 52, 12 55"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M88 43 C91 46, 91 52, 88 55"
            stroke="#06b6d4"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </>
      )}
    </svg>
  );

  if (variant === 'empty') {
    return (
      <div className={`relative flex flex-col items-center justify-center p-8 text-center ${className}`}>
        {/* Soft Ambient Neon Glow Behind Mascot */}
        <div className="absolute w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative mb-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-2xl backdrop-blur-md">
          {renderPenguinSvg()}
        </div>
      </div>
    );
  }

  if (variant === 'loading') {
    return (
      <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
        <div className="relative animate-pulse">
          {renderPenguinSvg()}
          <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className="relative shrink-0 flex items-center justify-center">
        {/* Subtle glow disk for logo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-md opacity-75" />
        {renderPenguinSvg()}
      </div>
      {showWordmark && (
        <div className="flex flex-col select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-extrabold text-lg tracking-tight text-white">
              Sportify
            </span>
            <span className="text-[11px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Lite
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide">
            Subzero Sound
          </span>
        </div>
      )}
    </div>
  );
};
