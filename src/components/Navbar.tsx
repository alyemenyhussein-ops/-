import React from 'react';
import {
  Activity,
  Archive,
  BookOpen,
  GraduationCap,
  Scale,
  Menu,
  Sparkles,
  ChevronLeft,
  Cpu,
  Layers,
} from 'lucide-react';
import { IttizanLogo } from './IttizanLogo';
import { PRESETS } from '../data/presets';

interface NavbarProps {
  currentTab: 'diagnostics' | 'vault' | 'trainer' | 'scaler';
  onTabChange: (tab: 'diagnostics' | 'vault' | 'trainer' | 'scaler') => void;
  vaultCount: number;
  onOpenGuide: () => void;
  selectedPresetId?: string;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  vaultCount,
  onOpenGuide,
  selectedPresetId,
  onToggleMobileSidebar,
}) => {
  const tabTitles: Record<
    'diagnostics' | 'vault' | 'trainer' | 'scaler',
    { title: string; subtitle: string; icon: React.ElementType; color: string }
  > = {
    diagnostics: {
      title: 'تشخيص المسار الحراري',
      subtitle: 'تحليل المنحنى ومؤشرات RoR ونسب المراحل الـ 3',
      icon: Activity,
      color: '#D97724',
    },
    trainer: {
      title: 'وضع المدرب (Trainer Mode)',
      subtitle: 'تحديات المحاكاة وكشف عيوب التحميص الخفية',
      icon: GraduationCap,
      color: '#A855F7',
    },
    scaler: {
      title: 'محول أحجام الدفعات (Batch Scaler)',
      subtitle: 'مواءمة حرارة الشحن وتدفق الهواء لشحنة جديدة',
      icon: Scale,
      color: '#38BDF8',
    },
    vault: {
      title: 'سجل وخزينة التحميص (Roast Vault)',
      subtitle: 'مقارنة الدفعات وأرشيف التقييمات الحسية',
      icon: Archive,
      color: '#10B981',
    },
  };

  const currentInfo = tabTitles[currentTab];
  const ActiveIcon = currentInfo.icon;
  const activePreset = PRESETS.find((p) => p.id === selectedPresetId);

  return (
    <header className="sticky top-0 z-30 bg-[#0D0F12]/95 backdrop-blur-md border-b border-[#262B36]">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Right Section: Mobile Hamburger Toggle + Active Path Breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile Drawer Button */}
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-[#161920] border border-[#262B36] text-slate-300 hover:text-white hover:border-[#D97724] transition flex items-center gap-2"
              aria-label="فتح قائمة المسارات"
            >
              <Menu className="w-5 h-5 text-[#D97724]" />
              <span className="text-xs font-bold font-sans">المسارات</span>
            </button>

            {/* Mobile Brand Logo */}
            <div className="lg:hidden">
              <IttizanLogo size="sm" />
            </div>

            {/* Desktop Breadcrumb & Current Active View Description */}
            <div className="hidden lg:flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm"
                style={{
                  backgroundColor: `${currentInfo.color}15`,
                  borderColor: `${currentInfo.color}40`,
                  color: currentInfo.color,
                }}
              >
                <ActiveIcon className="w-4 h-4" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">اتّزان</span>
                  <ChevronLeft className="w-3 h-3 text-slate-400" />
                  <span className="text-sm font-bold text-white">
                    {currentInfo.title}
                  </span>
                  {currentTab === 'vault' && vaultCount > 0 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {vaultCount} مسجلة
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {currentInfo.subtitle}
                </span>
              </div>
            </div>
          </div>

          {/* Left Section: Active Preset badge, Physical Guide button, AI Model badge */}
          <div className="flex items-center gap-2.5">
            {/* Active Preset Pill if loaded */}
            {activePreset && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#D97724]/10 border border-[#D97724]/30 text-xs text-[#D97724]">
                <Sparkles className="w-3.5 h-3.5 text-[#D97724]" />
                <span className="font-semibold text-[11px]">
                  مسار محمل: {activePreset.name.replace('حالة ', '')}
                </span>
              </div>
            )}

            {/* Physical Guide Modal Trigger */}
            <button
              onClick={onOpenGuide}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-[#161920] hover:bg-[#262B36] border border-[#262B36] hover:border-[#38BDF8]/50 transition flex items-center gap-1.5 shadow-sm"
              title="دليل القواعد الفيزيائية والديناميكا الحرارية"
            >
              <BookOpen className="w-4 h-4 text-[#38BDF8]" />
              <span className="hidden sm:inline">الدليل الفيزيائي</span>
            </button>

            {/* AI Engine Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161920] border border-[#262B36] text-[11px] font-mono text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Gemini 3.8 Flash</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
