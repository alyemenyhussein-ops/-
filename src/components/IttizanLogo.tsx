import React from 'react';

interface IttizanLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSubtext?: boolean;
}

export const IttizanLogo: React.FC<IttizanLogoProps> = ({
  size = 'md',
  className = '',
  showSubtext = true,
}) => (
  <div className={`flex items-center gap-3.5 select-none ${className}`} dir="rtl">
    {/* The Equilibrium Geometric Bean & Curves Mark */}
    <svg
      className={size === 'lg' ? 'w-16 h-16 shrink-0' : size === 'sm' ? 'w-9 h-9 shrink-0' : 'w-12 h-12 shrink-0'}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ittizanCopper" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9A4B12" />
          <stop offset="50%" stopColor="#D97724" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id="ittizanCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="ittizanBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1A1E29" />
          <stop offset="100%" stopColor="#0D0F12" />
        </linearGradient>
      </defs>

      {/* Squircle App Icon Frame */}
      <rect x="2" y="2" width="116" height="116" rx="28" fill="url(#ittizanBg)" stroke="#262B36" strokeWidth="2.5" />
      
      {/* Subtle Calibration Orbit & Vertical 90° Equilibrium Axis */}
      <circle cx="60" cy="60" r="44" stroke="#262B36" strokeWidth="1" strokeDasharray="4 4" />
      <line x1="60" y1="12" x2="60" y2="108" stroke="#262B36" strokeWidth="1.2" />

      {/* Left Bean Half: Ascending Bean Temp (BT - Maillard Copper) */}
      <path
        d="M 60 20 C 34 20, 22 38, 22 60 C 22 82, 34 100, 60 100 C 52 84, 48 72, 60 60 C 72 48, 68 34, 60 20 Z"
        fill="url(#ittizanCopper)"
        opacity="0.95"
      />

      {/* Right Bean Half: Declining Rate of Rise (RoR - Convection Cyan) */}
      <path
        d="M 60 20 C 86 20, 98 38, 98 60 C 98 82, 86 100, 60 100 C 68 84, 72 72, 60 60 C 48 48, 52 34, 60 20 Z"
        stroke="url(#ittizanCyan)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Intersecting Ghost RoR Trajectory */}
      <path
        d="M 28 36 C 45 36, 52 60, 60 60 C 68 60, 75 84, 92 84"
        stroke="#F3F4F6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3 3"
      />

      {/* Central Delta (ΔT) Equilibrium Fulcrum */}
      <polygon
        points="60,50 69,66 51,66"
        fill="#0D0F12"
        stroke="#F59E0B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>

    {/* Brand Lockup Text */}
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2.5">
        <span className={`${size === 'lg' ? 'text-3xl md:text-4xl' : size === 'sm' ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} font-extrabold text-[#F3F4F6] tracking-wide relative font-['Readex_Pro',sans-serif]`}>
          اتّزان
        </span>
        <span className="text-xs font-bold text-[#D97724] tracking-[0.22em] font-['Space_Grotesk',monospace] border border-[#D97724]/30 bg-[#D97724]/10 px-2 py-0.5 rounded uppercase">
          ITTIZAN
        </span>
      </div>
      {showSubtext && (
        <span className="text-[11px] md:text-xs text-[#9CA3AF] font-medium mt-0.5 font-['Readex_Pro',sans-serif]">
          هندسة الاتزان الحراري وتشخيص مسارات التحميص
        </span>
      )}
    </div>
  </div>
);

export default IttizanLogo;
