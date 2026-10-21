import React from 'react';
import {
  Activity,
  Archive,
  GraduationCap,
  Scale,
  Sparkles,
  BookOpen,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  CheckCircle2,
  Cpu,
  Coffee,
} from 'lucide-react';
import { IttizanLogo } from './IttizanLogo';
import { PRESETS, DemoPreset } from '../data/presets';

interface SidebarProps {
  currentTab: 'diagnostics' | 'vault' | 'trainer' | 'scaler';
  onTabChange: (tab: 'diagnostics' | 'vault' | 'trainer' | 'scaler') => void;
  vaultCount: number;
  onSelectPreset: (preset: DemoPreset, autoSimulate?: boolean) => void;
  onOpenGuide: () => void;
  onResetData: () => void;
  selectedPresetId?: string;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  vaultCount,
  onSelectPreset,
  onOpenGuide,
  onResetData,
  selectedPresetId,
  isOpenMobile,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const navItems = [
    {
      id: 'diagnostics' as const,
      title: 'تشخيص المسار الحراري',
      subtitle: 'تحليل المنحنى ومؤشرات RoR',
      icon: Activity,
      badge: null,
      accent: '#D97724',
    },
    {
      id: 'trainer' as const,
      title: 'وضع المدرب (Trainer Mode)',
      subtitle: 'محاكاة العيوب وتدريب الحماصين',
      icon: GraduationCap,
      badge: 'تفاعلي',
      badgeColor: '#A855F7',
      accent: '#A855F7',
    },
    {
      id: 'scaler' as const,
      title: 'محول أحجام الدفعات (Batch Scaler)',
      subtitle: 'مواءمة الحرارة وسرعة الهواء',
      icon: Scale,
      badge: 'ديناميكا',
      badgeColor: '#38BDF8',
      accent: '#38BDF8',
    },
    {
      id: 'vault' as const,
      title: 'سجل وخزينة التحميص (Roast Vault)',
      subtitle: 'مقارنة الدفعات وأرشيف التقييمات',
      icon: Archive,
      badge: vaultCount > 0 ? `${vaultCount} دفعة` : null,
      badgeColor: '#10B981',
      accent: '#10B981',
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#161920] border-l border-[#262B36] text-slate-200 select-none overflow-y-auto scrollbar-thin scrollbar-thumb-[#262B36]">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-[#262B36] flex items-center justify-between">
        <button
          onClick={() => {
            onTabChange('diagnostics');
            onCloseMobile();
          }}
          className="text-right focus:outline-none hover:opacity-95 transition"
        >
          <IttizanLogo size="sm" />
        </button>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#262B36] transition"
          aria-label="إغلاق القائمة"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Engine Status Pill */}
      <div className="px-4 py-2.5 bg-[#0D0F12]/80 border-b border-[#262B36]/60 flex items-center justify-between text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-300 font-sans">محرك التحليل الحراري</span>
        </div>
        <span className="text-[#D97724] bg-[#D97724]/10 border border-[#D97724]/30 px-1.5 py-0.5 rounded text-[10px]">
          v2.5 • نشط
        </span>
      </div>

      {/* Main Navigation Items */}
      <div className="p-3 space-y-1">
        <div className="px-2 pt-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>المسارات والأنظمة الرئيسية</span>
          <span className="text-[10px] text-slate-400 font-mono">4 أقسام</span>
        </div>

        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onCloseMobile();
              }}
              className={`w-full text-right p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border relative group ${
                isActive
                  ? 'bg-gradient-to-r from-[#D97724]/15 to-[#161920] border-[#D97724]/50 text-white shadow-md shadow-[#D97724]/5'
                  : 'bg-[#0D0F12]/40 hover:bg-[#262B36]/50 border-transparent text-slate-300 hover:text-white'
              }`}
            >
              {/* Active Indicator Bar on right edge (in RTL) */}
              {isActive && (
                <span className="absolute right-0 top-2 bottom-2 w-1 rounded-l-full bg-[#D97724]" />
              )}

              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#D97724] text-white shadow-sm'
                    : 'bg-[#262B36]/60 text-slate-400 group-hover:text-white group-hover:bg-[#262B36]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-xs font-bold truncate">{item.title}</span>
                  {item.badge && (
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border shrink-0"
                      style={{
                        color: item.badgeColor || '#D97724',
                        borderColor: `${item.badgeColor || '#D97724'}40`,
                        backgroundColor: `${item.badgeColor || '#D97724'}15`,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate group-hover:text-slate-300">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Demo Curves / Presets */}
      <div className="p-3 pt-2 border-t border-[#262B36]/80 space-y-1">
        <div className="px-2 pb-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D97724]" />
            <span>مسارات تجريبية جاهزة</span>
          </span>
          <span className="text-[10px] text-[#D97724] font-mono">سريعة</span>
        </div>

        <div className="space-y-1.5">
          {PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPreset(p, true);
                  onCloseMobile();
                }}
                className={`w-full text-right px-3 py-2 rounded-lg text-xs transition border flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#D97724]/20 border-[#D97724] text-[#D97724] font-semibold'
                    : 'bg-[#0D0F12]/60 hover:bg-[#262B36]/60 border-[#262B36]/60 text-slate-300 hover:text-white'
                }`}
                title={p.description}
              >
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: p.badgeColor }}
                  />
                  <span className="truncate">{p.name.replace('حالة ', '')}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  تحميل
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Tools & Physics Guide */}
      <div className="p-3 pt-2 border-t border-[#262B36]/80 space-y-2 mt-auto">
        <div className="px-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>أدوات ومراجع فيزيائية</span>
        </div>

        <button
          onClick={() => {
            onOpenGuide();
            onCloseMobile();
          }}
          className="w-full text-right px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-[#0D0F12] hover:bg-[#262B36] border border-[#262B36] hover:border-[#38BDF8]/40 transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#38BDF8] group-hover:scale-110 transition-transform" />
            <span>الدليل الفيزيائي للديناميكا</span>
          </div>
          <span className="text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 px-1.5 py-0.5 rounded font-mono">
            مرجع
          </span>
        </button>

        <button
          onClick={() => {
            onResetData();
            onCloseMobile();
          }}
          className="w-full text-right px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-rose-300 bg-[#0D0F12] hover:bg-rose-500/10 border border-[#262B36] hover:border-rose-500/30 transition flex items-center justify-between"
          title="تصفير كافة الحقول لبدء تحميصة جديدة"
        >
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>تفريغ وبدء تحميصة جديدة</span>
          </div>
        </button>

        {/* Footer Brand Mini Note */}
        <div className="pt-2 text-center text-[10px] text-slate-400 font-mono border-t border-[#262B36]/40">
          منظومة اتّزان للتحميص الذكي • اليمن
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer (Slide in from right in RTL) */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 sm:w-80 max-w-[85vw] transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full'
        }`}
        dir="rtl"
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar (Visible on lg and larger) */}
      <aside
        className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-0 h-screen z-30"
        dir="rtl"
      >
        {sidebarContent}
      </aside>
    </>
  );
};
