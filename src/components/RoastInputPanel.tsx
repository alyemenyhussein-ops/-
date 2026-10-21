import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  X,
  Flame,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  Thermometer,
  Award,
  Coffee,
  Eye,
  Check,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  Wind,
  Gauge,
} from 'lucide-react';
import {
  BeanProfile,
  ManualTelemetry,
  ProcessingMethod,
  BrewTarget,
  SCACuppingScores,
  PostRoastAppearance,
  RoasterAirflowSettings,
  AirflowUnit,
} from '../types';
import {
  getAgtronClassification,
  evaluateRoastDelta,
  getProcessAgtronBenchmark,
  evaluateAgtronProcessConsistency,
} from '../utils/agtron';

interface RoastInputPanelProps {
  beanProfile: BeanProfile;
  setBeanProfile: React.Dispatch<React.SetStateAction<BeanProfile>>;
  telemetry: ManualTelemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<ManualTelemetry>>;
  sensoryDefect: string;
  setSensoryDefect: (val: string) => void;
  cuppingScores: SCACuppingScores;
  setCuppingScores: React.Dispatch<React.SetStateAction<SCACuppingScores>>;
  appearance: PostRoastAppearance;
  setAppearance: React.Dispatch<React.SetStateAction<PostRoastAppearance>>;
  notes: string;
  setNotes: (val: string) => void;
  imageFile: { data: string; mimeType: string } | null;
  setImageFile: (img: { data: string; mimeType: string } | null) => void;
  onSubmit: (useSimulatedIfPreset?: boolean) => void;
  onReset: () => void;
  isLoading: boolean;
  selectedPresetId?: string;
}

export const RoastInputPanel: React.FC<RoastInputPanelProps> = ({
  beanProfile,
  setBeanProfile,
  telemetry,
  setTelemetry,
  sensoryDefect,
  setSensoryDefect,
  cuppingScores,
  setCuppingScores,
  appearance,
  setAppearance,
  notes,
  setNotes,
  imageFile,
  setImageFile,
  onSubmit,
  onReset,
  isLoading,
  selectedPresetId,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);
  const [showTelemetryDetails, setShowTelemetryDetails] = useState(true);
  const [showAirflowDetails, setShowAirflowDetails] = useState(true);
  const [cuppingSubTab, setCuppingSubTab] = useState<'attributes' | 'cups_defects' | 'wheel'>('attributes');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentAirflow: RoasterAirflowSettings = telemetry.airflow || {
    unit: 'PERCENT',
    chargeAirflow: 30,
    dryingAirflow: 50,
    maillardAirflow: 65,
    firstCrackAirflow: 80,
    chaffEvacuationRating: 'OPTIMAL',
    notes: '',
  };

  const handleAirflowParamChange = (field: keyof RoasterAirflowSettings, val: any) => {
    setTelemetry((prev) => ({
      ...prev,
      airflow: {
        ...(prev.airflow || currentAirflow),
        [field]: val,
      },
    }));
  };

  const handleAirflowUnitChange = (unit: AirflowUnit) => {
    const isStep = unit === 'STEP';
    setTelemetry((prev) => ({
      ...prev,
      airflow: {
        ...(prev.airflow || currentAirflow),
        unit,
        chargeAirflow: isStep ? 3 : 30,
        dryingAirflow: isStep ? 5 : 50,
        maillardAirflow: isStep ? 6.5 : 65,
        firstCrackAirflow: isStep ? 8 : 80,
      },
    }));
  };

  const FLAVOR_WHEEL_OPTIONS = [
    { category: 'زهري (Floral)', items: ['ياسمين', 'زهر البرتقال', 'ورد جوري', 'شاي أخضر'] },
    { category: 'فواكه (Fruity)', items: ['توت أزرق', 'فراولة', 'خوخ ومشمش', 'كرز أحمر', 'تفاح أخضر', 'مانجو'] },
    { category: 'حمضيات (Citrus)', items: ['برتقال حلو', 'ليمون أصفر', 'جريب فروت', 'برغموت'] },
    { category: 'سكريات وكراميل (Sweet)', items: ['كراميل ناعم', 'عسل طبيعي', 'سكر بني', 'فانيليا', 'دبس'] },
    { category: 'شوكولاتة ومكسرات (Nutty/Cocoa)', items: ['شوكولاتة داكنة', 'كاكاو خام', 'لوز محمص', 'بندق'] },
    { category: 'توابل وتخمير (Spices/Ferment)', items: ['قرفة', 'هيل', 'تخمير فاكهي نبيذي', 'قرنفل'] },
  ];

  const processOptions: { id: ProcessingMethod; label: string; desc: string }[] = [
    { id: 'WASHED', label: 'مغسول (Washed)', desc: 'بنية صلبة تتحمل حرارة موحدة وتتطلب تطويراً حرارياً عميقاً' },
    { id: 'NATURAL', label: 'مجفف (Natural)', desc: 'سكريات سطحية تتطلب حرارة دخول أقل بـ 5-10°C لمنع الاحتراق' },
    { id: 'ANAEROBIC', label: 'لاهوائي (Anaerobic)', desc: 'حساسية قصوى؛ سقف RoR منخفض 14-16°C/min مع حرارة خروج مبكرة' },
    { id: 'HONEY', label: 'عسلي (Honey)', desc: 'طبقة هلامية متبقية تحتاج توازناً دقيقاً بين الحمل والتوصيل' },
  ];

  const brewOptions: { id: BrewTarget; label: string; rule: string }[] = [
    { id: 'FILTER', label: 'فلتر / مقطر (Filter)', rule: 'DTR 12-18% | Delta-T 6-10°C | Agtron 80-95' },
    { id: 'ESPRESSO', label: 'إسبريسو (Espresso)', rule: 'DTR 18-24% | Delta-T 10-16°C | Agtron 55-70' },
    { id: 'OMNI', label: 'تحميص شامل (Omni)', rule: 'DTR 16-19% | Delta-T 9-12°C | Agtron 68-78' },
  ];

  const sensoryOptions = [
    {
      id: 'طعم مخبوز Baked',
      title: 'طعم مخبوز (Baked)',
      sub: 'تسطح بالنكهات، خبز شوفاني باهت، انهيار الحلاوة والـ RoR',
      color: '#F59E0B',
    },
    {
      id: 'حمضية حادة/عشبي Underdeveloped',
      title: 'غير متطور / قلب نيء (Underdeveloped)',
      sub: 'حمضية عشبية لاذعة وفول سوداني، جفاف فموي',
      color: '#10B981',
    },
    {
      id: 'جفاف قابض Astringency',
      title: 'جفاف قابض (Astringency)',
      sub: 'خشونة بمؤخرة اللسان ناتجة عن قفزة RoR Flick في مرحلة التطور',
      color: '#A855F7',
    },
    {
      id: 'مرارة دخانية Roasty/Ashy',
      title: 'مرارة رمادية دخانية (Roasty/Ashy)',
      sub: 'طعم كربوني حاد، خنق سحب الهواء أو تحميص متأخر',
      color: '#EF4444',
    },
    {
      id: 'احتراق أطراف Scorching/Tipping',
      title: 'احتراق أطراف أو بقع (Tipping/Scorching)',
      sub: 'بقع سوداء على الحواف، صدمة حرارة دخول مفرطة',
      color: '#D97724',
    },
    {
      id: 'كوب متزن - فحص روتيني للمنحنى',
      title: 'كوب متزن وخالٍ من العيوب',
      sub: 'تطابق متوازن ونكهات منشئية ساطعة',
      color: '#38BDF8',
    },
  ];

  const visualDefectOptions = [
    { id: 'TIPPING', label: 'احتراق طرف البذرة (Tipping)', desc: 'طرف محترق بسبب RoR ابتدائي عنيف أو حرارة توصيل مباشرة' },
    { id: 'SCORCHING', label: 'بقع حرق مسطحة (Scorching)', desc: 'بقع سوداء نتيجة ملامسة الطبلة الساخنة جداً أو سرعة دوران بطيئة' },
    { id: 'FACING', label: 'حرق وجه الحبة (Facing)', desc: 'حرق على الجانب المسطح للحبة' },
    { id: 'QUAKERS', label: 'حبوب كويكرز باهتة (Quakers)', desc: 'حبوب شاحبة خالية من السكريات ناتجة عن قطاف ثمار غير ناضجة' },
    { id: 'CHIPPING', label: 'تشظي وتكسر الحواف (Chipping)', desc: 'تكسر حواف البن نتيجة ضغط بخار داخلي شديد وقسوة حرارية' },
  ];

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const base64Data = result.split(',')[1];
      setImageFile({
        data: base64Data,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const parseMmSsToSec = (mmss: string) => {
    if (!mmss || !mmss.includes(':')) return 0;
    const [m, s] = mmss.split(':').map(Number);
    return (m || 0) * 60 + (s || 0);
  };

  const totalSec = parseMmSsToSec(telemetry.dropTime);
  const fcSec = parseMmSsToSec(telemetry.firstCrackTime);
  const devSec = totalSec > fcSec ? totalSec - fcSec : 0;
  const calculatedDtr = totalSec > 0 && devSec > 0 ? ((devSec / totalSec) * 100).toFixed(1) : '0';
  const calculatedDeltaT =
    telemetry.dropTempC !== '' && telemetry.firstCrackTempC !== ''
      ? (Number(telemetry.dropTempC) - Number(telemetry.firstCrackTempC)).toFixed(1)
      : '0';

  // Live calculation of SCA Cupping Score
  const liveSCATotal = Number(
    (
      (cuppingScores.fragrance_aroma || 0) +
      (cuppingScores.flavor || 0) +
      (cuppingScores.aftertaste || 0) +
      (cuppingScores.acidity || 0) +
      (cuppingScores.body || 0) +
      (cuppingScores.balance || 0) +
      (cuppingScores.uniformity || 0) +
      (cuppingScores.clean_cup || 0) +
      (cuppingScores.sweetness || 0) +
      (cuppingScores.overall || 0) -
      (cuppingScores.defects_points || 0)
    ).toFixed(2)
  );

  const getSCAGrade = (score: number) => {
    if (score >= 90) return { title: 'مختصة فائقة (Outstanding)', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
    if (score >= 85) return { title: 'مختصة ممتازة (Excellent)', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
    if (score >= 80) return { title: 'مختصة جيدة جداً (Very Good)', color: 'text-sky-400 bg-sky-500/20 border-sky-500/40' };
    return { title: 'تجارية / دون المختصة (Commercial)', color: 'text-rose-400 bg-rose-500/20 border-rose-500/40' };
  };

  const scaGrade = getSCAGrade(liveSCATotal);

  const updateCuppingScore = (field: keyof SCACuppingScores, val: any) => {
    setCuppingScores((prev) => {
      const updated = { ...prev, [field]: val };
      const newTotal = Number(
        (
          (field === 'fragrance_aroma' ? val : prev.fragrance_aroma || 0) +
          (field === 'flavor' ? val : prev.flavor || 0) +
          (field === 'aftertaste' ? val : prev.aftertaste || 0) +
          (field === 'acidity' ? val : prev.acidity || 0) +
          (field === 'body' ? val : prev.body || 0) +
          (field === 'balance' ? val : prev.balance || 0) +
          (field === 'uniformity' ? val : prev.uniformity || 0) +
          (field === 'clean_cup' ? val : prev.clean_cup || 0) +
          (field === 'sweetness' ? val : prev.sweetness || 0) +
          (field === 'overall' ? val : prev.overall || 0) -
          (field === 'defects_points' ? val : prev.defects_points || 0)
        ).toFixed(2)
      );
      updated.total_score = newTotal;
      return updated;
    });
  };

  const toggleFlavorNote = (note: string) => {
    setCuppingScores((prev) => {
      const exists = prev.flavor_notes?.includes(note);
      const newNotes = exists
        ? prev.flavor_notes.filter((n) => n !== note)
        : [...(prev.flavor_notes || []), note];
      return { ...prev, flavor_notes: newNotes };
    });
  };

  const toggleVisualDefect = (defectId: string) => {
    setAppearance((prev) => {
      const exists = prev.visual_defects?.includes(defectId);
      const updated = exists
        ? prev.visual_defects.filter((d) => d !== defectId)
        : [...(prev.visual_defects || []), defectId];
      return { ...prev, visual_defects: updated };
    });
  };

  // Agtron calculations
  const wholeAgtronNum = Number(appearance.whole_bean_agtron) || 0;
  const groundAgtronNum = Number(appearance.ground_agtron) || 0;
  const wholeClassification = wholeAgtronNum > 0 ? getAgtronClassification(wholeAgtronNum, appearance.agtron_scale) : null;
  const groundClassification = groundAgtronNum > 0 ? getAgtronClassification(groundAgtronNum, appearance.agtron_scale) : null;
  const deltaAssessment =
    wholeAgtronNum > 0 && groundAgtronNum > 0
      ? evaluateRoastDelta(wholeAgtronNum, groundAgtronNum)
      : null;

  const processBenchmark = getProcessAgtronBenchmark(beanProfile.process, beanProfile.targetBrew);
  const processConsistency =
    wholeAgtronNum > 0 && groundAgtronNum > 0
      ? evaluateAgtronProcessConsistency(
          wholeAgtronNum,
          groundAgtronNum,
          beanProfile.process,
          beanProfile.targetBrew
        )
      : null;

  return (
    <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl flex flex-col gap-5">
      {/* 4-Step Tabs Header */}
      <div className="flex items-center justify-between border-b border-[#262B36] pb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeStep === 1
                ? 'bg-[#D97724] text-white shadow-md shadow-[#D97724]/20'
                : 'text-slate-400 hover:text-white bg-[#0D0F12]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center font-mono text-[10px]">
              1
            </span>
            <span>البن الأخضر</span>
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeStep === 2
                ? 'bg-[#D97724] text-white shadow-md shadow-[#D97724]/20'
                : 'text-slate-400 hover:text-white bg-[#0D0F12]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center font-mono text-[10px]">
              2
            </span>
            <span>المنحنى والحرارة</span>
            {imageFile && (
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveStep(3)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeStep === 3
                ? 'bg-[#D97724] text-white shadow-md shadow-[#D97724]/20'
                : 'text-slate-400 hover:text-white bg-[#0D0F12]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center font-mono text-[10px]">
              3
            </span>
            <span>تذوق SCA</span>
            {liveSCATotal > 0 && (
              <span className="text-[10px] font-mono bg-black/30 text-amber-300 px-1 rounded">
                {liveSCATotal}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveStep(4)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              activeStep === 4
                ? 'bg-[#D97724] text-white shadow-md shadow-[#D97724]/20'
                : 'text-slate-400 hover:text-white bg-[#0D0F12]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center font-mono text-[10px]">
              4
            </span>
            <span>اللون و مظهر</span>
            {wholeAgtronNum > 0 && (
              <span
                className="w-2.5 h-2.5 rounded-full border border-white/40"
                style={{ backgroundColor: wholeClassification?.hex_color || '#874F20' }}
              />
            )}
          </button>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-rose-400 transition flex items-center gap-1 px-2 py-1 rounded hover:bg-[#0D0F12] shrink-0"
          title="تصفير وتفريغ النموذج بالكامل"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تصفير</span>
        </button>
      </div>

      {/* STEP 1: Green Coffee Attributes */}
      {activeStep === 1 && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              مصدر ونوع البن:
            </label>
            <input
              type="text"
              value={beanProfile.name}
              onChange={(e) =>
                setBeanProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="مثال: يمن حراز مجفف عالي الكثافة، كولومبيا غيشا لاهوائي..."
              className="w-full bg-[#0D0F12] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D97724] transition"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              طريقة المعالجة (تحدد حساسية السكريات وحرارة الدخول):
            </label>
            <div className="grid grid-cols-2 gap-2">
              {processOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setBeanProfile((prev) => ({ ...prev, process: opt.id }))
                  }
                  className={`p-2.5 rounded-xl border text-right transition flex flex-col gap-1 ${
                    beanProfile.process === opt.id
                      ? 'bg-[#D97724]/15 border-[#D97724] text-white shadow-sm'
                      : 'bg-[#0D0F12] border-[#262B36] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200">
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                الكثافة الحجمية (Density):
              </label>
              <div className="flex items-center bg-[#0D0F12] border border-[#262B36] rounded-xl px-3 py-2">
                <input
                  type="number"
                  placeholder="820"
                  value={beanProfile.density_g_l}
                  onChange={(e) =>
                    setBeanProfile((prev) => ({
                      ...prev,
                      density_g_l: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                />
                <span className="text-[11px] font-mono text-slate-400">g/L</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                نسبة الرطوبة (Moisture):
              </label>
              <div className="flex items-center bg-[#0D0F12] border border-[#262B36] rounded-xl px-3 py-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder="10.8"
                  value={beanProfile.moisture_pct}
                  onChange={(e) =>
                    setBeanProfile((prev) => ({
                      ...prev,
                      moisture_pct: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                />
                <span className="text-[11px] font-mono text-slate-400">%</span>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              الاستخدام المستهدف (Target Brew Profile):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {brewOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    setBeanProfile((prev) => ({ ...prev, targetBrew: opt.id }))
                  }
                  className={`p-2 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    beanProfile.targetBrew === opt.id
                      ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-white shadow-sm'
                      : 'bg-[#0D0F12] border-[#262B36] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xs font-bold text-slate-200">
                    {opt.label}
                  </span>
                  <span className="text-[9px] text-[#38BDF8] font-mono">
                    {opt.rule}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              نوع الحمّاصة وسعة الطبل (Roaster Drum Type):
            </label>
            <input
              type="text"
              value={beanProfile.roasterType}
              onChange={(e) =>
                setBeanProfile((prev) => ({ ...prev, roasterType: e.target.value }))
              }
              placeholder="مثال: Giesen W6A, Diedrich IR-5, Probat UG15, Aillio Bullet..."
              className="w-full bg-[#0D0F12] border border-[#262B36] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D97724] transition"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="w-full py-2.5 rounded-xl bg-[#D97724] hover:bg-[#c4681c] text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>متابعة إلى خطوة المنحنى والحرارة</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Curve Image & Telemetry */}
      {activeStep === 2 && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              لقطة شاشة المنحنى الحراري (Roast Curve Screenshot):
            </label>
            {imageFile ? (
              <div className="relative rounded-xl border border-[#D97724]/50 overflow-hidden bg-[#0D0F12] p-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-black overflow-hidden flex items-center justify-center border border-[#262B36]">
                    <img
                      src={`data:${imageFile.mimeType};base64,${imageFile.data}`}
                      alt="Roast Curve"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      تم إرفاق صورة المنحنى
                    </span>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      جاهزة لتحليل Gemini البصري
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setImageFile(null)}
                  className="p-1.5 rounded-lg bg-[#161920] text-slate-400 hover:text-rose-400 border border-[#262B36]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleImageUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#262B36] hover:border-[#A855F7] rounded-xl p-4 text-center cursor-pointer transition bg-[#0D0F12]/60 hover:bg-[#0D0F12] group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(e.target.files[0]);
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-10 h-10 mx-auto rounded-full bg-[#161920] border border-[#262B36] group-hover:border-[#A855F7] flex items-center justify-center mb-2 transition">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-[#A855F7]" />
                </div>
                <p className="text-xs font-medium text-slate-200">
                  اسحب وأفلت لقطة شاشة المنحنى أو اضغط للاختيار
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  يدعم صور كروپستر، أرتيزان، كافالو، روست تايم (PNG, JPG, WebP)
                </p>
              </div>
            )}
          </div>

          {/* Collapsible Telemetry Section */}
          <div className="border border-[#262B36] rounded-xl bg-[#0D0F12] overflow-hidden">
            <button
              onClick={() => setShowTelemetryDetails(!showTelemetryDetails)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-[#161920] transition"
            >
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-[#D97724]" />
                <span>القياسات الرقمية للمسار الحراري (Telemetry)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#38BDF8]">
                  DTR: {calculatedDtr}% | ΔT: {calculatedDeltaT}°C
                </span>
                {showTelemetryDetails ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {showTelemetryDetails && (
              <div className="p-3.5 border-t border-[#262B36] flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      حرارة الإسقاط (Charge Temp):
                    </label>
                    <div className="flex items-center bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5">
                      <input
                        type="number"
                        placeholder="200"
                        value={telemetry.chargeTempC}
                        onChange={(e) =>
                          setTelemetry((prev) => ({
                            ...prev,
                            chargeTempC: e.target.value === '' ? '' : Number(e.target.value),
                          }))
                        }
                        className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                      />
                      <span className="text-[11px] font-mono text-slate-400">°C</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      نقطة التحول (Turning Point):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center bg-[#161920] border border-[#262B36] rounded-lg px-2 py-1.5 flex-1">
                        <input
                          type="number"
                          placeholder="92"
                          value={telemetry.turningPointTempC}
                          onChange={(e) =>
                            setTelemetry((prev) => ({
                              ...prev,
                              turningPointTempC: e.target.value === '' ? '' : Number(e.target.value),
                            }))
                          }
                          className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                        />
                        <span className="text-[10px] font-mono text-slate-400">°C</span>
                      </div>
                      <input
                        type="text"
                        placeholder="01:15"
                        value={telemetry.turningPointTime}
                        onChange={(e) =>
                          setTelemetry((prev) => ({ ...prev, turningPointTime: e.target.value }))
                        }
                        className="w-16 bg-[#161920] border border-[#262B36] rounded-lg px-2 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      الاصفرار / التجفيف (Yellowing):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="04:30"
                        value={telemetry.yellowingTime}
                        onChange={(e) =>
                          setTelemetry((prev) => ({ ...prev, yellowingTime: e.target.value }))
                        }
                        className="w-16 bg-[#161920] border border-[#262B36] rounded-lg px-2 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                      />
                      <div className="flex items-center bg-[#161920] border border-[#262B36] rounded-lg px-2 py-1.5 flex-1">
                        <input
                          type="number"
                          placeholder="150"
                          value={telemetry.yellowingTempC}
                          onChange={(e) =>
                            setTelemetry((prev) => ({
                              ...prev,
                              yellowingTempC: e.target.value === '' ? '' : Number(e.target.value),
                            }))
                          }
                          className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                        />
                        <span className="text-[10px] font-mono text-slate-400">°C</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">
                      القرقعة الأولى (First Crack):
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        placeholder="08:20"
                        value={telemetry.firstCrackTime}
                        onChange={(e) =>
                          setTelemetry((prev) => ({ ...prev, firstCrackTime: e.target.value }))
                        }
                        className="w-16 bg-[#161920] border border-[#262B36] rounded-lg px-2 py-1.5 text-xs font-mono text-center text-white focus:outline-none"
                      />
                      <div className="flex items-center bg-[#161920] border border-[#262B36] rounded-lg px-2 py-1.5 flex-1">
                        <input
                          type="number"
                          placeholder="195"
                          value={telemetry.firstCrackTempC}
                          onChange={(e) =>
                            setTelemetry((prev) => ({
                              ...prev,
                              firstCrackTempC: e.target.value === '' ? '' : Number(e.target.value),
                            }))
                          }
                          className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                        />
                        <span className="text-[10px] font-mono text-slate-400">°C</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    التفريغ النهائي (Drop):
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5">
                      <span className="text-[10px] text-slate-400 ml-2">الوقت:</span>
                      <input
                        type="text"
                        placeholder="10:15"
                        value={telemetry.dropTime}
                        onChange={(e) =>
                          setTelemetry((prev) => ({ ...prev, dropTime: e.target.value }))
                        }
                        className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-left"
                      />
                    </div>
                    <div className="flex-1 flex items-center bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5">
                      <span className="text-[10px] text-slate-400 ml-2">الحرارة:</span>
                      <input
                        type="number"
                        placeholder="204"
                        value={telemetry.dropTempC}
                        onChange={(e) =>
                          setTelemetry((prev) => ({
                            ...prev,
                            dropTempC: e.target.value === '' ? '' : Number(e.target.value),
                          }))
                        }
                        className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none text-left"
                      />
                      <span className="text-[10px] font-mono text-slate-400 mr-1">°C</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Airflow & Roaster Fan Settings Section */}
          <div className="border border-[#262B36] rounded-xl bg-[#0D0F12] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAirflowDetails(!showAirflowDetails)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-[#161920] transition"
            >
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30">
                  <Wind className="w-4 h-4 text-[#38BDF8]" />
                </span>
                <span>إعدادات تدفق الهواء ومروحة الحمّاصة (Airflow & Roaster Fan)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/30">
                  {currentAirflow.unit === 'PERCENT'
                    ? `${currentAirflow.chargeAirflow}% ➔ ${currentAirflow.firstCrackAirflow}%`
                    : currentAirflow.unit === 'PASCAL'
                    ? `${currentAirflow.chargeAirflow}Pa ➔ ${currentAirflow.firstCrackAirflow}Pa`
                    : `صمام ${currentAirflow.chargeAirflow} ➔ ${currentAirflow.firstCrackAirflow}`}
                </span>
                {showAirflowDetails ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </button>

            {showAirflowDetails && (
              <div className="p-3.5 border-t border-[#262B36] flex flex-col gap-3.5">
                {/* Airflow Unit Selector */}
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1.5 font-bold">
                    نظام وحدة قياس صمام وتدفق هواء الحمّاصة:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'PERCENT' as const, label: 'نسبة مئوية % (0-100)', desc: 'لورينغ / جيسن / Aillio' },
                      { id: 'STEP' as const, label: 'صمام مدرج (Notches 1-10)', desc: 'بروبات / ميل سيتي / ديدريش' },
                      { id: 'PASCAL' as const, label: 'ضغط تفاضلي Pa / mbar', desc: 'مقياس مانوميتر Magnehelic' },
                      { id: 'RPM' as const, label: 'سرعة دوران RPM / Hz', desc: 'محولات تردد VFD' },
                    ].map((unitOpt) => (
                      <button
                        key={unitOpt.id}
                        type="button"
                        onClick={() => handleAirflowUnitChange(unitOpt.id)}
                        className={`p-2 rounded-lg border text-right transition flex flex-col gap-0.5 ${
                          currentAirflow.unit === unitOpt.id
                            ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-white shadow-sm'
                            : 'bg-[#161920] border-[#262B36] text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold">{unitOpt.label}</span>
                        <span className="text-[9px] text-slate-500">{unitOpt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4 Stages Airflow Inputs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Charge / TP Airflow */}
                  <div className="bg-[#161920] p-2.5 rounded-xl border border-[#262B36] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-300 font-bold">هواء الإسقاط (Charge)</span>
                      <span className="text-[9px] text-[#D97724] font-mono">نقطة التحول</span>
                    </div>
                    <div className="flex items-center bg-[#0D0F12] border border-[#262B36] rounded-lg px-2 py-1">
                      <input
                        type="number"
                        placeholder="30"
                        value={currentAirflow.chargeAirflow}
                        onChange={(e) => handleAirflowParamChange('chargeAirflow', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400">
                        {currentAirflow.unit === 'PERCENT' ? '%' : currentAirflow.unit === 'PASCAL' ? 'Pa' : 'درجة'}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 leading-tight">منخفض لتجنب هبوط حرارة البيئة</span>
                  </div>

                  {/* Drying Airflow */}
                  <div className="bg-[#161920] p-2.5 rounded-xl border border-[#262B36] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-300 font-bold">هواء التجفيف (Drying)</span>
                      <span className="text-[9px] text-amber-400 font-mono">طرد البخار</span>
                    </div>
                    <div className="flex items-center bg-[#0D0F12] border border-[#262B36] rounded-lg px-2 py-1">
                      <input
                        type="number"
                        placeholder="50"
                        value={currentAirflow.dryingAirflow}
                        onChange={(e) => handleAirflowParamChange('dryingAirflow', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400">
                        {currentAirflow.unit === 'PERCENT' ? '%' : currentAirflow.unit === 'PASCAL' ? 'Pa' : 'درجة'}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 leading-tight">سحب رطوبة وبخار الماء الكثيف</span>
                  </div>

                  {/* Maillard Airflow */}
                  <div className="bg-[#161920] p-2.5 rounded-xl border border-[#262B36] flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-300 font-bold">هواء مايلارد (Maillard)</span>
                      <span className="text-[9px] text-[#D97724] font-mono">تطوير النكهة</span>
                    </div>
                    <div className="flex items-center bg-[#0D0F12] border border-[#262B36] rounded-lg px-2 py-1">
                      <input
                        type="number"
                        placeholder="65"
                        value={currentAirflow.maillardAirflow}
                        onChange={(e) => handleAirflowParamChange('maillardAirflow', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-slate-400">
                        {currentAirflow.unit === 'PERCENT' ? '%' : currentAirflow.unit === 'PASCAL' ? 'Pa' : 'درجة'}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 leading-tight">توازن الحمل الحراري المتجانس</span>
                  </div>

                  {/* First Crack / Development Airflow */}
                  <div className="bg-[#161920] p-2.5 rounded-xl border border-sky-500/30 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-sky-300 font-bold">هواء القرقعة (FC/Dev)</span>
                      <span className="text-[9px] text-[#38BDF8] font-mono">حرج لمنع Crash</span>
                    </div>
                    <div className="flex items-center bg-[#0D0F12] border border-[#262B36] rounded-lg px-2 py-1">
                      <input
                        type="number"
                        placeholder="80"
                        value={currentAirflow.firstCrackAirflow}
                        onChange={(e) => handleAirflowParamChange('firstCrackAirflow', e.target.value)}
                        className="w-full bg-transparent text-xs font-mono font-bold text-[#38BDF8] focus:outline-none"
                      />
                      <span className="text-[10px] font-mono text-[#38BDF8]">
                        {currentAirflow.unit === 'PERCENT' ? '%' : currentAirflow.unit === 'PASCAL' ? 'Pa' : 'درجة'}
                      </span>
                    </div>
                    <span className="text-[9px] text-sky-400 leading-tight">سحب عادم الدخان وقشور Chaff</span>
                  </div>
                </div>

                {/* Chaff & Smoke Clearance Rating */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                      كفاءة سحب القشور وتصريف الدخان (Chaff & Smoke Clearance):
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'OPTIMAL' as const, label: 'ممتاز / سحب تام', color: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' },
                        { id: 'MODERATE' as const, label: 'متوسط / خفيف', color: 'border-amber-500/40 text-amber-300 bg-amber-500/10' },
                        { id: 'POOR' as const, label: 'ضعيف / تراكم دخان', color: 'border-rose-500/40 text-rose-300 bg-rose-500/10' },
                      ].map((rating) => (
                        <button
                          key={rating.id}
                          type="button"
                          onClick={() => handleAirflowParamChange('chaffEvacuationRating', rating.id)}
                          className={`py-1.5 px-2 rounded-lg border text-center text-[10px] font-bold transition ${
                            (currentAirflow.chaffEvacuationRating || 'OPTIMAL') === rating.id
                              ? rating.color
                              : 'bg-[#161920] border-[#262B36] text-slate-400 hover:text-white'
                          }`}
                        >
                          {rating.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-bold">
                      ملاحظات حركة الهواء وصمام المروحة:
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: زيادة تدفق الهواء بنسبة 15% قبل القرقعة بـ 30 ثانية..."
                      value={currentAirflow.notes || ''}
                      onChange={(e) => handleAirflowParamChange('notes', e.target.value)}
                      className="w-full bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="py-2.5 px-4 rounded-xl bg-[#0D0F12] border border-[#262B36] text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="flex-1 py-2.5 rounded-xl bg-[#D97724] hover:bg-[#c4681c] text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>متابعة إلى تذوق SCA الحسي</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Complete SCA Cupping Standards */}
      {activeStep === 3 && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* SCA Header Score Card */}
          <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">
                  تقييم استمارة SCA الرسمية للقهوة المختصة
                </span>
                <span className="text-[10px] text-slate-400">
                  معايرة المعايير الـ 10 وعيوب التذوق من 100 نقطة
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <span className={`text-xs px-2.5 py-1 rounded-lg border font-bold ${scaGrade.color}`}>
                {scaGrade.title}
              </span>
              <div className="bg-[#161920] px-2.5 py-1 rounded-lg border border-[#262B36] text-amber-300 font-black text-sm">
                {liveSCATotal}
              </div>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="grid grid-cols-3 gap-1 bg-[#0D0F12] p-1 rounded-xl border border-[#262B36]">
            <button
              type="button"
              onClick={() => setCuppingSubTab('attributes')}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                cuppingSubTab === 'attributes'
                  ? 'bg-[#161920] text-amber-300 border border-[#262B36]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الخصائص الـ 6 الرئيسية
            </button>
            <button
              type="button"
              onClick={() => setCuppingSubTab('cups_defects')}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                cuppingSubTab === 'cups_defects'
                  ? 'bg-[#161920] text-amber-300 border border-[#262B36]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الأكواب والعيوب (Defects)
            </button>
            <button
              type="button"
              onClick={() => setCuppingSubTab('wheel')}
              className={`py-1.5 text-xs font-bold rounded-lg transition ${
                cuppingSubTab === 'wheel'
                  ? 'bg-[#161920] text-amber-300 border border-[#262B36]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              عجلة النكهات وعيوب الطعم
            </button>
          </div>

          {cuppingSubTab === 'attributes' && (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {/* Fragrance / Aroma */}
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">
                    1. العطرية والرائحة (Fragrance / Aroma):
                  </span>
                  <span className="text-xs font-mono text-[#D97724] font-bold">
                    {cuppingScores.fragrance_aroma || 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="6.00"
                  max="10.00"
                  step="0.25"
                  value={cuppingScores.fragrance_aroma || 6}
                  onChange={(e) => updateCuppingScore('fragrance_aroma', Number(e.target.value))}
                  className="w-full accent-[#D97724] cursor-pointer"
                />
              </div>

              {/* Flavor */}
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">
                    2. النكهة (Flavor):
                  </span>
                  <span className="text-xs font-mono text-[#D97724] font-bold">
                    {cuppingScores.flavor || 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="6.00"
                  max="10.00"
                  step="0.25"
                  value={cuppingScores.flavor || 6}
                  onChange={(e) => updateCuppingScore('flavor', Number(e.target.value))}
                  className="w-full accent-[#D97724] cursor-pointer"
                />
              </div>

              {/* Aftertaste */}
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">
                    3. المذاق اللاحق المتبقي (Aftertaste):
                  </span>
                  <span className="text-xs font-mono text-[#D97724] font-bold">
                    {cuppingScores.aftertaste || 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="6.00"
                  max="10.00"
                  step="0.25"
                  value={cuppingScores.aftertaste || 6}
                  onChange={(e) => updateCuppingScore('aftertaste', Number(e.target.value))}
                  className="w-full accent-[#D97724] cursor-pointer"
                />
              </div>

              {/* Acidity */}
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    4. الحمضية وجودتها (Acidity):
                  </span>
                  <span className="text-xs font-mono text-[#38BDF8] font-bold">
                    {cuppingScores.acidity || 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="6.00"
                  max="10.00"
                  step="0.25"
                  value={cuppingScores.acidity || 6}
                  onChange={(e) => updateCuppingScore('acidity', Number(e.target.value))}
                  className="w-full accent-[#38BDF8] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#262B36]">
                  <span className="text-slate-400">شدة الحمضية:</span>
                  <div className="flex items-center gap-1 font-mono">
                    {(['LOW', 'MEDIUM', 'HIGH'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => updateCuppingScore('acidity_intensity', lvl)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cuppingScores.acidity_intensity === lvl
                            ? 'bg-[#38BDF8] text-black'
                            : 'bg-[#161920] text-slate-400 border border-[#262B36]'
                        }`}
                      >
                        {lvl === 'LOW' ? 'منخفضة' : lvl === 'MEDIUM' ? 'متوسطة' : 'عالية'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    5. القوام والملمس الفموي (Body):
                  </span>
                  <span className="text-xs font-mono text-[#38BDF8] font-bold">
                    {cuppingScores.body || 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="6.00"
                  max="10.00"
                  step="0.25"
                  value={cuppingScores.body || 6}
                  onChange={(e) => updateCuppingScore('body', Number(e.target.value))}
                  className="w-full accent-[#38BDF8] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#262B36]">
                  <span className="text-slate-400">مستوى القوام:</span>
                  <div className="flex items-center gap-1 font-mono">
                    {(['LIGHT', 'MEDIUM', 'HEAVY'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => updateCuppingScore('body_level', lvl)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          cuppingScores.body_level === lvl
                            ? 'bg-[#38BDF8] text-black'
                            : 'bg-[#161920] text-slate-400 border border-[#262B36]'
                        }`}
                      >
                        {lvl === 'LIGHT' ? 'خفيف' : lvl === 'MEDIUM' ? 'متوسط' : 'ممتلئ ثقيل'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Balance */}
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">
                    6. الاتزان والتوافق (Balance):
                  </span>
                  <span className="text-xs font-mono text-[#A855F7] font-bold">
                    {cuppingScores.balance || 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="6.00"
                  max="10.00"
                  step="0.25"
                  value={cuppingScores.balance || 6}
                  onChange={(e) => updateCuppingScore('balance', Number(e.target.value))}
                  className="w-full accent-[#A855F7] cursor-pointer"
                />
              </div>

              {/* Overall */}
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">
                    10. التقييم الإجمالي العام (Overall):
                  </span>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {cuppingScores.overall || 0} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="6.00"
                  max="10.00"
                  step="0.25"
                  value={cuppingScores.overall || 6}
                  onChange={(e) => updateCuppingScore('overall', Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {cuppingSubTab === 'cups_defects' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Sweetness 5 cups */}
              <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    7. الحلاوة (Sweetness):
                  </span>
                  <span className="text-[10px] text-slate-400">
                    نظافة السكر وتكرمله عبر الأكواب الـ 5
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  {[10, 8, 6, 4, 2, 0].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => updateCuppingScore('sweetness', score)}
                      className={`px-2 py-1 rounded text-[11px] font-bold ${
                        cuppingScores.sweetness === score
                          ? 'bg-amber-500 text-black'
                          : 'bg-[#161920] text-slate-400 border border-[#262B36]'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clean Cup 5 cups */}
              <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    8. نقاء الكوب (Clean Cup):
                  </span>
                  <span className="text-[10px] text-slate-400">
                    خلو الكوب من أي شوائب أو روائح غريبة
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  {[10, 8, 6, 4, 2, 0].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => updateCuppingScore('clean_cup', score)}
                      className={`px-2 py-1 rounded text-[11px] font-bold ${
                        cuppingScores.clean_cup === score
                          ? 'bg-[#10B981] text-black'
                          : 'bg-[#161920] text-slate-400 border border-[#262B36]'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* Uniformity 5 cups */}
              <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    9. التجانس والتطابق (Uniformity):
                  </span>
                  <span className="text-[10px] text-slate-400">
                    تطابق نكهات الأكواب الخمسة المحضرة
                  </span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  {[10, 8, 6, 4, 2, 0].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => updateCuppingScore('uniformity', score)}
                      className={`px-2 py-1 rounded text-[11px] font-bold ${
                        cuppingScores.uniformity === score
                          ? 'bg-[#38BDF8] text-black'
                          : 'bg-[#161920] text-slate-400 border border-[#262B36]'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* Defects Subtraction */}
              <div className="bg-[#0D0F12] p-3 rounded-xl border border-rose-500/30 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    خصم عيوب التذوق (SCA Defects Deduction):
                  </span>
                  <span className="text-xs font-mono text-rose-400 font-black">
                    -{cuppingScores.defects_points || 0} نقطة
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Taint (عيب خفيف يغير النكهة): 2 نقطة للكوب | Fault (عيب جسيم مفسد): 4 نقاط للكوب
                </p>
                <div className="grid grid-cols-4 gap-1.5 font-mono pt-1">
                  {[0, 2, 4, 8].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => updateCuppingScore('defects_points', pts)}
                      className={`py-1 rounded text-[11px] font-bold ${
                        cuppingScores.defects_points === pts
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-[#161920] text-slate-400 border border-[#262B36] hover:text-white'
                      }`}
                    >
                      {pts === 0 ? 'سليم (0)' : `-${pts} نقطة`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {cuppingSubTab === 'wheel' && (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  النوتات العطرية المسجلة (SCA Flavor Wheel):
                </label>
                <div className="space-y-2">
                  {FLAVOR_WHEEL_OPTIONS.map((cat, idx) => (
                    <div key={idx} className="bg-[#0D0F12] p-2 rounded-xl border border-[#262B36]">
                      <span className="text-[10px] font-bold text-[#D97724] block mb-1">
                        {cat.category}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((item) => {
                          const isPicked = cuppingScores.flavor_notes?.includes(item);
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => toggleFlavorNote(item)}
                              className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                                isPicked
                                  ? 'bg-[#D97724] text-white border-[#D97724] font-bold'
                                  : 'bg-[#161920] text-slate-300 border-[#262B36] hover:text-white'
                              }`}
                            >
                              {item} {isPicked ? '✓' : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roasting Defects Quick Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  العيب الحسي المرصود في الكوب:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {sensoryOptions.map((opt) => {
                    const isSelected = sensoryDefect.includes(opt.id) || sensoryDefect === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSensoryDefect(opt.id)}
                        className={`p-2 rounded-lg border text-right transition flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#161920] border-[#D97724] text-white shadow-sm'
                            : 'bg-[#0D0F12] border-[#262B36] text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: opt.color }}
                        />
                        <span className="text-[11px] font-bold truncate">{opt.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveStep(2)}
              className="py-2.5 px-4 rounded-xl bg-[#0D0F12] border border-[#262B36] text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveStep(4)}
              className="flex-1 py-2.5 rounded-xl bg-[#D97724] hover:bg-[#c4681c] text-white text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>متابعة إلى خطوة اللون و مظهر</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Agtron Scale & Post-Roast Appearance */}
      {activeStep === 4 && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Agtron Scale Toggle */}
          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#D97724]" />
              <span className="text-xs font-bold text-slate-200">
                مقياس الأجترون للون التحميص (Agtron Scale):
              </span>
            </div>
            <div className="flex items-center gap-1 bg-[#161920] p-0.5 rounded-lg border border-[#262B36]">
              <button
                type="button"
                onClick={() => setAppearance((prev) => ({ ...prev, agtron_scale: 'GOURMET' }))}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                  appearance.agtron_scale === 'GOURMET'
                    ? 'bg-[#D97724] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gourmet (المختصة)
              </button>
              <button
                type="button"
                onClick={() => setAppearance((prev) => ({ ...prev, agtron_scale: 'COMMERCIAL' }))}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                  appearance.agtron_scale === 'COMMERCIAL'
                    ? 'bg-[#D97724] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Commercial (التجاري)
              </button>
            </div>
          </div>

          {/* Processing-Specific Agtron Benchmark Target Box */}
          <div className="bg-[#0D0F12] p-3 rounded-xl border border-amber-500/30 flex flex-col gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Coffee className="w-3.5 h-3.5" />
                <span>المعيار المستهدف لمعالجة {processBenchmark.process_label_ar} ({processBenchmark.target_brew_label_ar}):</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAppearance((prev) => ({
                    ...prev,
                    whole_bean_agtron: Math.round((processBenchmark.whole_min + processBenchmark.whole_max) / 2),
                    ground_agtron: Math.round((processBenchmark.ground_min + processBenchmark.ground_max) / 2),
                  }))
                }
                className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/40 hover:bg-amber-500/30 transition"
              >
                تطبيق المعيار المثالي لهذا البن
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
              <div className="bg-[#161920] p-1.5 rounded border border-[#262B36]">
                <span className="text-slate-400 block text-[9px]">المطحون المستهدف:</span>
                <span className="font-bold text-white">{processBenchmark.ground_min} - {processBenchmark.ground_max}</span>
              </div>
              <div className="bg-[#161920] p-1.5 rounded border border-[#262B36]">
                <span className="text-slate-400 block text-[9px]">الحبة الكاملة:</span>
                <span className="font-bold text-white">{processBenchmark.whole_min} - {processBenchmark.whole_max}</span>
              </div>
              <div className="bg-[#161920] p-1.5 rounded border border-[#262B36]">
                <span className="text-slate-400 block text-[9px]">ΔAgtron مثالي:</span>
                <span className="font-bold text-emerald-400">{processBenchmark.ideal_delta_min} - {processBenchmark.ideal_delta_max}</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              💡 {processBenchmark.description_ar}
            </p>
          </div>

          {/* Whole Bean and Ground Agtron Inputs */}
          <div className="grid grid-cols-2 gap-3">
            {/* Whole Bean */}
            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  قراءة الحبة الكاملة (Whole Bean):
                </span>
                {wholeClassification && (
                  <span
                    className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                    style={{ backgroundColor: wholeClassification.hex_color }}
                    title={wholeClassification.hex_color}
                  />
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                يقيس لون السطح الخارجي وتكرمل القشرة
              </p>
              <div className="flex items-center bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5">
                <input
                  type="number"
                  placeholder="مثال: 72"
                  value={appearance.whole_bean_agtron}
                  onChange={(e) =>
                    setAppearance((prev) => ({
                      ...prev,
                      whole_bean_agtron: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                />
                <span className="text-[10px] font-mono text-amber-300">Agtron</span>
              </div>
              {wholeClassification && (
                <div className="text-[10px] text-slate-300 bg-[#161920] px-2 py-1 rounded border border-[#262B36]">
                  {wholeClassification.category_ar} ({wholeClassification.sca_tile})
                </div>
              )}
            </div>

            {/* Ground Bean */}
            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  قراءة البن المطحون (Ground Bean):
                </span>
                {groundClassification && (
                  <span
                    className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                    style={{ backgroundColor: groundClassification.hex_color }}
                    title={groundClassification.hex_color}
                  />
                )}
              </div>
              <p className="text-[10px] text-slate-500">
                يقيس عمق تطور ونضج لب الحبة الداخلي
              </p>
              <div className="flex items-center bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5">
                <input
                  type="number"
                  placeholder="مثال: 84"
                  value={appearance.ground_agtron}
                  onChange={(e) =>
                    setAppearance((prev) => ({
                      ...prev,
                      ground_agtron: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  className="w-full bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                />
                <span className="text-[10px] font-mono text-amber-300">Agtron</span>
              </div>
              {groundClassification && (
                <div className="text-[10px] text-slate-300 bg-[#161920] px-2 py-1 rounded border border-[#262B36]">
                  {groundClassification.category_ar} ({groundClassification.sca_tile})
                </div>
              )}
            </div>
          </div>

          {/* Quick Agtron Value Presets Bar */}
          <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
            <span className="text-[10px] text-slate-400 font-bold block mb-1.5">
              نماذج درجات التحميص المعيارية بحسب SCA (اختر لملء سريع):
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 text-center">
              {[
                { label: 'فاتح جداً', whole: 95, ground: 104, tile: '#95' },
                { label: 'فاتح فلتر', whole: 82, ground: 93, tile: '#85' },
                { label: 'سيتي +', whole: 72, ground: 84, tile: '#75' },
                { label: 'متوسط', whole: 62, ground: 70, tile: '#65' },
                { label: 'متوسط داكن', whole: 50, ground: 56, tile: '#55' },
                { label: 'داكن', whole: 38, ground: 42, tile: '#45' },
                { label: 'إيطالي', whole: 28, ground: 30, tile: '#25' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    setAppearance((prev) => ({
                      ...prev,
                      whole_bean_agtron: item.whole,
                      ground_agtron: item.ground,
                    }))
                  }
                  className="p-1 rounded bg-[#161920] border border-[#262B36] hover:border-[#D97724] text-[10px] text-slate-300 transition flex flex-col items-center"
                >
                  <span className="font-bold">{item.tile}</span>
                  <span className="text-[9px] text-slate-500">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Roast Delta (Spread) Dynamic Card */}
          {deltaAssessment && (
            <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${deltaAssessment.badge_color}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  فارق التدرج الحراري (Roast Delta = {deltaAssessment.spread} نقطة)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 font-bold">
                  {deltaAssessment.title_ar}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-200">
                {deltaAssessment.verdict_ar}
              </p>
              <div className="text-[10px] bg-black/30 p-2 rounded-lg text-slate-300">
                <span className="font-bold text-amber-300 ml-1">توجيه الحمّاص:</span>
                {deltaAssessment.thermodynamic_tip_ar}
              </div>
            </div>
          )}

          {/* Live Consistency with Process Standard Card */}
          {processConsistency && (
            <div className={`p-3 rounded-xl border flex flex-col gap-1.5 ${processConsistency.badge_color}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5" />
                  اتساق اللون مع معايير المعالجة (درجة الاتساق: {processConsistency.score}%)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 font-bold">
                  {processConsistency.title_ar}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-200">
                {processConsistency.summary_ar}
              </p>
            </div>
          )}

          {/* Post-Roast Physical Appearance Parameters */}
          <div className="space-y-3 bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
            <span className="text-xs font-bold text-slate-200 block">
              فحص المظهر الفيزيائي للحبوب بعد الخروج (Bean Physical Inspection):
            </span>

            {/* Expansion & Crease */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">
                تمدد الحبة وانفتاح الشق الأوسط (Expansion & Crease):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'EXCELLENT', label: 'انتفاخ ممتاز وانفتاح كامل', desc: 'ضغط بخار داخلي مثالي' },
                  { id: 'MEDIUM', label: 'تمدد متوسط', desc: 'تطور مقبول' },
                  { id: 'POOR', label: 'انكماش / تمدد ضعيف', desc: 'حرارة بطيئة أو خمول' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setAppearance((prev) => ({
                        ...prev,
                        expansion_quality: opt.id as any,
                      }))
                    }
                    className={`p-1.5 rounded-lg border text-center transition flex flex-col ${
                      appearance.expansion_quality === opt.id
                        ? 'bg-[#D97724]/20 border-[#D97724] text-white font-bold'
                        : 'bg-[#161920] border-[#262B36] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Surface Oils */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">
                الزيوت السطحية (Surface Oils & Sweating):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'DRY', label: 'جافة مطفأة (Dry / Matte)', desc: 'جدران خلوية سليمة' },
                  { id: 'SLIGHT_SWEAT', label: 'لمعان خفيف (Slight Sheen)', desc: 'بداية تحميص متوسط داكن' },
                  { id: 'OILY', label: 'زيوت سائلة متسربة (Oily)', desc: 'تدمير حراري عميق للخلايا' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setAppearance((prev) => ({
                        ...prev,
                        surface_oil: opt.id as any,
                      }))
                    }
                    className={`p-1.5 rounded-lg border text-center transition flex flex-col ${
                      appearance.surface_oil === opt.id
                        ? 'bg-[#D97724]/20 border-[#D97724] text-white font-bold'
                        : 'bg-[#161920] border-[#262B36] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px]">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Defects Checklist */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5">
                عيوب المظهر السطحي إن وجدت:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {visualDefectOptions.map((defect) => {
                  const isChecked = appearance.visual_defects?.includes(defect.id);
                  return (
                    <button
                      key={defect.id}
                      type="button"
                      onClick={() => toggleVisualDefect(defect.id)}
                      className={`p-2 rounded-lg border text-right transition flex items-start gap-2 ${
                        isChecked
                          ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
                          : 'bg-[#161920] border-[#262B36] text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-500'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5" />}
                      </span>
                      <div>
                        <span className="text-[11px] font-bold block">{defect.label}</span>
                        <span className="text-[9px] text-slate-400">{defect.desc}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes Box */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              ملاحظات إضافية حول التذوق والمظهر والحمّاصة:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: لوحظ تدرج كبير بين السطح والقلب، أو خروج مبكر للزيوت..."
              className="w-full bg-[#0D0F12] border border-[#262B36] rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D97724] resize-none"
            />
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setActiveStep(3)}
              className="py-3 px-4 rounded-xl bg-[#0D0F12] border border-[#262B36] hover:bg-[#262B36] text-slate-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              type="button"
              onClick={() => onSubmit(false)}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D97724] to-[#B45309] hover:from-[#ea8731] hover:to-[#c65c0b] text-white text-xs font-black shadow-lg shadow-[#D97724]/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>محرك Gemini يحلل الديناميكا الحرارية وتذوق SCA والأجترون...</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>بدء التشخيص وربط التذوق ولون الأجترون بالفيزياء</span>
                </>
              )}
            </button>
          </div>

          {selectedPresetId && (
            <button
              type="button"
              onClick={() => onSubmit(true)}
              className="w-full py-2 rounded-xl bg-[#161920] border border-[#38BDF8]/40 hover:bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-medium transition flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>معاينة فورية وسريعة لتحليل هذا المثال الجاهز</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
