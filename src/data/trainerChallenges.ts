import { TrainerChallenge } from '../types';

export const TRAINER_CHALLENGES: TrainerChallenge[] = [
  {
    id: 'challenge-ror-crash',
    title_ar: 'الانهيار الحراري الكلاسيكي عند القرقعة الأولى (RoR Crash)',
    difficulty: 'INTERMEDIATE',
    scenario_brief_ar:
      'محصول إثيوبي مجفف تم تحميصه لغرض قهوة الفلتر. لاحظ العميل غياب النوتات العطرية الزهرية وظهور طعم مسطح يشبه الكرتون الرطب في الكوب.',
    beanProfile: {
      name: 'إثيوبيا قوجي مجففة (Guji Natural)',
      process: 'NATURAL',
      density_g_l: 810,
      moisture_pct: 11.2,
      targetBrew: 'FILTER',
      roasterType: 'محمصة طبل تقليدية (Drum Roaster 2.5kg)',
    },
    telemetry: {
      chargeTempC: 204,
      turningPointTempC: 93,
      turningPointTime: '01:20',
      yellowingTime: '04:40',
      yellowingTempC: 151,
      firstCrackTime: '08:35',
      firstCrackTempC: 198,
      dropTime: '10:15',
      dropTempC: 206,
    },
    appearance: {
      agtron_scale: 'GOURMET',
      whole_bean_agtron: 80,
      ground_agtron: 89,
      expansion_quality: 'MEDIUM',
      surface_oil: 'DRY',
      center_cut_color: 'HONEY_BROWN',
      visual_defects: [],
    },
    sensory_notes_ar:
      'غياب حلاوة الخوخ المتوقعة، نكهة مسطحة وخافتة (Baked/Flat)، حمضية كامدة، وطعم متبقي قصير مع لمحة سيلولوز باهتة.',
    ghost_curve_target: [
      { time_min: 1, actual_estimated_ror: 12.0, target_ror: 14.5, temp_c: 90 },
      { time_min: 2, actual_estimated_ror: 18.0, target_ror: 17.5, temp_c: 110 },
      { time_min: 3, actual_estimated_ror: 15.5, target_ror: 15.0, temp_c: 128 },
      { time_min: 4, actual_estimated_ror: 13.0, target_ror: 13.0, temp_c: 144 },
      { time_min: 5, actual_estimated_ror: 11.2, target_ror: 11.5, temp_c: 157 },
      { time_min: 6, actual_estimated_ror: 9.8, target_ror: 10.0, temp_c: 170 },
      { time_min: 7, actual_estimated_ror: 8.5, target_ror: 8.8, temp_c: 182 },
      { time_min: 8, actual_estimated_ror: 7.2, target_ror: 7.5, temp_c: 193 },
      { time_min: 8.5, actual_estimated_ror: 6.8, target_ror: 6.8, temp_c: 198 },
      { time_min: 9, actual_estimated_ror: 2.1, target_ror: 5.8, temp_c: 201 }, // Severe crash!
      { time_min: 9.5, actual_estimated_ror: 1.8, target_ror: 5.0, temp_c: 203 },
      { time_min: 10, actual_estimated_ror: 2.5, target_ror: 4.2, temp_c: 205 },
      { time_min: 10.25, actual_estimated_ror: 2.2, target_ror: 3.8, temp_c: 206 },
    ],
    hiddenAnomaly: {
      defect_name_ar: 'الانهيار الحراري لمعدل الارتفاع (RoR Crash)',
      defect_category: 'ROR_CRASH',
      thermodynamic_cause_ar:
        'عند بداية القرقعة الأولى (08:35)، حدث انفجار مفاجئ لبخار الماء الماص للحرارة (Endothermic Moisture Flash). تأخر الحمّاص في خفض الشعلة ثم خفضها بقوة شديدة في نفس لحظة القرقعة مع إبقاء تدفق الهواء منخفضاً، مما أدى لانهيار الـ RoR من 6.8 إلى 1.8°C/min واختناق الزخم الحراري وتوقف تفاعلات الكرملة الناضجة.',
      optimal_gas_fix_ar:
        'قم بخفض الغاز تدريجياً بنسبة 25-30% قبل موعد القرقعة الأولى بـ 45 إلى 60 ثانية (عند الدقيقة 07:45 تقريباً) لتهدئة تسارع الحبوب بدلاً من خفضها الفجائي أثناء القرقعة.',
      optimal_airflow_fix_ar:
        'ارفع تدفق الهواء (Airflow) بدرجة أو درجتين قبل القرقعة الأولى بـ 30 ثانية للمساعدة في سحب بخار الماء الكثيف ومنع تراكم الغازات الرطبة العازلة حول مجس الحرارة.',
      sensory_impact_ar:
        'يسبب تفلطح الكوب وتكون طعم مخبوز كامد (Baked/Cardboard) وفقدان التعقيد العطري والزهري المميز للمحاصيل الإثيوبية.',
      agtron_clue_ar: 'فارق الأجترون 9 درجات متقارب مع بطء التطور مما يعكس تلبد الكوب.',
    },
  },
  {
    id: 'challenge-ror-flick',
    title_ar: 'القفزة الحرارية العنيفة في التطور (RoR Flick)',
    difficulty: 'BEGINNER',
    scenario_brief_ar:
      'محصول كولومبي مغسول تم تحميصه بمستوى فلتر متوسط-فاتح، لكن عند التذوق الحسي اشتكى الفاحصون من جفاف قابض حاد في الحلق ومرارة رماد دخانية تطغى على النهاية.',
    beanProfile: {
      name: 'كولومبيا هويلا مغسول (Huila Supremo)',
      process: 'WASHED',
      density_g_l: 830,
      moisture_pct: 10.8,
      targetBrew: 'FILTER',
      roasterType: 'محمصة هواء ساخن وتوصيل (Giesen W6A)',
    },
    telemetry: {
      chargeTempC: 212,
      turningPointTempC: 96,
      turningPointTime: '01:15',
      yellowingTime: '04:30',
      yellowingTempC: 152,
      firstCrackTime: '08:15',
      firstCrackTempC: 196,
      dropTime: '10:05',
      dropTempC: 211,
    },
    appearance: {
      agtron_scale: 'GOURMET',
      whole_bean_agtron: 71,
      ground_agtron: 80,
      expansion_quality: 'MEDIUM',
      surface_oil: 'SLIGHT_SWEAT',
      center_cut_color: 'DARK_UNIFORM',
      visual_defects: ['احتراق خفيف في الشق (Darkened Chaff)'],
    },
    sensory_notes_ar:
      'مرارة لاذعة وقابضة (Astringent / Dry Mouthfeel)، طعم رماد ودخان خفيف في مؤخرة الحلق، حجب النكهات الفاكهية اللطيفة.',
    ghost_curve_target: [
      { time_min: 1, actual_estimated_ror: 13.5, target_ror: 15.0, temp_c: 95 },
      { time_min: 2, actual_estimated_ror: 18.5, target_ror: 18.0, temp_c: 114 },
      { time_min: 3, actual_estimated_ror: 16.0, target_ror: 15.5, temp_c: 132 },
      { time_min: 4, actual_estimated_ror: 13.5, target_ror: 13.2, temp_c: 148 },
      { time_min: 5, actual_estimated_ror: 11.5, target_ror: 11.5, temp_c: 161 },
      { time_min: 6, actual_estimated_ror: 9.8, target_ror: 9.8, temp_c: 173 },
      { time_min: 7, actual_estimated_ror: 8.2, target_ror: 8.4, temp_c: 183 },
      { time_min: 8, actual_estimated_ror: 6.8, target_ror: 7.0, temp_c: 194 },
      { time_min: 8.5, actual_estimated_ror: 5.5, target_ror: 6.0, temp_c: 199 },
      { time_min: 9, actual_estimated_ror: 3.5, target_ror: 4.8, temp_c: 203 },
      { time_min: 9.5, actual_estimated_ror: 6.2, target_ror: 3.8, temp_c: 207 }, // Sudden flick!
      { time_min: 10, actual_estimated_ror: 5.8, target_ror: 3.0, temp_c: 211 },
    ],
    hiddenAnomaly: {
      defect_name_ar: 'القفزة الحرارية لمعدل الارتفاع (RoR Flick)',
      defect_category: 'ROR_FLICK',
      thermodynamic_cause_ar:
        'في الدقيقة الأخيرة من التحميص، تحولت الحبوب إلى تفاعل طارد للحرارة (Exothermic Reaction)، وقام الحمّاص إما برفع الغاز أو ترك كمية طاقة مفرطة في الطبل مع تدفق هواء غير كافٍ، فقفز الـ RoR من 3.5 إلى أكثر من 6.2°C/min مما سبب احتراقاً جزئياً للمركبات العطرية المتكونة حديثاً.',
      optimal_gas_fix_ar:
        'خفض الغاز إلى الحد الأدنى (أو التوقف تماماً عن إمداد غاز إضافي) بعد الدقيقة التاسعة، وعدم رفع الغاز نهائياً أثناء مرحلة التطور (DTR).',
      optimal_airflow_fix_ar:
        'رفع سحب الهواء (Airflow) في نهاية التحميص لتبريد البيئة الحرارية وسحب الدخان العادم المتولد من تفكك السكريات.',
      sensory_impact_ar:
        'ينتج مركبات كربونية قابضة ومرارة قاسية تحرم الكوب من النقاء وتترك جفافاً منفراً.',
      agtron_clue_ar: 'تكون عرق زيتي خفيف (Slight Sweat) على حبة بدرجة 71 أجترون يشير لتلف حراري سطحي.',
    },
  },
  {
    id: 'challenge-scorching-raw-core',
    title_ar: 'احتراق السطح والقلب النيء (Surface Scorching & Underdeveloped Core)',
    difficulty: 'EXPERT',
    scenario_brief_ar:
      'محصول برازيلي منخفض الكثافة ومجفف تم إسقاطه بحرارة عالية، فأظهر الكوب طعماً عشبياً لاذعاً ممتزجاً مع طعم فول سوداني محروق وقشرة بندق.',
    beanProfile: {
      name: 'البرازيل سيرادو مجفف (Cerrado NY2)',
      process: 'NATURAL',
      density_g_l: 735,
      moisture_pct: 11.8,
      targetBrew: 'ESPRESSO',
      roasterType: 'محمصة طبل حديدية (Cast Iron Drum Roaster)',
    },
    telemetry: {
      chargeTempC: 228,
      turningPointTempC: 108,
      turningPointTime: '00:55',
      yellowingTime: '03:40',
      yellowingTempC: 155,
      firstCrackTime: '07:10',
      firstCrackTempC: 197,
      dropTime: '08:50',
      dropTempC: 213,
    },
    appearance: {
      agtron_scale: 'GOURMET',
      whole_bean_agtron: 54,
      ground_agtron: 76,
      expansion_quality: 'POOR',
      surface_oil: 'SLIGHT_SWEAT',
      center_cut_color: 'WHITE_PALE',
      visual_defects: ['احتراق الأطراف (Tipping)', 'بقع احتراق الوجه (Facing/Scorching)'],
    },
    sensory_notes_ar:
      'طعم قشر الفول السوداني (Peanut skin)، حمضية عشبية غير ناضجة (Vegetal/Grassy)، مرارة فحمية حارقة، وشق وسطي باهت جداً.',
    ghost_curve_target: [
      { time_min: 1, actual_estimated_ror: 22.5, target_ror: 15.0, temp_c: 108 },
      { time_min: 2, actual_estimated_ror: 23.0, target_ror: 18.0, temp_c: 134 },
      { time_min: 3, actual_estimated_ror: 17.0, target_ror: 15.0, temp_c: 153 },
      { time_min: 4, actual_estimated_ror: 11.0, target_ror: 12.5, temp_c: 168 },
      { time_min: 5, actual_estimated_ror: 8.5, target_ror: 10.5, temp_c: 180 },
      { time_min: 6, actual_estimated_ror: 6.8, target_ror: 8.5, temp_c: 190 },
      { time_min: 7, actual_estimated_ror: 5.5, target_ror: 7.0, temp_c: 196 },
      { time_min: 8, actual_estimated_ror: 4.0, target_ror: 5.5, temp_c: 206 },
      { time_min: 8.8, actual_estimated_ror: 3.0, target_ror: 4.2, temp_c: 213 },
    ],
    hiddenAnomaly: {
      defect_name_ar: 'احتراق السطح والقلب النيء (Scorching & Underdeveloped Core)',
      defect_category: 'SCORCHING',
      thermodynamic_cause_ar:
        'الحبوب ذات كثافة منخفضة (735 g/L) ومعالجة مجففة غنية بالسكريات السطحية سريعة التكرمل، ولكن تم إدخالها بحرارة إسقاط مفرطة (228°C) مع شعلة قوية جداً في البداية. أدى ذلك لتوصيل حراري سطحي عنيف أحرق جدران الخلايا الخارجية بينما ظل مركز الحبة بارداً وعاجزاً عن التطور، مما أحدث فارق أجترون شاسع بلغ 22 نقطة!',
      optimal_gas_fix_ar:
        'خفض حرارة الإسقاط (Charge Temp) إلى 192-198°C، والبدء بشعلة غاز معتدلة (50-60%) لمنع تجاوز الـ RoR الابتدائي حاجز 16°C/min.',
      optimal_airflow_fix_ar:
        'زيادة سرعة الطبل (Drum RPM) لتسريع دوران الحبوب ومنع ملامستها الطويلة لسطح الطبل الساخن، مع فتح تدفق الهواء تدريجياً لتعزيز التسخين بالحمل الحراري بدلاً من التوصيل المباشر.',
      sensory_impact_ar:
        'تناقض حسي مزعج يجمع بين طعم الحبوب النيئة العشبية في المركز ومرارة الاحتراق على السطح.',
      agtron_clue_ar:
        'قراءة الحبة الكاملة 54 (متوسط داكن) بينما المطحون 76 (فاتح جداً)؛ فارق دلتا 22 مؤشر قاطع على اختلال التدرج الداخلي.',
    },
  },
  {
    id: 'challenge-baked-roast',
    title_ar: 'التحميص المخبوز وفقدان الحيوية (Baked Defect: Flat Momentum)',
    difficulty: 'INTERMEDIATE',
    scenario_brief_ar:
      'محصول كيني عالي الكثافة تم تحميصه ببطء شديد وبزخم حراري متواضع، فتحول الكوب إلى نكهة خبز قمح وخبز محمص خالية من أي بريق حمضي.',
    beanProfile: {
      name: 'كينيا نيري مغسول AA (Nyeri Hill AA)',
      process: 'WASHED',
      density_g_l: 855,
      moisture_pct: 11.5,
      targetBrew: 'FILTER',
      roasterType: 'محمصة غاز تجارية 5 كجم',
    },
    telemetry: {
      chargeTempC: 192,
      turningPointTempC: 86,
      turningPointTime: '01:45',
      yellowingTime: '05:55',
      yellowingTempC: 150,
      firstCrackTime: '10:20',
      firstCrackTempC: 196,
      dropTime: '12:55',
      dropTempC: 201,
    },
    appearance: {
      agtron_scale: 'GOURMET',
      whole_bean_agtron: 68,
      ground_agtron: 71,
      expansion_quality: 'POOR',
      surface_oil: 'DRY',
      center_cut_color: 'HONEY_BROWN',
      visual_defects: [],
    },
    sensory_notes_ar:
      'طعم قشرة الخبز المحمص والقمح (Bread crust/Baked)، فقدان تام لحمضية الكشمش الأسود الكينية، قوام ميت، حلاوة متبلدة.',
    ghost_curve_target: [
      { time_min: 1, actual_estimated_ror: 8.0, target_ror: 15.0, temp_c: 88 },
      { time_min: 2, actual_estimated_ror: 12.0, target_ror: 18.0, temp_c: 104 },
      { time_min: 3, actual_estimated_ror: 11.5, target_ror: 16.0, temp_c: 119 },
      { time_min: 4, actual_estimated_ror: 9.0, target_ror: 14.0, temp_c: 133 },
      { time_min: 5, actual_estimated_ror: 7.2, target_ror: 12.0, temp_c: 144 },
      { time_min: 6, actual_estimated_ror: 5.5, target_ror: 10.0, temp_c: 154 },
      { time_min: 7, actual_estimated_ror: 4.8, target_ror: 8.8, temp_c: 166 },
      { time_min: 8, actual_estimated_ror: 4.2, target_ror: 7.8, temp_c: 177 },
      { time_min: 9, actual_estimated_ror: 3.8, target_ror: 6.8, temp_c: 187 },
      { time_min: 10, actual_estimated_ror: 3.2, target_ror: 5.8, temp_c: 195 },
      { time_min: 11, actual_estimated_ror: 2.2, target_ror: 4.8, temp_c: 198 },
      { time_min: 12, actual_estimated_ror: 1.8, target_ror: 3.8, temp_c: 200 },
      { time_min: 12.9, actual_estimated_ror: 1.2, target_ror: 3.0, temp_c: 201 },
    ],
    hiddenAnomaly: {
      defect_name_ar: 'التحميص المخبوز (Baked Defect)',
      defect_category: 'BAKED',
      thermodynamic_cause_ar:
        'حبوب الكينيا ذات كثافة فائقة (855 g/L) تتطلب طاقة حرارية ابتدائية قوية لنفاذ الحرارة، ولكن تم إسقاطها بحرارة متدنية (192°C) مع شعلة خاملة، فتسطح الـ RoR وظل يزحف دون 5°C/min لمعظم وقت التحميص. استمر التطور لأكثر من دقيقتين ونصف لكن الحرارة لم ترتفع سوى 5°C فقط (Delta T = 5°C مع DTR = 19.9%) وهو الشرط الفيزيائي الصارم للقهوة المخبوزة.',
      optimal_gas_fix_ar:
        'رفع حرارة الإسقاط إلى 208-212°C وتكثيف الشعلة في مرحلة التجفيف لخلق زخم صعودي قوي للـ RoR يصل إلى 18-20°C/min.',
      optimal_airflow_fix_ar:
        'ضبط تدفق الهواء على مستوى معتدل في البداية حتى لا يسلب حرارة الطبل، ثم رفعه عند الاصفرار للحفاظ على انتقال حراري نشط يمنع ركود وتسطح المنحنى.',
      sensory_impact_ar:
        'تحلل الأحماض العضوية المعقدة دون بناء مركبات عطرية جديدة، مما يحول حمضية الفاكهة إلى طعم خبز مسطح.',
      agtron_clue_ar:
        'فارق الأجترون 3 درجات فقط (71 - 68) بعد 13 دقيقة يؤكد تسطح التحميص وتخبزه التام.',
    },
  },
];
