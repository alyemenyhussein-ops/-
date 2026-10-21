import React, { useState, useEffect } from 'react';
import {
  ReferenceRoastProfile,
  ScaledBatchPlan,
  RoasterType,
} from '../types';
import {
  ROASTER_TYPE_INFO,
  BATCH_SCALER_PRESETS,
  calculateThermodynamicScaling,
} from '../utils/batchScalerEngine';
import {
  Scale,
  Flame,
  Wind,
  Gauge,
  Thermometer,
  Layers,
  Sparkles,
  RefreshCw,
  Copy,
  Printer,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  TrendingUp,
  Activity,
  Sliders,
  Maximize2,
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

export const BatchScaler: React.FC = () => {
  // Active preset or custom
  const [selectedPresetId, setSelectedPresetId] = useState<string>(BATCH_SCALER_PRESETS[0].id);

  // Reference roast profile state
  const [reference, setReference] = useState<ReferenceRoastProfile>(
    BATCH_SCALER_PRESETS[0].reference
  );

  // Target batch size (kg)
  const [targetBatchKg, setTargetBatchKg] = useState<number>(
    BATCH_SCALER_PRESETS[0].targetBatchKg
  );

  // Advanced options toggle
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Calculation output plan
  const [plan, setPlan] = useState<ScaledBatchPlan>(() =>
    calculateThermodynamicScaling(BATCH_SCALER_PRESETS[0].reference, BATCH_SCALER_PRESETS[0].targetBatchKg)
  );

  // AI loading and error states
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);
  const [isAiCalculated, setIsAiCalculated] = useState<boolean>(false);

  // Recalculate instant thermodynamic physics whenever parameters change
  useEffect(() => {
    try {
      const immediatePlan = calculateThermodynamicScaling(reference, targetBatchKg);
      setPlan(immediatePlan);
      setIsAiCalculated(false);
    } catch (e) {
      console.error(e);
    }
  }, [reference, targetBatchKg]);

  const handleSelectPreset = (presetId: string) => {
    const p = BATCH_SCALER_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setSelectedPresetId(presetId);
    setReference(p.reference);
    setTargetBatchKg(p.targetBatchKg);
    setErrorMsg(null);
  };

  const handleCalculateWithGemini = async () => {
    setIsLoadingAi(true);
    setErrorMsg(null);
    try {
      const response = await fetch('/api/scaler/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, targetBatchKg }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'تعذر حساب التحجيم عبر الذكاء الاصطناعي');
      }

      setPlan(data.plan);
      setIsAiCalculated(true);
    } catch (err: any) {
      console.warn('AI calculation failed, maintaining thermodynamic engine calculation:', err);
      setErrorMsg(
        err?.message ||
          'تعذر الاتصال بخادم الذكاء الاصطناعي؛ تم الحساب بنجاح عبر محرك الديناميكا الحرارية المدمج.'
      );
      // Fallback is already live in state
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleCopyActionPlan = () => {
    if (!plan) return;
    const text = `
=== خطة تحجيم دفعة التحميص | Roast Batch Scaler Plan ===
المحمصة: ${plan.reference.roasterModel || plan.reference.roasterType}
الدفعة المرجعية: ${plan.reference.batchSizeKg} كجم | حرارة الدخول المرجعية: ${plan.reference.chargeTempC}°C | الغاز: ${plan.reference.gasBaselinePercent}%
الدفعة المستهدفة الجديدة: ${plan.target.batchSizeKg} كجم (معدل ×${plan.target.scaleRatio})
--------------------------------------------------
المعاملات المستهدفة:
- حرارة الشحن الموصى بها: ${plan.target.recommendedChargeTempC}°C (فرق: ${plan.target.chargeTempDeltaC > 0 ? '+' : ''}${plan.target.chargeTempDeltaC}°C)
- مستوى الغاز الأساسي: ${plan.target.recommendedGasScalingPercent}%
- تدفق الهواء: ${plan.target.recommendedAirflowSetting}
- سرعة دوران الأسطوانة: ${plan.target.recommendedDrumSpeedRpm} RPM (فرق: ${plan.target.drumSpeedDeltaRpm > 0 ? '+' : ''}${plan.target.drumSpeedDeltaRpm} RPM)

خطة المراحل:
${plan.phaseByPhaseGuidance.map((g) => `* ${g.phase}: غاز [${g.gasAdjustment}] | هواء [${g.airflowAdjustment}]`).join('\n')}

المخاطر الحرارية:
${plan.thermodynamicAnalysis.criticalRisks.join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Quick scale multiplier buttons
  const applyMultiplier = (factor: number) => {
    const newKg = Math.round(reference.batchSizeKg * factor * 10) / 10;
    if (newKg > 0) setTargetBatchKg(newKg);
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#D97724]/10 via-[#38BDF8]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-gradient-to-br from-[#D97724]/20 to-[#38BDF8]/20 border border-[#262B36] rounded-2xl shadow-inner text-[#D97724]">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  محول أحجام الدفعات الثرموديناميكي
                </h1>
                <span className="text-[11px] font-mono font-bold bg-[#D97724]/15 text-[#D97724] border border-[#D97724]/30 px-2.5 py-0.5 rounded-full">
                  Gemini Thermodynamics Engine
                </span>
                {isAiCalculated && (
                  <span className="text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    تحليل معتمد بواسطة Gemini 3.8 Flash
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
                معايرة فيزيائية دقيقة لتحجيم دفعات التحميص (Batch Scaling) وفق السعة الحرارية للبن
                والكتلة المعدنية للأسطوانة ومعدل التدفق الحجمي للحفاظ على نفس منحنى الـ RoR ومذاق الكوب.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
            <button
              onClick={handleCopyActionPlan}
              className="px-3.5 py-2 bg-[#0D0F12] hover:bg-[#1E232E] text-slate-300 hover:text-white border border-[#262B36] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
              title="نسخ الخطة"
            >
              <Copy className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{copiedSuccess ? 'تم النسخ بنجاح!' : 'نسخ الخطة'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#0D0F12] hover:bg-[#1E232E] text-slate-300 hover:text-white border border-[#262B36] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
              title="طباعة بطاقة التحجيم"
            >
              <Printer className="w-3.5 h-3.5 text-[#D97724]" />
              <span>طباعة البطاقة</span>
            </button>
          </div>
        </div>

        {/* Ready-to-Test Presets Bar */}
        <div className="mt-5 pt-4 border-t border-[#262B36]/80 flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#D97724]" />
            <span>أمثلة تحجيم صناعية جاهزة:</span>
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin">
            {BATCH_SCALER_PRESETS.map((p) => {
              const isSelected = selectedPresetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p.id)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-[#D97724]/20 border-[#D97724] text-white shadow-sm font-bold'
                      : 'bg-[#0D0F12] border-[#262B36] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {p.title_ar}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Dual Panels: Input configuration on Right, Calculated Thermodynamic Plan on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Panel (Inputs): 5 cols on lg */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Step 1: Reference Roast Input Card */}
          <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#262B36] pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#D97724]" />
                <h3 className="text-sm font-bold text-white">معطيات التحميص المرجعي الناجح (Reference)</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-[#0D0F12] px-2 py-0.5 rounded border border-[#262B36]">
                البروفايل الأساسي
              </span>
            </div>

            {/* Reference Batch Size (kg) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>وزن الدفعة المرجعية (Reference Batch Size)</span>
                </label>
                <span className="text-xs font-mono font-bold text-[#38BDF8]">
                  {reference.batchSizeKg} كجم
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.2"
                  max="60"
                  step="0.1"
                  value={reference.batchSizeKg}
                  onChange={(e) =>
                    setReference({ ...reference, batchSizeKg: parseFloat(e.target.value) || 1.0 })
                  }
                  className="w-full accent-[#38BDF8] bg-[#0D0F12] h-2 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="0.1"
                  max="120"
                  step="0.1"
                  value={reference.batchSizeKg}
                  onChange={(e) =>
                    setReference({
                      ...reference,
                      batchSizeKg: Math.max(0.1, parseFloat(e.target.value) || 0.1),
                    })
                  }
                  className="w-20 bg-[#0D0F12] border border-[#262B36] text-white text-xs font-mono px-2.5 py-1.5 rounded-lg text-center focus:border-[#38BDF8] focus:outline-none"
                />
              </div>
            </div>

            {/* Reference Charge Temp (°C) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-[#D97724]" />
                  <span>حرارة الشحن المرجعية (Charge Temp)</span>
                </label>
                <span className="text-xs font-mono font-bold text-[#D97724]">
                  {reference.chargeTempC}°C
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="160"
                  max="240"
                  step="1"
                  value={reference.chargeTempC}
                  onChange={(e) =>
                    setReference({ ...reference, chargeTempC: parseInt(e.target.value, 10) || 200 })
                  }
                  className="w-full accent-[#D97724] bg-[#0D0F12] h-2 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="150"
                  max="250"
                  value={reference.chargeTempC}
                  onChange={(e) =>
                    setReference({
                      ...reference,
                      chargeTempC: parseInt(e.target.value, 10) || 190,
                    })
                  }
                  className="w-20 bg-[#0D0F12] border border-[#262B36] text-white text-xs font-mono px-2.5 py-1.5 rounded-lg text-center focus:border-[#D97724] focus:outline-none"
                />
              </div>
            </div>

            {/* Roaster Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>نوع المحمصة ونظام نقل الحرارة (Roaster Type)</span>
              </label>
              <select
                value={reference.roasterType}
                onChange={(e) =>
                  setReference({
                    ...reference,
                    roasterType: e.target.value as RoasterType,
                    drumSpeedRpm: ROASTER_TYPE_INFO[e.target.value as RoasterType]?.defaultDrumRpm || 55,
                  })
                }
                className="bg-[#0D0F12] border border-[#262B36] text-slate-200 text-xs px-3 py-2 rounded-xl focus:border-[#D97724] focus:outline-none cursor-pointer"
              >
                {(Object.keys(ROASTER_TYPE_INFO) as RoasterType[]).map((type) => (
                  <option key={type} value={type}>
                    {ROASTER_TYPE_INFO[type].label_ar}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400">
                طبيعة الحمل الحراري: {ROASTER_TYPE_INFO[reference.roasterType]?.convectionShare}
              </span>
            </div>

            {/* Drum Speed (RPM) & Baseline Gas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>دوران الأسطوانة (RPM)</span>
                </label>
                <input
                  type="number"
                  min="25"
                  max="90"
                  value={reference.drumSpeedRpm}
                  onChange={(e) =>
                    setReference({
                      ...reference,
                      drumSpeedRpm: parseInt(e.target.value, 10) || 55,
                    })
                  }
                  className="bg-[#0D0F12] border border-[#262B36] text-white text-xs font-mono px-3 py-1.5 rounded-lg text-center focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#D97724]" />
                  <span>الغاز الأساسي (%)</span>
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={reference.gasBaselinePercent}
                  onChange={(e) =>
                    setReference({
                      ...reference,
                      gasBaselinePercent: parseInt(e.target.value, 10) || 50,
                    })
                  }
                  className="bg-[#0D0F12] border border-[#262B36] text-white text-xs font-mono px-3 py-1.5 rounded-lg text-center focus:border-[#D97724] focus:outline-none"
                />
              </div>
            </div>

            {/* Airflow Setting */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>إعداد تدفق الهواء المرجعي (Airflow Setting)</span>
              </label>
              <input
                type="text"
                value={reference.airflowSetting}
                onChange={(e) => setReference({ ...reference, airflowSetting: e.target.value })}
                placeholder="مثال: 35 Pa أو Step 3 أو 45%"
                className="bg-[#0D0F12] border border-[#262B36] text-white text-xs px-3 py-1.5 rounded-lg focus:border-[#38BDF8] focus:outline-none"
              />
            </div>

            {/* Optional / Advanced Accordion */}
            <div className="border-t border-[#262B36] pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center justify-between w-full py-1"
              >
                <span>معلومات إضافية عن البن وطراز المحمصة (اختياري)</span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showAdvanced && (
                <div className="mt-3 flex flex-col gap-2.5 bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]/80 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">طراز المحمصة</label>
                    <input
                      type="text"
                      value={reference.roasterModel || ''}
                      onChange={(e) => setReference({ ...reference, roasterModel: e.target.value })}
                      placeholder="مثال: Giesen W12A, Probat UG22, Diedrich IR-12"
                      className="w-full bg-[#161920] border border-[#262B36] text-slate-200 text-xs px-2.5 py-1.5 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">المنشأ والمعالجة</label>
                      <input
                        type="text"
                        value={reference.beanOrigin || ''}
                        onChange={(e) => setReference({ ...reference, beanOrigin: e.target.value })}
                        placeholder="إثيوبيا / كولومبيا"
                        className="w-full bg-[#161920] border border-[#262B36] text-slate-200 text-xs px-2.5 py-1.5 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">الكثافة (g/L)</label>
                      <input
                        type="number"
                        value={reference.beanDensity || 800}
                        onChange={(e) =>
                          setReference({
                            ...reference,
                            beanDensity: parseInt(e.target.value, 10) || 800,
                          })
                        }
                        className="w-full bg-[#161920] border border-[#262B36] text-slate-200 text-xs px-2.5 py-1.5 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Target Batch Size Configuration Card */}
          <div className="bg-[#161920] border-2 border-[#38BDF8]/40 rounded-2xl p-5 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#262B36] pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-bold text-white">حجم الدفعة المستهدفة الجديدة (Target Batch)</h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-2.5 py-0.5 rounded-full">
                ×{(targetBatchKg / Math.max(0.1, reference.batchSizeKg)).toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  حدد وزن الدفعة الجديدة بالكيلوجرام (Target kg)
                </label>
                <span className="text-base font-black font-mono text-[#38BDF8]">
                  {targetBatchKg} كجم
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0.2"
                  max="60"
                  step="0.1"
                  value={targetBatchKg}
                  onChange={(e) => setTargetBatchKg(parseFloat(e.target.value) || 1.0)}
                  className="w-full accent-[#38BDF8] bg-[#0D0F12] h-2.5 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min="0.1"
                  max="120"
                  step="0.1"
                  value={targetBatchKg}
                  onChange={(e) => setTargetBatchKg(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                  className="w-24 bg-[#0D0F12] border-2 border-[#38BDF8]/50 text-[#38BDF8] text-sm font-bold font-mono px-3 py-1.5 rounded-xl text-center focus:outline-none"
                />
              </div>

              {/* Quick Multiplier Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] text-slate-400 ml-1">مضاعفات سريعة:</span>
                {[0.25, 0.5, 0.75, 1.5, 2.0, 3.0, 5.0, 10.0].map((factor) => (
                  <button
                    key={factor}
                    type="button"
                    onClick={() => applyMultiplier(factor)}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0D0F12] hover:bg-[#38BDF8]/20 hover:text-[#38BDF8] text-slate-300 border border-[#262B36] transition-all"
                  >
                    ×{factor}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Calculate Button */}
            <button
              onClick={handleCalculateWithGemini}
              disabled={isLoadingAi}
              className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-[#D97724] to-[#B45309] hover:from-[#E68A38] hover:to-[#C26114] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#D97724]/20 disabled:opacity-60 transition-all cursor-pointer"
            >
              {isLoadingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جارٍ الحساب والتحليل الثرموديناميكي عبر Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>حساب المعاملات وتعميق التحليل عبر Gemini 3.8 Flash</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Left Panel (Results): 7 cols on lg */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Key Adjusted Parameters Summary Card */}
          <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#262B36] pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  المعاملات الحرارية المعدلة للدفعة الجديدة ({plan.target.batchSizeKg} كجم)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-[#0D0F12] px-2.5 py-0.5 rounded border border-[#262B36]">
                معدل التحجيم: ×{plan.target.scaleRatio}
              </span>
            </div>

            {/* 4 Main KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* 1. Recommended Charge Temp */}
              <div className="bg-[#0D0F12] border border-[#262B36] rounded-xl p-3 flex flex-col gap-1 relative overflow-hidden">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#D97724]" />
                  <span>حرارة الشحن</span>
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-[#D97724]">
                    {plan.target.recommendedChargeTempC}°C
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded w-fit ${
                    plan.target.chargeTempDeltaC > 0
                      ? 'bg-amber-500/15 text-amber-300'
                      : plan.target.chargeTempDeltaC < 0
                      ? 'bg-sky-500/15 text-sky-300'
                      : 'bg-slate-700/30 text-slate-300'
                  }`}
                >
                  {plan.target.chargeTempDeltaC > 0 ? '+' : ''}
                  {plan.target.chargeTempDeltaC}°C عن المرجع
                </span>
              </div>

              {/* 2. Recommended Gas Scaling */}
              <div className="bg-[#0D0F12] border border-[#262B36] rounded-xl p-3 flex flex-col gap-1 relative overflow-hidden">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>مستوى الغاز الأساسي</span>
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-rose-400">
                    {plan.target.recommendedGasScalingPercent}%
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded w-fit">
                  المرجع: {plan.reference.gasBaselinePercent}%
                </span>
              </div>

              {/* 3. Recommended Airflow */}
              <div className="bg-[#0D0F12] border border-[#262B36] rounded-xl p-3 flex flex-col gap-1 relative overflow-hidden">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>تعديل الهواء</span>
                </span>
                <div className="text-xs font-bold text-[#38BDF8] line-clamp-2 mt-0.5 leading-snug">
                  {plan.target.recommendedAirflowSetting}
                </div>
                <span className="text-[10px] text-slate-400 mt-auto">
                  {plan.reference.airflowSetting}
                </span>
              </div>

              {/* 4. Drum Speed */}
              <div className="bg-[#0D0F12] border border-[#262B36] rounded-xl p-3 flex flex-col gap-1 relative overflow-hidden">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" />
                  <span>دوران الأسطوانة</span>
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black font-mono text-amber-400">
                    {plan.target.recommendedDrumSpeedRpm}
                  </span>
                  <span className="text-[10px] text-slate-400">RPM</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded w-fit">
                  {plan.target.drumSpeedDeltaRpm === 0
                    ? 'ثابت'
                    : `${plan.target.drumSpeedDeltaRpm > 0 ? '+' : ''}${plan.target.drumSpeedDeltaRpm} RPM`}
                </span>
              </div>
            </div>

            {/* Executive Action Summary Callout */}
            <div className="bg-[#0D0F12] border border-[#D97724]/40 rounded-xl p-4 text-xs text-slate-200 leading-relaxed flex items-start gap-3">
              <Info className="w-4 h-4 text-[#D97724] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#D97724] block mb-1">
                  الملخص التنفيذي لخطة التحجيم:
                </span>
                <p>{plan.thermodynamicAnalysis.actionSummary_ar}</p>
              </div>
            </div>
          </div>

          {/* Visual Simulated RoR Curve Overlay Chart */}
          <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#262B36] pb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-bold text-white">
                  محاكاة تطابق منحنى الـ RoR وحرارة البن (Simulated Curve Overlay)
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-[#38BDF8]">
                  <span className="w-3 h-0.5 bg-[#38BDF8] inline-block" />
                  المرجع ({plan.reference.batchSizeKg} كجم)
                </span>
                <span className="flex items-center gap-1 text-[#D97724]">
                  <span className="w-3 h-0.5 bg-[#D97724] inline-block" />
                  الدفعة المعدلة ({plan.target.batchSizeKg} كجم)
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={plan.simulatedRoRCurve} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262B36" />
                  <XAxis
                    dataKey="timeSec"
                    stroke="#64748B"
                    tickFormatter={(val) => {
                      const m = Math.floor(val / 60);
                      const s = val % 60;
                      return `${m}:${s < 10 ? '0' : ''}${s}`;
                    }}
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                  />
                  <YAxis
                    yAxisId="ror"
                    orientation="right"
                    domain={[0, 24]}
                    stroke="#38BDF8"
                    tick={{ fontSize: 11, fill: '#38BDF8' }}
                    label={{ value: 'RoR (°C/min)', angle: 90, position: 'insideRight', fill: '#38BDF8', fontSize: 10 }}
                  />
                  <YAxis
                    yAxisId="bt"
                    orientation="left"
                    domain={[80, 230]}
                    stroke="#D97724"
                    tick={{ fontSize: 11, fill: '#D97724' }}
                    label={{ value: 'حرارة البن (°C)', angle: -90, position: 'insideLeft', fill: '#D97724', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0D0F12', borderColor: '#262B36', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                    labelFormatter={(val) => {
                      const num = typeof val === 'number' ? val : Number(val) || 0;
                      return `الوقت: ${Math.floor(num / 60)}:${num % 60 < 10 ? '0' : ''}${num % 60}`;
                    }}
                  />
                  {/* RoR lines */}
                  <Line
                    yAxisId="ror"
                    type="monotone"
                    dataKey="referenceRoR"
                    name="RoR المرجعي"
                    stroke="#38BDF8"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="ror"
                    type="monotone"
                    dataKey="scaledRoR"
                    name="RoR المعدل"
                    stroke="#D97724"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  {/* BT lines */}
                  <Line
                    yAxisId="bt"
                    type="monotone"
                    dataKey="referenceBeanTemp"
                    name="حرارة البن المرجعية"
                    stroke="#38BDF8"
                    strokeWidth={1.5}
                    strokeOpacity={0.5}
                    dot={false}
                  />
                  <Line
                    yAxisId="bt"
                    type="monotone"
                    dataKey="scaledBeanTemp"
                    name="حرارة البن المعدلة"
                    stroke="#D97724"
                    strokeWidth={1.5}
                    strokeOpacity={0.6}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 text-center">
              * يوضح الرسم محاكاة الحفاظ على نفس انحدار معدل الارتفاع المتناقص (Smooth RoR Decline) عبر المعاملات المعدلة.
            </p>
          </div>

          {/* Phase-by-Phase Operational Playbook */}
          <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#262B36] pb-3">
              <Layers className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">
                خطة التشغيل خطوة بخطوة لكل مرحلة (Phase-by-Phase Guidance)
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              {plan.phaseByPhaseGuidance.map((phase, idx) => (
                <div
                  key={idx}
                  className="bg-[#0D0F12] border border-[#262B36] rounded-xl p-3.5 flex flex-col gap-2 transition-all hover:border-slate-600"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#D97724]/20 text-[#D97724] border border-[#D97724]/30 flex items-center justify-center text-[10px] font-mono font-bold">
                        {idx + 1}
                      </span>
                      <span>{phase.phase}</span>
                    </span>
                    <span className="text-[11px] font-mono text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded border border-[#38BDF8]/20">
                      الهدف الزمني: {phase.timingTarget}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div className="bg-[#161920] p-2.5 rounded-lg border border-[#262B36]/60">
                      <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1 mb-1">
                        <Flame className="w-3 h-3" />
                        <span>التحكم في الغاز / الطاقة:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{phase.gasAdjustment}</p>
                    </div>

                    <div className="bg-[#161920] p-2.5 rounded-lg border border-[#262B36]/60">
                      <span className="text-[11px] font-bold text-[#38BDF8] flex items-center gap-1 mb-1">
                        <Wind className="w-3 h-3" />
                        <span>التحكم في تدفق الهواء:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">{phase.airflowAdjustment}</p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic bg-[#161920]/40 px-2.5 py-1.5 rounded border border-dashed border-[#262B36]">
                    💡 الأثر الثرموديناميكي: {phase.thermodynamicNotes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Thermodynamic Analysis & Critical Safety Risks */}
          <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-[#262B36] pb-3">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                التحليل الفيزيائي والمخاطر الحرارية المحتملة
              </h3>
            </div>

            {/* Critical Risks List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-300">
                المخاطر الفيزيائية الواجب تفاديها في هذه الدفعة:
              </span>
              {plan.thermodynamicAnalysis.criticalRisks.map((risk, i) => (
                <div
                  key={i}
                  className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-2.5 text-xs text-amber-200 flex items-start gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{risk}</span>
                </div>
              ))}
            </div>

            {/* Scientific Rationale */}
            <div className="bg-[#0D0F12] border border-[#262B36] rounded-xl p-4 flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>التعليل العلمي الثرموديناميكي (Gemini Thermodynamic Rationale):</span>
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {plan.thermodynamicAnalysis.scientificRationale_ar}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
