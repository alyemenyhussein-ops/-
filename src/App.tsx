import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { RoastInputPanel } from './components/RoastInputPanel';
import { DiagnosticDashboard } from './components/DiagnosticDashboard';
import { RoastVault } from './components/RoastVault';
import { TrainerMode } from './components/TrainerMode';
import { BatchScaler } from './components/BatchScaler';
import { IttizanLogo } from './components/IttizanLogo';
import { LuxuryYemenFooter } from './components/LuxuryYemenFooter';
import { ThermodynamicGuideModal } from './components/ThermodynamicGuideModal';
import { PRESETS, DemoPreset } from './data/presets';
import {
  BeanProfile,
  ManualTelemetry,
  RoastDiagnosisResponse,
  SavedRoastRecord,
  SCACuppingScores,
  PostRoastAppearance,
} from './types';
import {
  getSavedRoasts,
  saveRoastRecord,
  deleteRoastRecord,
} from './utils/storage';
import {
  Flame,
  Activity,
  AlertCircle,
  Sparkles,
  Layers,
  Thermometer,
  Eye,
  Award,
  ArrowRight,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

const BLANK_BEAN: BeanProfile = {
  name: '',
  process: 'WASHED',
  density_g_l: '',
  moisture_pct: '',
  targetBrew: 'FILTER',
  roasterType: '',
};

const BLANK_TELEMETRY: ManualTelemetry = {
  chargeTempC: '',
  turningPointTempC: '',
  turningPointTime: '',
  yellowingTime: '',
  yellowingTempC: '',
  firstCrackTime: '',
  firstCrackTempC: '',
  dropTime: '',
  dropTempC: '',
};

const BLANK_CUPPING_SCORES: SCACuppingScores = {
  fragrance_aroma: 0,
  flavor: 0,
  aftertaste: 0,
  acidity: 0,
  acidity_intensity: 'MEDIUM',
  body: 0,
  body_level: 'MEDIUM',
  balance: 0,
  uniformity: 10,
  clean_cup: 10,
  sweetness: 10,
  overall: 0,
  defects_points: 0,
  total_score: 30,
  flavor_notes: [],
};

const BLANK_APPEARANCE: PostRoastAppearance = {
  agtron_scale: 'GOURMET',
  whole_bean_agtron: '',
  ground_agtron: '',
  expansion_quality: 'MEDIUM',
  surface_oil: 'DRY',
  center_cut_color: 'HONEY_BROWN',
  visual_defects: [],
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'diagnostics' | 'vault' | 'trainer' | 'scaler'>('diagnostics');
  const [beanProfile, setBeanProfile] = useState<BeanProfile>(BLANK_BEAN);
  const [telemetry, setTelemetry] = useState<ManualTelemetry>(BLANK_TELEMETRY);
  const [sensoryDefect, setSensoryDefect] = useState<string>('');
  const [cuppingScores, setCuppingScores] = useState<SCACuppingScores>(BLANK_CUPPING_SCORES);
  const [appearance, setAppearance] = useState<PostRoastAppearance>(BLANK_APPEARANCE);
  const [notes, setNotes] = useState<string>('');
  const [imageFile, setImageFile] = useState<{ data: string; mimeType: string } | null>(null);
  const [diagnosis, setDiagnosis] = useState<RoastDiagnosisResponse | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [savedRoasts, setSavedRoasts] = useState<SavedRoastRecord[]>([]);
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const list = getSavedRoasts();
    setSavedRoasts(list);
  }, []);

  const handleSelectPreset = (preset: DemoPreset, autoSimulate: boolean = true) => {
    setBeanProfile({ ...preset.beanProfile });
    setTelemetry({ ...preset.telemetry });
    setSensoryDefect(preset.sensoryDefect);
    setNotes(preset.notes);
    setSelectedPresetId(preset.id);
    setImageFile(null);
    setErrorMessage(null);
    setIsCurrentSaved(false);

    // If preset includes cupping & appearance, populate them
    if ((preset as any).cuppingScores) {
      setCuppingScores({ ...(preset as any).cuppingScores });
    }
    if ((preset as any).appearance) {
      setAppearance({ ...(preset as any).appearance });
    }

    if (autoSimulate) {
      setDiagnosis(preset.simulatedDiagnosis);
      setCurrentTab('diagnostics');
    }
  };

  const handleSubmitDiagnosis = async (useSimulatedIfPreset: boolean = false) => {
    setErrorMessage(null);

    // If fast preview requested for current preset
    if (useSimulatedIfPreset && selectedPresetId) {
      const p = PRESETS.find((item) => item.id === selectedPresetId);
      if (p) {
        setDiagnosis(p.simulatedDiagnosis);
        setIsCurrentSaved(false);
        return;
      }
    }

    setIsLoading(true);
    try {
      const payload = {
        image: imageFile,
        telemetry,
        beanProfile,
        sensoryDefect,
        cuppingScores,
        appearance,
        notes,
      };

      const res = await fetch('/api/diagnose-roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل الاتصال بمحرك التشخيص');
      }

      setDiagnosis(data.diagnosis);
      setIsCurrentSaved(false);
    } catch (err: any) {
      console.error('Diagnosis request failed:', err);
      setErrorMessage(
        err?.message || 'حدث خطأ في معالجة طلب التشخيص، يرجى التحقق من المدخلات والمحاولة ثانية'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToVault = () => {
    if (!diagnosis) return;
    const newRecord: SavedRoastRecord = {
      id: `roast_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      title: `${beanProfile.name || 'تحميصة جديدة'} - ${beanProfile.targetBrew === 'FILTER' ? 'مقطر' : 'إسبريسو'}`,
      beanProfile,
      sensoryDefect,
      cuppingScores,
      appearance,
      diagnosis,
      hasImage: !!imageFile,
    };

    saveRoastRecord(newRecord);
    setSavedRoasts(getSavedRoasts());
    setIsCurrentSaved(true);
  };

  const handleDeleteRecord = (id: string) => {
    deleteRoastRecord(id);
    setSavedRoasts(getSavedRoasts());
  };

  const handleSelectRecordFromVault = (record: SavedRoastRecord) => {
    setBeanProfile(record.beanProfile);
    setSensoryDefect(record.sensoryDefect);
    if (record.cuppingScores) {
      setCuppingScores(record.cuppingScores);
    }
    if (record.appearance) {
      setAppearance(record.appearance);
    }
    setDiagnosis(record.diagnosis);
    setSelectedPresetId(undefined);
    setIsCurrentSaved(true);
    setCurrentTab('diagnostics');
  };

  const handleResetForm = () => {
    setBeanProfile({ ...BLANK_BEAN });
    setTelemetry({ ...BLANK_TELEMETRY });
    setSensoryDefect('');
    setCuppingScores({ ...BLANK_CUPPING_SCORES, flavor_notes: [] });
    setAppearance({ ...BLANK_APPEARANCE, visual_defects: [] });
    setNotes('');
    setImageFile(null);
    setSelectedPresetId(undefined);
    setDiagnosis(null);
    setIsCurrentSaved(false);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0D0F12] text-slate-100 flex flex-row font-sans" dir="rtl">
      {/* Right-Side Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        vaultCount={savedRoasts.length}
        onSelectPreset={handleSelectPreset}
        onOpenGuide={() => setIsGuideOpen(true)}
        onResetData={handleResetForm}
        selectedPresetId={selectedPresetId}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          vaultCount={savedRoasts.length}
          onOpenGuide={() => setIsGuideOpen(true)}
          selectedPresetId={selectedPresetId}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between gap-3 text-xs text-rose-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {currentTab === 'vault' ? (
          <RoastVault
            records={savedRoasts}
            onSelectRecord={handleSelectRecordFromVault}
            onDeleteRecord={handleDeleteRecord}
            onNewDiagnosis={() => setCurrentTab('diagnostics')}
          />
        ) : currentTab === 'trainer' ? (
          <TrainerMode />
        ) : currentTab === 'scaler' ? (
          <BatchScaler />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Right Panel: 4-Step Input Form (Takes 5 cols on lg) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#D97724]" />
                  <span>معطيات وبيانات مسار التحميص</span>
                </span>
                {selectedPresetId && (
                  <span className="text-[11px] text-[#D97724] bg-[#D97724]/10 border border-[#D97724]/30 px-2 py-0.5 rounded-full font-mono">
                    مثال جاهز محمل
                  </span>
                )}
              </div>

              <RoastInputPanel
                beanProfile={beanProfile}
                setBeanProfile={setBeanProfile}
                telemetry={telemetry}
                setTelemetry={setTelemetry}
                sensoryDefect={sensoryDefect}
                setSensoryDefect={setSensoryDefect}
                cuppingScores={cuppingScores}
                setCuppingScores={setCuppingScores}
                appearance={appearance}
                setAppearance={setAppearance}
                notes={notes}
                setNotes={setNotes}
                imageFile={imageFile}
                setImageFile={setImageFile}
                onSubmit={handleSubmitDiagnosis}
                onReset={handleResetForm}
                isLoading={isLoading}
                selectedPresetId={selectedPresetId}
              />
            </div>

            {/* Left Panel: Diagnostic Dashboard OR Zeroed State Welcome (Takes 7 cols on lg) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#38BDF8]" />
                  <span>نتائج الفحص والتحليل الديناميكي الحراري</span>
                </span>
                {diagnosis && (
                  <span className="text-[11px] font-mono text-slate-400">
                    نموذج التشخيص: Gemini 3.8 Flash
                  </span>
                )}
              </div>

              {diagnosis ? (
                <DiagnosticDashboard
                  diagnosis={diagnosis}
                  beanProfile={beanProfile}
                  telemetry={telemetry}
                  appearance={appearance}
                  cuppingScores={cuppingScores}
                  notes={notes}
                  sensoryDefect={sensoryDefect}
                  onSaveToVault={handleSaveToVault}
                  isSaved={isCurrentSaved}
                  hasImage={!!imageFile}
                />
              ) : (
                /* Zeroed Fresh State Welcome & Instructions */
                <div className="bg-[#161920] border border-[#262B36] rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-6 min-h-[580px] shadow-xl relative overflow-hidden">
                  <div className="py-2">
                    <IttizanLogo size="lg" />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-lg font-bold text-white">
                      منظومة التشخيص الحراري جاهزة ومفرغة لبياناتك
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      قم بتعبئة بيانات تحميصتك من اللوحة المجاورة عبر المراحل الـ 4، أو جرّب أحد الأمثلة الجاهزة فورياً من الشريط العلوي لمعاينة التحليل الكامل.
                    </p>
                  </div>

                  {/* 4 Steps Showcase */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-right">
                    <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#D97724]/15 border border-[#D97724]/30 text-[#D97724] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        1
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">البن الأخضر</span>
                        <span className="text-[10px] text-slate-400">
                          الكثافة، نسبة الرطوبة، وطريقة المعالجة
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        2
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">المنحنى والصورة</span>
                        <span className="text-[10px] text-slate-400">
                          صورة كروپستر/أرتيزان أو القياسات الرقمية
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        3
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">تذوق SCA الكامل</span>
                        <span className="text-[10px] text-slate-400">
                          المعايير الـ 10 وعجلة النكهات وخصم العيوب
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#0D0F12] p-3.5 rounded-xl border border-[#262B36] flex items-start gap-3">
                      <span className="w-6 h-6 rounded-lg bg-[#A855F7]/15 border border-[#A855F7]/30 text-[#A855F7] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                        4
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">اللون و مظهر</span>
                        <span className="text-[10px] text-slate-400">
                          قراءة الحبوب والمطحون وفارق التدرج (Roast Delta)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Try Presets CTA */}
                  <div className="pt-2 border-t border-[#262B36] w-full max-w-lg flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>هل ترغب بتجربة سريعة وفورية؟</span>
                    </span>
                    <button
                      onClick={() => handleSelectPreset(PRESETS[0], true)}
                      className="px-3 py-1.5 rounded-lg bg-[#0D0F12] hover:bg-[#262B36] border border-[#D97724]/40 text-[#D97724] font-bold transition flex items-center gap-1"
                    >
                      <span>تشغيل مثال RoR Crash</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        </main>

        {/* Luxury Brand Footer */}
        <LuxuryYemenFooter />
      </div>

      {/* Guide Modal */}
      <ThermodynamicGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
