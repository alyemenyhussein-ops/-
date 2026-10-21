import React from 'react';
import {
  BeanProfile,
  ManualTelemetry,
  RoastDiagnosisResponse,
  SCACuppingScores,
  PostRoastAppearance,
} from '../types';
import {
  X,
  Printer,
  Download,
  Flame,
  Award,
  Thermometer,
  Layers,
  Activity,
  CheckCircle2,
  Calendar,
  Coffee,
  Wind,
  Droplets,
  Beaker,
} from 'lucide-react';
import { IttizanLogo } from './IttizanLogo';
import { LuxuryYemenFooter } from './LuxuryYemenFooter';
import { getOrGenerateBrewRescue } from '../utils/brewRescue';

interface PrintableRoastSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  beanProfile: BeanProfile;
  telemetry: ManualTelemetry;
  diagnosis: RoastDiagnosisResponse;
  appearance?: PostRoastAppearance;
  cuppingScores?: SCACuppingScores;
  sensoryDefect?: string;
  notes?: string;
}

export const PrintableRoastSheetModal: React.FC<PrintableRoastSheetModalProps> = ({
  isOpen,
  onClose,
  beanProfile,
  telemetry,
  diagnosis,
  appearance,
  cuppingScores,
  sensoryDefect,
  notes,
}) => {
  if (!isOpen) return null;
  const rescue = getOrGenerateBrewRescue(diagnosis, beanProfile, sensoryDefect);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadText = () => {
    const textReport = `=====================================================
تقرير التشخيص الفيزيائي والديناميكي لتحميص القهوة المختصة
ROAST MASTER PHYSICAL DIAGNOSTIC SHEET (SCA STANDARDS)
=====================================================
التاريخ: ${new Date().toLocaleDateString('ar-SA')} | ${new Date().toLocaleTimeString('ar-SA')}
المحصول: ${beanProfile.name || 'غير محدد'}
المعالجة: ${beanProfile.process}
الكثافة: ${beanProfile.density_g_l || '-'} g/L | الرطوبة: ${beanProfile.moisture_pct || '-'} %
الهدف: ${beanProfile.targetBrew === 'FILTER' ? 'مقطر (Filter)' : 'إسبريسو (Espresso)'}
نوع المحمصة: ${beanProfile.roasterType || 'غير محدد'}

-----------------------------------------------------
1. النتيجة الإجمالية وصحة التحميص:
-----------------------------------------------------
درجة صحة التحميص (Roast Health Score): ${diagnosis.roast_health_score}/100
حالة المسار: ${diagnosis.overall_status}
الخلاصة التشخيصية: ${diagnosis.summary_headline}

-----------------------------------------------------
2. الأرقام الحرارية والأطوار المستخرجة:
-----------------------------------------------------
- حرارة الإسقاط (Charge): ${telemetry.chargeTempC || '-'}°C
- نقطة التحول (Turning Point): ${telemetry.turningPointTempC || '-'}°C @ ${telemetry.turningPointTime || '-'}
- بداية الاصفرار (Yellowing): ${telemetry.yellowingTempC || '-'}°C @ ${telemetry.yellowingTime || '-'}
- الفرقعة الأولى (First Crack): ${telemetry.firstCrackTempC || '-'}°C @ ${telemetry.firstCrackTime || '-'}
- حرارة وزمن التفريغ (Drop): ${telemetry.dropTempC || '-'}°C @ ${telemetry.dropTime || '-'}
- أطوار التحميص: تجفيف (${diagnosis.phase_ratios.drying_percent}%) | مايلارد (${diagnosis.phase_ratios.maillard_percent}%) | تطور (${diagnosis.phase_ratios.dtr_percent}%)

-----------------------------------------------------
3. إعدادات تدفق الهواء ومروحة الحمّاصة (Airflow & Roaster Fan):
-----------------------------------------------------
- نظام الوحدة: ${telemetry.airflow?.unit === 'PERCENT' ? 'نسبة مئوية %' : telemetry.airflow?.unit === 'PASCAL' ? 'ضغط تفاضلي Pa' : telemetry.airflow?.unit === 'STEP' ? 'صمام مدرج (درجات)' : 'دوران RPM'}
- مسار المروحة: إسقاط (${telemetry.airflow?.chargeAirflow ?? '-'}) ➔ تجفيف (${telemetry.airflow?.dryingAirflow ?? '-'}) ➔ مايلارد (${telemetry.airflow?.maillardAirflow ?? '-'}) ➔ قرقعة وتطوير (${telemetry.airflow?.firstCrackAirflow ?? '-'})
- كفاءة سحب القشور والدخان: ${telemetry.airflow?.chaffEvacuationRating === 'OPTIMAL' ? 'ممتازة وتصريف تام' : telemetry.airflow?.chaffEvacuationRating === 'MODERATE' ? 'متوسطة' : 'ضعيفة'}
${diagnosis.airflow_analysis ? `- نسبة مساهمة الحمل الحراري: ${diagnosis.airflow_analysis.convective_heat_ratio_percent}% Convection
- حكم اتزان تدفق الهواء: ${diagnosis.airflow_analysis.verdict_headline_ar}
- توصية ضبط المروحة للدفعة القادمة: ${diagnosis.airflow_analysis.recommended_fan_adjustments_ar}` : ''}

-----------------------------------------------------
4. بروتوكول إنقاذ الدفعة وهندسة الاستخلاص (Brew & Water Rescue Protocol):
-----------------------------------------------------
- نسبة إمكانية الإنقاذ (Salvageability): ${rescue.salvageability_percent}%
- التوصية الرسمية للاستخدام: ${rescue.best_use_recommendation_ar}
- فترة الراحة الموصى بها (Degassing): ${rescue.degassing_rest_days_ar}
- كيمياء المياه:
  * الصلابة الكلية (GH): ${rescue.water_chemistry_target.target_gh_ppm}
  * القلوية (KH): ${rescue.water_chemistry_target.target_kh_ppm}
  * نسبة Mg:Ca: ${rescue.water_chemistry_target.mg_to_ca_ratio}
  * التفسير: ${rescue.water_chemistry_target.water_explanation_ar}
- وصفة المقطر (Filter Rescue):
  * الحرارة: ${rescue.filter_rescue_recipe.water_temp_c} | النسبة: ${rescue.filter_rescue_recipe.brew_ratio}
  * الطحنة: ${rescue.filter_rescue_recipe.grind_adjustment_ar}
  * أسلوب الصب: ${rescue.filter_rescue_recipe.bloom_and_pour_technique_ar}
- وصفة الإسبريسو (Espresso Rescue):
  * الحرارة: ${rescue.espresso_rescue_recipe.water_temp_c} | نسبة الاستخلاص: ${rescue.espresso_rescue_recipe.yield_ratio}
  * زمن الاستخلاص: ${rescue.espresso_rescue_recipe.shot_time_sec} | الترطيب والضغط: ${rescue.espresso_rescue_recipe.pre_infusion_and_pressure_ar}

-----------------------------------------------------
4. التشخيص الثرموديناميكي والسبب الجذري:
-----------------------------------------------------
- السبب الجذري: ${diagnosis.sensory_correlation.thermodynamic_root_cause_ar || diagnosis.summary_headline}
- سلوك انحدار الـ RoR: ${diagnosis.ror_diagnostics.is_monotonically_decreasing ? 'انحدار رتيب متناقص سليم' : 'اضطراب في التناقص الرتيب (شذوذ حراري)'}
- الشذوذ المكتشف: ${diagnosis.ror_diagnostics.detected_anomalies.map(a => `${a.anomaly_type}: ${a.physical_cause_ar}`).join(' | ') || 'لا يوجد شذوذ حرج'}

-----------------------------------------------------
5. خطة عمل الدفعة القادمة (Next Batch Action Plan):
-----------------------------------------------------
${diagnosis.next_batch_action_plan
  .map(
    (s, idx) =>
      `${idx + 1}. [${s.stage_name_ar}] ${s.control_parameter}: ${s.exact_action_ar} - ${s.expected_effect_ar}`
  )
  .join('\n')}

=====================================================
توقيع مسؤول الجودة / الحمّاص: _______________________
`;

    const blob = new Blob([textReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Roast_Report_${beanProfile.name ? beanProfile.name.replace(/\s+/g, '_') : 'Batch'}_${Date.now()}.txt`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return { text: 'مسار مثالي ومنضبط (Optimal)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'NEEDS_ADJUSTMENT':
        return { text: 'يحتاج تعديل ديناميكي طفيف (Needs Adjustment)', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      default:
        return { text: 'شذوذ حراري حرج (Critical Defect)', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    }
  };

  const statusInfo = getStatusBadge(diagnosis.overall_status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex justify-center p-2 sm:p-4 print:p-0 print:bg-white print:fixed print:inset-0">
      <div className="bg-[#12141A] print:bg-white text-slate-100 print:text-black w-full max-w-4xl rounded-2xl print:rounded-none border border-[#262B36] print:border-none shadow-2xl flex flex-col my-auto overflow-hidden">
        {/* Top Interactive Controls (Hidden during print) */}
        <div className="flex items-center justify-between p-4 border-b border-[#262B36] bg-[#161920] print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#D97724]" />
            <h3 className="text-sm font-bold text-white">
              معاينة وتصدير تقرير التحميص الفيزيائي (Roast Diagnostic Report)
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0D0F12] border border-[#262B36] text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#262B36] transition"
            >
              <Download className="w-4 h-4 text-[#38BDF8]" />
              <span>تصدير ملف نصي</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#D97724] hover:bg-[#c4651a] text-xs font-bold text-white shadow-md transition"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#262B36] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div id="printable-roast-sheet" className="p-6 sm:p-8 space-y-6 text-right font-sans print:p-6 print:text-black">
          {/* Header Sheet */}
          <div className="border-b-2 border-[#D97724] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <IttizanLogo size="md" />
            </div>

            <div className="flex flex-col sm:items-end text-xs text-slate-400 print:text-slate-600 font-mono">
              <span className="flex items-center gap-1 font-semibold text-slate-200 print:text-black">
                <Calendar className="w-3.5 h-3.5 text-[#D97724]" />
                {new Date().toLocaleDateString('ar-SA')} - {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="mt-1 px-2.5 py-0.5 rounded bg-[#262B36] print:bg-slate-200 text-[#38BDF8] print:text-slate-800 text-[11px] font-mono border border-[#262B36] print:border-slate-300">
                رقم التوثيق: #{Math.floor(Date.now() / 1000).toString().slice(-6)}
              </span>
              <span className="text-[10px] text-slate-400 print:text-slate-500 mt-1">
                Roast Profile Diagnostic Sheet • SCA & Agtron Standards
              </span>
            </div>
          </div>

          {/* Bean Profile & Summary Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#161920] print:bg-slate-50 p-4 rounded-xl border border-[#262B36] print:border-slate-300 text-xs">
            <div>
              <span className="text-slate-400 print:text-slate-500 block text-[11px]">اسم المحصول والمنشأ:</span>
              <strong className="text-white print:text-black text-sm">{beanProfile.name || 'غير محدد'}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 block text-[11px]">المعالجة والهدف:</span>
              <strong className="text-[#D97724] print:text-amber-800">
                {beanProfile.process} • {beanProfile.targetBrew === 'FILTER' ? 'مقطر (Filter)' : 'إسبريسو'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 block text-[11px]">الكثافة والرطوبة:</span>
              <span className="font-mono text-slate-200 print:text-black">
                {beanProfile.density_g_l ? `${beanProfile.density_g_l} g/L` : '-'} | {beanProfile.moisture_pct ? `${beanProfile.moisture_pct}%` : '-'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 print:text-slate-500 block text-[11px]">نوع المحمصة:</span>
              <span className="text-slate-200 print:text-black">{beanProfile.roasterType || 'محمصة تجارية'}</span>
            </div>
          </div>

          {/* Scores & Verdict Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0D0F12] print:bg-white p-4 rounded-xl border border-[#262B36] print:border-slate-300 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 print:text-slate-500 block">درجة صحة التحميص</span>
                <span className="text-3xl font-black font-mono text-emerald-400 print:text-emerald-700">
                  {diagnosis.roast_health_score}
                  <span className="text-xs text-slate-400 font-normal"> / 100</span>
                </span>
              </div>
              <div className="text-left font-mono text-[11px]">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.bg}`}>
                  {diagnosis.overall_status}
                </span>
              </div>
            </div>

            <div className="bg-[#0D0F12] print:bg-white p-4 rounded-xl border border-[#262B36] print:border-slate-300 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 print:text-slate-500 block">تقييم الكوب المعياري (SCA)</span>
                <span className="text-3xl font-black font-mono text-amber-400 print:text-amber-700">
                  {diagnosis.sca_cupping_analysis?.calibrated_sca_score || cuppingScores?.total_score || '-'}
                  <span className="text-xs text-slate-400 font-normal"> / 100</span>
                </span>
              </div>
              <div className="text-left text-[11px] text-slate-400 print:text-slate-600">
                <span>{diagnosis.sca_cupping_analysis?.sca_grade_ar || 'تصنيف SCA'}</span>
              </div>
            </div>

            <div className="bg-[#0D0F12] print:bg-white p-4 rounded-xl border border-[#262B36] print:border-slate-300 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 print:text-slate-500 block">لون الأجترون (حب / مطحون)</span>
                <span className="text-2xl font-black font-mono text-[#38BDF8] print:text-sky-700">
                  {diagnosis.agtron_appearance_analysis?.agtron_reading_whole || appearance?.whole_bean_agtron || '-'} / {diagnosis.agtron_appearance_analysis?.agtron_reading_ground || appearance?.ground_agtron || '-'}
                </span>
              </div>
              <div className="text-left text-[11px]">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 print:text-sky-800 border border-sky-500/20">
                  Δ {diagnosis.agtron_appearance_analysis?.delta_agtron_spread ?? '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Headline Banner */}
          <div className="bg-[#161920] print:bg-slate-100 p-3.5 rounded-xl border border-amber-500/30 print:border-amber-400 text-xs">
            <strong className="text-amber-400 print:text-amber-800 block mb-0.5">التشخيص التنفيذي المباشر:</strong>
            <p className="text-slate-200 print:text-slate-800 leading-relaxed">{diagnosis.summary_headline}</p>
          </div>

          {/* Phase Ratios & Telemetry Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 print:text-black flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#D97724]" />
              <span>النسب المئوية للمراحل والبيانات الحرارية (Phase Ratios & Telemetry)</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right border-collapse border border-[#262B36] print:border-slate-300">
                <thead>
                  <tr className="bg-[#161920] print:bg-slate-200 text-slate-300 print:text-black border-b border-[#262B36] print:border-slate-300">
                    <th className="p-2 border-l border-[#262B36] print:border-slate-300">المرحلة</th>
                    <th className="p-2 border-l border-[#262B36] print:border-slate-300">الوقت والحرارة</th>
                    <th className="p-2 border-l border-[#262B36] print:border-slate-300">النسبة المئوية</th>
                    <th className="p-2 border-l border-[#262B36] print:border-slate-300">المعيار الموصى به</th>
                    <th className="p-2">الحالة الفيزيائية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262B36] print:divide-slate-300 font-mono">
                  <tr>
                    <td className="p-2 font-bold text-slate-200 print:text-black border-l border-[#262B36] print:border-slate-300">
                      التجفيف (Drying)
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-slate-300 print:text-black">
                      إلى {telemetry.yellowingTime || '-'} @ {telemetry.yellowingTempC || '-'}°C
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-amber-400 print:text-amber-800 font-bold">
                      {diagnosis.phase_ratios.drying_percent}%
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-slate-400 print:text-slate-600">
                      35% - 45%
                    </td>
                    <td className="p-2 font-sans text-slate-300 print:text-black text-[11px]">
                      {diagnosis.phase_ratios.drying_percent < 35 ? 'سريع (خطر احتراق الأطراف)' : diagnosis.phase_ratios.drying_percent > 45 ? 'بطيء (خطر ركود الزخم)' : 'متزن ومثالي'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-200 print:text-black border-l border-[#262B36] print:border-slate-300">
                      مايلارد (Maillard)
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-slate-300 print:text-black">
                      إلى {telemetry.firstCrackTime || '-'} @ {telemetry.firstCrackTempC || '-'}°C
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-sky-400 print:text-sky-800 font-bold">
                      {diagnosis.phase_ratios.maillard_percent}%
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-slate-400 print:text-slate-600">
                      35% - 45%
                    </td>
                    <td className="p-2 font-sans text-slate-300 print:text-black text-[11px]">
                      {diagnosis.phase_ratios.maillard_percent > 45 ? 'ممتد (قوام عالي، تسطح حمضية)' : 'تطور السكريات سليم'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-200 print:text-black border-l border-[#262B36] print:border-slate-300">
                      التطور (DTR)
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-slate-300 print:text-black">
                      تفريغ عند {telemetry.dropTime || '-'} @ {telemetry.dropTempC || '-'}°C
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-purple-400 print:text-purple-800 font-bold">
                      {diagnosis.phase_ratios.dtr_percent}%
                    </td>
                    <td className="p-2 border-l border-[#262B36] print:border-slate-300 text-slate-400 print:text-slate-600">
                      12% - 18% (فلتر) / 18% - 24% (إسبريسو)
                    </td>
                    <td className="p-2 font-sans text-slate-300 print:text-black text-[11px]">
                      ΔT التطور: {diagnosis.extracted_metrics.temp_development_delta_c}°C
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Agtron & Sensory Consistency Analysis */}
          {diagnosis.agtron_appearance_analysis && (
            <div className="bg-[#161920] print:bg-slate-50 p-4 rounded-xl border border-[#262B36] print:border-slate-300 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-300 print:text-amber-800 flex items-center gap-1.5">
                  <Coffee className="w-4 h-4 text-[#D97724]" />
                  <span>تحليل اتساق لون الأجترون مع معايير معالجة البن ({beanProfile.process}):</span>
                </span>
                <span className="font-mono font-bold text-white print:text-black bg-[#0D0F12] print:bg-slate-200 px-2 py-0.5 rounded">
                  درجة الاتساق: {diagnosis.agtron_appearance_analysis.process_consistency_score ?? 85}/100
                </span>
              </div>
              <p className="text-slate-300 print:text-slate-700 leading-relaxed">
                {diagnosis.agtron_appearance_analysis.process_sensory_link_analysis_ar || diagnosis.agtron_appearance_analysis.core_vs_surface_gradient_ar}
              </p>
              {diagnosis.agtron_appearance_analysis.roast_color_sensory_verdict_ar && (
                <p className="text-sky-300 print:text-sky-900 border-t border-[#262B36] print:border-slate-200 pt-1.5 font-medium">
                  <strong>الأثر الحسي للون: </strong>
                  {diagnosis.agtron_appearance_analysis.roast_color_sensory_verdict_ar}
                </p>
              )}
            </div>
          )}

          {/* Root-Cause Physical Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-[#0D0F12] print:bg-white p-4 rounded-xl border border-[#262B36] print:border-slate-300 space-y-2">
              <strong className="text-rose-400 print:text-rose-800 block text-xs">
                السبب الفيزيائي الجذري (Thermodynamic Root Cause):
              </strong>
              <p className="text-slate-300 print:text-slate-700 leading-relaxed">
                {diagnosis.sensory_correlation.thermodynamic_root_cause_ar || diagnosis.summary_headline}
              </p>
            </div>
            <div className="bg-[#0D0F12] print:bg-white p-4 rounded-xl border border-[#262B36] print:border-slate-300 space-y-2">
              <strong className="text-sky-400 print:text-sky-800 block text-xs">
                سلوك انحدار معدل الصعود (RoR Anomaly Evaluation):
              </strong>
              <p className="text-slate-300 print:text-slate-700 leading-relaxed">
                {diagnosis.ror_diagnostics.detected_anomalies.length > 0
                  ? diagnosis.ror_diagnostics.detected_anomalies
                      .map((a) => `${a.anomaly_type}: ${a.physical_cause_ar}`)
                      .join(' | ')
                  : 'انحدار رتيب متناقص وسلس دون شذوذ حرج.'}
              </p>
            </div>
          </div>

          {/* Brew & Water Rescue Protocol */}
          <div className="bg-[#161920] print:bg-slate-50 p-4 rounded-xl border border-[#262B36] print:border-slate-300 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#262B36] print:border-slate-200 pb-2">
              <span className="font-bold text-sky-400 print:text-sky-800 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-[#38BDF8]" />
                <span>بروتوكول إنقاذ الدفعة وهندسة الاستخلاص (Brew & Water Rescue):</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 print:text-slate-600">
                  إمكانية الإنقاذ: <strong className="text-emerald-400 print:text-emerald-700 font-mono">{rescue.salvageability_percent}%</strong>
                </span>
                <span className="text-[10px] bg-slate-800 print:bg-slate-200 text-slate-300 print:text-slate-800 px-2 py-0.5 rounded font-mono">
                  راحة البن: {rescue.degassing_rest_days_ar}
                </span>
              </div>
            </div>

            <p className="text-slate-300 print:text-slate-700 font-medium">
              <strong className="text-amber-400 print:text-amber-700">التوجيه المعتمد: </strong>
              {rescue.best_use_recommendation_ar}
            </p>

            {/* Water Chemistry & Recipes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
              <div className="bg-[#0D0F12] print:bg-white p-2.5 rounded-lg border border-[#262B36] print:border-slate-200">
                <strong className="text-sky-400 print:text-sky-800 block mb-1">
                  هندسة المياه (Water Targets):
                </strong>
                <p className="text-slate-300 print:text-slate-700 font-mono">GH: {rescue.water_chemistry_target.target_gh_ppm}</p>
                <p className="text-slate-300 print:text-slate-700 font-mono">KH: {rescue.water_chemistry_target.target_kh_ppm}</p>
                <p className="text-slate-300 print:text-slate-700 font-mono">Mg:Ca: {rescue.water_chemistry_target.mg_to_ca_ratio}</p>
              </div>

              <div className="bg-[#0D0F12] print:bg-white p-2.5 rounded-lg border border-[#262B36] print:border-slate-200">
                <strong className="text-amber-400 print:text-amber-800 block mb-1">
                  المقطر (Filter Recipe):
                </strong>
                <p className="text-slate-300 print:text-slate-700">الحرارة: {rescue.filter_rescue_recipe.water_temp_c}</p>
                <p className="text-slate-300 print:text-slate-700">النسبة: {rescue.filter_rescue_recipe.brew_ratio}</p>
                <p className="text-slate-400 print:text-slate-600 text-[10px] mt-1">{rescue.filter_rescue_recipe.grind_adjustment_ar}</p>
              </div>

              <div className="bg-[#0D0F12] print:bg-white p-2.5 rounded-lg border border-[#262B36] print:border-slate-200">
                <strong className="text-purple-400 print:text-purple-800 block mb-1">
                  الإسبريسو (Espresso Recipe):
                </strong>
                <p className="text-slate-300 print:text-slate-700">الحرارة: {rescue.espresso_rescue_recipe.water_temp_c}</p>
                <p className="text-slate-300 print:text-slate-700">النسبة: {rescue.espresso_rescue_recipe.yield_ratio}</p>
                <p className="text-slate-400 print:text-slate-600 text-[10px] mt-1">{rescue.espresso_rescue_recipe.shot_time_sec}</p>
              </div>
            </div>
          </div>

          {/* Next Batch Action Plan */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white print:text-black flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#D97724]" />
              <span>خطة عمل الدفعة القادمة (Next Batch Action Plan):</span>
            </h4>
            <div className="space-y-2">
              {diagnosis.next_batch_action_plan.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-[#161920] print:bg-slate-50 p-3 rounded-xl border border-[#262B36] print:border-slate-300 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-[#D97724]/20 print:bg-amber-100 text-[#D97724] print:text-amber-800 font-bold font-mono flex items-center justify-center shrink-0 text-xs">
                    {step.step_number || idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-white print:text-black">{step.stage_name_ar}:</strong>
                      <span className="font-mono text-amber-400 print:text-amber-800 font-bold">{step.exact_action_ar}</span>
                      <span className="text-[10px] text-slate-400 print:text-slate-500 font-mono">({step.control_parameter})</span>
                    </div>
                    <p className="text-slate-300 print:text-slate-600 text-[11px] leading-relaxed">
                      {step.expected_effect_ar}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer & Signature Block */}
          <div className="border-t border-[#262B36] print:border-slate-300 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 print:text-slate-600 gap-4">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#D97724]" />
              <span>تم التحقق والمطابقة وفق معايير SCA والديناميكا الحرارية المعيارية</span>
            </div>
            <div className="flex items-center gap-4">
              <span>توقيع الحمّاص / مراقب الجودة:</span>
              <span className="inline-block w-36 border-b border-dashed border-slate-500 print:border-black" />
            </div>
          </div>

          {/* Luxury Yemen Signature Footer */}
          <LuxuryYemenFooter isPrintReport />
        </div>
      </div>
    </div>
  );
};
