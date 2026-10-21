import React, { useState } from 'react';
import {
  BrewRescueProtocol,
  BeanProfile,
  AirflowAnalysis,
  RoasterAirflowSettings,
} from '../types';
import {
  Droplets,
  Beaker,
  Coffee,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
  Thermometer,
  Scale,
  Gauge,
  Sliders,
  Flame,
  Wind,
} from 'lucide-react';

interface BrewRescueProtocolCardProps {
  protocol: BrewRescueProtocol;
  beanProfile: BeanProfile;
  roastHealthScore?: number;
  dtrPercent?: number;
  dtrStatus?: string;
  deltaTDev?: number;
  airflowAnalysis?: AirflowAnalysis;
  airflowSettings?: RoasterAirflowSettings;
}

export const BrewRescueProtocolCard: React.FC<BrewRescueProtocolCardProps> = ({
  protocol,
  beanProfile,
  roastHealthScore,
  dtrPercent,
  dtrStatus,
  deltaTDev,
  airflowAnalysis,
  airflowSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'filter' | 'espresso'>('filter');
  const [copied, setCopied] = useState(false);

  const {
    salvageability_percent,
    best_use_recommendation_ar,
    degassing_rest_days_ar,
    water_chemistry_target,
    filter_rescue_recipe,
    espresso_rescue_recipe,
  } = protocol;

  const handleCopyBaristaTicket = async () => {
    const ticket = `=====================================================
بطاقة التوصية الرسمية لاستخلاص الدفعة | ITTIZAN PROTOCOL
=====================================================
المحصول: ${beanProfile.name || 'قهوة مختصة'}
المعالجة: ${beanProfile.process} | الاستخدام المستهدف: ${beanProfile.targetBrew === 'FILTER' ? 'مقطر' : 'إسبريسو'}
الحمّاصة وديناميكا الهواء: ${beanProfile.roasterType || 'حمّاصة أسطوانية'}${airflowSettings ? ` (مروحة ${airflowSettings.chargeAirflow} ➔ ${airflowSettings.firstCrackAirflow} ${airflowSettings.unit === 'PERCENT' ? '%' : airflowSettings.unit})` : ''}
التوجيه الرسمي للتقديم: ${best_use_recommendation_ar}
فترة الراحة الموصى بها (Degassing): ${degassing_rest_days_ar}

-----------------------------------------------------
[1. هندسة كيمياء مياه التحضير المستهدفة]:
-----------------------------------------------------
- الصلابة الكلية (GH): ${water_chemistry_target.target_gh_ppm}
- القلوية / البفر الكيميائي (KH): ${water_chemistry_target.target_kh_ppm}
- نسبة المغنيسيوم إلى الكالسيوم (Mg:Ca): ${water_chemistry_target.mg_to_ca_ratio}
- التوجيه العلمي: ${water_chemistry_target.water_explanation_ar}

-----------------------------------------------------
[2. وصفة الترشيح المقطر المعتمدة (V60 / Filter)]:
-----------------------------------------------------
- حرارة ماء التحضير: ${filter_rescue_recipe.water_temp_c}
- نسبة الاستخلاص (Brew Ratio): ${filter_rescue_recipe.brew_ratio}
- درجة الطحن: ${filter_rescue_recipe.grind_adjustment_ar}
- تكنيك الصب والترطيب: ${filter_rescue_recipe.bloom_and_pour_technique_ar}

-----------------------------------------------------
[3. وصفة الإسبريسو ومشروبات الحليب (Espresso)]:
-----------------------------------------------------
- حرارة ماء الإسبريسو: ${espresso_rescue_recipe.water_temp_c}
- نسبة الاستخلاص (Yield Ratio): ${espresso_rescue_recipe.yield_ratio}
- وقت التدفق المستهدف: ${espresso_rescue_recipe.shot_time_sec}
- الترطيب المسبق والضغط: ${espresso_rescue_recipe.pre_infusion_and_pressure_ar}
=====================================================
معايير استخلاص هندسية دقيقة ومصادق عليها من كبير المحمصين
`;

    try {
      await navigator.clipboard.writeText(ticket);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy ticket:', err);
    }
  };

  const getSalvageColor = (percent: number) => {
    if (percent >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/40', bar: 'from-emerald-500 to-teal-400' };
    if (percent >= 60) return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', bar: 'from-amber-500 to-yellow-400' };
    return { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/40', bar: 'from-rose-500 to-red-400' };
  };

  const salvageStyle = getSalvageColor(salvageability_percent);

  return (
    <div
      className="bg-[#161920] border-2 border-[#38BDF8]/70 hover:border-[#10B981] shadow-[0_0_30px_rgba(56,189,248,0.2)] ring-1 ring-[#10B981]/50 rounded-2xl p-5 md:p-6 flex flex-col gap-5 text-right relative overflow-hidden transition-all duration-300"
      dir="rtl"
    >
      {/* Ambient background highlight */}
      <div className="absolute top-0 right-0 w-96 h-40 bg-gradient-to-b from-[#38BDF8]/10 via-[#10B981]/5 to-transparent pointer-events-none rounded-t-2xl" />

      {/* 1. Header & Barista Copy Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262B36] pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
              <Droplets className="w-5 h-5 text-[#38BDF8]" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>بروتوكول إنقاذ الدفعة وهندسة الاستخلاص</span>
              <span className="text-[11px] font-mono text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full bg-[#38BDF8]/10 hidden sm:inline-block">
                Brew & Water Rescue
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-300 pr-9">
            هندسة الاستخلاص التعويضي للباريستا وكيمياء المياه لمعادلة انحرافات المنحنى وحماية تجربة العميل
          </p>
        </div>

        <button
          onClick={handleCopyBaristaTicket}
          className={`shrink-0 flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition border shadow-sm ${
            copied
              ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-[#0D0F12] text-[#38BDF8] border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 hover:border-[#10B981] hover:text-[#10B981]'
          }`}
          title="نسخ بطاقة الاستخلاص المعتمدة للباريستا بدون الإفصاح عن عيوب التحميص"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>تم نسخ بطاقة الباريستا! ✓</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-[#38BDF8]" />
              <span>نسخ بطاقة الباريستا للمقهى</span>
            </>
          )}
        </button>
      </div>

      {/* Roaster Airflow Context Pill */}
      {(airflowSettings || airflowAnalysis) && (
        <div className="flex items-center justify-between flex-wrap gap-2 px-3.5 py-2 rounded-xl bg-[#0D0F12] border border-[#262B36] text-[11px] text-slate-300 relative z-10">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-bold text-white">إعدادات هواء الحمّاصة المرصودة:</span>
            <span className="text-[#38BDF8] font-mono">
              {airflowSettings
                ? `${airflowSettings.chargeAirflow}${airflowSettings.unit === 'PERCENT' ? '%' : ''} ➔ ${airflowSettings.firstCrackAirflow}${airflowSettings.unit === 'PERCENT' ? '%' : ''} (${airflowSettings.unit === 'PERCENT' ? 'نسبة مئوية' : airflowSettings.unit})`
                : 'تدفق هواء مسجل'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {airflowAnalysis && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30 font-mono">
                {airflowAnalysis.convective_heat_ratio_percent}% حمل حراري
              </span>
            )}
            <span className="text-[10px] text-slate-400">
              الوصفة مصممة هندسياً لموازنة الحمل الحراري وتصريف القشور
            </span>
          </div>
        </div>
      )}

      {/* 2. Top Metrics Grid: Salvageability, DTR%, Best Use, & Degassing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {/* Salvageability Gauge */}
        <div className="bg-[#0D0F12] p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between gap-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              قابلية الإنقاذ (Salvageability)
            </span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${salvageStyle.bg} ${salvageStyle.text} ${salvageStyle.border}`}>
              {salvageability_percent}%
            </span>
          </div>

          <div className="w-full bg-[#161920] h-2.5 rounded-full overflow-hidden border border-[#262B36]">
            <div
              className={`h-full bg-gradient-to-l ${salvageStyle.bar} transition-all duration-700 rounded-full`}
              style={{ width: `${Math.min(salvageability_percent, 100)}%` }}
            />
          </div>

          <p className="text-[10px] text-slate-400 leading-tight">
            {salvageability_percent >= 80
              ? 'إمكانية عالية جداً لاستخلاص كوب متزن ولذيذ عبر وصفة الباريستا المصححة.'
              : salvageability_percent >= 60
              ? 'إنقاذ متوسط؛ يوصى باتباع تقنية التخطي المائي أو توجيهه لمشروبات الحليب.'
              : 'شذوذ حاد؛ يوصى باستخدامها حصرياً كقاعدة للحليب بعد إزالة القشور أو لإسبريسو مكثف.'}
          </p>
        </div>

        {/* Development Time Ratio (نسبة التطور DTR %) */}
        <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#38BDF8]/30 flex flex-col justify-between gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-[#38BDF8]" />
              نسبة التطور (DTR %)
            </span>
            {dtrPercent !== undefined && (
              <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
                {dtrPercent}%
              </span>
            )}
          </div>
          <div>
            <span className="text-sm font-black font-mono text-white block">
              {dtrPercent !== undefined ? `${dtrPercent}% DTR` : 'محسوبة من المنحنى'}
            </span>
            <span className="text-[10px] text-sky-400 font-semibold block">
              {dtrStatus || (dtrPercent && dtrPercent >= 20 ? 'تطور متزن' : 'تطور سريع / ناقص')}
              {deltaTDev ? ` • ΔT: ${deltaTDev}°C` : ''}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            {dtrPercent && dtrPercent < 17
              ? 'تطور ناقص: يتطلب حرارة ماء قصوى (95°C+) وترطيباً طويلاً لتعزيز الذائبية.'
              : dtrPercent && dtrPercent > 22
              ? 'تطور متقدم/مخبوز: يتطلب ماء منخفض القلوية وحرارة تحضير مركزة لتجنب المرارة.'
              : 'تطور قياسي متزن: وصفة الاستخلاص تدعم إبراز الإيحاءات الأصلية للمحصول.'}
          </p>
        </div>

        {/* Best Use Recommendation */}
        <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Coffee className="w-4 h-4 text-[#D97724]" />
            التوجيه الأفضل للاستخدام
          </span>
          <p className="text-xs font-bold text-amber-300 leading-relaxed">
            {best_use_recommendation_ar}
          </p>
          <span className="text-[10px] text-slate-500">
            توجيه عملي معتمد لمدير المقهى وفريق الباريستا
          </span>
        </div>

        {/* Degassing & Rest Period */}
        <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#A855F7]" />
            فترة الراحة وطرد الغازات (Degassing)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-purple-300 font-mono">
              {degassing_rest_days_ar}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            ضرورية لاستقرار ضغط CO2 الداخلي ومنع الاضطراب الحركي أثناء الترطيب.
          </p>
        </div>
      </div>

      {/* 3. Water Chemistry Engineering Target */}
      <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#38BDF8]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Beaker className="w-4 h-4 text-[#38BDF8]" />
            <h4 className="text-xs sm:text-sm font-bold text-white">
              هندسة كيمياء مياه التحضير (Target Water Chemistry)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/30">
            معادلة العيب كيميائياً عبر الأيونات
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* GH */}
          <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36] flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold">
              الصلابة الكلية (General Hardness - GH):
            </span>
            <span className="text-xs font-mono font-bold text-[#38BDF8]">
              {water_chemistry_target.target_gh_ppm}
            </span>
            <span className="text-[10px] text-slate-500">
              قوة المذيب لاستخلاص السكريات والزيوت
            </span>
          </div>

          {/* KH */}
          <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36] flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold">
              القلوية / البفر الكيميائي (Buffer - KH):
            </span>
            <span className="text-xs font-mono font-bold text-[#F59E0B]">
              {water_chemistry_target.target_kh_ppm}
            </span>
            <span className="text-[10px] text-slate-500">
              معادلة الأحماض وكبح الجفاف والمرارة
            </span>
          </div>

          {/* Mg:Ca Ratio */}
          <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36] flex flex-col gap-1">
            <span className="text-[10px] text-slate-400 font-bold">
              نسبة المغنيسيوم إلى الكالسيوم (Mg : Ca):
            </span>
            <span className="text-xs font-mono font-bold text-[#A855F7]">
              {water_chemistry_target.mg_to_ca_ratio}
            </span>
            <span className="text-[10px] text-slate-500">
              تركيز المغنيسيوم لجذب جزيئات الأكسجين
            </span>
          </div>
        </div>

        {/* Scientific Explanation */}
        <div className="bg-[#161920]/80 p-3 rounded-lg border border-[#262B36] text-[11px] text-slate-300 leading-relaxed flex items-start gap-2">
          <span className="text-[#38BDF8] font-bold shrink-0">● الشرح العلمي:</span>
          <span>{water_chemistry_target.water_explanation_ar}</span>
        </div>
      </div>

      {/* 4. Filter vs Espresso Recipe Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#262B36] pb-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#D97724]" />
            <span className="text-xs font-bold text-white">
              وصفات الاستخلاص التعويضية للباريستا
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0D0F12] p-1 rounded-xl border border-[#262B36]">
            <button
              onClick={() => setActiveTab('filter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'filter'
                  ? 'bg-gradient-to-r from-[#38BDF8] to-cyan-400 text-[#0D0F12] shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>الترشيح المقطر (V60 / Filter)</span>
            </button>
            <button
              onClick={() => setActiveTab('espresso')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'espresso'
                  ? 'bg-gradient-to-r from-[#10B981] to-emerald-400 text-[#0D0F12] shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-[#161920]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>الإسبريسو والحليب (Espresso)</span>
            </button>
          </div>
        </div>

        {/* Filter Recipe Content */}
        {activeTab === 'filter' && (
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36]">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  حرارة ماء التحضير (Water Temp):
                </span>
                <span className="text-xs font-mono font-bold text-[#D97724]">
                  {filter_rescue_recipe.water_temp_c}
                </span>
              </div>

              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36]">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  نسبة الاستخلاص (Brew Ratio):
                </span>
                <span className="text-xs font-mono font-bold text-[#38BDF8]">
                  {filter_rescue_recipe.brew_ratio}
                </span>
              </div>

              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36]">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  تعديل درجة الطحن (Grind Adjustment):
                </span>
                <span className="text-xs font-bold text-amber-300">
                  {filter_rescue_recipe.grind_adjustment_ar}
                </span>
              </div>
            </div>

            <div className="bg-[#161920] p-3.5 rounded-lg border border-[#262B36] space-y-1">
              <span className="text-[11px] font-bold text-[#38BDF8] block">
                تكنيك الترطيب والصب الموصى به (Bloom & Pour Technique):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {filter_rescue_recipe.bloom_and_pour_technique_ar}
              </p>
            </div>
          </div>
        )}

        {/* Espresso Recipe Content */}
        {activeTab === 'espresso' && (
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36]">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  حرارة الاستخلاص (Espresso Temp):
                </span>
                <span className="text-xs font-mono font-bold text-[#38BDF8]">
                  {espresso_rescue_recipe.water_temp_c}
                </span>
              </div>

              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36]">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  نسبة الاستخلاص (Yield Ratio):
                </span>
                <span className="text-xs font-mono font-bold text-[#A855F7]">
                  {espresso_rescue_recipe.yield_ratio}
                </span>
              </div>

              <div className="bg-[#161920] p-3 rounded-lg border border-[#262B36]">
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  وقت التدفق المستهدف (Shot Time):
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {espresso_rescue_recipe.shot_time_sec}
                </span>
              </div>
            </div>

            <div className="bg-[#161920] p-3.5 rounded-lg border border-[#262B36] space-y-1">
              <span className="text-[11px] font-bold text-[#38BDF8] block">
                الترطيب المسبق والضغط (Pre-infusion & Pressure):
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {espresso_rescue_recipe.pre_infusion_and_pressure_ar}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 5. Safe Barista Protocol Notice */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#262B36]/80 text-[11px] text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-[#D97724] shrink-0" />
        <span>
          <strong>بروتوكول الباريستا الآمن:</strong> تمت صياغة هذه التوصيات وفق هندسة الاستخلاص لتعظيم نكهة الكوب دون إبراز أي خلل بالتحميص للمستهلك.
        </span>
      </div>
    </div>
  );
};
