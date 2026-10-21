import React from 'react';

interface LuxuryYemenFooterProps {
  className?: string;
  isPrintReport?: boolean;
}

export const LuxuryYemenFooter: React.FC<LuxuryYemenFooterProps> = ({
  className = '',
  isPrintReport = false,
}) => (
  <footer
    className={`w-full ${
      isPrintReport ? 'mt-6 pt-5 pb-4 print:mt-4 print:pt-4 print:pb-2' : 'mt-16 pt-8 pb-10'
    } border-t border-[#262B36]/80 print:border-slate-300 bg-gradient-to-b from-[#0D0F12] to-[#08090B] print:bg-transparent select-none ${className}`}
    dir="rtl"
  >
    <div className="max-w-4xl mx-auto px-4 flex flex-col items-center justify-center text-center space-y-3 print:space-y-2">
      {/* Ornamental Top Divider with Copper-Gold Diamond */}
      <div className="flex items-center justify-center gap-3 w-full max-w-xs opacity-80">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D97724] to-[#F59E0B] print:bg-[#D97724]" />
        <div className="w-2 h-2 rotate-45 bg-[#F59E0B] shadow-[0_0_8px_#D97724] print:shadow-none" />
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D97724] to-[#F59E0B] print:bg-[#D97724]" />
      </div>

      {/* Arabic Luxury Signature */}
      <div className="pt-1">
        <p
          style={{ fontFamily: "'Amiri', 'Reem Kufi', serif" }}
          className="text-2xl md:text-3xl font-bold tracking-wider bg-gradient-to-r from-[#C87A28] via-[#FCE19C] to-[#D97724] bg-clip-text text-transparent print:text-[#C87A28] print:drop-shadow-none drop-shadow-[0_2px_10px_rgba(217,119,36,0.25)]"
        >
          صُنِعَ فِي اليَمَن
        </p>
      </div>

      {/* English Luxury Engraved Signature */}
      <div className="flex items-center justify-center gap-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97724]/60 print:bg-[#D97724]" />
        <p
          style={{ fontFamily: "'Cinzel', serif" }}
          className="text-xs md:text-sm font-bold tracking-[0.38em] uppercase bg-gradient-to-r from-[#9CA3AF] via-[#F3F4F6] to-[#9CA3AF] bg-clip-text text-transparent print:text-slate-700"
        >
          MADE IN YEMEN
        </p>
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97724]/60 print:bg-[#D97724]" />
      </div>

      {/* Subtle Heritage Sub-caption */}
      <p className="text-[10px] text-[#9CA3AF]/60 print:text-slate-500 font-mono tracking-widest pt-1">
        ITTIZAN THERMODYNAMICS • CRADLE OF SPECIALTY COFFEE
      </p>
    </div>
  </footer>
);
