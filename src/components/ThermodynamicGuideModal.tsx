import React from 'react';
import { X, BookOpen, Flame, Wind, Thermometer, Layers, AlertTriangle, Sparkles, Eye } from 'lucide-react';

interface ThermodynamicGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThermodynamicGuideModal: React.FC<ThermodynamicGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#161920] border border-[#262B36] rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#262B36] flex items-center justify-between bg-[#0D0F12]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-[#D97724]" />
            <h3 className="text-base font-bold text-white">
              الدليل الفيزيائي وقوانين الديناميكا الحرارية في التحميص
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#262B36] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Section 1: Phase Ratios */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#F59E0B]">
              <Layers className="w-4 h-4" />
              <h4>1. نسب المراحل الزمنية (Phase Ratios) وفروق التطور</h4>
            </div>
            <ul className="space-y-2 pr-4 list-disc marker:text-[#F59E0B]">
              <li>
                <strong>مرحلة التجفيف (Drying Phase):</strong> النطاق القياسي من <span className="font-mono text-white">35% إلى 45%</span>. أقل من 32% يمثل ضغطاً حرارياً مفرطاً وخطر احتراق السطح (Scorching/Tipping). أعلى من 48% يسبب ضعف الزخم وتسطح النكهات.
              </li>
              <li>
                <strong>مرحلة مايلارد (Maillard Phase):</strong> النطاق القياسي من <span className="font-mono text-white">35% إلى 45%</span>. تجاوز 45% يزيد مركبات الميلانويدين والقوام الثقيل على حساب وضوح الحمضية الزهرية والفاكهية.
              </li>
              <li>
                <strong>نسبة وقت التطور (DTR) وفرق حرارة التطور (ΔT dev = Drop - FC):</strong>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono">
                  <div className="bg-[#161920] p-2 rounded border border-[#262B36]">
                    <span className="text-[#38BDF8] block font-bold">قهوة التقطير (Filter):</span>
                    DTR: 12% - 18% | ΔT dev: 6°C - 10°C
                  </div>
                  <div className="bg-[#161920] p-2 rounded border border-[#262B36]">
                    <span className="text-amber-400 block font-bold">قهوة الإسبريسو (Espresso):</span>
                    DTR: 18% - 24% | ΔT dev: 10°C - 16°C
                  </div>
                </div>
              </li>
              <li className="text-rose-400 font-medium">
                <strong>شرط القهوة المخبوزة (Baked Defect):</strong> يتحقق فيزيائياً إذا تجاوز DTR نسبة 20% بينما فرق حرارة التطور ΔT dev أقل من 6°C.
              </li>
            </ul>
          </div>

          {/* Section 2: RoR Dynamics */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#38BDF8]">
              <Flame className="w-4 h-4" />
              <h4>2. قوانين ديناميكا معدل صعود الحرارة (RoR Dynamics)</h4>
            </div>
            <ul className="space-y-2 pr-4 list-disc marker:text-[#38BDF8]">
              <li>
                <strong>قاعدة التناقص الرتيب:</strong> بعد بلوغ قمة الـ RoR بعد نقطة التحول، يجب أن ينحدر المنحنى بانسيابية تدريجية دون قمم أو انكسارات حادة حتى يستقر عند 20%-35% من قيمة القمة لحظة التفريغ.
              </li>
              <li>
                <strong>الانهيار الحراري (RoR Crash):</strong> هبوط RoR بأكثر من 5°C/min خلال 45 ثانية عند القرقعة الأولى نتيجة تبخر رطوبة نواة الحبة الماص للحرارة بالتزامن مع خفض متأخر للغاز.
                <div className="text-sky-300 mt-1">
                  الحل: خفض الغاز مسبقاً قبل القرقعة بـ 45-60 ثانية ورفع تدفق الهواء (Airflow) فور انطلاق أول فرقعة.
                </div>
              </li>
              <li>
                <strong>القفزة النهائية (RoR Flick):</strong> ارتفاع RoR بمقدار 1.5°C/min أو أكثر في الدقيقة الأخيرة، ما يؤدي لتحلل البوليفينولات وإنتاج جفاف قابض (Astringency) ونكهة رماد.
                <div className="text-sky-300 mt-1">
                  الحل: خفض الغاز تدريجياً وعدم رفع صمام الغاز مطلقاً أثناء مرحلة التطور مع توفير تدفق هواء مناسب.
                </div>
              </li>
            </ul>
          </div>

          {/* Section 3: Green Coffee Modifiers */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#A855F7]">
              <Sparkles className="w-4 h-4" />
              <h4>3. مصفوفة معايرة البن الأخضر (Green Coffee Modifiers)</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#161920] border border-[#262B36]">
                <h5 className="font-bold text-white mb-1">الكثافة العالية (&gt; 820 g/L)</h5>
                <p className="text-slate-400 text-[11px]">
                  مثل البن اليمني والإثيوبي المرتفع؛ بنية خلوية متراصة تتحمل حرارة دخول أعلى وقمة RoR تصل إلى 20-22°C/min لنفاذ الطاقة إلى قلب الحبة.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#161920] border border-[#262B36]">
                <h5 className="font-bold text-white mb-1">الكثافة المنخفضة (&lt; 760 g/L)</h5>
                <p className="text-slate-400 text-[11px]">
                  تتطلب حرارة دخول هادئة وسقف RoR لا يتجاوز 16°C/min لتجنب تفحم الحواف ونقاط التلامس (Tipping/Scorching).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#161920] border border-[#262B36]">
                <h5 className="font-bold text-white mb-1">المعالجة المجففة (Natural)</h5>
                <p className="text-slate-400 text-[11px]">
                  تحتوي على سكريات خارجية حرة؛ تتطلب حرارة دخول أقل بـ 5-10°C من المغسول مع الاعتماد على الحمل الحراري (Airflow) في النصف الثاني.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#161920] border border-[#262B36]">
                <h5 className="font-bold text-white mb-1">المعالجة اللاهوائية (Anaerobic)</h5>
                <p className="text-slate-400 text-[11px]">
                  حساسية قصوى؛ سقف RoR أقصى 14-16°C/min مع تقليص حرارة التفريغ لتفادي احتراق السكريات الكحولية.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: SCA Cupping Standards */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#D97724]">
              <Layers className="w-4 h-4" />
              <h4>4. بروتوكول التذوق الحسي المعياري لـ SCA (SCA Cupping Protocol)</h4>
            </div>
            <ul className="space-y-2 pr-4 list-disc marker:text-[#D97724]">
              <li>
                <strong>تصنيف جودة القهوة المختصة:</strong> المجموع الكلي من 100 نقطة؛ القهوة المختصة يجب أن تحقق 80.00 نقطة فما فوق.
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1 font-mono text-[10px]">
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-amber-300">
                    90 - 100: فائقة (Outstanding)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-emerald-300">
                    85 - 89.75: ممتازة (Excellent)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-sky-300">
                    80 - 84.75: جيدة جداً (Very Good)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-rose-300">
                    &lt; 80: تجارية (Commercial)
                  </div>
                </div>
              </li>
              <li>
                <strong>أثر الديناميكا الحرارية على خصائص الكوب:</strong>
                <p className="mt-1 text-slate-300 text-[11px]">
                  قصر مرحلة مايلارد يعزز الحمضية الفاكهية لكنه قد يقلل من القوام والحلاوة. تطاول مرحلة التطور DTR يزيد من قوام الميلانويدين ولكن إن صاحبه هبوط حراري فإنه يسبب طعم الخبز ويهبط بدرجة النكهة (Flavor) دون 7.25. أي قفزة RoR في النهاية تفرز طعماً قابضاً حاداً يهبط بدرجة الطعم المتبقي (Aftertaste).
                </p>
              </li>
            </ul>
          </div>

          {/* Section 5: Agtron Scale & Roast Delta Spread */}
          <div className="bg-[#0D0F12] p-4 rounded-xl border border-[#262B36] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#38BDF8]">
              <Eye className="w-4 h-4" />
              <h4>5. مقياس الأجترون (Agtron Scale) وفارق التدرج اللوني (Roast Delta)</h4>
            </div>
            <ul className="space-y-2 pr-4 list-disc marker:text-[#38BDF8]">
              <li>
                <strong>تصنيف درجات التحميص وفق بلاطات SCA ومقياس Agtron Gourmet:</strong>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mt-1 font-mono text-[10px]">
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-amber-200">
                    95+: سينامون (#95)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-amber-300">
                    80 - 94: سيتي فلتر (#85)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-[#D97724]">
                    70 - 79: سيتي بلس (#75)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-orange-400">
                    55 - 69: فل سيتي (#65)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-orange-600">
                    45 - 54: فل سيتي+ (#55)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-stone-400">
                    35 - 44: فيينا (#45)
                  </div>
                  <div className="p-1.5 rounded bg-[#161920] border border-[#262B36] text-stone-500">
                    &lt; 35: فرنسي / إيطالي (#25)
                  </div>
                </div>
              </li>
              <li>
                <strong>فارق التدرج بين السطح والقلب (Roast Delta = Ground - Whole):</strong>
                <p className="mt-1 text-slate-300 text-[11px]">
                  قراءة البن المطحون تعكس عمق نضج اللب وتكون عادة أعلى (أفتح) بـ <strong>8 إلى 15 نقطة</strong> من قراءة الحبة الكاملة السطحية. إذا زاد الفارق عن 18-20 نقطة فهذا دليل قاطع على صدمة حرارية سببت تكرمل السطح وبقاء اللب نيئاً (Underdeveloped Core). بينما الفارق الأقل من 4 نقاط يعني تحميصاً بطيئاً متسطحاً فاقداً للحلاوة (Baked).
                </p>
              </li>
              <li>
                <strong>معايير الأجترون بحسب طريقة معالجة البن (Processing Standards) والارتباط الحسي:</strong>
                <p className="mt-1 text-slate-300 text-[11px] leading-relaxed">
                  • <strong>البن المغسول (WASHED):</strong> مطحون 82-92 للفلتر مع دلتا 8-13 لإبراز وضوح الحمضية الستريكية ونظافة الكوب.<br />
                  • <strong>البن المجفف (NATURAL):</strong> مطحون 73-83 للفلتر مع دلتا 9-14؛ السطح يتكرمل أسرع لوجود السكريات الصمغية (Mucilage)؛ احتراق السطح مع لب نيء يسبب طعم السكر المحروق وتخمر لاذع.<br />
                  • <strong>المعالجة اللاهوائية (ANAEROBIC):</strong> مطحون 76-87 للفلتر؛ بنية هشة وحساسية مفرطة؛ التحميص الأغمق من 68 يولد مرارة فينولية قاسية ويدمر النوتات العطرية الفريدة.
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#262B36] bg-[#0D0F12] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#262B36] hover:bg-[#D97724] text-white text-xs font-bold transition"
          >
            إغلاق الدليل
          </button>
        </div>
      </div>
    </div>
  );
};
