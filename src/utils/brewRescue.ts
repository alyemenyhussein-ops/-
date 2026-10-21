import { BrewRescueProtocol, RoastDiagnosisResponse, BeanProfile } from '../types';

export function getOrGenerateBrewRescue(
  diagnosis: RoastDiagnosisResponse,
  beanProfile: BeanProfile,
  sensoryDefect?: string
): BrewRescueProtocol {
  if (diagnosis.brew_rescue_protocol) {
    return diagnosis.brew_rescue_protocol;
  }

  const { ror_diagnostics, sensory_correlation, phase_ratios } = diagnosis;
  
  const hasCrash = ror_diagnostics?.detected_anomalies?.some(
    (a) => a.anomaly_type.toLowerCase().includes('crash') || a.anomaly_type.includes('انهيار')
  ) ?? false;

  const hasFlick = ror_diagnostics?.detected_anomalies?.some(
    (a) => a.anomaly_type.toLowerCase().includes('flick') || a.anomaly_type.includes('قفزة')
  ) ?? false;

  const sensoryText = `${sensory_correlation?.reported_defect_ar || ''} ${sensoryDefect || ''} ${sensory_correlation?.thermodynamic_root_cause_ar || ''}`;

  const isBaked =
    hasCrash ||
    phase_ratios?.dtr_status === 'BAKED' ||
    phase_ratios?.dtr_status?.includes('خبز') ||
    sensoryText.includes('خبز') ||
    sensoryText.includes('Baked') ||
    sensoryText.includes('تسطح');

  const isFlick =
    hasFlick ||
    sensoryText.includes('قفزة') ||
    sensoryText.includes('Flick') ||
    sensoryText.includes('مرارة') ||
    sensoryText.includes('قبوض') ||
    sensoryText.includes('دخاني');

  const isScorched =
    sensoryText.includes('حرق') ||
    sensoryText.includes('Scorching') ||
    sensoryText.includes('Tipping') ||
    (phase_ratios?.drying_percent ?? 40) < 32;

  const isUnderdeveloped =
    (phase_ratios?.dtr_percent ?? 15) < 12 ||
    phase_ratios?.dtr_status?.includes('ناقص') ||
    phase_ratios?.dtr_status === 'UNDERDEVELOPED' ||
    sensoryText.includes('حموضة حادة') ||
    sensoryText.includes('عشبي') ||
    sensoryText.includes('Underdeveloped');

  // 1. Baked or RoR Crash
  if (isBaked) {
    return {
      salvageability_percent: 88,
      best_use_recommendation_ar: 'مناسبة للمقطر بنسبة مركزة قصيرة، أو كأساس غني لمشروبات الفلات وايت واللاتيه',
      degassing_rest_days_ar: '8 إلى 12 يوماً بعد التحميص',
      water_chemistry_target: {
        target_gh_ppm: '85 ppm (صلابة كلية غنية بالمغنيسيوم)',
        target_kh_ppm: '20 ppm (قلوية منخفضة للحفاظ على الحمضية)',
        mg_to_ca_ratio: '3:1 (تركيز المغنيسيوم لجذب السكريات)',
        water_explanation_ar: 'الماء منخفض القلوية جداً (20 ppm) يحافظ على ما تبقى من الأحماض العضوية الفاكهية دون تحييدها بالبيكربونات، بينما الصلابة المرتفعة بالمغنيسيوم تسحب السكريات لتعويض التسطح الناتج عن الانهيار الحراري.',
      },
      filter_rescue_recipe: {
        water_temp_c: '93°C - 94°C (حرارة استخلاص عالية لزيادة الطاقة الحركية)',
        brew_ratio: '1:14.5 (نسبة استخلاص مركزة وقصيرة لتعزيز الحلاوة والقوام)',
        grind_adjustment_ar: 'أنعم بنقطة واحدة من طحنة الكاليبراشن المعتادة لرفع معدل الاستخلاص التراكمي للسكريات',
        bloom_and_pour_technique_ar: 'ترطيب بـ 45ml لمدة 40 ثانية مع هزة دائرية خفيفة، يليه صبتان دائريتان مركزتان في منتصف القمع (100ml ثم 100ml) للوصول إلى 245ml مع تفادي استخلاص شوائب الحواف.',
      },
      espresso_rescue_recipe: {
        water_temp_c: '94°C',
        yield_ratio: '1:1.8 (ريستريتو مركز - 19g بن إلى 34g استخلاص)',
        shot_time_sec: '25 - 27 ثانية',
        pre_infusion_and_pressure_ar: 'ترطيب مسبق 6 ثوانٍ عند ضغط 3 بار يتبعه استخلاص سلس عند 8.5 بار مع إنهاء مبكر للاستخلاص قبل مرحلة الشقراء (Blonding).',
      },
    };
  }

  // 2. Flick or Astringent
  if (isFlick) {
    return {
      salvageability_percent: 82,
      best_use_recommendation_ar: 'مناسبة للمقطر بتقنية التخطي المائي (Bypass Brewing)، أو استخلاص كولد برو نقي بنقع بارد بطيء',
      degassing_rest_days_ar: '10 إلى 14 يوماً بعد التحميص',
      water_chemistry_target: {
        target_gh_ppm: '50 ppm (صلابة منخفضة لتخفيف سحب المركبات الثقيلة)',
        target_kh_ppm: '40 ppm (قلوية معتدلة لعمل بفر كيميائي ضد المرارة)',
        mg_to_ca_ratio: '2:1 (توازن لطيف لعدم المبالغة في سحب الاسترات المحترقة)',
        water_explanation_ar: 'خفض الصلابة الكلية (50 ppm) يقلل قوة المذيب ويمنع استخلاص مركبات الفحم والمرارة الدخانية، بينما القلوية المعتدلة تعمل كعازل كيميائي يحيد الطعم القابض (Astringency) في الطعم المتبقي.',
      },
      filter_rescue_recipe: {
        water_temp_c: '86°C - 88°C (حرارة استخلاص هادئة جداً لتفادي إثارة المركبات المرة)',
        brew_ratio: '1:12 استخلاص أولي + إضافة ماء نقي bypass للوصول إلى 1:16',
        grind_adjustment_ar: 'أخشن بنقطتين كاملتين من طحنة الكاليبراشن المعتادة لتقليل مساحة التلامس السطحي',
        bloom_and_pour_technique_ar: 'ترطيب هادئ 50ml لمدة 35 ثانية، ثم صبة واحدة بطيئة حتى 180ml، ثم سحب القمع وإضافة 60ml ماء نقي ساخن 85°C مباشرة للكوب لتخفيف التركيز دون استخلاص المرارة المتأخرة.',
      },
      espresso_rescue_recipe: {
        water_temp_c: '88°C - 89°C',
        yield_ratio: '1:2.0',
        shot_time_sec: '21 - 23 ثانية (استخلاص سريع وخاطف)',
        pre_infusion_and_pressure_ar: 'استخلاص مباشر بدون ترطيب طويل عند 8 بار مع قطع الاستخلاص فوراً عند أول تبدل في اللون لمنع نزول المركبات المحترقة المتأخرة.',
      },
    };
  }

  // 3. Scorching or Tipping
  if (isScorched) {
    return {
      salvageability_percent: 76,
      best_use_recommendation_ar: 'توجيهها لمشروبات الحليب (كورتادو، فلات وايت، لاتيه) أو تحضير إسبريسو كريما كلاسيكي بعد غربلة القشور المحترقة',
      degassing_rest_days_ar: '12 إلى 16 يوماً بعد التحميص (للسماح للمركبات الكربونية بالهدوء)',
      water_chemistry_target: {
        target_gh_ppm: '70 ppm (صلابة متوازنة)',
        target_kh_ppm: '65 ppm (قلوية مرتفعة لمعادلة الأحماض النيئة ومرارة الحرق)',
        mg_to_ca_ratio: '1.5:1 (كالسيوم متوازن لتعزيز القوام المخملي مع الحليب)',
        water_explanation_ar: 'رفع القلوية (65 ppm) يوفر دارئة (Buffer) كيميائية قوية تعادل الحمضية غير الناضجة الناتجة عن القلب النيء، وتكبح حدة تفحم أطراف الحبوب، مما يجعل القهوة متوازنة وناعمة عند دمجها بالحليب.',
      },
      filter_rescue_recipe: {
        water_temp_c: 'ترطيب بـ 93°C ثم إكمال الصب بـ 86°C (تقنية الحرارة المتدرجة)',
        brew_ratio: '1:15',
        grind_adjustment_ar: 'طحن متوسط مع النفخ اللطيف لطرد القشور (Chaff) المتفحمة قبل وضع البن في القمع',
        bloom_and_pour_technique_ar: 'ترطيب 45ml بماء ساخن 93°C لمدة 45 ثانية لتحفيز استخلاص قلب الحبة البطيء، ثم خفض حرارة الصب إلى 86°C لإكمال الصبات لمنع سحب كربون السطح المحترق.',
      },
      espresso_rescue_recipe: {
        water_temp_c: '91°C',
        yield_ratio: '1:2.2 (استخلاص ممتد قليلاً مع استخدام فلتر ورقي أسفل الباسكت)',
        shot_time_sec: '26 - 28 ثانية',
        pre_infusion_and_pressure_ar: 'ترطيب مسبق 5 ثوانٍ، واستخدام Puck screen علوي لمنع القنوات وامتزاج نكهات التفحم السطحي، والتركيز على مشروبات الحليب 180ml.',
      },
    };
  }

  // 4. Underdeveloped
  if (isUnderdeveloped) {
    return {
      salvageability_percent: 85,
      best_use_recommendation_ar: 'مناسبة للفلتر بحرارة ماء قصوى وترطيب مطول، وتتطلب فترة راحة أطول قبل التقديم',
      degassing_rest_days_ar: '14 إلى 18 يوماً لطرد غاز CO2 المحبوس في النواة الصلبة',
      water_chemistry_target: {
        target_gh_ppm: '75 ppm',
        target_kh_ppm: '65 ppm (قلوية مرتفعة لمعادلة الأحماض العشبية الحادة)',
        mg_to_ca_ratio: '2.5:1',
        water_explanation_ar: 'القلوية العالية (65 ppm) تعادل الأحماض الماليكية الحادة الناتجة عن عدم اكتمال التطور الداخلي، والحرارة القصوى تجبر الحبة على إطلاق مركباتها السكرية.',
      },
      filter_rescue_recipe: {
        water_temp_c: '95°C - 96°C (أقصى حرارة لاستخلاص عميق)',
        brew_ratio: '1:16.5',
        grind_adjustment_ar: 'أنعم بنقطتين لزيادة مساحة السطح التفاعلية للبن الصلب',
        bloom_and_pour_technique_ar: 'ترطيب مبدئي لمدة 60 ثانية مع تحريك خفيف، ثم صبات متتالية لزيادة وقت التلامس.',
      },
      espresso_rescue_recipe: {
        water_temp_c: '95°C',
        yield_ratio: '1:2.4 (لونغ كورتادو / استخلاص ممتد)',
        shot_time_sec: '28 - 30 ثانية',
        pre_infusion_and_pressure_ar: 'ترطيب مسبق 8 ثوانٍ عند 2.5 بار لضمان تشبع النواة الصلبة قبل ضغط 9 بار.',
      },
    };
  }

  // 5. Default / Optimal Roast
  return {
    salvageability_percent: 96,
    best_use_recommendation_ar: 'تحميص مثالي ومنضبط؛ جاهزة للتقديم للفلتر والإسبريسو بالوصفة الذهبية المعتمدة لإبراز النوتات الأصلية',
    degassing_rest_days_ar: '7 إلى 10 أيام بعد التحميص',
    water_chemistry_target: {
      target_gh_ppm: '65 ppm (صلابة مثالية لمعايير SCA)',
      target_kh_ppm: '35 ppm (قلوية متزنة لحماية بريق الحمضية الطبيعية)',
      mg_to_ca_ratio: '2:1 (توازن ذهبي بين المغنيسيوم والكالسيوم)',
      water_explanation_ar: 'كيمياء ماء قياسية متوازنة تماماً تتيح إطلاق كامل الإمكانات العطرية والفاكهية للبن دون أي كبح أو تشويه طعمي.',
    },
    filter_rescue_recipe: {
      water_temp_c: '91°C - 92°C',
      brew_ratio: '1:15.5 إلى 1:16',
      grind_adjustment_ar: 'طحنة الكاليبراشن القياسية (متوسطة النعومة كحبات ملح البحر الناعم)',
      bloom_and_pour_technique_ar: 'ترطيب 50ml لمدة 40 ثانية، ثم 3 صبات متساوية بهدوء مركزي حتى الوصول إلى 250ml عند دقيقة 02:30.',
    },
    espresso_rescue_recipe: {
      water_temp_c: '92.5°C',
      yield_ratio: '1:2.0 (18g بن إلى 36g استخلاص)',
      shot_time_sec: '26 - 28 ثانية',
      pre_infusion_and_pressure_ar: 'ترطيب مسبق 4 ثوانٍ عند 3 بار، يليه تدفق مستقر عند 9 بار مع كريما مخملية ذهبية متسقة.',
    },
  };
}
