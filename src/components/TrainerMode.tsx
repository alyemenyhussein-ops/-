import React, { useState } from 'react';
import {
  TrainerChallenge,
  TrainerSubmission,
  TrainerGradingResult,
  DefectCategory,
} from '../types';
import { TRAINER_CHALLENGES } from '../data/trainerChallenges';
import {
  GraduationCap,
  Sparkles,
  Award,
  Flame,
  Wind,
  Layers,
  Thermometer,
  Coffee,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  TrendingDown,
  Eye,
  Sliders,
  Send,
  Loader2,
  BookOpen,
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

export const TrainerMode: React.FC = () => {
  const [challenges, setChallenges] = useState<TrainerChallenge[]>(TRAINER_CHALLENGES);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    TRAINER_CHALLENGES[0].id
  );
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT'>('ALL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<TrainerGradingResult | null>(null);

  // Trainee Submission State
  const [submission, setSubmission] = useState<TrainerSubmission>({
    identified_defect_category: '',
    defect_description_ar: '',
    gas_action: 'EARLIER_REDUCTION',
    gas_timing_ar: '',
    gas_magnitude_ar: '',
    airflow_action: 'INCREASE',
    airflow_timing_ar: '',
    airflow_magnitude_ar: '',
    thermodynamic_reasoning_ar: '',
  });

  const activeChallenge =
    challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  const filteredChallenges = challenges.filter((c) => {
    if (difficultyFilter === 'ALL') return true;
    return c.difficulty === difficultyFilter;
  });

  const defectCategories: { key: DefectCategory; label: string; desc: string }[] = [
    { key: 'ROR_CRASH', label: 'انهيار الـ RoR (Crash)', desc: 'هبوط حاد في معدل الصعود عند أو بعد القرقعة' },
    { key: 'ROR_FLICK', label: 'قفزة الـ RoR (Flick)', desc: 'تسارع غير محسوب في الدقائق الأخيرة من التطور' },
    { key: 'SCORCHING', label: 'احتراق السطح (Scorching)', desc: 'حرارة شحن مفرطة أو دوران طبل بطيء أحرق القشرة' },
    { key: 'TIPPING', label: 'احتراق الأطراف (Tipping)', desc: 'حرارة توصيلية عنيفة تركزت في حواف الحبة' },
    { key: 'BAKED', label: 'تحميص مخبوز (Baked)', desc: 'زخم حراري متسطح مع DTR ممتد ودلتا حرارة متدنية' },
    { key: 'UNDERDEVELOPED', label: 'قلب غير ناضج (Underdeveloped)', desc: 'فارق أجترون واسع يترك اللب عشبياً حامضياً' },
    { key: 'STALLING', label: 'ركود حراري (Stalling)', desc: 'توقف مؤقت في انتقال الحرارة في مرحلة مايلارد' },
  ];

  const handleSelectChallenge = (c: TrainerChallenge) => {
    setSelectedChallengeId(c.id);
    setGradingResult(null);
    setSubmission({
      identified_defect_category: '',
      defect_description_ar: '',
      gas_action: 'EARLIER_REDUCTION',
      gas_timing_ar: '',
      gas_magnitude_ar: '',
      airflow_action: 'INCREASE',
      airflow_timing_ar: '',
      airflow_magnitude_ar: '',
      thermodynamic_reasoning_ar: '',
    });
  };

  // AI Challenge Generator
  const handleGenerateNewChallenge = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/trainer/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          difficulty: difficultyFilter === 'ALL' ? 'INTERMEDIATE' : difficultyFilter,
        }),
      });

      const data = await res.json();
      if (data.success && data.challenge) {
        setChallenges((prev) => [data.challenge, ...prev]);
        handleSelectChallenge(data.challenge);
      } else {
        throw new Error(data.error || 'تعذر توليد التحدي');
      }
    } catch (err: any) {
      console.warn('AI Challenge gen error:', err);
      // Fallback: pick another challenge
      const randomIdx = Math.floor(Math.random() * TRAINER_CHALLENGES.length);
      handleSelectChallenge(TRAINER_CHALLENGES[randomIdx]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Offline Grading Fallback
  const evaluateOfflineGrading = (
    challenge: TrainerChallenge,
    sub: TrainerSubmission
  ): TrainerGradingResult => {
    const isExactDefect =
      sub.identified_defect_category === challenge.hiddenAnomaly.defect_category;
    let defectScore = isExactDefect ? 38 : 15;

    let controlScore = 20;
    if (challenge.hiddenAnomaly.defect_category === 'ROR_CRASH') {
      if (sub.gas_action === 'EARLIER_REDUCTION' || sub.gas_action === 'DECREASE') controlScore += 10;
      if (sub.airflow_action === 'INCREASE') controlScore += 8;
    } else if (challenge.hiddenAnomaly.defect_category === 'ROR_FLICK') {
      if (sub.gas_action === 'CUT_OFF' || sub.gas_action === 'DECREASE') controlScore += 10;
      if (sub.airflow_action === 'INCREASE') controlScore += 8;
    } else if (challenge.hiddenAnomaly.defect_category === 'SCORCHING') {
      if (sub.gas_action === 'DECREASE') controlScore += 10;
      if (sub.airflow_action === 'INCREASE') controlScore += 8;
    } else if (challenge.hiddenAnomaly.defect_category === 'BAKED') {
      if (sub.gas_action === 'INCREASE') controlScore += 12;
      if (sub.airflow_action === 'HOLD' || sub.airflow_action === 'DECREASE') controlScore += 6;
    }

    let reasoningScore = 14;
    if (sub.thermodynamic_reasoning_ar.length > 30) reasoningScore += 4;

    const total = Math.min(100, defectScore + controlScore + reasoningScore);

    let tier = 'متدرب يحتاج لإعادة المحاولة (Trainee)';
    if (total >= 90) tier = 'خبير تحميص معتمد (Master Roaster)';
    else if (total >= 75) tier = 'حمّاص متقدم (Advanced Roaster)';
    else if (total >= 60) tier = 'حمّاص ممارس (Practitioner)';

    return {
      total_score: total,
      grade_tier_ar: tier,
      score_breakdown: {
        defect_identification: defectScore,
        control_adjustments: controlScore,
        thermodynamic_reasoning: reasoningScore,
      },
      overall_feedback_ar: isExactDefect
        ? 'تشخيص ممتاز للخلل الفيزيائي! أظهرت فهماً كبيراً لديناميكا الـ RoR واستجابة حبوب البن.'
        : 'تشخيصك بحاجة إلى مراجعة أدق لمنحنى الـ RoR وتوقيت التغير الحراري.',
      defect_critique_ar: isExactDefect
        ? `طابقت الإجابة الصحيحة (${challenge.hiddenAnomaly.defect_name_ar}) بدقة واقتدار.`
        : `الخلل الفعلي الكامن في المسار هو: "${challenge.hiddenAnomaly.defect_name_ar}".`,
      gas_airflow_critique_ar: `التصحيح الموصى به لمعاملات الشعلة: ${challenge.hiddenAnomaly.optimal_gas_fix_ar} وتدفق الهواء: ${challenge.hiddenAnomaly.optimal_airflow_fix_ar}.`,
      revealed_truth_ar: challenge.hiddenAnomaly.thermodynamic_cause_ar,
      key_learning_points_ar: [
        'راقب انحدار الـ RoR وتجنب التعديلات الفجائية المتأخرة للغاز.',
        'استغل سحب الهواء لسحب الرطوبة في الوقت المناسب دون تبريد الحبوب.',
        'قارن دائماً بين قراءة الحبة الكاملة والمطحونة لمعاينة عمق التطور.',
      ],
    };
  };

  // Submit Answer for AI Grading
  const handleSubmitGrading = async () => {
    if (!submission.identified_defect_category) {
      alert('يرجى تحديد الخلل الفيزيائي الكامن أولاً');
      return;
    }

    setIsGrading(true);
    try {
      const res = await fetch('/api/trainer/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge: activeChallenge,
          submission,
        }),
      });

      const data = await res.json();
      if (data.success && data.grading) {
        setGradingResult(data.grading);
      } else {
        throw new Error(data.error || 'فشل التقييم عبر السيرفر');
      }
    } catch (err: any) {
      console.warn('AI Grading fallback to offline heuristic:', err);
      const fallback = evaluateOfflineGrading(activeChallenge, submission);
      setGradingResult(fallback);
    } finally {
      setIsGrading(false);
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'BEGINNER':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'INTERMEDIATE':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'EXPERT':
      default:
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#161920] via-[#1A1E26] to-[#161920] border border-[#262B36] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D97724] to-[#B45309] flex items-center justify-center shadow-lg shadow-[#D97724]/20 border border-[#D97724]/40">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                وضع المُدَرِّب الذكي (Roaster Trainer Mode)
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40">
                SCA AI Academy
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              تحديات مسارات تحميص واقعية تحتوي على شذوذ حراري وفيزيائي خفي. اكتشف الخلل، واقترح خطة تعديل الغاز والهواء للدفعة القادمة، واحصل على تقييم فوري من 100 نقطة!
            </p>
          </div>
        </div>

        {/* Action & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <div className="flex items-center gap-1 bg-[#0D0F12] p-1 rounded-xl border border-[#262B36] text-xs">
            <button
              onClick={() => setDifficultyFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                difficultyFilter === 'ALL'
                  ? 'bg-[#262B36] text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setDifficultyFilter('BEGINNER')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                difficultyFilter === 'BEGINNER'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              مبتدئ
            </button>
            <button
              onClick={() => setDifficultyFilter('INTERMEDIATE')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                difficultyFilter === 'INTERMEDIATE'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              متوسط
            </button>
            <button
              onClick={() => setDifficultyFilter('EXPERT')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                difficultyFilter === 'EXPERT'
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              خبير
            </button>
          </div>

          <button
            onClick={handleGenerateNewChallenge}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D97724] to-[#b86118] hover:from-[#e5832e] hover:to-[#c6681b] text-white text-xs font-bold transition shadow-md disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>جاري التوليد...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>سيناريو جديد بالذكاء الاصطناعي</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Challenges Carousel / Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredChallenges.map((c) => {
          const isSelected = c.id === activeChallenge.id;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectChallenge(c)}
              className={`p-3.5 rounded-xl border text-right transition flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-[#1A1E26] border-[#D97724] shadow-lg shadow-[#D97724]/10'
                  : 'bg-[#161920] border-[#262B36] hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                      c.difficulty
                    )}`}
                  >
                    {c.difficulty === 'BEGINNER' ? 'مبتدئ' : c.difficulty === 'INTERMEDIATE' ? 'متوسط' : 'خبير'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {c.beanProfile.process}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{c.title_ar}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {c.scenario_brief_ar}
                </p>
              </div>

              <div className="border-t border-[#262B36] pt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{c.beanProfile.name.split(' ')[0]}</span>
                <span className="text-[#38BDF8] flex items-center gap-1">
                  <span>فحص المسار</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Challenge Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Defective Curve & Roasting Data (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Challenge Brief Card */}
          <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262B36] pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#D97724] uppercase tracking-wider block">
                  سيناريو التحدي النشط
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {activeChallenge.title_ar}
                </h3>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getDifficultyBadge(activeChallenge.difficulty)}`}>
                {activeChallenge.difficulty}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              {activeChallenge.scenario_brief_ar}
            </p>

            {/* Bean Profile & Roaster */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <span className="text-[10px] text-slate-500 block">المحصول:</span>
                <strong className="text-white text-xs truncate block">{activeChallenge.beanProfile.name}</strong>
              </div>
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <span className="text-[10px] text-slate-500 block">المعالجة والهدف:</span>
                <strong className="text-amber-400 text-xs">
                  {activeChallenge.beanProfile.process} • {activeChallenge.beanProfile.targetBrew}
                </strong>
              </div>
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <span className="text-[10px] text-slate-500 block">الكثافة والرطوبة:</span>
                <span className="font-mono text-slate-200 text-xs">
                  {activeChallenge.beanProfile.density_g_l}g/L | {activeChallenge.beanProfile.moisture_pct}%
                </span>
              </div>
              <div className="bg-[#0D0F12] p-2.5 rounded-xl border border-[#262B36]">
                <span className="text-[10px] text-slate-500 block">المحمصة:</span>
                <span className="text-slate-300 text-[11px] truncate block">{activeChallenge.beanProfile.roasterType}</span>
              </div>
            </div>

            {/* Telemetry Summary Table */}
            <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36]">
              <span className="text-[11px] font-bold text-slate-400 block mb-2 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>القياسات الزمنية والحرارية المسجلة (Recorded Telemetry):</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-lg bg-[#161920] border border-[#262B36]">
                  <span className="text-[10px] text-slate-400 block">Charge</span>
                  <strong className="text-white">{activeChallenge.telemetry.chargeTempC}°C</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#161920] border border-[#262B36]">
                  <span className="text-[10px] text-slate-400 block">Turning Point</span>
                  <strong className="text-white">{activeChallenge.telemetry.turningPointTempC}°C</strong>
                  <span className="text-[9px] text-slate-500 block">{activeChallenge.telemetry.turningPointTime}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#161920] border border-[#262B36]">
                  <span className="text-[10px] text-slate-400 block">Yellowing</span>
                  <strong className="text-amber-400">{activeChallenge.telemetry.yellowingTempC}°C</strong>
                  <span className="text-[9px] text-slate-500 block">{activeChallenge.telemetry.yellowingTime}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#161920] border border-[#262B36]">
                  <span className="text-[10px] text-slate-400 block">First Crack</span>
                  <strong className="text-rose-400">{activeChallenge.telemetry.firstCrackTempC}°C</strong>
                  <span className="text-[9px] text-slate-500 block">{activeChallenge.telemetry.firstCrackTime}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#161920] border border-[#262B36]">
                  <span className="text-[10px] text-slate-400 block">Drop Temp</span>
                  <strong className="text-purple-400">{activeChallenge.telemetry.dropTempC}°C</strong>
                  <span className="text-[9px] text-slate-500 block">{activeChallenge.telemetry.dropTime}</span>
                </div>
              </div>
            </div>

            {/* Sensory Cupping Notes & Appearance Clues */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0D0F12] p-3 rounded-xl border border-amber-500/20 space-y-1">
                <span className="text-amber-400 font-bold flex items-center gap-1.5 text-[11px]">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>ملاحظات فحص الكوب (Cupping Observations):</span>
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {activeChallenge.sensory_notes_ar}
                </p>
              </div>

              <div className="bg-[#0D0F12] p-3 rounded-xl border border-sky-500/20 space-y-1">
                <span className="text-[#38BDF8] font-bold flex items-center gap-1.5 text-[11px]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>مظهر الحبوب ولون الأجترون:</span>
                </span>
                <div className="text-[11px] text-slate-300 font-mono space-y-0.5">
                  <p>
                    أجترون (حب/مطحون):{' '}
                    <strong className="text-white">
                      {activeChallenge.appearance?.whole_bean_agtron || '-'} / {activeChallenge.appearance?.ground_agtron || '-'}
                    </strong>
                    {activeChallenge.appearance?.whole_bean_agtron && activeChallenge.appearance?.ground_agtron && (
                      <span className="text-amber-400 mr-1.5">
                        (Δ {+activeChallenge.appearance.ground_agtron - +activeChallenge.appearance.whole_bean_agtron})
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] text-slate-400 font-sans">
                    الشق الوسطي: {activeChallenge.appearance?.center_cut_color || 'عسلي'} | الزيوت السطحية: {activeChallenge.appearance?.surface_oil}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive RoR Anomaly Chart */}
          <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white">
                  منحنى RoR التجريبي (ابحث عن موضع الشذوذ الحراري)
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#38BDF8]" />
                  <span className="text-slate-300">الـ RoR الفعلي المشوّه</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-[#A855F7] border-dashed border-t border-[#A855F7]" />
                  <span className="text-[#A855F7]">الهدف المثالي (Ghost)</span>
                </span>
              </div>
            </div>

            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activeChallenge.ghost_curve_target}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
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
                      backgroundColor: '#0D0F12',
                      borderColor: '#262B36',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#F8FAFC',
                      direction: 'rtl',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target_ror"
                    name="الهدف المثالي"
                    stroke="#A855F7"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual_estimated_ror"
                    name="الـ RoR الفعلي"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#38BDF8' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500 font-mono text-center">
              * تتبع ميل المنحنى قبل وبعد نقطة القرقعة الأولى (First Crack) ولاحظ أي انحدار أو صعود مفاجئ.
            </p>
          </div>
        </div>

        {/* Right Column: Trainee Submission Form (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-5 shadow-xl space-y-5">
            <div className="border-b border-[#262B36] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D97724]" />
                <span>لوحة إجابة المتدرب وتصحيح المعاملات</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                أجب على الأقسام الثلاثة ثم اضغط على زر التقييم لقياس دقتك واحتساب درجتك من 100.
              </p>
            </div>

            {/* Part 1: Defect Identification */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] flex items-center justify-center font-mono">1</span>
                <span>تحديد وتوصيف الخلل الفيزيائي الكامن (40 نقطة):</span>
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                {defectCategories.map((item) => {
                  const isChecked = submission.identified_defect_category === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() =>
                        setSubmission((prev) => ({
                          ...prev,
                          identified_defect_category: item.key,
                        }))
                      }
                      className={`p-2 rounded-xl text-right transition border text-xs flex flex-col gap-0.5 ${
                        isChecked
                          ? 'bg-[#D97724]/20 border-[#D97724] text-white font-bold'
                          : 'bg-[#0D0F12] border-[#262B36] text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="text-[9px] text-slate-500 font-normal line-clamp-1">{item.desc}</span>
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                placeholder="توصيف إضافي دقيق للخلل بالمنحنى (اختياري)..."
                value={submission.defect_description_ar}
                onChange={(e) =>
                  setSubmission((prev) => ({
                    ...prev,
                    defect_description_ar: e.target.value,
                  }))
                }
                className="w-full bg-[#0D0F12] border border-[#262B36] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D97724]"
              />
            </div>

            {/* Part 2: Gas & Airflow Correction Plan */}
            <div className="space-y-3 pt-3 border-t border-[#262B36]">
              <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] text-[10px] flex items-center justify-center font-mono">2</span>
                <span>اقتراح خطة تصحيح الغاز والهواء للدفعة القادمة (40 نقطة):</span>
              </span>

              {/* Gas Controls */}
              <div className="bg-[#0D0F12] p-3 rounded-xl border border-rose-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-400" />
                    <span>تعديل شعلة الغاز (Gas Adjustment):</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  {[
                    { key: 'EARLIER_REDUCTION', label: 'خفض مبكر' },
                    { key: 'DECREASE', label: 'خفض الشعلة' },
                    { key: 'INCREASE', label: 'زيادة الشعلة' },
                    { key: 'HOLD', label: 'تثبيت الشعلة' },
                    { key: 'CUT_OFF', label: 'إطفاء مؤقت' },
                  ].map((act) => (
                    <button
                      key={act.key}
                      onClick={() =>
                        setSubmission((prev) => ({
                          ...prev,
                          gas_action: act.key as any,
                        }))
                      }
                      className={`py-1 px-1.5 rounded-lg border text-center transition ${
                        submission.gas_action === act.key
                          ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                          : 'bg-[#161920] border-[#262B36] text-slate-400 hover:text-white'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="التوقيت (مثال: قبل FC بـ 45 ث)..."
                    value={submission.gas_timing_ar}
                    onChange={(e) =>
                      setSubmission((prev) => ({ ...prev, gas_timing_ar: e.target.value }))
                    }
                    className="bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="المقدار (مثال: خفض 30%)..."
                    value={submission.gas_magnitude_ar}
                    onChange={(e) =>
                      setSubmission((prev) => ({ ...prev, gas_magnitude_ar: e.target.value }))
                    }
                    className="bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 text-xs"
                  />
                </div>
              </div>

              {/* Airflow Controls */}
              <div className="bg-[#0D0F12] p-3 rounded-xl border border-sky-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-sky-300">
                  <span className="flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-sky-400" />
                    <span>تعديل تدفق الهواء والعادم (Airflow Adjustment):</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-[11px]">
                  {[
                    { key: 'INCREASE', label: 'رفع الهواء' },
                    { key: 'DECREASE', label: 'خفض الهواء' },
                    { key: 'HOLD', label: 'تثبيت الهواء' },
                    { key: 'PULSE_VENT', label: 'سحب نبضي' },
                  ].map((act) => (
                    <button
                      key={act.key}
                      onClick={() =>
                        setSubmission((prev) => ({
                          ...prev,
                          airflow_action: act.key as any,
                        }))
                      }
                      className={`py-1 px-1.5 rounded-lg border text-center transition ${
                        submission.airflow_action === act.key
                          ? 'bg-sky-500/20 border-sky-500 text-sky-200 font-bold'
                          : 'bg-[#161920] border-[#262B36] text-slate-400 hover:text-white'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="التوقيت (مثال: عند بداية FC)..."
                    value={submission.airflow_timing_ar}
                    onChange={(e) =>
                      setSubmission((prev) => ({ ...prev, airflow_timing_ar: e.target.value }))
                    }
                    className="bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="المقدار (مثال: فتح العادم درجة)..."
                    value={submission.airflow_magnitude_ar}
                    onChange={(e) =>
                      setSubmission((prev) => ({ ...prev, airflow_magnitude_ar: e.target.value }))
                    }
                    className="bg-[#161920] border border-[#262B36] rounded-lg px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Part 3: Thermodynamic Reasoning */}
            <div className="space-y-2 pt-3 border-t border-[#262B36]">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-400 text-[10px] flex items-center justify-center font-mono">3</span>
                <span>التعليل والمنطق الثرموديناميكي (20 نقطة):</span>
              </span>
              <textarea
                rows={3}
                placeholder="لماذا اخترت هذا التعديل؟ كيف تؤثر الرطوبة، الكثافة، وانتقال الحرارة على قرارك؟"
                value={submission.thermodynamic_reasoning_ar}
                onChange={(e) =>
                  setSubmission((prev) => ({
                    ...prev,
                    thermodynamic_reasoning_ar: e.target.value,
                  }))
                }
                className="w-full bg-[#0D0F12] border border-[#262B36] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 resize-none leading-relaxed"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitGrading}
              disabled={isGrading || !submission.identified_defect_category}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D97724] to-[#B45309] hover:from-[#e5832e] hover:to-[#c6681b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#D97724]/20 transition disabled:opacity-50 cursor-pointer"
            >
              {isGrading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تقييم الإجابة وتحليل المعاملات...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال الإجابة للاختبار والتقييم (من 100)</span>
                </>
              )}
            </button>
          </div>

          {/* Grading Result Box (Rendered when graded) */}
          {gradingResult && (
            <div className="bg-[#161920] border-2 border-amber-500/50 rounded-2xl p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between border-b border-[#262B36] pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#D97724]" />
                  <h4 className="text-sm font-bold text-white">نتيجة التقييم المعتمد</h4>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#D97724]/20 text-[#D97724] border border-[#D97724]/40">
                  {gradingResult.grade_tier_ar}
                </span>
              </div>

              {/* Total Score Display */}
              <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">درجة المتدرب المستحقة:</span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span
                      className={`text-4xl font-black ${
                        gradingResult.total_score >= 80
                          ? 'text-emerald-400'
                          : gradingResult.total_score >= 60
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {gradingResult.total_score}
                    </span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="space-y-1.5 text-[11px] font-mono text-left w-1/2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>تشخيص الخلل:</span>
                    <strong className="text-white">
                      {gradingResult.score_breakdown.defect_identification}/40
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>خطة الغاز والهواء:</span>
                    <strong className="text-white">
                      {gradingResult.score_breakdown.control_adjustments}/40
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>التعليل العلمي:</span>
                    <strong className="text-white">
                      {gradingResult.score_breakdown.thermodynamic_reasoning}/20
                    </strong>
                  </div>
                </div>
              </div>

              {/* Instructor Critique */}
              <div className="space-y-2 text-xs">
                <div className="bg-[#0D0F12] p-3 rounded-xl border border-[#262B36] space-y-1">
                  <strong className="text-amber-400 block text-[11px]">ملاحظات المدرب:</strong>
                  <p className="text-slate-200 leading-relaxed text-[11px]">
                    {gradingResult.overall_feedback_ar}
                  </p>
                </div>

                <div className="bg-[#0D0F12] p-3 rounded-xl border border-sky-500/25 space-y-1">
                  <strong className="text-[#38BDF8] block text-[11px]">نقد خطة الغاز وتدفق الهواء:</strong>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {gradingResult.gas_airflow_critique_ar}
                  </p>
                </div>

                {/* The Revealed Hidden Truth */}
                <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
                  <strong className="text-emerald-400 block text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>كشف الحقيقة العلمية الكامنة (The Revealed Truth):</span>
                  </strong>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {gradingResult.revealed_truth_ar}
                  </p>
                </div>
              </div>

              {/* Reset or Next Action */}
              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => setGradingResult(null)}
                  className="px-3 py-1.5 rounded-lg bg-[#0D0F12] border border-[#262B36] text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
                <button
                  onClick={handleGenerateNewChallenge}
                  className="px-3.5 py-1.5 rounded-lg bg-[#D97724] hover:bg-[#c6681b] text-xs font-bold text-white transition flex items-center gap-1"
                >
                  <span>التحدي التالي</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
