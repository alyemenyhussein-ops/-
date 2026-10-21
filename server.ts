import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

const ai = new GoogleGenAI();

const SYSTEM_INSTRUCTION = `أنت كبير مهندسي ديناميكا تحميص القهوة المختصة والمستشار العلمي الأول وخبير معايير جمعية القهوة المختصة العالمية (SCA) والتحليل الطيفي اللوني (Agtron Color Spectroscopy).
مهمتك: إجراء تشخيص فيزيائي وثرموديناميكي وحسي صارم وعميق لمسار تحميص البن، وربط قراءات درجات الحرارة ومعدل الارتفاع (RoR) والمظهر الفيزيائي ولون الأجترون (Agtron) بنتائج التقييم الحسي المعياري (SCA Cupping Form) وطبيعة معالجة البن.

القواعد العلمية والفيزيائية الحاكمة للتحليل:
1. النسب الزمنية للمراحل (Phase Ratios) والدلتا الحرارية:
   - مرحلة التجفيف (Drying Phase): النطاق القياسي 35% إلى 45%. أقل من 32% يعني ضغطاً حرارياً مفرطاً في البداية وخطر احتراق السطح (Scorching/Tipping). أعلى من 48% يعني زخماً حرارياً ابتدائياً ضعيفاً يسبب تسطح النكهات.
   - مرحلة مايلارد (Maillard Phase): النطاق القياسي 35% إلى 45%. أعلى من 45% يزيد الميلانويدين والقوام على حساب سطوع الحمضية والوضوح العطري. أقل من 33% ينتج قواماً خفيفاً وحمضية حادة أو عشبية.
   - نسبة وقت التطور (DTR) وفرق حرارة التطور (Delta_T_dev = حرارة الخروج - حرارة القرقعة الأولى):
     * للمقطر (Filter): DTR بين 12% و18%، وDelta_T_dev بين 6°C و10°C.
     * للإسبريسو (Espresso): DTR بين 18% و24%، وDelta_T_dev بين 10°C و16°C.
     * شرط القهوة المخبوزة (Baked): إذا كان DTR أعلى من 20% بينما Delta_T_dev أقل من 6°C.
     * شرط التطور السطحي السريع والقلب غير الناضج: إذا كان DTR أقل من 13% بينما Delta_T_dev أعلى من 12°C.

2. قوانين ديناميكا معدل الارتفاع (RoR Dynamics):
   - قاعدة التناقص الرتيب: بعد قمة الـ RoR يجب أن ينحدر المنحنى تدريجياً وبشكل سلس حتى ينتهي عند 20% إلى 35% من قيمة القمة.
   - الانهيار الحراري (RoR Crash): هبوط الـ RoR بأكثر من 5°C/min خلال 45 ثانية عند القرقعة الأولى أو بعدها نتيجة خروج بخار الماء الماص للحرارة مع خفض متأخر للغاز. الحل: خفض الغاز قبل القرقعة بـ 45-60 ثانية ورفع تدفق الهواء (Airflow) عند بداية القرقعة.
   - القفزة النهائية (RoR Flick): ارتفاع الـ RoR بمقدار 1.5°C/min أو أكثر في الدقيقة الأخيرة؛ يسبب مرارة دخانية وجفافاً قابضاً (Astringency). الحل: خفض الغاز تدريجياً وزيادة الهواء دون رفع الغاز أبداً في مرحلة التطور.

3. مصفوفة معايرة البن الأخضر (Green Coffee Modifiers):
   - الكثافة العالية (أعلى من 820 g/L كالبن اليمني والإثيوبي المرتفع): تتحمل حرارة دخول أعلى وقمة RoR تصل إلى 20-22°C/min لتغلغل الحرارة لمركز الحبة.
   - الكثافة المنخفضة (أقل من 760 g/L): تتطلب حرارة دخول منخفضة وتحذيراً مبكراً من احتراق الأطراف (Tipping) إذا تجاوز الـ RoR المبدئي 16°C/min.
   - المعالجة المجففة (Natural): تتطلب حرارة دخول أقل بـ 5-10°C من المغسول واعتماداً أكبر على الحمل الحراري (Airflow) في النصف الثاني.
   - المعالجة اللاهوائية (Anaerobic): حساسية حرارية قصوى؛ سقف الـ RoR الأقصى 14-16°C/min مع تقليص حرارة الخروج.

4. قراءة الصور: إذا أرفق المستخدم صورة لمنحنى تحميص، استخرج بدقة أوقات وحرارات (Charge, Turning Point, Yellowing, First Crack, Drop) وتتبع شكل منحنى الـ RoR بصرياً.

5. بروتوكول التقييم والتذوق الحسي بمعايير جمعية القهوة المختصة (SCA Cupping Standards):
   - عند تقييم الكوب، التزم بمعايير استمارة الـ SCA الرسمية (Fragrance/Aroma, Flavor, Aftertaste, Acidity, Body, Balance, Clean Cup, Sweetness, Uniformity, Overall, Defects):
     * الحمضية (Acidity): ترتبط بمدة مايلارد و DTR؛ قصر مايلارد يزيد بريق الحمضية الستريكية ولكن القصر المفرط يسبب حمضية عشبية فجة، بينما إطالتها تخمد الحمضية وتزيد قوام الميلانويدين.
     * النكهة (Flavor) والحلاوة (Sweetness): تفاعلات الكرملة ومايلارد؛ الانهيار الحراري RoR Crash أو التسطح يسبب طعماً مخبوزاً ويهبط بالدرجة لدون 7.00.
     * الطعم المتبقي (Aftertaste): قفزة الـ RoR Flick تنتج مركبات قابضة Astringent ومرارة رماد تفقد الطعم المتبقي نقاءه وطوله.
     * القوام (Body): يرتفع مع توازن التوصيل الحراري وتكوين السكريات المعقدة في مرحلة مايلارد.
   - قم بتوليد كائن sca_cupping_analysis يحتوي على تقييم دقيق لكل خاصية، وتحديد نوتات عجلة النكهات (Flavor Wheel)، والدرجة المعايرة من 100 وتصنيف الجودة.

6. معايير قياس اللون بجهاز الأجترون (Agtron Color Scale) والمظهر الفيزيائي:
   - مقياس الأجترون للذواقة (Agtron Gourmet Scale):
     * فاتح جداً (Very Light / Cinnamon): 95 - 105+
     * فاتح (Light / City): 80 - 95 (المعيار الذهبي لقهوة الفلتر المقطرة لإبراز نوتات المنشأ)
     * متوسط فاتح (Medium-Light / City+): 70 - 80
     * متوسط (Medium / Full City): 55 - 70 (تحميص متزن مشترك أو إسبريسو ناصع)
     * متوسط داكن (Medium-Dark / Full City+): 45 - 55
     * داكن (Dark / Vienna / French): 35 - 45
     * داكن جداً (Very Dark / Italian): 25 - 35
   - الفارق بين الحبة الكاملة والمطحونة (Agtron Delta Spread / RD Value = Ground - Whole):
     * قراءة الحبة الكاملة: تمثل تكرمل السطح الخارجي وقوة التوصيل الحراري.
     * قراءة البن المطحون: تمثل عمق التطور ونضج نواة الحبة.
     * الفارق المتوازن: للتحميص الفاتح 8-14 نقطة، وللمتوسط 6-10 نقاط.
     * التدرج المفرط (> 18): احترق السطح وبقي اللب نيئاً (عشب ورماد وجفاف قابض).
     * التسطح والخبز (< 4 مع وقت طويل): تحميص مخبوز متسطح مسلوب الحلاوة.

7. مصفوفة ربط قياسات لون الأجترون (Agtron) بنتيجة التقييم الحسي ومعايير معالجة البن (Processing & Sensory Agtron Consistency Matrix):
   - يجب ربط قراءات الأجترون (للحبة الكاملة Whole والبن المطحون Ground وفارق التدرج ΔAgtron) مباشرةً بنوع معالجة البن (WASHED, NATURAL, ANAEROBIC, HONEY) وهدف التحضير (FILTER, ESPRESSO, OMNI) ونتائج التقييم الحسي SCA:
     * البن المغسول (WASHED):
       - معايير الأجترون للفلتر: مطحون 82-92، حبة كاملة 74-86، دلتا 8-13. للإسبريسو: مطحون 65-76، حبة كاملة 58-68.
       - ربط اللون بالحسي: البن المغسول ذو كثافة عالية وبنية خلوية متماسكة خالية من الصمغ السطحي. اللون الفاتح (>82) يجب أن يترافق حسياً مع حمضية ستريكية/ماليكية براقة ونظافة كوب تامة (Clean Cup 10/10). إذا كان اللون >82 لكن الكوب ظهر بحمضية عشبية فجة أو طعم قابض (Astringent)، فهذا عدم اتساق يثبت أن الحرارة لم تخترق النواة (لب نيء). وإذا نزل اللون دون 65 للفلتر فهذا يطمس الخصائص الزهرية ويزيد المرارة.
     * البن المجفف (NATURAL):
       - معايير الأجترون للفلتر: مطحون 73-83، حبة كاملة 64-76، دلتا 9-14. للإسبريسو: مطحون 58-68، حبة كاملة 50-60.
       - ربط اللون بالحسي: غني بالسكريات الأحادية والصمغية (Mucilage)؛ يتكرمل السطح أسرع ويقرأ أغمق بـ 4-8 درجات من المغسول لنفس درجة النضج الداخلي.
       - عدم الاتساق الحرج: إذا كان لون الحبة الكاملة داكناً (<60) والمطحون فاتحاً (>76) مع دلتا >16، فهذا يثبت احتراق سكريات السطح وتفحمها، وينعكس حسياً بطعم السكر المحروق (Bittersweet/Burnt Sugar) والمرارة الخشنة مع بقاء اللب غير ناضج وظهور حموضة تخمر لاذعة. التحميص المتسق يحافظ على حلاوة فاكهية نقية (>8.00).
     * البن اللاهوائي والتخمير الممتد (ANAEROBIC):
       - معايير الأجترون للفلتر: مطحون 76-87، حبة كاملة 68-80، دلتا 7-12.
       - ربط اللون بالحسي: بن هش جداً خلوياً وحساس للحرارة لغناه بالأحماض العضوية والمركبات المتطايرة المعقدة. أي تحميص يقل عن 68 للمطحون يدمر النوتات العطرية الفريدة ويحولها إلى طعم دوائي أو فينولي لاذع ومرارة ثقيلة. التحميص المتسق يتطلب لوناً فاتحاً وتدرجاً منخفضاً للحفاظ على تعقيد الكوب ونقائه.
     * البن العسلي (HONEY):
       - توازن بين المغسول والمجفف (فلتر: مطحون 77-87، دلتا 8-13). الحساسية تكمن في الصمغ العسلي المتبقي وخطر احتراقه بالتلامس.
   - حساب process_consistency_score (0-100) و process_consistency_status:
     * قيّم بدقة مدى اتساق اللون مع المعالجة والكوب الحسي. إذا كان اللون محققاً للتوازن المنشئي والحلاوة دون شوائب، فالحالة HIGHLY_CONSISTENT. وإذا كان هناك انحراف طفيف فـ MODERATELY_CONSISTENT. وإذا تعارض اللون مع المعالجة أو أفسد النكهات فـ INCONSISTENT أو CRITICAL_MISMATCH مع تقديم شرح علمي تفصيلي وتوصيات دقيقة.

8. قواعد إنقاذ التحميصات عبر الاستخلاص وكيمياء المياه (Brew & Water Rescue Rules):
بناءً على العيب المشخص في منحنى التحميص، صمم وصفة استخلاص تعويضية للباريستا (للمقطر وللإسبريسو) مع هندسة المياه:
- في حالة القهوة المخبوزة أو انهيار الـ RoR (Baked / Crash): وجه لاستخدام ماء منخفض القلوية جداً (KH: 15-25 ppm) للحفاظ على الحمضية المتبقية، وصلابة كلية مرتفعة غنية بالمغنيسيوم (GH: 80-90 ppm)، مع حرارة تحضير عالية (93-94°C) ونسبة مركزة قصيرة (1:14.5 للمقطر أو 1:1.8 للإسبريسو) لتعزيز القوام والحلاوة.
- في حالة القفزة النهائية أو المرارة الدخانية (RoR Flick / Roasty / Astringent): وجه لخفض حرارة الماء (86-88°C)، طحنة أخشن قليلاً، وتطبيق تقنية التخطي المائي (Bypass Brewing: استخلاص بنسبة 1:12 ثم إضافة ماء نقي للكوب للوصول إلى 1:16 لمنع استخلاص المركبات المرة المتأخرة)، مع ماء متوسط القلوية (KH: 40 ppm) ومنخفض الصلابة (GH: 50 ppm).
- في حالة التطور الناقص أو التحميص السريع (Underdeveloped / Sour / Grassy): وجه لرفع حرارة الماء للحد الأقصى (95-96°C)، طحنة أنعم، إطالة فترة الترطيب المبدئي (Bloom لمدة 60 ثانية مع تحريك)، نسبة أطول (1:17 للمقطر أو 1:2.4 للإسبريسو)، وماء مرتفع القلوية (KH: 60-75 ppm) لمعادلة الأحماض الحادة كيميائياً، مع فترة راحة (Degassing) أطول (12-16 يوماً).
- في حالة الاحتراق السطحي (Scorching / Tipping): وجه لتقنية الحرارة المتدرجة (الترطيب بماء 93°C ثم إكمال الصب بماء 86°C)، مع النفخ للتخلص من القشور (Chaff) بعد الطحن.
- في حالة التحميص المتزن والمثالي (Optimal): قدم الوصفة الذهبية الموصى بها لإبراز إيحاءات البن الأصلية بتوازن مثالي (ماء مثالي GH: 65, KH: 35، حرارة 91-92°C، نسبة 1:15.5-1:16).

9. قواعد ثرموديناميكا تدفق الهواء ومروحة الحمّاصة (Roaster Airflow & Convective Dynamics):
تدفق الهواء وسرعة المروحة (Airflow / Fan Settings) يحددان التوازن الدقيق بين التوصيل (Conduction) والحمل الحراري (Convection):
- مرحلة الإسقاط ونقطة التحول (Charge & Turning Point): تدفق هواء منخفض إلى متوسط (20%-35% أو درجات 2-3.5) لتفادي سحب الحرارة البيئية من الطبل أثناء هبوط الحرارة الماص للطاقة، وتجنب تبريد الحبوب وتأخير نقطة التحول.
- مرحلة التجفيف (Drying Phase): رفع تدفق الهواء تدريجياً إلى 45%-55% لسحب الرطوبة السطحية المتبخرة وبخار الماء الكثيف (Water Vapor Evacuation). تدفق الهواء الضعيف هنا يسبب احتباس الرطوبة وتبخير الحبوب وسلقها (Steaming)، بينما التدفق المفرط يجفف السطح قبل نضج النواة.
- مرحلة مايلارد (Maillard Phase): تدفق هواء متوازن (60%-70%) لتعزيز الحمل الحراري المتجانس وتطوير الميلانويدين والسكريات المعقدة دون تعريض الحبوب لجفاف مفرط يحد من التفاعلات الكيميائية.
- مرحلة القرقعة الأولى والتطوير (First Crack & Development): رفع تدفق الهواء إلى 75%-85%+ إلزامي وحرج للغاية! عند القرقعة الأولى تطلق الحبوب طاقة ماصة للحرارة وتفرغ بخار الماء والغازات الداخلية مع قشور حريرية (Chaff) وأيروسولات زيتية دخانية. إذا لم يُرفع تدفق الهواء فستحدث ظاهرة الانهيار الحراري (RoR Crash) بسبب سحابة الرطوبة الخانقة، أو سيكتسب الكوب طعماً مدخناً قابضاً (Smoky / Astringent) واحتراقاً للقشور الحبيسة.
- تحليل airflow_analysis: احسب نسبة مساهمة الحمل الحراري المقدرة (convective_heat_ratio_percent: عادة 50-75% للحماصات الأسطوانية الحديثة و80-95% للحماصات الهوائية)، وحالة اتزان الهواء (OPTIMAL, INSUFFICIENT, EXCESSIVE)، وحكم كفاءة سحب القشور والدخان، وتوصيات تعديل المروحة للدفعة القادمة.
جميع الشروحات والتوصيات يجب أن تكون باللغة العربية العلمية الدقيقة.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    overall_status: {
      type: Type.STRING,
      enum: ['OPTIMAL', 'NEEDS_ADJUSTMENT', 'CRITICAL_DEFECT'],
      description: 'الحالة الإجمالية لمسار التحميص',
    },
    roast_health_score: {
      type: Type.INTEGER,
      description: 'درجة صحة التحميص وجودة المنحنى الفيزيائية من 0 إلى 100',
    },
    summary_headline: {
      type: Type.STRING,
      description: 'عنوان تشخيصي علمي موجز باللغة العربية',
    },
    extracted_metrics: {
      type: Type.OBJECT,
      properties: {
        charge_temp_c: { type: Type.NUMBER, description: 'حرارة الإسقاط / الدخول بالدرجة المئوية' },
        turning_point_temp_c: { type: Type.NUMBER, description: 'حرارة نقطة التحول بالدرجة المئوية' },
        yellowing_time_sec: { type: Type.NUMBER, description: 'وقت بداية الاصفرار بالثواني' },
        first_crack_temp_c: { type: Type.NUMBER, description: 'حرارة القرقعة الأولى بالدرجة المئوية' },
        first_crack_time_sec: { type: Type.NUMBER, description: 'وقت القرقعة الأولى بالثواني' },
        drop_temp_c: { type: Type.NUMBER, description: 'حرارة التفريغ بالدرجة المئوية' },
        total_time_sec: { type: Type.NUMBER, description: 'الوقت الإجمالي للتحميص بالثواني' },
        temp_development_delta_c: { type: Type.NUMBER, description: 'فرق حرارة التطور Delta_T_dev بالدرجة المئوية (Drop - FC)' },
      },
      required: [
        'charge_temp_c',
        'turning_point_temp_c',
        'yellowing_time_sec',
        'first_crack_temp_c',
        'first_crack_time_sec',
        'drop_temp_c',
        'total_time_sec',
        'temp_development_delta_c',
      ],
    },
    phase_ratios: {
      type: Type.OBJECT,
      properties: {
        drying_pct: { type: Type.NUMBER, description: 'النسبة المئوية لمرحلة التجفيف' },
        maillard_pct: { type: Type.NUMBER, description: 'النسبة المئوية لمرحلة مايلارد' },
        development_pct: { type: Type.NUMBER, description: 'نسبة وقت التطور DTR %' },
        drying_status: { type: Type.STRING, enum: ['BALANCED', 'SHORT', 'EXTENDED'] },
        maillard_status: { type: Type.STRING, enum: ['BALANCED', 'SHORT', 'EXTENDED'] },
        development_status: { type: Type.STRING, enum: ['BALANCED', 'UNDERDEVELOPED', 'OVERDEVELOPED', 'BAKED'] },
      },
      required: [
        'drying_pct',
        'maillard_pct',
        'development_pct',
        'drying_status',
        'maillard_status',
        'development_status',
      ],
    },
    ror_diagnostics: {
      type: Type.OBJECT,
      properties: {
        has_crash: { type: Type.BOOLEAN, description: 'هل حدث انهيار حراري RoR Crash؟' },
        crash_details_ar: { type: Type.STRING, description: 'تفاصيل الانهيار الحراري باللغة العربية' },
        has_flick: { type: Type.BOOLEAN, description: 'هل حدثت قفزة حرارية نهائية RoR Flick؟' },
        flick_details_ar: { type: Type.STRING, description: 'تفاصيل القفزة الحرارية باللغة العربية' },
        is_monotonic_descent: { type: Type.BOOLEAN, description: 'هل انحدر معدل الارتفاع بصورة متناقصة ورتيبة؟' },
        peak_ror_c_min: { type: Type.NUMBER, description: 'أعلى قيمة وصل إليها RoR' },
        end_ror_c_min: { type: Type.NUMBER, description: 'قيمة RoR عند التفريغ' },
      },
      required: [
        'has_crash',
        'crash_details_ar',
        'has_flick',
        'flick_details_ar',
        'is_monotonic_descent',
        'peak_ror_c_min',
        'end_ror_c_min',
      ],
    },
    sensory_correlation: {
      type: Type.OBJECT,
      properties: {
        expected_taste_profile_ar: { type: Type.STRING, description: 'الملف الحسي المتوقع في الكوب' },
        acidity_analysis_ar: { type: Type.STRING, description: 'تحليل طبيعة الحمضية (مشرقة، عشبية، خامدة)' },
        sweetness_body_ar: { type: Type.STRING, description: 'تحليل الحلاوة والقوام' },
        baked_risk: { type: Type.BOOLEAN, description: 'هل يوجد خطر تحميص مخبوز مسلوب النكهة؟' },
        scorched_risk: { type: Type.BOOLEAN, description: 'هل يوجد خطر احتراق سطحي؟' },
        astringency_risk: { type: Type.BOOLEAN, description: 'هل توجد جفافية وقبض في الطعم المتبقي؟' },
      },
      required: [
        'expected_taste_profile_ar',
        'acidity_analysis_ar',
        'sweetness_body_ar',
        'baked_risk',
        'scorched_risk',
        'astringency_risk',
      ],
    },
    sca_cupping_analysis: {
      type: Type.OBJECT,
      description: 'تحليل استمارة التقييم الحسي المعياري لجمعية القهوة المختصة (SCA Cupping Analysis)',
      properties: {
        calibrated_sca_score: { type: Type.NUMBER, description: 'الدرجة المعايرة لجودة الكوب من 100' },
        sca_grade_ar: { type: Type.STRING, description: 'تصنيف درجة الجودة (مختصة فائقة Specialty 85+، ممتازة 80-84.75، جيدة جداً، تجارية)' },
        attributes_eval: {
          type: Type.OBJECT,
          properties: {
            fragrance_aroma_ar: { type: Type.STRING, description: 'تحليل خاصية الرائحة والعطر' },
            flavor_ar: { type: Type.STRING, description: 'تحليل خاصية النكهة وتنوعها' },
            aftertaste_ar: { type: Type.STRING, description: 'تحليل خاصية الطعم المتبقي ونقاوته' },
            acidity_ar: { type: Type.STRING, description: 'تحليل خاصية الحمضية وجودتها' },
            body_ar: { type: Type.STRING, description: 'تحليل خاصية القوام والملمس' },
            balance_ar: { type: Type.STRING, description: 'تحليل خاصية الاتزان' },
          },
          required: [
            'fragrance_aroma_ar',
            'flavor_ar',
            'aftertaste_ar',
            'acidity_ar',
            'body_ar',
            'balance_ar',
          ],
        },
        flavor_wheel_tags: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'نوتات عجلة النكهات SCA البارزة في الكوب',
        },
        cupping_thermodynamic_impact_ar: {
          type: Type.STRING,
          description: 'الأثر الفيزيائي والديناميكي الحراري لمسار التحميص على تقييم الكوب المعياري',
        },
      },
      required: [
        'calibrated_sca_score',
        'sca_grade_ar',
        'attributes_eval',
        'flavor_wheel_tags',
        'cupping_thermodynamic_impact_ar',
      ],
    },
    next_batch_action_plan: {
      type: Type.ARRAY,
      description: 'خطة التدخل والإجراءات للدفعة القادمة مرتبة زمنياً',
      items: {
        type: Type.OBJECT,
        properties: {
          step_number: { type: Type.INTEGER, description: 'رقم الخطوة' },
          stage_name_ar: { type: Type.STRING, description: 'اسم المرحلة بالحمّاصة' },
          control_parameter: {
            type: Type.STRING,
            enum: ['CHARGE_TEMP', 'GAS_POWER', 'AIRFLOW', 'DRUM_SPEED', 'DROP_TIMING'],
            description: 'متغير التحكم الأساسي',
          },
          exact_action_ar: { type: Type.STRING, description: 'الإجراء التشغيلي المحدد بدقة (مثلاً: خفض الغاز بنسبة 20% عند دقيقة 07:15)' },
          expected_effect_ar: { type: Type.STRING, description: 'الأثر الفيزيائي والديناميكي المتوقع على الكوب والمنحنى' },
        },
        required: ['step_number', 'stage_name_ar', 'control_parameter', 'exact_action_ar', 'expected_effect_ar'],
      },
    },
    ghost_curve_target: {
      type: Type.ARRAY,
      description: 'نقاط منحنى RoR الفعلي التقديري ومنحنى الشبح المستهدف المثالي دقيقة بدقيقة',
      items: {
        type: Type.OBJECT,
        properties: {
          time_min: { type: Type.NUMBER, description: 'الدقيقة من وقت التحميص' },
          actual_estimated_ror: { type: Type.NUMBER, description: 'قيمة RoR الفعلية/التقديرية بالدرجة المئوية لكل دقيقة' },
          target_ror: { type: Type.NUMBER, description: 'قيمة RoR لمنحنى الشبح المثالي الموصى به' },
        },
        required: ['time_min', 'actual_estimated_ror', 'target_ror'],
      },
    },
    agtron_appearance_analysis: {
      type: Type.OBJECT,
      description: 'تحليل لون الأجترون وتدرج التطور الداخلي والمظهر بعد التحميص وربطه بالتقييم الحسي ومعايير المعالجة',
      properties: {
        agtron_reading_whole: { type: Type.NUMBER, description: 'قراءة أجترون الحبة الكاملة' },
        agtron_reading_ground: { type: Type.NUMBER, description: 'قراءة أجترون البن المطحون' },
        delta_agtron_spread: { type: Type.NUMBER, description: 'فارق الأجترون بين السطح والقلب (ΔAgtron)' },
        roast_degree_category_ar: { type: Type.STRING, description: 'درجة التحميص وفق مقياس الأجترون (مثلاً: فاتح City، متوسط Full City)' },
        color_hex: { type: Type.STRING, description: 'كود اللون التقريبي بنظام HEX لعرض المظهر (مثلاً: #8B5A2B)' },
        core_vs_surface_gradient_ar: { type: Type.STRING, description: 'تقييم فيزيائي للتدرج الحراري بين السطح والقلب' },
        physical_expansion_evaluation_ar: { type: Type.STRING, description: 'تقييم تمدد وانتفاخ الحبة والزيوت السطحية' },
        thermodynamic_cause_ar: { type: Type.STRING, description: 'التفسير الديناميكي الحراري لنتائج اللون والتمدد' },
        process_consistency_score: {
          type: Type.INTEGER,
          description: 'درجة اتساق لون الأجترون مع معايير معالجة هذا البن وهدف التحضير والتقييم الحسي من 0 إلى 100',
        },
        process_consistency_status: {
          type: Type.STRING,
          enum: ['HIGHLY_CONSISTENT', 'MODERATELY_CONSISTENT', 'INCONSISTENT', 'CRITICAL_MISMATCH'],
          description: 'حالة اتساق لون التحميص مع طبيعة معالجة البن والنتيجة الحسية',
        },
        expected_agtron_range: {
          type: Type.OBJECT,
          properties: {
            min_ground: { type: Type.NUMBER, description: 'الحد الأدنى الموصى به لقراءة المطحون لهذا البن والمعالجة' },
            max_ground: { type: Type.NUMBER, description: 'الحد الأقصى الموصى به لقراءة المطحون لهذا البن والمعالجة' },
            ideal_delta_range: { type: Type.STRING, description: 'نطاق فارق التدرج المثالي ΔAgtron لهذا البن' },
          },
          required: ['min_ground', 'max_ground', 'ideal_delta_range'],
        },
        process_sensory_link_analysis_ar: {
          type: Type.STRING,
          description: 'تحليل علمي مفصل لمدى اتساق لون الأجترون مع طريقة المعالجة (مغسول/مجفف/لاهوائي/عسلي) وربطه مباشرة بنتيجة التقييم الحسي (الحمضية، الحلاوة، القوام، الطعم المتبقي، والعيوب)',
        },
        roast_color_sensory_verdict_ar: {
          type: Type.STRING,
          description: 'خلاصة دقيقة لحكم الذكاء الاصطناعي على توافق اللون الحاصل مع المعايير المستهدفة لهذا البن المعالج',
        },
        process_specific_recommendations_ar: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'توصيات حرارية خاصة بطريقة معالجة هذا البن للوصول للون الأجترون المثالي المتسق مع الكوب',
        },
      },
      required: [
        'agtron_reading_whole',
        'agtron_reading_ground',
        'delta_agtron_spread',
        'roast_degree_category_ar',
        'color_hex',
        'core_vs_surface_gradient_ar',
        'physical_expansion_evaluation_ar',
        'thermodynamic_cause_ar',
        'process_consistency_score',
        'process_consistency_status',
        'expected_agtron_range',
        'process_sensory_link_analysis_ar',
        'roast_color_sensory_verdict_ar',
        'process_specific_recommendations_ar',
      ],
    },
    brew_rescue_protocol: {
      type: Type.OBJECT,
      description: 'بروتوكول إنقاذ الدفعة وهندسة الاستخلاص وكيمياء المياه للباريستا',
      properties: {
        salvageability_percent: {
          type: Type.INTEGER,
          description: 'نسبة إمكانية إنقاذ الدفعة واستخلاص كوب متزن تجارياً وحسياً من 0 إلى 100',
        },
        best_use_recommendation_ar: {
          type: Type.STRING,
          description: 'التوجيه الأفضل لاستخدام الدفعة (مثلاً: مناسبة للمقطر بعد التعديل، أو يفضل توجيهها لمشروبات الحليب والإسبريسو)',
        },
        degassing_rest_days_ar: {
          type: Type.STRING,
          description: 'فترة راحة البن الموصى بها قبل الاستخلاص (مثلاً: 10-14 يوماً لطرد غاز ثاني أكسيد الكربون الزائد)',
        },
        water_chemistry_target: {
          type: Type.OBJECT,
          description: 'هندسة كيمياء مياه التحضير المستهدفة لمعادلة العيب',
          properties: {
            target_gh_ppm: {
              type: Type.STRING,
              description: 'الصلابة الكلية المستهدفة GH ppm (مثل: 85 ppm General Hardness)',
            },
            target_kh_ppm: {
              type: Type.STRING,
              description: 'القلوية المؤقتة المستهدفة KH ppm (مثل: 20 ppm Alkalinity / Buffer)',
            },
            mg_to_ca_ratio: {
              type: Type.STRING,
              description: 'نسبة المغنيسيوم إلى الكالسيوم Mg:Ca (مثل: 3:1 تركيز المغنيسيوم لسحب السكريات)',
            },
            water_explanation_ar: {
              type: Type.STRING,
              description: 'الشرح العلمي لكيفية حماية النكهة ومعادلة العيب عبر كيمياء الماء المختارة',
            },
          },
          required: ['target_gh_ppm', 'target_kh_ppm', 'mg_to_ca_ratio', 'water_explanation_ar'],
        },
        filter_rescue_recipe: {
          type: Type.OBJECT,
          description: 'وصفة الترشيح المقطر التعويضية (V60 / Filter)',
          properties: {
            water_temp_c: {
              type: Type.STRING,
              description: 'درجة حرارة ماء التحضير للفلتر (مثل: 93°C - 94°C)',
            },
            brew_ratio: {
              type: Type.STRING,
              description: 'نسبة الاستخلاص للفلتر (مثل: 1:14.5)',
            },
            grind_adjustment_ar: {
              type: Type.STRING,
              description: 'تعديل درجة الطحن بالنسبة للمعتاد (مثل: أنعم بنقطتين من طحنة الكاليبراشن المعتادة)',
            },
            bloom_and_pour_technique_ar: {
              type: Type.STRING,
              description: 'تكنيك الترطيب والصب الموصى به لمعادلة العيب',
            },
          },
          required: ['water_temp_c', 'brew_ratio', 'grind_adjustment_ar', 'bloom_and_pour_technique_ar'],
        },
        espresso_rescue_recipe: {
          type: Type.OBJECT,
          description: 'وصفة الإسبريسو ومشروبات الحليب التعويضية (Espresso / Milk Drinks)',
          properties: {
            water_temp_c: {
              type: Type.STRING,
              description: 'درجة حرارة ماء الإسبريسو (مثل: 94°C)',
            },
            yield_ratio: {
              type: Type.STRING,
              description: 'نسبة الاستخلاص للإسبريسو (مثل: 1:1.8 Ristretto)',
            },
            shot_time_sec: {
              type: Type.STRING,
              description: 'وقت الاستخلاص المستهدف بالثواني (مثل: 24-26 ثانية)',
            },
            pre_infusion_and_pressure_ar: {
              type: Type.STRING,
              description: 'توجيهات الترطيب المسبق وضغط الاستخلاص',
            },
          },
          required: ['water_temp_c', 'yield_ratio', 'shot_time_sec', 'pre_infusion_and_pressure_ar'],
        },
      },
      required: [
        'salvageability_percent',
        'best_use_recommendation_ar',
        'degassing_rest_days_ar',
        'water_chemistry_target',
        'filter_rescue_recipe',
        'espresso_rescue_recipe',
      ],
    },
    airflow_analysis: {
      type: Type.OBJECT,
      description: 'تحليل ديناميكا تدفق الهواء وسرعة مروحة الحمّاصة وتوازن الحمل الحراري وسحب القشور والدخان',
      properties: {
        convective_heat_ratio_percent: {
          type: Type.INTEGER,
          description: 'نسبة مساهمة الحمل الحراري التقديرية المئوية (Convective Heat Transfer %)',
        },
        airflow_balance_status: {
          type: Type.STRING,
          enum: ['OPTIMAL', 'INSUFFICIENT', 'EXCESSIVE'],
          description: 'حالة اتزان تدفق الهواء الإجمالية',
        },
        verdict_headline_ar: {
          type: Type.STRING,
          description: 'عنوان حكم اتزان تدفق الهواء وسرعة المروحة بالعربية',
        },
        chaff_smoke_clearance_ar: {
          type: Type.STRING,
          description: 'تقييم كفاءة تصريف الدخان وسحب القشور عبر الدورة الهوائية',
        },
        stage_evaluation: {
          type: Type.OBJECT,
          properties: {
            charge_drying_eval_ar: { type: Type.STRING, description: 'تقييم هواء الإسقاط والتجفيف' },
            maillard_eval_ar: { type: Type.STRING, description: 'تقييم تدفق الهواء في مايلارد' },
            first_crack_dev_eval_ar: { type: Type.STRING, description: 'تقييم تدفق الهواء عند القرقعة والتطوير' },
          },
          required: ['charge_drying_eval_ar', 'maillard_eval_ar', 'first_crack_dev_eval_ar'],
        },
        recommended_fan_adjustments_ar: {
          type: Type.STRING,
          description: 'توصيات ضبط مروحة الحمّاصة وتدفق الهواء بدقة للدفعة القادمة',
        },
      },
      required: [
        'convective_heat_ratio_percent',
        'airflow_balance_status',
        'verdict_headline_ar',
        'chaff_smoke_clearance_ar',
        'stage_evaluation',
        'recommended_fan_adjustments_ar',
      ],
    },
  },
  required: [
    'overall_status',
    'roast_health_score',
    'summary_headline',
    'extracted_metrics',
    'phase_ratios',
    'ror_diagnostics',
    'sensory_correlation',
    'next_batch_action_plan',
    'ghost_curve_target',
    'sca_cupping_analysis',
    'agtron_appearance_analysis',
    'brew_rescue_protocol',
    'airflow_analysis',
  ],
};

app.post('/api/diagnose-roast', async (req: Request, res: Response) => {
  try {
    const { image, telemetry, beanProfile, sensoryDefect, cuppingScores, appearance, notes } = req.body;

    const parts: any[] = [];

    if (image?.data) {
      parts.push({
        inlineData: {
          mimeType: image.mimeType || 'image/jpeg',
          data: image.data,
        },
      });
    }

    let textPrompt = `قم بإجراء تشخيص فيزيائي وديناميكي حراري تفصيلي ومتقدم لعملية التحميص التالية:\n\n`;
    textPrompt += `=== خصائص البن الأخضر والهدف ===\n`;
    textPrompt += `- نوع ومصدر البن: ${beanProfile?.name || 'غير محدد'}\n`;
    textPrompt += `- طريقة المعالجة: ${beanProfile?.process || 'WASHED'}\n`;
    textPrompt += `- الكثافة الحجمية: ${beanProfile?.density_g_l || 'غير محدد'} g/L\n`;
    textPrompt += `- نسبة الرطوبة: ${beanProfile?.moisture_pct || 'غير محدد'}%\n`;
    textPrompt += `- الاستخدام المستهدف: ${beanProfile?.targetBrew || 'FILTER'}\n`;
    textPrompt += `- نوع الحمّاصة: ${beanProfile?.roasterType || 'حمّاصة أسطوانية كلاسيكية (Drum Roaster)'}\n\n`;

    if (cuppingScores) {
      textPrompt += `=== تقييم استمارة التذوق المعيارية لجمعية القهوة المختصة (SCA Cupping Form) ===\n`;
      textPrompt += `- العطر والرائحة (Fragrance/Aroma): ${cuppingScores.fragrance_aroma}/10\n`;
      textPrompt += `- النكهة (Flavor): ${cuppingScores.flavor}/10\n`;
      textPrompt += `- الطعم المتبقي (Aftertaste): ${cuppingScores.aftertaste}/10\n`;
      textPrompt += `- الحمضية (Acidity): ${cuppingScores.acidity}/10 (الشدة: ${cuppingScores.acidity_intensity || 'MEDIUM'})\n`;
      textPrompt += `- القوام (Body): ${cuppingScores.body}/10 (المستوى: ${cuppingScores.body_level || 'MEDIUM'})\n`;
      textPrompt += `- الاتزان (Balance): ${cuppingScores.balance}/10\n`;
      textPrompt += `- الحلاوة (Sweetness): ${cuppingScores.sweetness}/10\n`;
      textPrompt += `- النقاء (Clean Cup): ${cuppingScores.clean_cup}/10\n`;
      textPrompt += `- التطابق (Uniformity): ${cuppingScores.uniformity}/10\n`;
      textPrompt += `- التقييم العام (Overall): ${cuppingScores.overall}/10\n`;
      textPrompt += `- خصم العيوب (Defects): -${cuppingScores.defects_points || 0} نقطة\n`;
      textPrompt += `- الدرجة الكلية لـ SCA: ${cuppingScores.total_score}/100\n`;
      if (cuppingScores.flavor_notes?.length) {
        textPrompt += `- نوتات التذوق المسجلة من عجلة النكهات: ${cuppingScores.flavor_notes.join(', ')}\n`;
      }
      textPrompt += `\n`;
    }

    if (appearance) {
      textPrompt += `=== مظهر البن ولون التحميص بمقياس الأجترون (Agtron & Post-Roast Appearance) ===\n`;
      textPrompt += `- مقياس الأجترون: ${appearance.agtron_scale === 'COMMERCIAL' ? 'Agtron Commercial' : 'Agtron Gourmet'}\n`;
      textPrompt += `- قراءة الحبة الكاملة (Whole Bean Agtron): ${appearance.whole_bean_agtron || 'غير محدد'}\n`;
      textPrompt += `- قراءة البن المطحون (Ground Bean Agtron): ${appearance.ground_agtron || 'غير محدد'}\n`;
      if (appearance.whole_bean_agtron && appearance.ground_agtron) {
        const wholeVal = Number(appearance.whole_bean_agtron);
        const groundVal = Number(appearance.ground_agtron);
        const spread = (groundVal - wholeVal);
        textPrompt += `- فارق التدرج الحراري الداخلي/الخارجي (Roast Delta Spread = Ground - Whole): ${spread.toFixed(1)} نقطة\n`;
      }
      textPrompt += `- تمدد الحبة وانفتاح الشق الأوسط: ${appearance.expansion_quality || 'غير محدد'}\n`;
      textPrompt += `- لمعان وزيوت السطح: ${appearance.surface_oil || 'DRY'}\n`;
      textPrompt += `- لون الشق الأوسط (Chaff/Center Cut): ${appearance.center_cut_color || 'غير محدد'}\n`;
      if (appearance.visual_defects?.length) {
        textPrompt += `- عيوب المظهر المرصودة: ${appearance.visual_defects.join(', ')}\n`;
      }
      textPrompt += `\n`;
    }

    if (sensoryDefect) {
      textPrompt += `=== العيب الحسي الملاحظ في الكوب أو فحص التذوق ===\n`;
      textPrompt += `- النتيجة الحسية المبلغ عنها: ${sensoryDefect}\n\n`;
    }

    if (telemetry) {
      textPrompt += `=== القياسات والبيانات الحرارية المدخلة يدوياً ===\n`;
      textPrompt += `- حرارة الإسقاط (Charge Temp): ${telemetry.chargeTempC ? `${telemetry.chargeTempC} °C` : 'غير محدد'}\n`;
      textPrompt += `- نقطة التحول (Turning Point): ${telemetry.turningPointTempC ? `${telemetry.turningPointTempC} °C` : 'غير محدد'} عند ${telemetry.turningPointTime || 'غير محدد'}\n`;
      textPrompt += `- وقت الاصفرار / نهاية التجفيف (Yellowing): ${telemetry.yellowingTime || 'غير محدد'} عند ${telemetry.yellowingTempC ? `${telemetry.yellowingTempC} °C` : 'غير محدد'}\n`;
      textPrompt += `- القرقعة الأولى (First Crack): ${telemetry.firstCrackTime || 'غير محدد'} عند ${telemetry.firstCrackTempC ? `${telemetry.firstCrackTempC} °C` : 'غير محدد'}\n`;
      textPrompt += `- وقت التفريغ (Drop Time): ${telemetry.dropTime || 'غير محدد'} عند حرارة ${telemetry.dropTempC ? `${telemetry.dropTempC} °C` : 'غير محدد'}\n\n`;

      if (telemetry.airflow) {
        const af = telemetry.airflow;
        textPrompt += `=== إعدادات تدفق الهواء وسرعة مروحة الحمّاصة (Airflow & Roaster Fan Settings) ===\n`;
        textPrompt += `- نظام وحدة الهواء: ${af.unit === 'PERCENT' ? 'نسبة مئوية %' : af.unit === 'STEP' ? 'درجات الصمام (Damper Notches)' : af.unit === 'PASCAL' ? 'ضغط تفاضلي (Pa)' : 'سرعة مروحة RPM'}\n`;
        textPrompt += `- هواء الإسقاط ونقطة التحول (Charge Airflow): ${af.chargeAirflow ?? 'غير محدد'}\n`;
        textPrompt += `- هواء مرحلة التجفيف (Drying Airflow): ${af.dryingAirflow ?? 'غير محدد'}\n`;
        textPrompt += `- هواء مرحلة مايلارد (Maillard Airflow): ${af.maillardAirflow ?? 'غير محدد'}\n`;
        textPrompt += `- هواء القرقعة والتطوير (First Crack/Dev Airflow): ${af.firstCrackAirflow ?? 'غير محدد'}\n`;
        if (af.chaffEvacuationRating) {
          textPrompt += `- كفاءة سحب القشور وتصريف الدخان: ${af.chaffEvacuationRating === 'OPTIMAL' ? 'ممتازة وتصريف تام' : af.chaffEvacuationRating === 'MODERATE' ? 'متوسطة' : 'ضعيفة وتراكم قشور ودخان'}\n`;
        }
        if (af.notes) {
          textPrompt += `- ملاحظات حركة الهواء والعادم: ${af.notes}\n`;
        }
        textPrompt += `\n`;
      }
    }

    if (notes) {
      textPrompt += `=== ملاحظات إضافية من الحمّاص ===\n${notes}\n\n`;
    }

    if (image?.data) {
      textPrompt += `ملاحظة هامة: مرفق صورة لمنحنى التحميص (Roast Curve Screenshot). يرجى قراءة المنحنيات (درجة حرارة حبوب البن BT، ودرجة حرارة البيئة ET، ومنحنى معدل الارتفاع RoR) واستخلاص القياسات وتحديد أي شذوذ بصري مثل RoR Crash، RoR Flick، أو عدم انتظام في الانحدار الرتيب بدقة متناهية.\n`;
    }

    textPrompt += `مهم جداً ومطلوب أساسي: قم بربط قياسات لون الأجترون (Agtron للحبة والمطحون وفارق التدرج ΔAgtron) بنتيجة التقييم الحسي (SCA Cupping) ومعايير التحميص المحددة للبن المعالج (${beanProfile?.process || 'WASHED'} لغرض ${beanProfile?.targetBrew || 'FILTER'}). قم بتحليل مدى اتساق اللون كيميائياً وثرموديناميكياً مع خصائص المعالجة ونواتج الاستطعام (الحمضية، الحلاوة، القوام، الطعم المتبقي، والعيوب المحتملة كالخبز Baked أو الاحتراق السطحي Scorching أو العشبية الفجة Grassy)، واملأ كائن agtron_appearance_analysis بالدرجة process_consistency_score وحالة الاتساق process_consistency_status والشرح العلمي المفصل والتوصيات الحرارية الخاصة بطريقة المعالجة.`;
    textPrompt += `\nوكذلك بشكل إلزامي: قم بتصميم كائن "بروتوكول إنقاذ الدفعة وهندسة الاستخلاص وكيمياء المياه (brew_rescue_protocol)" للباريستا لإنقاذ هذه الدفعة وتعويض العيوب المشخصة وفق القواعد العلمية لكيمياء الماء (GH, KH, Mg:Ca) ووصفات الترشيح المقطر (V60) والإسبريسو ونسبة قابلية الإنقاذ (salvageability_percent).`;
    textPrompt += `\nوكذلك بشكل إلزامي: قم بتحليل إعدادات مروحة الحمّاصة وسرعة الهواء (airflow_analysis) وحساب نسبة مساهمة الحمل الحراري Convective %، وتقييم كفاءة طرد بخار الماء وسحب القشور والدخان، وتوفير توصيات هندسية دقيقة لضبط المروحة في الدفعة القادمة.`;
    textPrompt += `\nقم بتوليد التشخيص الكامل بصيغة JSON متوافقة مع المخطط المحدد بدقة، مع حساب نسب المراحل (Drying %, Maillard %, DTR %) وفرق حرارة التطور بدقة ومقارنتها بقواعد التحميص الديناميكي الحراري. كما يجب توفير مصفوفة ghost_curve_target تحوي دقيقة بدقيقة (من دقيقة 1 حتى وقت التفريغ) مقارنة بين الـ RoR الفعلي/المستنتج ومنحنى الشبح RoR المثالي المصحح.`;

    parts.push({ text: textPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error('لم يتم استلام رد من محرك الذكاء الاصطناعي');
    }

    const diagnosis = JSON.parse(outputText);

    // Normalize phase ratios if needed for client display
    if (diagnosis.phase_ratios) {
      diagnosis.phase_ratios.drying_percent = diagnosis.phase_ratios.drying_percent ?? diagnosis.phase_ratios.drying_pct ?? 0;
      diagnosis.phase_ratios.maillard_percent = diagnosis.phase_ratios.maillard_percent ?? diagnosis.phase_ratios.maillard_pct ?? 0;
      diagnosis.phase_ratios.dtr_percent = diagnosis.phase_ratios.dtr_percent ?? diagnosis.phase_ratios.development_pct ?? 0;
    }

    return res.json({ success: true, diagnosis });
  } catch (error: any) {
    console.error('Diagnostic error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'حدث خطأ غير متوقع أثناء معالجة مسار التحميص',
    });
  }
});

// Trainer Mode: Generate a new simulated defective challenge curve
app.post('/api/trainer/generate-challenge', async (req: Request, res: Response) => {
  try {
    const { difficulty = 'INTERMEDIATE' } = req.body;

    const prompt = `أنت كبير مدربي التحميص المحترف وفق معايير SCA.
قم بتوليد سيناريو تدريبي احترافي (Roaster Training Challenge) يحتوي على شذوذ فيزيائي أو حراري خفي (Hidden Thermodynamic Defect).
مستوى الصعوبة المطلوب: ${difficulty} (BEGINNER أو INTERMEDIATE أو EXPERT).
العيوب المتاحة للتضمين (اختر عيباً واحداً بذكاء):
- RoR Crash عند القرقعة الأولى
- RoR Flick في الدقائق الأخيرة من التطور
- تحميص مخبوز Baked (زخم ضعيف، DTR مرتفع مع Delta T أقل من 6°C)
- احتراق سطحي Scorching / Tipping مع قلب غير ناضج (فارق Agtron شاسع > 18)
- ركود حراري Stalling في مرحلة الاصفرار

قم بإرجاع كائن JSON متوافق بدقة مع المخطط التالي:
{
  "id": "challenge-${Date.now()}",
  "title_ar": "عنوان السيناريو التدريبي بالعربية",
  "difficulty": "${difficulty}",
  "scenario_brief_ar": "سياق المشكلة التي واجهها المحمص",
  "beanProfile": {
    "name": "اسم المحصول والمنشأ",
    "process": "WASHED" أو "NATURAL" أو "ANAEROBIC" أو "HONEY",
    "density_g_l": 820,
    "moisture_pct": 11.2,
    "targetBrew": "FILTER" أو "ESPRESSO",
    "roasterType": "نوع المحمصة"
  },
  "telemetry": {
    "chargeTempC": 205,
    "turningPointTempC": 94,
    "turningPointTime": "01:20",
    "yellowingTime": "04:30",
    "yellowingTempC": 152,
    "firstCrackTime": "08:30",
    "firstCrackTempC": 197,
    "dropTime": "10:15",
    "dropTempC": 208
  },
  "appearance": {
    "agtron_scale": "GOURMET",
    "whole_bean_agtron": 75,
    "ground_agtron": 85,
    "expansion_quality": "MEDIUM",
    "surface_oil": "DRY",
    "center_cut_color": "HONEY_BROWN",
    "visual_defects": ["أي عيب بصري ملحوظ إن وجد"]
  },
  "sensory_notes_ar": "الملاحظات الحسية وطعم الكوب الناتج الذي لاحظه الفاحصون",
  "ghost_curve_target": [
    {"time_min": 1, "actual_estimated_ror": 12.0, "target_ror": 15.0, "temp_c": 92},
    {"time_min": 2, "actual_estimated_ror": 18.0, "target_ror": 17.5, "temp_c": 112},
    {"time_min": 3, "actual_estimated_ror": 15.5, "target_ror": 15.0, "temp_c": 130},
    {"time_min": 4, "actual_estimated_ror": 13.0, "target_ror": 13.0, "temp_c": 146},
    {"time_min": 5, "actual_estimated_ror": 11.0, "target_ror": 11.5, "temp_c": 159},
    {"time_min": 6, "actual_estimated_ror": 9.5, "target_ror": 9.8, "temp_c": 171},
    {"time_min": 7, "actual_estimated_ror": 8.0, "target_ror": 8.5, "temp_c": 182},
    {"time_min": 8, "actual_estimated_ror": 6.8, "target_ror": 7.2, "temp_c": 192},
    {"time_min": 9, "actual_estimated_ror": 2.5, "target_ror": 5.5, "temp_c": 199},
    {"time_min": 10, "actual_estimated_ror": 2.0, "target_ror": 4.0, "temp_c": 204}
  ],
  "hiddenAnomaly": {
    "defect_name_ar": "اسم الخلل الحقيقي",
    "defect_category": "ROR_CRASH" أو "ROR_FLICK" أو "SCORCHING" أو "BAKED" أو "UNDERDEVELOPED" أو "STALLING",
    "thermodynamic_cause_ar": "السبب الثرموديناميكي الدقيق لحدوث هذا الشذوذ",
    "optimal_gas_fix_ar": "التعديل الصحيح للشعلة بالوقت والنسبة",
    "optimal_airflow_fix_ar": "التعديل الصحيح لتدفق الهواء وسحب العادم",
    "sensory_impact_ar": "التأثير الحسي المباشر على حمضية وحلاوة وقوام الكوب",
    "agtron_clue_ar": "الدلالة اللونية للأجترون المرتبطة بالخلل"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, challenge: parsed });
  } catch (error: any) {
    console.error('Trainer generate error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'فشل توليد التحدي التدريبي عبر الذكاء الاصطناعي',
    });
  }
});

// Trainer Mode: Grade trainee's answers out of 100
app.post('/api/trainer/grade', async (req: Request, res: Response) => {
  try {
    const { challenge, submission } = req.body;
    if (!challenge || !submission) {
      return res.status(400).json({ success: false, error: 'بيانات التحدي أو إجابة المتدرب غير مكتملة' });
    }

    const prompt = `أنت رئيس لجان تحكيم واختبار حمّاصي القهوة المختصة (Roast Master Examiner).
قم بتقييم إجابة المتدرب بدقة علمية وحيادية صارمة ومنحه درجة مستحقة من 100 نقطة.

=== بيانات التحدي والمنحنى المَعيب ===
- اسم السيناريو: ${challenge.title_ar} (${challenge.difficulty})
- المحصول: ${challenge.beanProfile?.name} (معالجة: ${challenge.beanProfile?.process}، كثافة: ${challenge.beanProfile?.density_g_l} g/L)
- القياسات الحرارية: Charge: ${challenge.telemetry?.chargeTempC}°C, TP: ${challenge.telemetry?.turningPointTempC}°C, Yellowing: ${challenge.telemetry?.yellowingTime}, First Crack: ${challenge.telemetry?.firstCrackTime}, Drop: ${challenge.telemetry?.dropTime} @ ${challenge.telemetry?.dropTempC}°C
- الأجترون: حب كامل: ${challenge.appearance?.whole_bean_agtron || 'غير محدد'}، مطحون: ${challenge.appearance?.ground_agtron || 'غير محدد'}
- الملاحظات الحسية: ${challenge.sensory_notes_ar}

=== الحقيقة المخفية (Model Answer / Ground Truth) ===
- الخلل الفعلي: ${challenge.hiddenAnomaly?.defect_name_ar} (${challenge.hiddenAnomaly?.defect_category})
- السبب الثرموديناميكي: ${challenge.hiddenAnomaly?.thermodynamic_cause_ar}
- تصحيح الغاز المثالي: ${challenge.hiddenAnomaly?.optimal_gas_fix_ar}
- تصحيح الهواء المثالي: ${challenge.hiddenAnomaly?.optimal_airflow_fix_ar}
- الدلالة اللونية: ${challenge.hiddenAnomaly?.agtron_clue_ar || ''}

=== إجابة المتدرب المقدمة للتقييم ===
1. الخلل الفيزيائي المشخص: ${submission.identified_defect_category} - "${submission.defect_description_ar || ''}"
2. خطة تعديل الغاز: الإجراء: ${submission.gas_action} | التوقيت: ${submission.gas_timing_ar || 'غير محدد'} | المقدار: ${submission.gas_magnitude_ar || 'غير محدد'}
3. خطة تعديل تدفق الهواء: الإجراء: ${submission.airflow_action} | التوقيت: ${submission.airflow_timing_ar || 'غير محدد'} | المقدار: ${submission.airflow_magnitude_ar || 'غير محدد'}
4. التفسير الثرموديناميكي للمتدرب: "${submission.thermodynamic_reasoning_ar || 'لم يقدم تفسيراً مفصلاً'}"

=== قواعد التقييم (Grading Rubric) ===
1. تشخيص الخلل الفيزيائي (Defect Identification): [40 نقطة]
   - 40/40 إذا طابق الخلل الفعلي تماماً وفهم مكانه في المنحنى.
   - 20-30/40 إذا كان قريباً جداً في المفهوم.
   - 0-15 إذا أخطأ تماماً في تشخيص العيب.
2. خطة التحكم في الغاز وتدفق الهواء (Gas & Airflow Adjustment): [40 نقطة]
   - 35-40/40 إذا كان توقيت ونسبة تعديل الغاز والهواء دقيقة وفق فيزياء التحميص.
   - 20-30/40 إذا كان الاتجاه صحيحاً لكن التوقيت أو المقدار يحتاج لضبط.
   - 0-15 إذا كانت الاستجابة خاطئة أو ستفاقم المشكلة الحرارية.
3. المنطق الثرموديناميكي ومعايير SCA: [20 نقطة]
   - 18-20/20 إذا أظهر فهماً عميقاً لانتقال الحرارة والتفاعلات الكيميائية ومظهر الأجترون.
   - 10-15/20 إذا كان التعليل سطحي ومقبول.
   - 0-9 إذا كان التفسير ضعيفاً أو مغلوطاً.

أرجع النتيجة بصيغة JSON حصراً بهذا المخطط:
{
  "total_score": 88,
  "grade_tier_ar": "خبير تحميص معتمد (Master Roaster)" أو "حمّاص متقدم (Advanced Roaster)" أو "حمّاص ممارس (Practitioner)" أو "متدرب يحتاج لإعادة المحاولة (Trainee - Retry)",
  "score_breakdown": {
    "defect_identification": 36,
    "control_adjustments": 34,
    "thermodynamic_reasoning": 18
  },
  "overall_feedback_ar": "تقييم عام مشجع ودقيق لإجابة المتدرب باللغة العربية",
  "defect_critique_ar": "نقد تفصيلي لتشخيصه للخلل مقارنة بالخلل الفعلي",
  "gas_airflow_critique_ar": "نقد تفصيلي لخطة الغاز والهواء وهل كانت ستحل المشكلة في الدفعة القادمة",
  "revealed_truth_ar": "الشرح العلمي الكامل للخلل الخفي وكيفية كشفه من المنحنى والأجترون",
  "key_learning_points_ar": [
    "نقطة تعليمية 1",
    "نقطة تعليمية 2",
    "نقطة تعليمية 3"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, grading: parsed });
  } catch (error: any) {
    console.error('Trainer grading error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'فشل تقييم الإجابة عبر الذكاء الاصطناعي',
    });
  }
});

// Endpoint: Batch Scaler thermodynamic calculation using Gemini
app.post('/api/scaler/calculate', async (req: Request, res: Response) => {
  try {
    const { reference, targetBatchKg } = req.body;

    if (!reference || !targetBatchKg || targetBatchKg <= 0) {
      return res.status(400).json({
        success: false,
        error: 'بيانات غير مكتملة: يرجى تحديد بروفايل التحميص المرجعي وحجم الدفعة المستهدفة بالكيلوجرام.',
      });
    }

    const scaleRatio = targetBatchKg / Math.max(0.1, reference.batchSizeKg);

    const prompt = `أنت كبير مهندسي الديناميكا الحرارية لتحميص القهوة ومصمم محامص القهوة العالمية وخبير تحجيم الدفعات (Batch Size Scaling Engine).
مهمتك: تطبيق القوانين الفيزيائية والثرموديناميكية بدقة لتحجيم بروفايل تحميص مرجعي ناجح (Reference Roast) إلى حجم دفعة جديد (Target Batch Size) مع الحفاظ على نفس مسار RoR ومراحل التطور والنكهة الحسية.

=== البيانات المرجعية (Reference Roast) ===
- حجم الدفعة المرجعية: ${reference.batchSizeKg} كجم
- حرارة الشحن المرجعية (Charge Temp): ${reference.chargeTempC}°C
- نوع المحمصة: ${reference.roasterType || 'DRUM_SINGLE_WALLED'}
- طراز المحمصة: ${reference.roasterModel || 'غير محدد'}
- سرعة الأسطوانة (Drum Speed): ${reference.drumSpeedRpm || 55} دورة/دقيقة (RPM)
- تدفق الهواء المرجعي (Airflow): ${reference.airflowSetting || 'معياري'}
- مستوى الغاز / الطاقة المرجعي: ${reference.gasBaselinePercent || 70}%
- نوع البن والمعالجة: ${reference.beanOrigin || 'بن مختص'} - ${reference.beanProcess || 'WASHED'}
- الكثافة: ${reference.beanDensity || 800} g/L
- توقيت نقطة التحول المتوقع: ${reference.targetTurningPointC || 95}°C
- وقت الاصفرار المرجعي: ${reference.yellowingTimeSec || 280} ثانية
- وقت القرقعة الأولى المرجعي: ${reference.firstCrackTimeSec || 550} ثانية
- وقت التفريغ المرجعي: ${reference.dropTimeSec || 660} ثانية وحرارة التفريغ: ${reference.dropTempC || 208}°C

=== حجم الدفعة المستهدفة الجديدة ===
- حجم الدفعة المطلوب: ${targetBatchKg} كجم
- نسبة التحجيم (Scale Ratio = Target / Reference): ×${scaleRatio.toFixed(2)}

=== القواعد الفيزيائية الحاكمة للتحجيم الثرموديناميكي ===
1. كتلة الأسطوانة الحرارية مقابل كتلة البن (Thermal Mass Ratio):
   - عند تحجيم دفعة أصغر من المرجع، تكون كتلة معدن الأسطوانة هي المهيمنة على الطاقة، مما يرفع خطر الاحتراق السطحي (Scorching/Tipping). يجب خفض حرارة الشحن (Charge Temp) بمقدار يتناسب مع اللوغاريتم لنسبة الكتلة.
   - عند تحجيم دفعة أكبر نحو الطاقة القصوى للمحمصة، تمتص كمية البن الباردة طاقة الأسطوانة بسرعة فائقة مما يسبب ركوداً وهبوطاً حاداً في نقطة التحول (Turning Point). يجب رفع حرارة الشحن لضمان زخم حراري كافٍ.
2. قياس الغاز والطاقة (Burner Power Scaling Law):
   - طاقة الحارق لا تتغير بنسبة خطية 1:1 بسبب الفواقد الإشعاعية عبر الهيكل وحرارة العادم. القانون شبه الخطي P_target = P_ref * (m_target/m_ref)^gamma حيث gamma بين 0.75 و0.85 لمحامص الأسطوانة.
3. ديناميكا تدفق الهواء والحمل الحراري (Airflow & Convective Transfer):
   - تدفق الهواء يتحكم في معامل الانتقال بالحمل h_c وفي معدل إخلاء بخار الماء المتطاير وقشور البن (Chaff). الدفعة الكبيرة تتطلب رفع الهواء تدريجياً لزيادة سعة الإخلاء الحجمي وتفادي اختناق العادم، بينما الدفعة الصغيرة تحتاج خفض الهواء لمنع التبريد الهوائي المفرط للكتلة الصغيرة.
4. سرعة دوران الأسطوانة ورقم فرود (Drum Speed & Froude Number):
   - ضبط دوران الأسطوانة للحفاظ على نمط التدفق شبه الشلالي (Cascading Bed) وتفادي تطاير الحبوب أو التصاقها بجدار الأسطوانة الساخن.

أخرج النتيجة بصيغة JSON حصرية ودقيقة مطابقة للمخطط التالي:
{
  "reference": {
    "batchSizeKg": ${reference.batchSizeKg},
    "chargeTempC": ${reference.chargeTempC},
    "gasBaselinePercent": ${reference.gasBaselinePercent || 70},
    "airflowSetting": "${reference.airflowSetting || '35 Pa'}",
    "drumSpeedRpm": ${reference.drumSpeedRpm || 55},
    "roasterType": "${reference.roasterType || 'DRUM_SINGLE_WALLED'}",
    "roasterModel": "${reference.roasterModel || ''}"
  },
  "target": {
    "batchSizeKg": ${targetBatchKg},
    "scaleRatio": ${Number(scaleRatio.toFixed(2))},
    "recommendedChargeTempC": 208,
    "chargeTempDeltaC": 8,
    "recommendedGasScalingPercent": 75,
    "gasScaleFactor": 1.45,
    "recommendedAirflowSetting": "رفع الهواء بنسبة +20%",
    "airflowDeltaDescription": "تعديل تدفق الهواء لسحب الرطوبة المتزايدة",
    "recommendedDrumSpeedRpm": 57,
    "drumSpeedDeltaRpm": 2
  },
  "phaseByPhaseGuidance": [
    {
      "phase": "الشحن ونقطة التحول (Charge & Turning Point)",
      "timingTarget": "70 - 85 ثانية",
      "gasAdjustment": "تفاصيل دقيقة لضبط الغاز",
      "airflowAdjustment": "تفاصيل تدفق الهواء",
      "thermodynamicNotes": "الشرح الفيزيائي للمرحلة"
    },
    {
      "phase": "مرحلة التجفيف والاصفرار (Drying to Yellowing)",
      "timingTarget": "وقت الاصفرار المستهدف",
      "gasAdjustment": "تعديل الغاز",
      "airflowAdjustment": "تعديل تدفق الهواء",
      "thermodynamicNotes": "الملاحظة الثرموديناميكية"
    },
    {
      "phase": "مرحلة مايلارد (Maillard Phase)",
      "timingTarget": "المدة الزمنية لمرحلة مايلارد",
      "gasAdjustment": "تخفيضات الغاز لضمان RoR متناقص",
      "airflowAdjustment": "ضبط الهواء لدعم الحمل",
      "thermodynamicNotes": "الملاحظة الفيزيائية"
    },
    {
      "phase": "القرقعة الأولى والتطوير (First Crack & Development)",
      "timingTarget": "توقيت القرقعة ونسبة DTR",
      "gasAdjustment": "التحكم المسبق لتفادي Crash أو Flick",
      "airflowAdjustment": "رفع الهواء لتنقية الدخان",
      "thermodynamicNotes": "السيطرة على التفاعل الطارد"
    }
  ],
  "thermodynamicAnalysis": {
    "thermalMassRatioDescription": "وصف دقيق باللغة العربية لكيفية تغير نسبة الكتلة الحرارية وتأثيرها على نقل الحرارة",
    "convectiveDominanceDescription": "توصيف نسبة الحمل إلى التوصيل الحراري لنوع المحمصة",
    "criticalRisks": [
      "خطر فيزيائي محتمل 1 مع أسلوب تجنبه",
      "خطر فيزيائي محتمل 2 مع أسلوب تجنبه",
      "خطر فيزيائي محتمل 3 مع أسلوب تجنبه"
    ],
    "actionSummary_ar": "ملخص تنفيذي موجز ومباشر لخطة التحميص الجديدة للمحمصة",
    "scientificRationale_ar": "التعليل العلمي الكامل المبني على معادلات انتقال الحرارة وقوانين التحميص"
  },
  "simulatedRoRCurve": [
    {
      "timeSec": 0,
      "referenceRoR": 18.0,
      "scaledRoR": 19.2,
      "referenceBeanTemp": 200,
      "scaledBeanTemp": 208
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.15,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, plan: parsed });
  } catch (error: any) {
    console.error('Batch scaler calculation error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'فشل حساب التحجيم عبر الذكاء الاصطناعي',
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Roast Diagnostics server running on port ${port}`);
  });
}

startServer();
