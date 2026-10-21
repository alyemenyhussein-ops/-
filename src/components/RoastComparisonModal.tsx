import React from 'react';
import { SavedRoastRecord, GhostCurvePoint } from '../types';
import {
  X,
  Layers,
  Activity,
  Award,
  TrendingDown,
  Thermometer,
  Coffee,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowLeftRight,
  Flame,
  Calendar,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface RoastComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  roastA: SavedRoastRecord;
  roastB: SavedRoastRecord;
  onSelectRecord?: (record: SavedRoastRecord) => void;
}

export const RoastComparisonModal: React.FC<RoastComparisonModalProps> = ({
  isOpen,
  onClose,
  roastA,
  roastB,
  onSelectRecord,
}) => {
  if (!isOpen) return null;

  // Build merged chart data for side-by-side RoR overlay
  const maxTime = Math.max(
    roastA.diagnosis.ghost_curve_target.length,
    roastB.diagnosis.ghost_curve_target.length,
    12
  );

  const mergedChartData = [];
  for (let min = 1; min <= maxTime; min += 0.5) {
    const ptA = roastA.diagnosis.ghost_curve_target.find(
      (p) => Math.abs(p.time_min - min) < 0.3
    );
    const ptB = roastB.diagnosis.ghost_curve_target.find(
      (p) => Math.abs(p.time_min - min) < 0.3
    );

    if (ptA || ptB) {
      mergedChartData.push({
        time_min: min,
        rorA: ptA?.actual_estimated_ror,
        rorB: ptB?.actual_estimated_ror,
        targetA: ptA?.target_ror,
      });
    }
  }

  const scoreDiff = roastA.diagnosis.roast_health_score - roastB.diagnosis.roast_health_score;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('ar-SA', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return {
          label: 'مثالي (Optimal)',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'NEEDS_ADJUSTMENT':
        return {
          label: 'يحتاج ضبط',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      default:
        return {
          label: 'شذوذ حرج',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        };
    }
  };

  const statusA = getStatusBadge(roastA.diagnosis.overall_status);
  const statusB = getStatusBadge(roastB.diagnosis.overall_status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex justify-center p-3 sm:p-6">
      <div className="bg-[#12141A] text-slate-100 w-full max-w-5xl rounded-2xl border border-[#262B36] shadow-2xl flex flex-col my-auto overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#262B36] bg-[#161920]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97724] to-[#38BDF8] flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-[#12141A] rounded-[10px] flex items-center justify-center">
                <ArrowLeftRight className="w-4 h-4 text-[#38BDF8]" />
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>مقارنة المسارات الحرارية جنباً إلى جنب</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#262B36] text-[#D97724] border border-[#262B36]">
                  Side-by-Side Comparison
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                تحليل الفوارق الديناميكية في نسب المراحل، درجات الأجترون، وسلوك منحنى الـ RoR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#262B36] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Header Comparative Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Roast A */}
            <div className="bg-[#0D0F12] p-4 rounded-xl border-2 border-[#38BDF8]/40 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#38BDF8] text-black font-mono font-bold text-[10px] px-3 py-0.5 rounded-bl-lg">
                المسار الأول (A)
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(roastA.timestamp)}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{roastA.title}</h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  <span>{roastA.beanProfile.name || 'محصول غير مسمى'}</span> •{' '}
                  <span className="text-[#38BDF8]">{roastA.beanProfile.process}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#262B36] pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">درجة صحة التحميص</span>
                  <span className="text-2xl font-black font-mono text-[#38BDF8]">
                    {roastA.diagnosis.roast_health_score}
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </span>
                </div>
                <div className="text-left">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusA.bg}`}>
                    {statusA.label}
                  </span>
                  <div className="text-[11px] font-mono text-amber-400 mt-1">
                    SCA: {roastA.diagnosis.sca_cupping_analysis?.calibrated_sca_score || roastA.cuppingScores?.total_score || '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Roast B */}
            <div className="bg-[#0D0F12] p-4 rounded-xl border-2 border-[#D97724]/40 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D97724] text-white font-mono font-bold text-[10px] px-3 py-0.5 rounded-bl-lg">
                المسار الثاني (B)
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mb-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(roastB.timestamp)}
                </span>
                <h4 className="text-sm font-bold text-white line-clamp-1">{roastB.title}</h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  <span>{roastB.beanProfile.name || 'محصول غير مسمى'}</span> •{' '}
                  <span className="text-[#D97724]">{roastB.beanProfile.process}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#262B36] pt-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">درجة صحة التحميص</span>
                  <span className="text-2xl font-black font-mono text-[#D97724]">
                    {roastB.diagnosis.roast_health_score}
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </span>
                </div>
                <div className="text-left">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusB.bg}`}>
                    {statusB.label}
                  </span>
                  <div className="text-[11px] font-mono text-amber-400 mt-1">
                    SCA: {roastB.diagnosis.sca_cupping_analysis?.calibrated_sca_score || roastB.cuppingScores?.total_score || '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Differential Highlight Banner */}
          <div className="bg-[#161920] p-3.5 rounded-xl border border-[#262B36] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D97724]" />
              <span className="text-slate-300 font-bold">فارق التقييم الحراري:</span>
              <span className="font-mono">
                {scoreDiff === 0 ? (
                  <span className="text-slate-400">متطابق في درجة الصحة (0)</span>
                ) : scoreDiff > 0 ? (
                  <span className="text-[#38BDF8] font-bold">
                    المسار (A) يتفوق بفارق +{scoreDiff} نقطة صحة
                  </span>
                ) : (
                  <span className="text-[#D97724] font-bold">
                    المسار (B) يتفوق بفارق +{Math.abs(scoreDiff)} نقطة صحة
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Side-by-Side Phase Ratios Comparison */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-[#262B36] pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#D97724]" />
                <span>مقارنة نسب المراحل الزمنية (Phase Ratios Comparison)</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                المعيار الموصى به: 35-45% تجفيف | 35-45% مايلارد | 12-18% تطور
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Drying Comparison */}
              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36] space-y-2">
                <span className="text-slate-400 font-bold block text-[11px]">مرحلة التجفيف (Drying Phase)</span>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-[#38BDF8] font-bold">A: {roastA.diagnosis.phase_ratios.drying_percent}%</span>
                  <span className="text-[#D97724] font-bold">B: {roastB.diagnosis.phase_ratios.drying_percent}%</span>
                </div>
                <div className="w-full bg-[#0D0F12] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#38BDF8]"
                    style={{ width: `${Math.min(roastA.diagnosis.phase_ratios.drying_percent, 100)}%` }}
                  />
                </div>
                <div className="w-full bg-[#0D0F12] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#D97724]"
                    style={{ width: `${Math.min(roastB.diagnosis.phase_ratios.drying_percent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Maillard Comparison */}
              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36] space-y-2">
                <span className="text-slate-400 font-bold block text-[11px]">مرحلة مايلارد (Maillard Phase)</span>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-[#38BDF8] font-bold">A: {roastA.diagnosis.phase_ratios.maillard_percent}%</span>
                  <span className="text-[#D97724] font-bold">B: {roastB.diagnosis.phase_ratios.maillard_percent}%</span>
                </div>
                <div className="w-full bg-[#0D0F12] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#38BDF8]"
                    style={{ width: `${Math.min(roastA.diagnosis.phase_ratios.maillard_percent, 100)}%` }}
                  />
                </div>
                <div className="w-full bg-[#0D0F12] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#D97724]"
                    style={{ width: `${Math.min(roastB.diagnosis.phase_ratios.maillard_percent, 100)}%` }}
                  />
                </div>
              </div>

              {/* DTR Comparison */}
              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36] space-y-2">
                <span className="text-slate-400 font-bold block text-[11px]">نسبة التطور (DTR %)</span>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-[#38BDF8] font-bold">A: {roastA.diagnosis.phase_ratios.dtr_percent}%</span>
                  <span className="text-[#D97724] font-bold">B: {roastB.diagnosis.phase_ratios.dtr_percent}%</span>
                </div>
                <div className="w-full bg-[#0D0F12] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#38BDF8]"
                    style={{ width: `${Math.min(roastA.diagnosis.phase_ratios.dtr_percent * 2, 100)}%` }}
                  />
                </div>
                <div className="w-full bg-[#0D0F12] h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#D97724]"
                    style={{ width: `${Math.min(roastB.diagnosis.phase_ratios.dtr_percent * 2, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Agtron Readings */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-[#D97724]" />
              <span>مقارنة قياسات الأجترون والاتساق مع المعالجة:</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-[#161920] p-3 rounded-xl border border-[#38BDF8]/20 space-y-1.5">
                <span className="text-[#38BDF8] font-bold block text-[11px]">المسار (A):</span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>الأجترون (حب / مطحون):</span>
                  <span className="font-bold text-white">
                    {roastA.diagnosis.agtron_appearance_analysis?.agtron_reading_whole || roastA.appearance?.whole_bean_agtron || '-'} / {roastA.diagnosis.agtron_appearance_analysis?.agtron_reading_ground || roastA.appearance?.ground_agtron || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>فارق التدرج (Δ Agtron):</span>
                  <span className="font-bold text-amber-400">
                    Δ {roastA.diagnosis.agtron_appearance_analysis?.delta_agtron_spread || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-sans text-[11px]">
                  <span>اتساق المعالجة:</span>
                  <span className="text-slate-200">
                    {roastA.diagnosis.agtron_appearance_analysis?.process_consistency_score ? `${roastA.diagnosis.agtron_appearance_analysis.process_consistency_score}/100` : '-'}
                  </span>
                </div>
              </div>

              <div className="bg-[#161920] p-3 rounded-xl border border-[#D97724]/20 space-y-1.5">
                <span className="text-[#D97724] font-bold block text-[11px]">المسار (B):</span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>الأجترون (حب / مطحون):</span>
                  <span className="font-bold text-white">
                    {roastB.diagnosis.agtron_appearance_analysis?.agtron_reading_whole || roastB.appearance?.whole_bean_agtron || '-'} / {roastB.diagnosis.agtron_appearance_analysis?.agtron_reading_ground || roastB.appearance?.ground_agtron || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>فارق التدرج (Δ Agtron):</span>
                  <span className="font-bold text-amber-400">
                    Δ {roastB.diagnosis.agtron_appearance_analysis?.delta_agtron_spread || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300 font-sans text-[11px]">
                  <span>اتساق المعالجة:</span>
                  <span className="text-slate-200">
                    {roastB.diagnosis.agtron_appearance_analysis?.process_consistency_score ? `${roastB.diagnosis.agtron_appearance_analysis.process_consistency_score}/100` : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Overlaid Comparative RoR Chart */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-[#38BDF8]" />
                <span>الرسم البياني المقارن لمنحنى RoR (Overlaid RoR Curves)</span>
              </span>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#38BDF8] rounded" />
                  <span className="text-[#38BDF8]">RoR المسار الأول (A)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#D97724] rounded" />
                  <span className="text-[#D97724]">RoR المسار الثاني (B)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#A855F7] border-dashed border-t border-[#A855F7]" />
                  <span className="text-[#A855F7]">الهدف المثالي (Ghost)</span>
                </div>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mergedChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262B36" opacity={0.6} />
                  <XAxis
                    dataKey="time_min"
                    stroke="#64748B"
                    tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    tickFormatter={(val) => `${val}m`}
                  />
                  <YAxis
                    stroke="#64748B"
                    domain={[0, 25]}
                    tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    unit="°"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161920',
                      borderColor: '#262B36',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#F8FAFC',
                      direction: 'rtl',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="targetA"
                    name="الهدف المثالي"
                    stroke="#A855F7"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="rorA"
                    name="المسار A"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#38BDF8' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rorB"
                    name="المسار B"
                    stroke="#D97724"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#D97724' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Root-cause Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#161920] p-3.5 rounded-xl border border-[#38BDF8]/20 space-y-1.5">
              <span className="text-[#38BDF8] font-bold block text-[11px]">تشخيص المسار A:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {roastA.diagnosis.summary_headline}
              </p>
            </div>
            <div className="bg-[#161920] p-3.5 rounded-xl border border-[#D97724]/20 space-y-1.5">
              <span className="text-[#D97724] font-bold block text-[11px]">تشخيص المسار B:</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {roastB.diagnosis.summary_headline}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 border-t border-[#262B36] bg-[#161920] text-xs">
          <span className="text-slate-400">
            يمكنك إغلاق المقارنة أو فتح أي مسار في لوحة التشخيص الرئيسية
          </span>
          <div className="flex items-center gap-2">
            {onSelectRecord && (
              <>
                <button
                  onClick={() => {
                    onSelectRecord(roastA);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#38BDF8]/20 transition font-bold"
                >
                  فتح المسار (A)
                </button>
                <button
                  onClick={() => {
                    onSelectRecord(roastB);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#D97724]/10 text-[#D97724] border border-[#D97724]/30 hover:bg-[#D97724]/20 transition font-bold"
                >
                  فتح المسار (B)
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#262B36] hover:bg-slate-700 text-white font-bold transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
