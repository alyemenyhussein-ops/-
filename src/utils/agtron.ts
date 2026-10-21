/**
 * Agtron Coffee Roasting Scale and Roast Delta Utilities
 * Grounded in SCA Standards and Infrared Reflectance Measurement
 */
import { ProcessingMethod, BrewTarget } from '../types';

export interface AgtronClassification {
  scale: 'GOURMET' | 'COMMERCIAL';
  category_ar: string;
  category_en: string;
  sca_tile: string;
  hex_color: string;
  description_ar: string;
  recommended_for: string;
}

export interface RoastDeltaAssessment {
  spread: number;
  status: 'OPTIMAL' | 'EXTREME_SPREAD' | 'BAKED_STALLING';
  title_ar: string;
  badge_color: string;
  verdict_ar: string;
  thermodynamic_tip_ar: string;
}

export function getAgtronClassification(
  value: number,
  scale: 'GOURMET' | 'COMMERCIAL' = 'GOURMET'
): AgtronClassification {
  if (scale === 'COMMERCIAL') {
    if (value >= 85) {
      return {
        scale,
        category_ar: 'فاتح جداً (سينامون)',
        category_en: 'Very Light / Cinnamon',
        sca_tile: '#95',
        hex_color: '#C4925D',
        description_ar: 'تحميص سطحي أولي، حمضية بارزة ونوتات عشبية.',
        recommended_for: 'عينات فحص العيوب ومعايرة الشراء',
      };
    } else if (value >= 70) {
      return {
        scale,
        category_ar: 'فاتح (سيتي)',
        category_en: 'Light / City',
        sca_tile: '#85',
        hex_color: '#A26B38',
        description_ar: 'إبراز أقصى للإيحاءات الزهرية والفاكهية المنشئية.',
        recommended_for: 'قهوة الترشيح والفلتر (V60, Chemex)',
      };
    } else if (value >= 60) {
      return {
        scale,
        category_ar: 'متوسط فاتح (سيتي بلس)',
        category_en: 'Medium-Light / City+',
        sca_tile: '#75',
        hex_color: '#8A5222',
        description_ar: 'توازن سلس بين سطوع الحمضية وبدايات حلاوة الكراميل.',
        recommended_for: 'فلتر متزن أو إسبريسو ناصع العطرية',
      };
    } else if (value >= 50) {
      return {
        scale,
        category_ar: 'متوسط (فل سيتي)',
        category_en: 'Medium / Full City',
        sca_tile: '#65',
        hex_color: '#6D3D16',
        description_ar: 'تطور كامل للسكريات، قوام ممتلئ وتوازن حمضي معتدل.',
        recommended_for: 'إسبريسو كلاسيكي ومشروبات الحليب',
      };
    } else if (value >= 40) {
      return {
        scale,
        category_ar: 'متوسط داكن (فل سيتي بلس)',
        category_en: 'Medium-Dark / Full City+',
        sca_tile: '#55',
        hex_color: '#532B0F',
        description_ar: 'بداية ظهور الزيوت السطحية وظهور نوتات الشوكولاتة الداكنة.',
        recommended_for: 'إسبريسو إيطالي كثيف',
      };
    } else if (value >= 30) {
      return {
        scale,
        category_ar: 'داكن (فيينا)',
        category_en: 'Dark / Vienna',
        sca_tile: '#45',
        hex_color: '#3B1B09',
        description_ar: 'سيادة نكهات الكرملة العميقة والمرارة الكربونية.',
        recommended_for: 'خلطات تجارية ثقيلة',
      };
    } else {
      return {
        scale,
        category_ar: 'داكن جداً (فرنسي / إيطالي)',
        category_en: 'Very Dark / French / Italian',
        sca_tile: '#35',
        hex_color: '#260F04',
        description_ar: 'تفحم شبه كامل لألياف الحبة وزيوت لامعة بارزة.',
        recommended_for: 'تحميص نمط داكن قديم',
      };
    }
  }

  // GOURMET SCALE (Specialty Coffee Standard)
  if (value >= 95) {
    return {
      scale,
      category_ar: 'فاتح جداً (سينامون Cinnamon)',
      category_en: 'Very Light / Cinnamon',
      sca_tile: '#95',
      hex_color: '#C6935E',
      description_ar: 'تحميص خفيف جداً، تركيز عالٍ للأحماض العضوية مع قوام خفيف.',
      recommended_for: 'عينات فحص المنشأ المخبرية',
    };
  } else if (value >= 80) {
    return {
      scale,
      category_ar: 'فاتح مختص (سيتي City Roast)',
      category_en: 'Light / City',
      sca_tile: '#85',
      hex_color: '#9F6734',
      description_ar: 'المعيار الذهبي لقهوة الفلتر المقطرة؛ يحافظ على هوية التربة والفاكهية.',
      recommended_for: 'قهوة الترشيح والتقطير المختص (V60, Aeropress)',
    };
  } else if (value >= 70) {
    return {
      scale,
      category_ar: 'متوسط فاتح (سيتي بلس City+)',
      category_en: 'Medium-Light / City+',
      sca_tile: '#75',
      hex_color: '#864F21',
      description_ar: 'تطور سكري غني مع حمضية ناعمة؛ مناسب جداً للتحميص المشترك (Omni).',
      recommended_for: 'تحميص شامل (Filter & Modern Espresso)',
    };
  } else if (value >= 55) {
    return {
      scale,
      category_ar: 'متوسط متزن (فل سيتي Full City)',
      category_en: 'Medium / Full City',
      sca_tile: '#65',
      hex_color: '#6A3A17',
      description_ar: 'تكرمل متقدم للسكريات، قوام مخملي وغياب الحموضة الحادة.',
      recommended_for: 'إسبريسو مختص كلاسيكي ومشروبات الحليب',
    };
  } else if (value >= 45) {
    return {
      scale,
      category_ar: 'متوسط داكن (فل سيتي بلس Full City+)',
      category_en: 'Medium-Dark / Full City+',
      sca_tile: '#55',
      hex_color: '#512A0E',
      description_ar: 'بداية تسرب الزيوت؛ نوتات الكاكاو والتوابل الداكنة.',
      recommended_for: 'إسبريسو تقليدي ذو كريما كثيفة',
    };
  } else if (value >= 35) {
    return {
      scale,
      category_ar: 'داكن (فيينا Vienna Roast)',
      category_en: 'Dark / Vienna',
      sca_tile: '#45',
      hex_color: '#3A1B07',
      description_ar: 'انحسار النكهات المنشئية وظهور المرارة الدخانية اللذيذة.',
      recommended_for: 'عشاق القهوة الثقيلة ذات التحميص الداكن',
    };
  } else {
    return {
      scale,
      category_ar: 'داكن جداً (فرنسي / إيطالي French / Italian)',
      category_en: 'Very Dark / French',
      sca_tile: '#25',
      hex_color: '#220E03',
      description_ar: 'احتراق لمعظم المركبات العضوية وتغطية زيتية كاملة.',
      recommended_for: 'خلطات المحامص التقليدية التجارية',
    };
  }
}

/**
 * Evaluates the Roast Delta (Spread) between Ground Coffee and Whole Bean.
 * In specialty coffee roasting:
 * Ground reading is usually 8 to 15 points higher (lighter) than Whole Bean
 * because the bean core received gentler conductive heat than the surface.
 */
export function evaluateRoastDelta(
  wholeBeanAgtron: number,
  groundAgtron: number
): RoastDeltaAssessment {
  const spread = Number((groundAgtron - wholeBeanAgtron).toFixed(1));

  if (spread >= 8 && spread <= 15) {
    return {
      spread,
      status: 'OPTIMAL',
      title_ar: 'تدرج حراري مثالي ومتزن (Ideal Uniformity)',
      badge_color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      verdict_ar:
        'الفارق بين السطح والقلب متطابق مع المعيار العالمي (8-15 نقطة)، مما يدل على اختراق حراري متجانس ونضج متناسق بين النواة والقشرة الخارجية دون صدمة سطحية.',
      thermodynamic_tip_ar:
        'حافظ على توازن الحمل الحراري وسرعة الهواء (Airflow) الحالية مع خفض الغاز التدريجي في مرحلة التطور.',
    };
  }

  if (spread > 18) {
    return {
      spread,
      status: 'EXTREME_SPREAD',
      title_ar: 'تدرج مفرط: سطح محترق وقلب نيء (Scorched Surface / Raw Core)',
      badge_color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      verdict_ar:
        `فارق التدرج (${spread} نقطة) كبير جداً ويشير إلى تسارع سطحي مفرط؛ تكرمل السطح الخارجي بفعل حرارة التوصيل العالية بينما ظل لب الحبة الداخلي نيئاً وغير متطور (Underdeveloped Core)، ما يسبب جفافاً قابضاً وحمضية عشبية.`,
      thermodynamic_tip_ar:
        'قم بخفض حرارة الإسقاط (Charge Temp) بمقدار 5-8°C، وزد سحب الهواء (Convection) في مرحلة التجفيف ومايلارد لضمان نضج النواة بالتساوي.',
    };
  }

  if (spread < 5) {
    return {
      spread,
      status: 'BAKED_STALLING',
      title_ar: 'تدرج راكد: مؤشر تحميص مخبوز (Baked / Thermal Stagnation)',
      badge_color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      verdict_ar:
        `الفارق بين السطح واللب (${spread} نقطة فقط) منخفض للغاية وغير طبيعي؛ هذا التسطح اللوني يدل على طول مفرط في وقت التحميص مع فقدان الزخم الحراري (Baked Roast) مما دمر السكريات وأفقد الكوب حلاوته.`,
      thermodynamic_tip_ar:
        'ارفع الزخم الحراري الابتدائي (Gas Power) واختصر وقت مرحلة مايلارد لتفادي خمول الحرارة وتسطح المنحنى.',
    };
  }

  // 5 to 7.9 or 15.1 to 18
  return {
    spread,
    status: 'OPTIMAL',
    title_ar: 'تدرج مقبول وقريب من النطاق المثالي',
    badge_color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    verdict_ar:
      `فارق التدرج (${spread} نقطة) مقبول تجارياً، مع إمكانية تحسين تناسق نقل الحرارة للاقتراب من النطاق المثالي 9-14 نقطة.`,
    thermodynamic_tip_ar:
      'تحقق من تدفق الهواء وتجانس سرعة الطبل (Drum RPM) لتوزيع الحرارة بدقة أعلى.',
  };
}

export interface ProcessAgtronBenchmark {
  process: ProcessingMethod;
  process_label_ar: string;
  targetBrew: BrewTarget;
  target_brew_label_ar: string;
  whole_min: number;
  whole_max: number;
  ground_min: number;
  ground_max: number;
  ideal_delta_min: number;
  ideal_delta_max: number;
  description_ar: string;
  chemical_behavior_ar: string;
  thermodynamic_rule_ar: string;
}

export const PROCESS_AGTRON_BENCHMARKS: Record<ProcessingMethod, Record<BrewTarget, ProcessAgtronBenchmark>> = {
  WASHED: {
    FILTER: {
      process: 'WASHED',
      process_label_ar: 'معالجة مغسولة (Washed)',
      targetBrew: 'FILTER',
      target_brew_label_ar: 'فلتر وترشيح (Filter)',
      whole_min: 74,
      whole_max: 86,
      ground_min: 82,
      ground_max: 92,
      ideal_delta_min: 8,
      ideal_delta_max: 13,
      description_ar: 'تحميص فاتح عالي النقاء للحفاظ على الأحماض الفاكهية الستريكية والماليكية والوضوح العطري الزهري النظيف (Clean Cup).',
      chemical_behavior_ar: 'خلايا البن المغسول كثيفة ومسامية منتظمة وخالية من السكريات الصمغية السطحية؛ يتطلب اختراقاً حرارياً متساوياً بالحمل Convection لتجنب اللب النيء.',
      thermodynamic_rule_ar: 'حافظ على حرارة دخول معتدلة-عالية وزد تدفق الهواء في مايلارد لمنع تفحم القشرة قبل نضج النواة.',
    },
    ESPRESSO: {
      process: 'WASHED',
      process_label_ar: 'معالجة مغسولة (Washed)',
      targetBrew: 'ESPRESSO',
      target_brew_label_ar: 'إسبريسو مختص (Espresso)',
      whole_min: 58,
      whole_max: 68,
      ground_min: 65,
      ground_max: 76,
      ideal_delta_min: 6,
      ideal_delta_max: 10,
      description_ar: 'تحميص متوسط يكسر حدة حموضة البن المغسول ويطور مركبات الميلانويدين لزيادة لزوجة القوام والذائبية.',
      chemical_behavior_ar: 'تكرمل السكروز وتحلل ألياف السليلوز يزيد استخلاص الزيوت ومستحلب الكريما الناعمة.',
      thermodynamic_rule_ar: 'تمديد نسبي لمرحلة مايلارد بنسبة 38-42% مع خفض الغاز التدريجي قبل القرقعة الأولى.',
    },
    OMNI: {
      process: 'WASHED',
      process_label_ar: 'معالجة مغسولة (Washed)',
      targetBrew: 'OMNI',
      target_brew_label_ar: 'تحميص شامل (Omni-Roast)',
      whole_min: 66,
      whole_max: 76,
      ground_min: 74,
      ground_max: 84,
      ideal_delta_min: 7,
      ideal_delta_max: 11,
      description_ar: 'توازن ذهبي يجمع بين الوضوح المنشئي العطري للفلتر مع قابلية الاستخلاص المتزنة للإسبريسو.',
      chemical_behavior_ar: 'تطور متوازن بين تكوين الأحماض العطرية والسكريات الكرملية المتوسطة.',
      thermodynamic_rule_ar: 'DTR مضبوط بين 15% و17% مع انحدار RoR منتظم دون فلك.',
    },
  },
  NATURAL: {
    FILTER: {
      process: 'NATURAL',
      process_label_ar: 'معالجة مجففة طبيعية (Natural)',
      targetBrew: 'FILTER',
      target_brew_label_ar: 'فلتر وترشيح (Filter)',
      whole_min: 64,
      whole_max: 76,
      ground_min: 73,
      ground_max: 83,
      ideal_delta_min: 9,
      ideal_delta_max: 14,
      description_ar: 'لون أجترون يحفظ نوتات الفاكهة والتوت مع تفادي حرق السكريات الصمغية السطحية وتفادي طعم التخمر اللاذع.',
      chemical_behavior_ar: 'البن المجفف غني بالفركتوز والغلوكوز على السطح مما يجعله يتكرمل أسرع؛ يقرأ السطح أغمق بـ 4-8 درجات من المغسول لنفس درجة النضج الداخلي.',
      thermodynamic_rule_ar: 'ابدأ بحرارة دخول أقل بـ 5-8°C من المغسول واعتمد على تدفق الهواء اللطيف لتجنب الـ Scorching على السطح.',
    },
    ESPRESSO: {
      process: 'NATURAL',
      process_label_ar: 'معالجة مجففة طبيعية (Natural)',
      targetBrew: 'ESPRESSO',
      target_brew_label_ar: 'إسبريسو مختص (Espresso)',
      whole_min: 50,
      whole_max: 60,
      ground_min: 58,
      ground_max: 68,
      ideal_delta_min: 7,
      ideal_delta_max: 11,
      description_ar: 'إسبريسو غني بحلاوة السكر البني وقوام ثقيل وملمس حريري مع نوتات الشوكولاتة والكرز.',
      chemical_behavior_ar: 'السكريات الطبيعية المعقدة تمنح كثافة كريما فائقة ومستوى ذائبية عالٍ جداً.',
      thermodynamic_rule_ar: 'تدرج حراري بطيء بعد الاصفرار لمنع تفحم السكريات المتبقية على الشق الأوسط.',
    },
    OMNI: {
      process: 'NATURAL',
      process_label_ar: 'معالجة مجففة طبيعية (Natural)',
      targetBrew: 'OMNI',
      target_brew_label_ar: 'تحميص شامل (Omni-Roast)',
      whole_min: 58,
      whole_max: 68,
      ground_min: 66,
      ground_max: 76,
      ideal_delta_min: 8,
      ideal_delta_max: 12,
      description_ar: 'تحميص شامل يوازن بين الفاكهية المجففة العطرية وقوام الشوكولاتة الكريمي.',
      chemical_behavior_ar: 'تكرمل متزن دون وصول لمرحلة خروج الزيوت السطحية.',
      thermodynamic_rule_ar: 'تفادي أي RoR Flick نهائي للحفاظ على نقاء الكوب.',
    },
  },
  ANAEROBIC: {
    FILTER: {
      process: 'ANAEROBIC',
      process_label_ar: 'معالجة لاهوائية وتخمير ممتد (Anaerobic / Extended)',
      targetBrew: 'FILTER',
      target_brew_label_ar: 'فلتر وترشيح (Filter)',
      whole_min: 68,
      whole_max: 80,
      ground_min: 76,
      ground_max: 87,
      ideal_delta_min: 7,
      ideal_delta_max: 12,
      description_ar: 'تحميص دقيق جداً وفاتح؛ أي تحميص أغمق من 68 للبن المطحون يؤدي إلى تفحم النوتات المعقدة وظهور مرارة فينولية قاسية.',
      chemical_behavior_ar: 'بنية خلوية هشة جداً بسبب التخمر الطويل والأحماض العضوية المكثفة؛ امتصاص الحرارة سريع للغاية ولا يتحمل صدمة حرارية.',
      thermodynamic_rule_ar: 'حرارة دخول منخفضة، وسقف RoR أقصى لا يتجاوز 14-16°C/min مع تفريغ مبكر وسريع.',
    },
    ESPRESSO: {
      process: 'ANAEROBIC',
      process_label_ar: 'معالجة لاهوائية وتخمير ممتد (Anaerobic / Extended)',
      targetBrew: 'ESPRESSO',
      target_brew_label_ar: 'إسبريسو مختص (Espresso)',
      whole_min: 55,
      whole_max: 65,
      ground_min: 63,
      ground_max: 73,
      ideal_delta_min: 6,
      ideal_delta_max: 10,
      description_ar: 'إسبريسو عصري متفجر بنكهات الفواكه الاستوائية مع حمضية لاكتيكية كريمية وتوازن غير تقليدي.',
      chemical_behavior_ar: 'حساسية عالية؛ تخفيض وقت التطور النسبي لمنع تكسر النوتات العطرية الفريدة.',
      thermodynamic_rule_ar: 'تجنب حرارة التفريغ العالية (>205°C) نهائياً لتفادي الطعم الطبي أو الخلوي الحاد.',
    },
    OMNI: {
      process: 'ANAEROBIC',
      process_label_ar: 'معالجة لاهوائية وتخمير ممتد (Anaerobic / Extended)',
      targetBrew: 'OMNI',
      target_brew_label_ar: 'تحميص شامل (Omni-Roast)',
      whole_min: 62,
      whole_max: 72,
      ground_min: 70,
      ground_max: 80,
      ideal_delta_min: 7,
      ideal_delta_max: 11,
      description_ar: 'تحميص استثنائي يبرز طابع التخمير الاستوائي بوضوح في الفلتر وتوازن فائق في الإسبريسو.',
      chemical_behavior_ar: 'توازن دقيق بين حفظ الاسترات العطرية والسكريات المتبقية.',
      thermodynamic_rule_ar: 'خفض الغاز بانتظام قبل القرقعة بـ 60 ثانية لتجنب الـ RoR Crash والـ Flick.',
    },
  },
  HONEY: {
    FILTER: {
      process: 'HONEY',
      process_label_ar: 'معالجة عسلية (Honey Process)',
      targetBrew: 'FILTER',
      target_brew_label_ar: 'فلتر وترشيح (Filter)',
      whole_min: 68,
      whole_max: 80,
      ground_min: 77,
      ground_max: 87,
      ideal_delta_min: 8,
      ideal_delta_max: 13,
      description_ar: 'لون فاتح-متوسط يحافظ على توازن رائع بين حلاوة العسل والنوتات الزهرية النظيفة وحمضية التفاح والبرتقال.',
      chemical_behavior_ar: 'طبقة الصمغ العسلية المحيطة بالحبة تتطلب مراقبة تكرمل السطح لتفادي احتراق التوصيل التلامسي مع الطبل.',
      thermodynamic_rule_ar: 'زيادة تدفق الهواء بعد الاصفرار ونقل الحرارة بالحمل لمنع التبقع اللوني.',
    },
    ESPRESSO: {
      process: 'HONEY',
      process_label_ar: 'معالجة عسلية (Honey Process)',
      targetBrew: 'ESPRESSO',
      target_brew_label_ar: 'إسبريسو مختص (Espresso)',
      whole_min: 54,
      whole_max: 64,
      ground_min: 62,
      ground_max: 72,
      ideal_delta_min: 7,
      ideal_delta_max: 11,
      description_ar: 'إسبريسو عسلي فائق الحلاوة وقوام زبدي ومستحلب ذهبي ناعم.',
      chemical_behavior_ar: 'تكرمل عميق لسكريات الصمغ يعطي نكهات العسل المكرمل واللوز المحمص.',
      thermodynamic_rule_ar: 'تطوير تدريجي مع DTR بين 17% و20% وتفريغ لطيف.',
    },
    OMNI: {
      process: 'HONEY',
      process_label_ar: 'معالجة عسلية (Honey Process)',
      targetBrew: 'OMNI',
      target_brew_label_ar: 'تحميص شامل (Omni-Roast)',
      whole_min: 62,
      whole_max: 72,
      ground_min: 70,
      ground_max: 80,
      ideal_delta_min: 7,
      ideal_delta_max: 11,
      description_ar: 'توازن سلس ومثالي بين نقاء الفلتر وغنى قوام الإسبريسو.',
      chemical_behavior_ar: 'توزيع متساوي للحرارة يمنع تبقع القشرة الخارجية.',
      thermodynamic_rule_ar: 'تحكم دقيق بمعدل الانحدار وتبريد فوري في الصينية.',
    },
  },
};

export function getProcessAgtronBenchmark(
  process: ProcessingMethod = 'WASHED',
  targetBrew: BrewTarget = 'FILTER'
): ProcessAgtronBenchmark {
  const safeProcess = PROCESS_AGTRON_BENCHMARKS[process] ? process : 'WASHED';
  const safeBrew = PROCESS_AGTRON_BENCHMARKS[safeProcess][targetBrew] ? targetBrew : 'FILTER';
  return PROCESS_AGTRON_BENCHMARKS[safeProcess][safeBrew];
}

export interface ConsistencyEvaluationResult {
  score: number;
  status: 'HIGHLY_CONSISTENT' | 'MODERATELY_CONSISTENT' | 'INCONSISTENT' | 'CRITICAL_MISMATCH';
  title_ar: string;
  badge_color: string;
  summary_ar: string;
}

export function evaluateAgtronProcessConsistency(
  wholeAgtron: number,
  groundAgtron: number,
  process: ProcessingMethod = 'WASHED',
  targetBrew: BrewTarget = 'FILTER'
): ConsistencyEvaluationResult {
  const benchmark = getProcessAgtronBenchmark(process, targetBrew);
  const spread = groundAgtron - wholeAgtron;

  const groundDiff =
    groundAgtron < benchmark.ground_min
      ? benchmark.ground_min - groundAgtron
      : groundAgtron > benchmark.ground_max
      ? groundAgtron - benchmark.ground_max
      : 0;

  const deltaDiff =
    spread < benchmark.ideal_delta_min
      ? benchmark.ideal_delta_min - spread
      : spread > benchmark.ideal_delta_max
      ? spread - benchmark.ideal_delta_max
      : 0;

  let score = 100 - Math.min(60, groundDiff * 3) - Math.min(30, deltaDiff * 3);
  score = Math.max(10, Math.min(100, Math.round(score)));

  if (score >= 85) {
    return {
      score,
      status: 'HIGHLY_CONSISTENT',
      title_ar: `اتساق ممتاز مع معايير ${benchmark.process_label_ar}`,
      badge_color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      summary_ar: `قياسات الأجترون (مطحون ${groundAgtron} / كامل ${wholeAgtron} / دلتا ${spread.toFixed(1)}) تقع بدقة داخل النطاق الذهبي المستهدف لتحميص ${benchmark.process_label_ar} لغرض ${benchmark.target_brew_label_ar}.`,
    };
  }

  if (score >= 68) {
    return {
      score,
      status: 'MODERATELY_CONSISTENT',
      title_ar: `اتساق معتدل مع معايير ${benchmark.process_label_ar}`,
      badge_color: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      summary_ar: `لون التحميص قريب من النطاق المستهدف، مع انحراف طفيف في عمق التطور أو فارق التدرج السطحي (${spread.toFixed(1)} نقطة). النطاق المستهدف للمطحون: ${benchmark.ground_min}-${benchmark.ground_max}.`,
    };
  }

  if (score >= 45) {
    return {
      score,
      status: 'INCONSISTENT',
      title_ar: `عدم اتساق ملحوظ مع معايير ${benchmark.process_label_ar}`,
      badge_color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      summary_ar: `لون الأجترون الحالي (${groundAgtron} مطحون) ينحرف عن المعيار الأمثل لمعالجة ${benchmark.process_label_ar} (${benchmark.ground_min}-${benchmark.ground_max})، مما قد يؤثر على بروز إيحاءات المنشأ والحلاوة.`,
    };
  }

  return {
    score,
    status: 'CRITICAL_MISMATCH',
    title_ar: `تعارض حرج بين لون الأجترون وطبيعة معالجة البن`,
    badge_color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    summary_ar: `اللون الحالي غير متوافق تماماً مع المتطلبات الكيميائية والفيزيائية لمعالجة ${benchmark.process_label_ar}؛ هناك خطر كبير لطمس الأحماض العطرية أو تفحم السكريات السطحية.`,
  };
}
