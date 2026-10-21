import React, { useState } from 'react';
import {
  RoastDiagnosisResponse,
  BeanProfile,
  ControlParameter,
} from '../types';
import { RoRChart } from './RoRChart';
import {
  getAgtronClassification,
  getProcessAgtronBenchmark,
  evaluateAgtronProcessConsistency,
} from '../utils/agtron';
import {
  Flame,
  Wind,
  Thermometer,
  RotateCw,
  Clock,
  BookmarkCheck,
  Bookmark,
  Share2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity,
  Layers,
  Sparkles,
  Coffee,
  Eye,
  Sliders,
  TrendingDown,
  Info,
  Award,
  Printer,
  Droplets,
} from 'lucide-react';
import {
  ManualTelemetry,
  PostRoastAppearance,
  SCACuppingScores,
} from '../types';
import { PrintableRoastSheetModal } from './PrintableRoastSheetModal';
import { BrewRescueProtocolCard } from './BrewRescueProtocolCard';
import { AirflowDynamicsCard } from './AirflowDynamicsCard';
import { getOrGenerateBrewRescue } from '../utils/brewRescue';

interface DiagnosticDashboardProps {
  diagnosis: RoastDiagnosisResponse;
  beanProfile: BeanProfile;
  sensoryDefect: string;
  onSaveToVault: () => void;
  isSaved: boolean;
  hasImage?: boolean;
  telemetry?: ManualTelemetry;
  appearance?: PostRoastAppearance;
  cuppingScores?: SCACuppingScores;
  notes?: string;
}

export const DiagnosticDashboard: React.FC<DiagnosticDashboardProps> = ({
  diagnosis,
  beanProfile,
  sensoryDefect,
  onSaveToVault,
  isSaved,
  hasImage,
  telemetry,
  appearance,
  cuppingScores,
  notes,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'all' | 'rescue' | 'curve' | 'sensory' | 'action_plan'>('all');

  const {
    overall_status,
    roast_health_score,
    summary_headline,
    extracted_metrics,
    phase_ratios,
    ror_diagnostics,
    sensory_correlation,
    next_batch_action_plan,
    ghost_curve_target,
    sca_cupping_analysis,
    agtron_appearance_analysis,
  } = diagnosis;

  const brewRescueProtocol = getOrGenerateBrewRescue(diagnosis, beanProfile, sensoryDefect);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return {
          label: 'مسار تحميص مثالي ومنضبط (Optimal)',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
          color: '#10B981',
        };
      case 'NEEDS_ADJUSTMENT':
        return {
          label: 'يحتاج تعديل ديناميكي طفيف (Needs Adjustment)',
          bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
          color: '#F59E0B',
        };
      case 'CRITICAL_DEFECT':
      default:
        return {
          label: 'شذوذ حراري حرج يضر بالكوب (Critical Defect)',
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <XCircle className="w-4 h-4 text-rose-400" />,
          color: '#EF4444',
        };
    }
  };

  const statusInfo = getStatusBadge(overall_status);

  // Circular gauge calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (roast_health_score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const scoreColor = getScoreColor(roast_health_score);

  const formatSecondsToMmSs = (sec: number) => {
    if (!sec) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getControlIcon = (param: ControlParameter) => {
    switch (param) {
      case 'GAS_POWER':
        return {
          icon: <Flame className="w-4 h-4" />,
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          label: 'شعلة الغاز (Gas)',
        };
      case 'AIRFLOW':
        return {
          icon: <Wind className="w-4 h-4" />,
          color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
          label: 'تدفق الهواء (Airflow)',
        };
      case 'CHARGE_TEMP':
        return {
          icon: <Thermometer className="w-4 h-4" />,
          color: 'text-[#D97724] bg-[#D97724]/10 border-[#D97724]/30',
          label: 'حرارة الإسقاط (Charge)',
        };
      case 'DRUM_SPEED':
        return {
          icon: <RotateCw className="w-4 h-4" />,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          label: 'سرعة الطبل (RPM)',
        };
      case 'DROP_TIMING':
      default:
        return {
          icon: <Clock className="w-4 h-4" />,
          color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
          label: 'توقيت التفريغ (Drop)',
        };
    }
  };

  const handleShare = async () => {
    const summary = `تشخيص تحميص: ${beanProfile.name || 'قهوة مختصة'}
درجة الصحة: ${roast_health_score}/100
الحالة: ${statusInfo.label}
DTR: ${phase_ratios.dtr_percent}% | Delta-T: ${extracted_metrics.temp_development_delta_c}°C
${agtron_appearance_analysis ? `أجترون: حبوب ${agtron_appearance_analysis.agtron_reading_whole} / مطحون ${agtron_appearance_analysis.agtron_reading_ground} (فارق ${agtron_appearance_analysis.delta_agtron_spread})` : ''}
${sca_cupping_analysis ? `تقييم SCA: ${sca_cupping_analysis.calibrated_sca_score}/100 (${sca_cupping_analysis.sca_grade_ar})` : ''}
العنوان: ${summary_headline}`;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Helper for Agtron preview colors
  const wholeColor = agtron_appearance_analysis?.agtron_reading_whole
    ? getAgtronClassification(agtron_appearance_analysis.agtron_reading_whole).hex_color
    : '#874F20';
  const groundColor = agtron_appearance_analysis?.agtron_reading_ground
    ? getAgtronClassification(agtron_appearance_analysis.agtron_reading_ground).hex_color
    : '#A96E37';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* 1. Health Score Card & Headline */}
      <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div
          className="absolute -top-24 -left-24 w-56 h-56 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: statusInfo.color }}
        />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Circular Gauge */}
          <div className="flex items-center gap-5">
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#262B36"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={scoreColor}
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-mono text-white tracking-tighter">
                  {roast_health_score}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div className="space-y-2">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}
              >
                {statusInfo.icon}
                <span>{statusInfo.label}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white leading-snug max-w-xl">
                {summary_headline}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>البن: <strong className="text-slate-200">{beanProfile.name || 'غير محدد'}</strong></span>
                <span>•</span>
                <span>المعالجة: <strong className="text-slate-200">{beanProfile.process}</strong></span>
                <span>•</span>
                <span>الهدف: <strong className="text-slate-200">{beanProfile.targetBrew === 'FILTER' ? 'مقطر' : 'إسبريسو'}</strong></span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-[#262B36] pt-3 md:pt-0 flex-wrap">
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D0F12] border border-amber-500/40 hover:border-amber-400 hover:bg-[#262B36] text-xs font-bold text-amber-300 transition shadow-sm"
              title="تصدير وطباعة تقرير التشخيص الشامل (Export Diagnostic Report)"
            >
              <Printer className="w-3.5 h-3.5 text-[#D97724]" />
              <span>طباعة / تصدير التقرير</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D0F12] border border-[#262B36] hover:bg-[#262B36] text-xs font-bold text-slate-300 transition"
              title="نسخ ملخص التشخيص العلمي"
            >
              <Share2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{copySuccess ? 'تم النسخ!' : 'مشاركة'}</span>
            </button>

            <button
              onClick={onSaveToVault}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md ${
                isSaved
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#D97724] hover:bg-[#c6681b] text-white'
              }`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>محفوظ بالأرشيف</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>حفظ في الأرشيف</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Extracted Metrics Chips */}
        <div className="mt-6 pt-4 border-t border-[#262B36] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] text-center">
            <span className="text-[10px] text-slate-400 block">حرارة الدخول (Charge)</span>
            <span className="text-xs font-mono font-bold text-white">
              {extracted_metrics.charge_temp_c}°C
            </span>
          </div>

          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] text-center">
            <span className="text-[10px] text-slate-400 block">نقطة التحول (TP)</span>
            <span className="text-xs font-mono font-bold text-white">
              {extracted_metrics.turning_point_temp_c}°C
            </span>
          </div>

          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] text-center">
            <span className="text-[10px] text-slate-400 block">وقت الاصفرار</span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {formatSecondsToMmSs(extracted_metrics.yellowing_time_sec)}
            </span>
          </div>

          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] text-center">
            <span className="text-[10px] text-slate-400 block">القرقعة الأولى (FC)</span>
            <span className="text-xs font-mono font-bold text-[#D97724]">
              {formatSecondsToMmSs(extracted_metrics.first_crack_time_sec)} @ {extracted_metrics.first_crack_temp_c}°C
            </span>
          </div>

          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] text-center">
            <span className="text-[10px] text-slate-400 block">حرارة التفريغ (Drop)</span>
            <span className="text-xs font-mono font-bold text-rose-400">
              {extracted_metrics.drop_temp_c}°C
            </span>
          </div>

          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] text-center">
            <span className="text-[10px] text-slate-400 block">الوقت الكلي</span>
            <span className="text-xs font-mono font-bold text-white">
              {formatSecondsToMmSs(extracted_metrics.total_time_sec)}
            </span>
          </div>

          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] text-center">
            <span className="text-[10px] text-slate-400 block">فرق التطور (ΔT_dev)</span>
            <span className="text-xs font-mono font-bold text-[#38BDF8]">
              {extracted_metrics.temp_development_delta_c}°C
            </span>
          </div>

          {/* 8. Roaster Fan & Airflow Setting Chip */}
          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] text-center hover:border-[#38BDF8]/40 transition group">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1 group-hover:text-[#38BDF8] transition">
              <Wind className="w-2.5 h-2.5 text-[#38BDF8]" />
              هواء ومروحة الحمّاصة
            </span>
            <span className="text-xs font-mono font-bold text-[#38BDF8]">
              {telemetry?.airflow
                ? `${telemetry.airflow.chargeAirflow}${telemetry.airflow.unit === 'PERCENT' ? '%' : ''}➔${telemetry.airflow.firstCrackAirflow}${telemetry.airflow.unit === 'PERCENT' ? '%' : ''}`
                : diagnosis.airflow_analysis?.convective_heat_ratio_percent
                ? `${diagnosis.airflow_analysis.convective_heat_ratio_percent}% حمل`
                : 'متوازن'}
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation for Diagnostic Sections */}
      <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-2 shadow-lg flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#262B36]">
        {/* All / Comprehensive */}
        <button
          onClick={() => setActiveDashboardTab('all')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDashboardTab === 'all'
              ? 'bg-[#262B36] text-white shadow-sm border border-[#38BDF8]/40'
              : 'text-slate-400 hover:text-white hover:bg-[#0D0F12]'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#D97724]" />
          <span>التقرير الشامل (عرض الكل)</span>
        </button>

        {/* Rescue Protocol Tab - Highlighted with Cyan/Emerald */}
        <button
          onClick={() => setActiveDashboardTab('rescue')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap border ${
            activeDashboardTab === 'rescue'
              ? 'bg-gradient-to-r from-[#38BDF8]/20 via-[#10B981]/25 to-[#38BDF8]/10 text-white border-emerald-500/60 shadow-[0_0_15px_rgba(56,189,248,0.25)] ring-1 ring-[#10B981]/50'
              : 'text-[#38BDF8] border-[#38BDF8]/40 hover:border-emerald-400 hover:text-emerald-300 hover:bg-[#38BDF8]/10'
          }`}
        >
          <Droplets className="w-4 h-4 text-[#38BDF8]" />
          <span>بروتوكول الإنقاذ (Brew Rescue)</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            {brewRescueProtocol.salvageability_percent}% إنقاذ
          </span>
        </button>

        {/* Curve, Airflow & Phases Tab */}
        <button
          onClick={() => setActiveDashboardTab('curve')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDashboardTab === 'curve'
              ? 'bg-[#262B36] text-white shadow-sm border border-[#38BDF8]/30'
              : 'text-slate-400 hover:text-white hover:bg-[#0D0F12]'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>المراحل ومنحنى RoR وهواء الحمّاصة</span>
        </button>

        {/* Sensory & Color & Appearance Tab */}
        <button
          onClick={() => setActiveDashboardTab('sensory')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDashboardTab === 'sensory'
              ? 'bg-[#262B36] text-white shadow-sm border border-[#D97724]/30'
              : 'text-slate-400 hover:text-white hover:bg-[#0D0F12]'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>اللون و مظهر والتقييم الحسي</span>
        </button>

        {/* Action Plan Tab */}
        <button
          onClick={() => setActiveDashboardTab('action_plan')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeDashboardTab === 'action_plan'
              ? 'bg-[#262B36] text-white shadow-sm border border-[#10B981]/30'
              : 'text-slate-400 hover:text-white hover:bg-[#0D0F12]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
          <span>خطة الدفعة القادمة</span>
        </button>
      </div>

      {/* DEDICATED VIEW: Rescue Protocol Tab */}
      {activeDashboardTab === 'rescue' && (
        <div className="flex flex-col gap-5 animate-in fade-in duration-300">
          {/* Rescue Context & Barista Bridge Banner */}
          <div className="bg-gradient-to-r from-[#161920] via-[#0D1F1C] to-[#161920] border border-emerald-500/40 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <Droplets className="w-5 h-5 text-[#38BDF8]" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  بروتوكول إنقاذ الدفعة وهندسة الاستخلاص (Brew & Water Rescue Protocol)
                </h3>
              </div>
              <p className="text-xs text-slate-300">
                هندسة الاستخلاص التعويضي للباريستا وكيمياء المياه لمعادلة انحرافات المنحنى وحماية تجربة العميل
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0D0F12] border border-[#38BDF8]/40 hover:border-emerald-400 hover:bg-[#262B36] text-xs font-bold text-slate-200 transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>طباعة بطاقة الاستخلاص</span>
              </button>
              <button
                onClick={() => setActiveDashboardTab('action_plan')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#D97724] to-amber-500 text-white text-xs font-bold transition shadow-md hover:opacity-90"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>خطة تعديل الدفعة القادمة</span>
              </button>
            </div>
          </div>

          {/* Dedicated Visual Card with Cyan/Emerald Border */}
          <BrewRescueProtocolCard
            protocol={brewRescueProtocol}
            beanProfile={beanProfile}
            roastHealthScore={roast_health_score}
            dtrPercent={phase_ratios.dtr_percent}
            dtrStatus={phase_ratios.dtr_status}
            deltaTDev={extracted_metrics.temp_development_delta_c}
            airflowAnalysis={diagnosis.airflow_analysis}
            airflowSettings={telemetry?.airflow}
          />
        </div>
      )}

      {/* 2. Phase Ratio Visualizer & 3 Diagnosis Cards */}
      {(activeDashboardTab === 'all' || activeDashboardTab === 'curve') && (
        <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D97724]" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              نسب المراحل الفيزيائية للتحميص (Phase Ratios Breakdown)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            DTR: <strong className="text-[#A855F7]">{phase_ratios.dtr_percent}%</strong> | ΔT_dev:{' '}
            <strong className="text-[#38BDF8]">{extracted_metrics.temp_development_delta_c}°C</strong>
          </span>
        </div>

        {/* Segmented Horizontal Progress Bar */}
        <div className="w-full flex flex-col gap-1.5">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-[#0D0F12] p-0.5 border border-[#262B36]">
            {/* Drying */}
            <div
              style={{ width: `${phase_ratios.drying_percent}%` }}
              className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-r-lg flex items-center justify-center text-[10px] font-mono font-bold text-black shadow-inner"
              title={`التجفيف: ${phase_ratios.drying_percent}%`}
            >
              {phase_ratios.drying_percent >= 15 && `تجفيف ${phase_ratios.drying_percent}%`}
            </div>

            {/* Maillard */}
            <div
              style={{ width: `${phase_ratios.maillard_percent}%` }}
              className="h-full bg-gradient-to-r from-[#D97724] to-[#B45309] flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-inner"
              title={`مايلارد: ${phase_ratios.maillard_percent}%`}
            >
              {phase_ratios.maillard_percent >= 15 && `مايلارد ${phase_ratios.maillard_percent}%`}
            </div>

            {/* DTR */}
            <div
              style={{ width: `${phase_ratios.dtr_percent}%` }}
              className="h-full bg-gradient-to-r from-[#A855F7] to-[#7E22CE] rounded-l-lg flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-inner"
              title={`التطور: ${phase_ratios.dtr_percent}%`}
            >
              {phase_ratios.dtr_percent >= 8 && `تطور ${phase_ratios.dtr_percent}%`}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#F59E0B]" />
              <span>التجفيف Drying (35%-45%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#D97724]" />
              <span>مايلارد Maillard (35%-45%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-[#A855F7]" />
              <span>
                التطور DTR ({beanProfile.targetBrew === 'FILTER' ? '12%-18%' : '18%-24%'})
              </span>
            </div>
          </div>
        </div>

        {/* 3 Detailed Diagnosis Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {/* Drying Card */}
          <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                مرحلة التجفيف ({phase_ratios.drying_percent}%)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#161920] border border-[#262B36] text-slate-300 font-bold">
                {phase_ratios.drying_status}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {phase_ratios.drying_diagnosis_ar}
            </p>
          </div>

          {/* Maillard Card */}
          <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D97724] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D97724]" />
                مرحلة مايلارد ({phase_ratios.maillard_percent}%)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#161920] border border-[#262B36] text-slate-300 font-bold">
                {phase_ratios.maillard_status}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {phase_ratios.maillard_diagnosis_ar}
            </p>
          </div>

          {/* DTR Card */}
          <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A855F7] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                وقت التطور DTR ({phase_ratios.dtr_percent}%)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#161920] border border-[#262B36] text-slate-300 font-bold">
                {phase_ratios.dtr_status}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {phase_ratios.dtr_diagnosis_ar}
            </p>
          </div>
        </div>
      </div>
      )}

      {/* 3. Interactive RoR & Ghost Curve Chart */}
      {(activeDashboardTab === 'all' || activeDashboardTab === 'curve') && (
        <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <RoRChart
            data={ghost_curve_target}
            anomalies={ror_diagnostics.detected_anomalies}
            firstCrackTimeSec={extracted_metrics.first_crack_time_sec}
          />
        </div>
      )}

      {/* 3.1 Airflow & Roaster Fan Dynamics */}
      {(activeDashboardTab === 'all' || activeDashboardTab === 'curve') && (
        <AirflowDynamicsCard
          airflowAnalysis={diagnosis.airflow_analysis}
          airflowSettings={telemetry?.airflow}
          roasterType={beanProfile.roasterType}
        />
      )}

      {/* 4. NEW: Agtron Roast Color & Post-Roast Appearance Analysis */}
      {(activeDashboardTab === 'all' || activeDashboardTab === 'sensory') && agtron_appearance_analysis && (
        <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#262B36] pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#D97724]" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  تحليل اللون و مظهر وتدرج التطور الداخلي (Roast Color & Appearance)
                </h3>
                <span className="text-[10px] text-slate-400">
                  ربط طيف الانعكاس بالأشعة تحت الحمراء للأجترون مع التوصيل الحراري ونضج اللب
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#D97724]/15 border border-[#D97724]/30 text-amber-200">
                {agtron_appearance_analysis.roast_degree_category_ar}
              </span>
            </div>
          </div>

          {/* Dual Color Swatch + Spread Gauge */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Whole Bean Swatch */}
            <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl shadow-lg border border-white/20 shrink-0"
                style={{ backgroundColor: wholeColor }}
              />
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block font-mono">
                  قراءة الحبة الكاملة (Whole Bean)
                </span>
                <span className="text-base font-black font-mono text-white">
                  {agtron_appearance_analysis.agtron_reading_whole}{' '}
                  <span className="text-xs font-normal text-amber-300">Agtron</span>
                </span>
                <span className="text-[10px] text-slate-400 block">
                  تكرمل السطح الخارجي
                </span>
              </div>
            </div>

            {/* Ground Bean Swatch */}
            <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl shadow-lg border border-white/20 shrink-0"
                style={{ backgroundColor: groundColor }}
              />
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 block font-mono">
                  قراءة البن المطحون (Ground Bean)
                </span>
                <span className="text-base font-black font-mono text-white">
                  {agtron_appearance_analysis.agtron_reading_ground}{' '}
                  <span className="text-xs font-normal text-amber-300">Agtron</span>
                </span>
                <span className="text-[10px] text-slate-400 block">
                  عمق تطور قلب ونواة الحبة
                </span>
              </div>
            </div>

            {/* Roast Delta Spread Card */}
            <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex flex-col justify-center">
              <span className="text-[10px] text-slate-400 block font-mono mb-0.5">
                فارق التدرج اللوني (Roast Delta Spread)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-mono text-[#38BDF8]">
                  Δ {agtron_appearance_analysis.delta_agtron_spread}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#161920] border border-[#262B36] text-slate-300 font-mono">
                  المعيار: 8-15 نقطة
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1">
                {agtron_appearance_analysis.delta_agtron_spread > 18
                  ? '⚠️ تدرج سطحي مفرط وقلب نيء'
                  : agtron_appearance_analysis.delta_agtron_spread < 5
                  ? '⚠️ تدرج مسطح / مؤشر تحميص مخبوز'
                  : '✓ تطور حراري متزن ومتجانس'}
              </span>
            </div>
          </div>

          {/* Detailed Diagnosis Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36]">
              <span className="text-[11px] text-[#D97724] font-bold block mb-1 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                تدرج الحرارة بين السطح والقلب (Gradient Evaluation):
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {agtron_appearance_analysis.core_vs_surface_gradient_ar}
              </p>
            </div>

            <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36]">
              <span className="text-[11px] text-[#38BDF8] font-bold block mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                تقييم انتفاخ الحبة والزيوت السطحية (Physical Expansion):
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {agtron_appearance_analysis.physical_expansion_evaluation_ar}
              </p>
            </div>
          </div>

          {/* Thermodynamic Cause Box */}
          <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-amber-500/25">
            <span className="text-[11px] text-amber-300 font-bold block mb-1 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              التفسير الديناميكي الحراري لنتائج اللون ومظهر البن:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed">
              {agtron_appearance_analysis.thermodynamic_cause_ar}
            </p>
          </div>

          {/* Processing & Sensory Agtron Consistency Matrix */}
          {(() => {
            const benchmark = getProcessAgtronBenchmark(beanProfile?.process, beanProfile?.targetBrew);
            const fallbackEval = evaluateAgtronProcessConsistency(
              agtron_appearance_analysis.agtron_reading_whole,
              agtron_appearance_analysis.agtron_reading_ground,
              beanProfile?.process,
              beanProfile?.targetBrew
            );

            const consistencyScore = agtron_appearance_analysis.process_consistency_score ?? fallbackEval.score;
            const consistencyStatus = agtron_appearance_analysis.process_consistency_status ?? fallbackEval.status;

            const isHigh = consistencyStatus === 'HIGHLY_CONSISTENT';
            const isModerate = consistencyStatus === 'MODERATELY_CONSISTENT';
            const isWarn = consistencyStatus === 'INCONSISTENT';

            const statusBadgeColor = isHigh
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : isModerate
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : isWarn
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

            const statusLabel = isHigh
              ? 'اتساق ممتاز مع معايير المعالجة'
              : isModerate
              ? 'اتساق مقبول مع المعالجة'
              : isWarn
              ? 'انحراف لوني عن المعالجة المستهدفة'
              : 'تعارض حرج بين اللون وطبيعة المعالجة';

            return (
              <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3.5">
                {/* Header with Consistency Score */}
                <div className="flex items-center justify-between flex-wrap gap-2 pb-2.5 border-b border-[#262B36]">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-[#D97724]" />
                    <span className="text-xs font-bold text-white">
                      ربط اللون بالتقييم الحسي ومعايير معالجة البن ({benchmark.process_label_ar})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeColor}`}>
                      {statusLabel}
                    </span>
                    <div className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded bg-[#161920] border border-[#262B36]">
                      <span className="text-slate-400">درجة الاتساق:</span>
                      <span className={`font-bold ${isHigh ? 'text-emerald-400' : isModerate ? 'text-sky-400' : isWarn ? 'text-amber-400' : 'text-rose-400'}`}>
                        {consistencyScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benchmark vs Actual Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div className="bg-[#161920] p-2.5 rounded-lg border border-[#262B36]">
                    <span className="text-slate-400 text-[10px] block mb-0.5">النطاق القياسي لمعالجة {beanProfile?.process || 'WASHED'}:</span>
                    <div className="font-mono font-bold text-slate-200">
                      مطحون {agtron_appearance_analysis.expected_agtron_range?.min_ground ?? benchmark.ground_min} - {agtron_appearance_analysis.expected_agtron_range?.max_ground ?? benchmark.ground_max}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      الدلتا المستهدفة: {agtron_appearance_analysis.expected_agtron_range?.ideal_delta_range ?? `${benchmark.ideal_delta_min}-${benchmark.ideal_delta_max} نقطة`}
                    </span>
                  </div>

                  <div className="bg-[#161920] p-2.5 rounded-lg border border-[#262B36]">
                    <span className="text-slate-400 text-[10px] block mb-0.5">القراءة الفعلية المحققة:</span>
                    <div className="font-mono font-bold text-amber-300">
                      مطحون {agtron_appearance_analysis.agtron_reading_ground} / كامل {agtron_appearance_analysis.agtron_reading_whole}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      فارق التدرج الفعلي: Δ {agtron_appearance_analysis.delta_agtron_spread} نقطة
                    </span>
                  </div>

                  <div className="bg-[#161920] p-2.5 rounded-lg border border-[#262B36]">
                    <span className="text-slate-400 text-[10px] block mb-0.5">الخصائص الكيميائية للمعالجة:</span>
                    <p className="text-[10px] text-slate-300 leading-tight">
                      {benchmark.chemical_behavior_ar}
                    </p>
                  </div>
                </div>

                {/* AI In-depth Sensory & Agtron Link Analysis */}
                {(agtron_appearance_analysis.process_sensory_link_analysis_ar || fallbackEval.summary_ar) && (
                  <div className="bg-[#161920]/70 p-3 rounded-lg border border-amber-500/20">
                    <span className="text-[11px] text-amber-300 font-bold block mb-1">
                      تحليل الذكاء الاصطناعي لمدى اتساق اللون مع التقييم الحسي (Sensory & Color Correlation):
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {agtron_appearance_analysis.process_sensory_link_analysis_ar || fallbackEval.summary_ar}
                    </p>
                  </div>
                )}

                {/* AI Roast Color Sensory Verdict */}
                {agtron_appearance_analysis.roast_color_sensory_verdict_ar && (
                  <div className="bg-sky-500/10 p-2.5 rounded-lg border border-sky-500/25 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-sky-300 block">حكم التوافق الحسي واللوني:</span>
                      <p className="text-xs text-sky-100 leading-relaxed">
                        {agtron_appearance_analysis.roast_color_sensory_verdict_ar}
                      </p>
                    </div>
                  </div>
                )}

                {/* Specific Recommendations for this process */}
                {agtron_appearance_analysis.process_specific_recommendations_ar && agtron_appearance_analysis.process_specific_recommendations_ar.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-300 block">
                      توصيات المعايرة الحرارية الخاصة بمعالجة {benchmark.process_label_ar} للدفعة القادمة:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {agtron_appearance_analysis.process_specific_recommendations_ar.map((rec, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300 bg-[#161920] p-2 rounded-lg border border-[#262B36]">
                          <span className="text-[#D97724] font-bold">#{i + 1}</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* 5. SCA Cupping Analysis & Sensory Attributes */}
      {(activeDashboardTab === 'all' || activeDashboardTab === 'sensory') && sca_cupping_analysis && (
        <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#262B36] pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D97724]" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  التقييم الحسي المعياري لجمعية القهوة المختصة (SCA Cupping Profile)
                </h3>
                <span className="text-[10px] text-slate-400">
                  تحليل الخصائص وفق بروتوكول التذوق الرسمي مع أثر الديناميكا الحرارية
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#0D0F12] border border-[#262B36] font-mono">
                <span className="text-xs text-slate-400">درجة SCA:</span>
                <span className="text-sm font-black text-amber-400">
                  {sca_cupping_analysis.calibrated_sca_score}
                </span>
                <span className="text-[10px] text-slate-500">/ 100</span>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-[#D97724]/15 border border-[#D97724]/30 text-amber-200">
                {sca_cupping_analysis.sca_grade_ar}
              </span>
            </div>
          </div>

          {/* 6 Attributes Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#D97724] font-bold">
                  العطر والرائحة (Fragrance / Aroma):
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {sca_cupping_analysis.attributes_eval.fragrance_aroma_ar}
              </p>
            </div>

            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#D97724] font-bold">
                  النكهة (Flavor):
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {sca_cupping_analysis.attributes_eval.flavor_ar}
              </p>
            </div>

            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#D97724] font-bold">
                  الطعم المتبقي (Aftertaste):
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {sca_cupping_analysis.attributes_eval.aftertaste_ar}
              </p>
            </div>

            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#38BDF8] font-bold">
                  الحمضية وجودتها (Acidity):
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {sca_cupping_analysis.attributes_eval.acidity_ar}
              </p>
            </div>

            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#38BDF8] font-bold">
                  القوام والملمس الفموي (Body):
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {sca_cupping_analysis.attributes_eval.body_ar}
              </p>
            </div>

            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-[#A855F7] font-bold">
                  الاتزان والتكامل (Balance):
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {sca_cupping_analysis.attributes_eval.balance_ar}
              </p>
            </div>
          </div>

          {/* Flavor Wheel Tags */}
          {sca_cupping_analysis.flavor_wheel_tags && sca_cupping_analysis.flavor_wheel_tags.length > 0 && (
            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              <span className="text-[10px] text-slate-400 font-bold block mb-1.5">
                نوتات عجلة النكهات المستخلصة في الكوب (SCA Flavor Wheel):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sca_cupping_analysis.flavor_wheel_tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#161920] border border-[#D97724]/40 text-amber-200 font-medium"
                  >
                    ● {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Thermodynamic Impact Box */}
          <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-sky-500/20 text-xs">
            <span className="text-[11px] text-sky-400 font-bold block mb-1">
              أثر مسار التحميص الفيزيائي على تقييم الكوب المعياري:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {sca_cupping_analysis.cupping_thermodynamic_impact_ar}
            </p>
          </div>
        </div>
      )}

      {/* 6. Sensory Correlation & Root Thermodynamic Cause */}
      {(activeDashboardTab === 'all' || activeDashboardTab === 'sensory') && (
        <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-[#D97724]" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              الارتباط الحسي والفيزيائي (Sensory to Thermodynamics Link)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36]">
              <span className="text-[11px] text-slate-400 font-bold block mb-1">
                الملاحظة أو العيب الحسي في الكوب:
              </span>
              <p className="text-xs font-bold text-amber-400">
                {sensory_correlation.reported_defect_ar || sensoryDefect}
              </p>
            </div>

            <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36]">
              <span className="text-[11px] text-slate-400 font-bold block mb-1">
                السبب الديناميكي الحراري الأساسي (Root Cause):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {sensory_correlation.thermodynamic_root_cause_ar}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. بروتوكول إنقاذ الدفعة وهندسة الاستخلاص (Brew & Water Rescue Protocol) */}
      {activeDashboardTab === 'all' && (
        <BrewRescueProtocolCard
          protocol={brewRescueProtocol}
          beanProfile={beanProfile}
          roastHealthScore={roast_health_score}
          dtrPercent={phase_ratios.dtr_percent}
          dtrStatus={phase_ratios.dtr_status}
          deltaTDev={extracted_metrics.temp_development_delta_c}
          airflowAnalysis={diagnosis.airflow_analysis}
          airflowSettings={telemetry?.airflow}
        />
      )}

      {/* 8. Numbered Timeline for Next Batch Action Plan */}
      {(activeDashboardTab === 'all' || activeDashboardTab === 'action_plan') && (
        <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              خطة التدخل التشغيلي للدفعة القادمة (Next Batch Action Plan)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {next_batch_action_plan.length} خطوات تحسين
          </span>
        </div>

        <div className="relative border-r-2 border-[#262B36] mr-4 pr-6 space-y-5">
          {next_batch_action_plan.map((step) => {
            const ctrl = getControlIcon(step.control_parameter);

            return (
              <div key={step.step_number} className="relative group">
                {/* Step Marker Dot */}
                <div className="absolute -right-[33px] top-1 w-6 h-6 rounded-full bg-[#0D0F12] border-2 border-[#D97724] flex items-center justify-center text-[10px] font-mono font-bold text-white group-hover:bg-[#D97724] transition">
                  {step.step_number}
                </div>

                <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] group-hover:border-[#D97724]/40 transition flex flex-col gap-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-white">
                      {step.stage_name_ar}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${ctrl.color}`}
                    >
                      {ctrl.icon}
                      {ctrl.label}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-slate-100 flex items-start gap-2">
                      <span className="text-[#D97724] font-bold shrink-0">● الإجراء المحدد:</span>
                      <span>{step.exact_action_ar}</span>
                    </p>

                    <p className="text-[11px] text-slate-400 flex items-start gap-2">
                      <span className="text-[#38BDF8] font-bold shrink-0">● الأثر المتوقع:</span>
                      <span>{step.expected_effect_ar}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Printable / Export Roast Sheet Modal */}
      <PrintableRoastSheetModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        beanProfile={beanProfile}
        telemetry={
          telemetry || {
            chargeTempC: extracted_metrics.charge_temp_c,
            turningPointTempC: extracted_metrics.turning_point_temp_c,
            turningPointTime: '01:30',
            yellowingTime: formatSecondsToMmSs(extracted_metrics.yellowing_time_sec),
            yellowingTempC: 150,
            firstCrackTime: formatSecondsToMmSs(extracted_metrics.first_crack_time_sec),
            firstCrackTempC: extracted_metrics.first_crack_temp_c,
            dropTime: formatSecondsToMmSs(extracted_metrics.total_time_sec),
            dropTempC: extracted_metrics.drop_temp_c,
          }
        }
        diagnosis={diagnosis}
        appearance={appearance}
        cuppingScores={cuppingScores}
        sensoryDefect={sensoryDefect}
        notes={notes}
      />
    </div>
  );
};
