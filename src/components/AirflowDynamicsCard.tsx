import React from 'react';
import { AirflowAnalysis, RoasterAirflowSettings } from '../types';
import {
  Wind,
  Gauge,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Flame,
  ArrowLeft,
  Sliders,
  Check,
} from 'lucide-react';

interface AirflowDynamicsCardProps {
  airflowAnalysis?: AirflowAnalysis;
  airflowSettings?: RoasterAirflowSettings;
  roasterType?: string;
}

export const AirflowDynamicsCard: React.FC<AirflowDynamicsCardProps> = ({
  airflowAnalysis,
  airflowSettings,
  roasterType,
}) => {
  // Fallback defaults if analysis is not yet supplied by API
  const analysis: AirflowAnalysis = airflowAnalysis || {
    convective_heat_ratio_percent: 65,
    airflow_balance_status: 'OPTIMAL',
    verdict_headline_ar: 'توازن ديناميكي معتدل بين الحمل الحراري والتوصيل',
    chaff_smoke_clearance_ar: 'تصريف جيد لبخار الماء والقشور عبر تيار الهواء',
    stage_evaluation: {
      charge_drying_eval_ar: 'هواء الإسقاط والتجفيف حافظ على استقرار حرارة الطبل وسحب الرطوبة.',
      maillard_eval_ar: 'تدفق الهواء في مرحلة مايلارد أتاح نقلاً حرارياً متجانساً للحبوب.',
      first_crack_dev_eval_ar: 'رفع تدفق الهواء عند القرقعة ساعد في منع احتباس الغازات وركود الـ RoR.',
    },
    recommended_fan_adjustments_ar: 'المحافظة على التدرج الهوائي الصاعد وضبط المروحة قبل القرقعة بـ 30 ثانية لتأمين استقرار المنحنى.',
  };

  const settings: RoasterAirflowSettings = airflowSettings || {
    unit: 'PERCENT',
    chargeAirflow: 30,
    dryingAirflow: 50,
    maillardAirflow: 65,
    firstCrackAirflow: 80,
    chaffEvacuationRating: 'OPTIMAL',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return {
          label: 'تدفق هواء مثالي ومنضبط (Optimal)',
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'EXCESSIVE':
        return {
          label: 'تدفق هواء مفرط / جفاف سطحي (Excessive)',
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'INSUFFICIENT':
      default:
        return {
          label: 'تدفق هواء ضعيف / احتباس دخان ورطوبة (Choked Airflow)',
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
        };
    }
  };

  const statusBadge = getStatusBadge(analysis.airflow_balance_status);
  const unitLabel = settings.unit === 'PERCENT' ? '%' : settings.unit === 'PASCAL' ? 'Pa' : 'درجة';

  return (
    <div className="bg-[#161920] border border-[#262B36] hover:border-[#38BDF8]/40 transition rounded-2xl p-5 shadow-xl flex flex-col gap-4 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262B36] pb-3.5">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Wind className="w-5 h-5 text-[#38BDF8]" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>ديناميكا تدفق الهواء ومروحة الحمّاصة</span>
              <span className="text-[10px] font-mono text-[#38BDF8] px-2 py-0.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30">
                Airflow & Convection
              </span>
            </h3>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              موازنة الحمل الحراري (Convection) وسحب بخار الماء والدخان وقشور الحبوب
              {roasterType ? ` • ${roasterType}` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusBadge.bg}`}>
            {statusBadge.icon}
            <span>{statusBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Top 3 Airflow Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Convective Heat Transfer Ratio */}
        <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex flex-col justify-between gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#38BDF8]" />
              نسبة الحمل الحراري (Convection)
            </span>
            <span className="text-xs font-mono font-bold text-[#38BDF8]">
              {analysis.convective_heat_ratio_percent}%
            </span>
          </div>

          <div className="space-y-1">
            <div className="w-full bg-[#161920] h-2.5 rounded-full overflow-hidden flex border border-[#262B36]">
              {/* Convective portion */}
              <div
                style={{ width: `${analysis.convective_heat_ratio_percent}%` }}
                className="h-full bg-gradient-to-r from-sky-500 to-[#38BDF8] rounded-r-full shadow-inner"
              />
              {/* Conductive portion */}
              <div
                style={{ width: `${100 - analysis.convective_heat_ratio_percent}%` }}
                className="h-full bg-gradient-to-r from-amber-600 to-[#D97724] rounded-l-full opacity-70"
              />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-0.5">
              <span className="text-[#38BDF8]">حمل هوائي: {analysis.convective_heat_ratio_percent}%</span>
              <span className="text-amber-400">توصيل معدني: {100 - analysis.convective_heat_ratio_percent}%</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 leading-tight">
            {analysis.convective_heat_ratio_percent >= 65
              ? 'نقل حراري ناعم ومتجانس يتغلغل لنواة الحبة دون إجهاد لسطحها.'
              : 'اعتماد مرتفع على التوصيل المعدني بالطبل؛ يتطلب حذراً من احتراق الأطراف.'}
          </p>
        </div>

        {/* 2. Chaff & Smoke Evacuation Status */}
        <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex flex-col justify-between gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-emerald-400" />
              سحب القشور والدخان (Chaff Clearance)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#161920] border border-[#262B36] text-slate-300 font-bold">
              {settings.chaffEvacuationRating === 'OPTIMAL' ? 'ممتاز' : settings.chaffEvacuationRating === 'MODERATE' ? 'متوسط' : 'ضعيف'}
            </span>
          </div>

          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {analysis.chaff_smoke_clearance_ar}
          </p>

          <span className="text-[10px] text-slate-500">
            تصريف عوادم الدخان يضمن نقاء الكوب وخلوه من مرارة الرماد والجفاف القابض
          </span>
        </div>

        {/* 3. Stage Stepper Summary */}
        <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#D97724]" />
            مسار سرعة المروحة المحقق
          </span>

          <div className="flex items-center justify-between bg-[#161920] p-2 rounded-lg border border-[#262B36] font-mono text-center">
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400">إسقاط</span>
              <span className="text-xs font-bold text-white">{settings.chargeAirflow}{unitLabel}</span>
            </div>
            <ArrowLeft className="w-3 h-3 text-slate-600" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400">تجفيف</span>
              <span className="text-xs font-bold text-amber-300">{settings.dryingAirflow}{unitLabel}</span>
            </div>
            <ArrowLeft className="w-3 h-3 text-slate-600" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400">مايلارد</span>
              <span className="text-xs font-bold text-[#D97724]">{settings.maillardAirflow}{unitLabel}</span>
            </div>
            <ArrowLeft className="w-3 h-3 text-slate-600" />
            <div className="flex flex-col">
              <span className="text-[9px] text-slate-400">القرقعة</span>
              <span className="text-xs font-bold text-[#38BDF8]">{settings.firstCrackAirflow}{unitLabel}</span>
            </div>
          </div>

          <span className="text-[10px] text-slate-500">
            الوحدة المستخدمة: {settings.unit === 'PERCENT' ? 'نسبة مئوية (%)' : settings.unit === 'STEP' ? 'صمام مدرج (درجات)' : settings.unit === 'PASCAL' ? 'ضغط تفاضلي (Pa)' : 'دوران RPM'}
          </span>
        </div>
      </div>

      {/* Stage-by-Stage Detailed Scientific Evaluation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
        <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] space-y-1">
          <span className="text-[11px] font-bold text-amber-300 block">
            1. هواء الإسقاط والتجفيف (Charge & Drying):
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {analysis.stage_evaluation.charge_drying_eval_ar}
          </p>
        </div>

        <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] space-y-1">
          <span className="text-[11px] font-bold text-[#D97724] block">
            2. هواء مرحلة مايلارد (Maillard Phase):
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {analysis.stage_evaluation.maillard_eval_ar}
          </p>
        </div>

        <div className="bg-[#0D0F12] p-3 rounded-xl border border-sky-500/30 space-y-1">
          <span className="text-[11px] font-bold text-[#38BDF8] block">
            3. هواء القرقعة والتطوير (First Crack & Dev):
          </span>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            {analysis.stage_evaluation.first_crack_dev_eval_ar}
          </p>
        </div>
      </div>

      {/* Next Batch Fan Adjustments Recommendation */}
      <div className="bg-sky-500/10 border border-sky-500/25 p-3.5 rounded-xl flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-sky-300 block">
            توصيات هندسة تدفق الهواء والمروحة للدفعة القادمة:
          </span>
          <p className="text-xs text-sky-100 leading-relaxed">
            {analysis.recommended_fan_adjustments_ar}
          </p>
        </div>
      </div>
    </div>
  );
};
