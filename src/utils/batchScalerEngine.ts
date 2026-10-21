import {
  ReferenceRoastProfile,
  ScaledBatchPlan,
  ScaledRoRCurvePoint,
  RoasterType,
} from '../types';

export const ROASTER_TYPE_INFO: Record<
  RoasterType,
  { label_ar: string; thermalInertia: string; convectionShare: string; defaultDrumRpm: number }
> = {
  DRUM_SINGLE_WALLED: {
    label_ar: 'أسطوانة تقليدية جدار أحادي (Single Walled Drum)',
    thermalInertia: 'متوسطة إلى عالية (توصيل حراري مباشر من لهب الموقد)',
    convectionShare: 'حوالي 50% توصيل / 50% حمل',
    defaultDrumRpm: 55,
  },
  DRUM_DOUBLE_WALLED: {
    label_ar: 'أسطوانة جدار مزدوج عازل (Double Walled Drum)',
    thermalInertia: 'عالية جداً (طبقة هواء عازلة تحمي من التوصيل المباشر)',
    convectionShare: 'حوالي 70% حمل / 30% توصيل',
    defaultDrumRpm: 58,
  },
  RECIRCULATING_HOT_AIR: {
    label_ar: 'هواء ساخن معاد تدويره (Recirculating Hot Air)',
    thermalInertia: 'منخفضة (استجابة فورية جداً للحرارة)',
    convectionShare: 'أكثر من 85% حمل حراري نقي',
    defaultDrumRpm: 45,
  },
  FLUID_BED: {
    label_ar: 'سرير مائع هوائي (Fluid Bed / Air Roaster)',
    thermalInertia: 'شبه معدومة (حمل حراري كامل 100%)',
    convectionShare: 'حمل حراري 95-100%',
    defaultDrumRpm: 0,
  },
  INFRARED_DRUM: {
    label_ar: 'موقد إشعاعي تحت أحمر (Infrared Burner Drum)',
    thermalInertia: 'متوسطة (تسخين إشعاعي يخترق لب الحبة)',
    convectionShare: 'إشعاع كهرومغناطيسي وحمل حراري',
    defaultDrumRpm: 52,
  },
};

export const BATCH_SCALER_PRESETS: {
  id: string;
  title_ar: string;
  description_ar: string;
  reference: ReferenceRoastProfile;
  targetBatchKg: number;
}[] = [
  {
    id: 'scale-up-1kg-to-12kg',
    title_ar: 'تحجيم تصاعدي: من عينة تجريبية 1 كجم إلى إنتاج 12 كجم (Giesen W12A)',
    description_ar: 'محاكاة ترقية بروفايل التحميص من محمصة عينات صغيرة إلى خط الإنتاج الرئيسي مع الحفاظ على نفس مسار RoR ومراحل التطور.',
    reference: {
      batchSizeKg: 1.0,
      chargeTempC: 195,
      roasterType: 'DRUM_DOUBLE_WALLED',
      drumSpeedRpm: 60,
      airflowSetting: '35 Pa (مستوى 3)',
      gasBaselinePercent: 45,
      roasterModel: 'Giesen W12A (تحجيم إنتاج)',
      beanOrigin: 'إثيوبيا يرغاتشيفي - مغسول',
      beanProcess: 'WASHED',
      beanDensity: 820,
      targetTurningPointC: 92,
      yellowingTimeSec: 270,
      firstCrackTimeSec: 540,
      dropTimeSec: 645,
      dropTempC: 206,
    },
    targetBatchKg: 12.0,
  },
  {
    id: 'scale-down-15kg-to-7kg',
    title_ar: 'تخفيض حمولة: من دفعة كاملة 15 كجم إلى نصف حمولة 7.5 كجم (Diedrich IR-12)',
    description_ar: 'تعديل المعاملات الحرارية عند تحميص نصف سعة الأسطوانة لمنع الحروق السطحية والتوصيل الزائد.',
    reference: {
      batchSizeKg: 15.0,
      chargeTempC: 218,
      roasterType: 'INFRARED_DRUM',
      drumSpeedRpm: 54,
      airflowSetting: '50% هواء مفتوح',
      gasBaselinePercent: 78,
      roasterModel: 'Diedrich IR-12',
      beanOrigin: 'كولومبيا هويلا - مجفف',
      beanProcess: 'NATURAL',
      beanDensity: 790,
      targetTurningPointC: 104,
      yellowingTimeSec: 285,
      firstCrackTimeSec: 560,
      dropTimeSec: 670,
      dropTempC: 210,
    },
    targetBatchKg: 7.5,
  },
  {
    id: 'scale-up-5kg-to-30kg',
    title_ar: 'تحجيم صناعي كبير: من 5 كجم إلى 30 كجم (Loring S35 Kestrel)',
    description_ar: 'تحجيم دفعات ذات حجم إنتاجي على نظام الحمل الحراري الدوار مع معايرة قوة النفث والغاز.',
    reference: {
      batchSizeKg: 5.0,
      chargeTempC: 205,
      roasterType: 'RECIRCULATING_HOT_AIR',
      drumSpeedRpm: 48,
      airflowSetting: 'مستوى الحمل 4',
      gasBaselinePercent: 55,
      roasterModel: 'Loring S35 Kestrel',
      beanOrigin: 'غواتيمالا أنتيغوا - مغسول',
      beanProcess: 'WASHED',
      beanDensity: 815,
      targetTurningPointC: 98,
      yellowingTimeSec: 260,
      firstCrackTimeSec: 530,
      dropTimeSec: 630,
      dropTempC: 207,
    },
    targetBatchKg: 30.0,
  },
  {
    id: 'micro-batch-probat',
    title_ar: 'دفعة صغرى تجريبية: 3 كجم على محمصة Probat UG22 (سعة 22 كجم)',
    description_ar: 'تحدي الحفاظ على المنحنى في أسطوانة ذات كتلة معدنية ضخمة بحمولة حبوب ضئيلة.',
    reference: {
      batchSizeKg: 20.0,
      chargeTempC: 224,
      roasterType: 'DRUM_SINGLE_WALLED',
      drumSpeedRpm: 52,
      airflowSetting: 'ضغط 45 Pa',
      gasBaselinePercent: 82,
      roasterModel: 'Probat UG22',
      beanOrigin: 'اليمن حراز - مجفف لاهوائي',
      beanProcess: 'ANAEROBIC',
      beanDensity: 835,
      targetTurningPointC: 108,
      yellowingTimeSec: 300,
      firstCrackTimeSec: 580,
      dropTimeSec: 690,
      dropTempC: 211,
    },
    targetBatchKg: 3.5,
  },
];

/**
 * Pure thermodynamic calculation engine for coffee roast scaling.
 * Grounded in Scott Rao's Coffee Roaster's Companion, Rob Hoos' Modulating the Flavor Profile of Coffee,
 * and standard thermal mass & convective boundary layer physics.
 */
export function calculateThermodynamicScaling(
  ref: ReferenceRoastProfile,
  targetBatchKg: number
): ScaledBatchPlan {
  const scaleRatio = targetBatchKg / Math.max(0.1, ref.batchSizeKg);

  // 1. Charge Temperature scaling:
  // When scaling UP (more cold bean mass into drum), charge temp must be higher to compensate for greater heat sink.
  // When scaling DOWN (small bean mass into heavy metal drum), drum metal retains excessive energy, so charge must be LOWER.
  // Formula: Delta Charge = log2(scaleRatio) * roasterConstant
  let roasterConstant = 12.0; // default for single-walled
  if (ref.roasterType === 'DRUM_DOUBLE_WALLED') roasterConstant = 9.5;
  if (ref.roasterType === 'RECIRCULATING_HOT_AIR') roasterConstant = 6.0;
  if (ref.roasterType === 'FLUID_BED') roasterConstant = 4.0;
  if (ref.roasterType === 'INFRARED_DRUM') roasterConstant = 8.5;

  let chargeTempDeltaC = Math.round(Math.log2(scaleRatio) * roasterConstant * 10) / 10;
  // Bounds check: don't allow insane charge temps (<165C or >245C)
  const proposedCharge = ref.chargeTempC + chargeTempDeltaC;
  const clampedCharge = Math.max(165, Math.min(245, Math.round(proposedCharge)));
  chargeTempDeltaC = clampedCharge - ref.chargeTempC;

  // 2. Gas / Power Scaling:
  // Power does NOT scale linearly (1.0). Sublinear exponent gamma ~= 0.75-0.85
  // P_target = P_ref * (mass_target / mass_ref)^0.78
  // But if scale ratio is within the same roaster, the percentage output on the burner scale:
  const gamma = ref.roasterType === 'FLUID_BED' ? 0.90 : 0.78;
  const theoreticalGasMultiplier = Math.pow(scaleRatio, gamma);

  // Scaling baseline gas percentage:
  let recommendedGasScalingPercent: number;
  if (scaleRatio >= 1) {
    // Scaling UP
    recommendedGasScalingPercent = Math.min(
      95,
      Math.round(ref.gasBaselinePercent * Math.pow(scaleRatio, 0.35))
    );
  } else {
    // Scaling DOWN
    recommendedGasScalingPercent = Math.max(
      20,
      Math.round(ref.gasBaselinePercent * Math.pow(scaleRatio, 0.45))
    );
  }

  // 3. Airflow Adjustments:
  let recommendedAirflowSetting = ref.airflowSetting;
  let airflowDeltaDescription = '';
  if (scaleRatio > 1.8) {
    airflowDeltaDescription =
      'زيادة سحب الهواء بمقدار 20% - 30% لزيادة الإخلاء الحجمي لبخار الرطوبة المتصاعد وتفادي اختناق السيكلون.';
    recommendedAirflowSetting = `رفع تدفق الهواء بنسبة +25% عن المرجع (${ref.airflowSetting})`;
  } else if (scaleRatio < 0.6) {
    airflowDeltaDescription =
      'تقليل سحب الهواء بمقدار 15% - 25% للحفاظ على الرطوبة الجوية داخل الأسطوانة وتجنب التبريد السريع لكتلة البن الصغيرة.';
    recommendedAirflowSetting = `خفض تدفق الهواء بنسبة -20% عن المرجع (${ref.airflowSetting})`;
  } else {
    airflowDeltaDescription = 'تعديل طفيف (±5%) مع المحافظة على نفس سرعة الإخلاء ومعايرة سحب القشرة (Chaff).';
    recommendedAirflowSetting = `مماثل للمرجع مع مراقبة الدخان (${ref.airflowSetting})`;
  }

  // 4. Drum Speed Adjustments (Froude Number):
  let drumSpeedDeltaRpm = 0;
  if (ref.roasterType !== 'FLUID_BED') {
    if (scaleRatio < 0.5) {
      drumSpeedDeltaRpm = -4; // Slower drum for tiny batch so beans stay in contact with probe and don't fling
    } else if (scaleRatio > 2.0) {
      drumSpeedDeltaRpm = +3; // Faster drum for huge batch to distribute across larger bed
    }
  }
  const recommendedDrumSpeedRpm = Math.max(35, Math.min(80, ref.drumSpeedRpm + drumSpeedDeltaRpm));

  // 5. Phase-by-phase Guidance:
  const phaseByPhaseGuidance = [
    {
      phase: 'الشحن ونقطة التحول (Charge & Turning Point)',
      timingTarget: scaleRatio >= 1 ? '75 - 90 ثانية' : '60 - 75 ثانية',
      gasAdjustment:
        scaleRatio > 1
          ? `تطبيق نقع حراري (Soak) لمدة 30-45 ثانية ثم تطبيق غاز ${recommendedGasScalingPercent}% لتعويض سحب الحرارة.`
          : `خفض حرارة الشحن إلى ${clampedCharge}°C مع بدء غاز هادئ (${recommendedGasScalingPercent}%) لمنع صدمة الحبوب بالأسطوانة الساخنة.`,
      airflowAdjustment: 'سحب هواء منخفض إلى معتدل لتثبيت البيئة الحرارية في الأسطوانة.',
      thermodynamicNotes:
        scaleRatio > 1
          ? 'كتلة البن الأكبر تشكل ممتصاً حرارياً هائلاً، مما يؤدي لنقطة تحول أعمق إذا لم ترفع حرارة الشحن.'
          : 'الأسطوانة المعدنية تحتفظ بطاقة كامنة هائلة مقارنة بكتلة البن الصغيرة، وخطر الاحتراق التوصيلي السطحي مرتفع جداً.',
    },
    {
      phase: 'مرحلة التجفيف والاصفرار (Drying to Yellowing)',
      timingTarget: `${Math.round((ref.yellowingTimeSec || 280) * (scaleRatio > 1 ? 1.05 : 0.95))} ثانية`,
      gasAdjustment: `الحفاظ على قوة غاز ${recommendedGasScalingPercent}% حتى درجة 145°C ثم خفض تدريجي أولي بمقدار 5-8%.`,
      airflowAdjustment: scaleRatio > 1 ? 'رفع الهواء تدريجياً لسحب بخار الماء الكثيف.' : 'الحفاظ على هواء معتدل لتجنب فقدان الزخم الحراري.',
      thermodynamicNotes:
        'مرحلة ماصة للحرارة (Endothermic). انتقال الحرارة يعتمد بنسبة 60% على التوصيل في البداية ثم يتحول للحمل.',
    },
    {
      phase: 'مرحلة تفاعلات مايلارد (Maillard Phase)',
      timingTarget: `${Math.round((ref.firstCrackTimeSec || 550) - (ref.yellowingTimeSec || 280))} ثانية`,
      gasAdjustment:
        'خفض الغاز على درجتين متتاليتين (-10% ثم -10%) لضمان انحدار رتيب متناقص للـ RoR دون تسطح.',
      airflowAdjustment: 'زيادة سحب الهواء لمستوى التشغيل المعياري لتسهيل نقل الحرارة بالحمل.',
      thermodynamicNotes:
        'بناء السكريات المعقدة والمركبات العطرية. التناقص المستمر في RoR يمنع الطعم المخبوز والكرملة السريعة غير المتجانسة.',
    },
    {
      phase: 'القرقعة الأولى والتطوير (First Crack & Development)',
      timingTarget: `${Math.round(((ref.dropTimeSec || 660) - (ref.firstCrackTimeSec || 550)))} ثانية (DTR: 15-18%)`,
      gasAdjustment:
        'خفض الغاز المسبق قبل القرقعة بـ 45 ثانية لتفادي الانهيار الحراري (RoR Crash) الناتج عن التبخير الطارد.',
      airflowAdjustment: 'رفع سحب الهواء للحد الأعلى لنزع الدخان وبخار الماء وقشرة البن.',
      thermodynamicNotes:
        'تفاعل طارد للحرارة (Exothermic). الكتلة الصغيرة تتأثر بسرعة فائقة بالقوة الطاردة (خطر Flick)، بينما الكتلة الكبيرة قد تنهار (خطر Crash).',
    },
  ];

  // 6. Thermodynamic Analysis & Risks:
  const criticalRisks: string[] = [];
  if (scaleRatio > 2.0) {
    criticalRisks.push('خطر التسطح الحراري والخبز (Baking): لزيادة كتلة البن التي تتطلب طاقة حمل أعلى لاختراق مركز الحبوب.');
    criticalRisks.push('خطر انهيار معدل الارتفاع (RoR Crash) عند القرقعة الأولى بسبب الحجم الهائل لبخار الماء المتدفق.');
    criticalRisks.push('خطر انسداد مسار السيكلون أو تراكم القشرة (Chaff) إذا لم يتم رفع قوة سحب الهواء.');
  } else if (scaleRatio < 0.6) {
    criticalRisks.push('خطر الاحتراق السطحي واحتراق الأطراف (Scorching & Tipping): لأن حرارة الأسطوانة المعدنية تفوق قدرة امتصاص الحبوب.');
    criticalRisks.push('خطر القفزة الحرارية المفاجئة (RoR Flick) عند نهاية التحميص نتيجة سرعة استجابة الدفعة الصغيرة للطاقة الكامنة.');
    criticalRisks.push('عدم دقة قراءة مسبار حرارة البن (Bean Probe) إذا لم تكن كتلة البن مغمورة بالكامل فوق المسبار.');
  } else {
    criticalRisks.push('الانتقال ضمن النطاق الآمن للسعة: التركيز على الحفاظ على نفس زاوية انحدار RoR المنحدرة.');
  }

  // 7. Simulated RoR Curve (reference vs scaled):
  const simulatedRoRCurve: ScaledRoRCurvePoint[] = [];
  const totalDuration = Math.round((ref.dropTimeSec || 660) * (scaleRatio > 1 ? 1.04 : 0.96));
  const steps = 25;
  const timeStep = Math.round(totalDuration / steps);

  for (let i = 0; i <= steps; i++) {
    const timeSec = i * timeStep;
    const progress = timeSec / totalDuration; // 0 to 1

    // Reference curve trajectory:
    let refBT = 0;
    let refRoR = 0;
    if (progress < 0.15) {
      // Turning point dip
      refBT = ref.chargeTempC - (ref.chargeTempC - (ref.targetTurningPointC || 95)) * Math.sin((progress / 0.15) * (Math.PI / 2));
      refRoR = 18 - 8 * (progress / 0.15);
    } else {
      // Rising phase
      const p = (progress - 0.15) / 0.85;
      refBT = (ref.targetTurningPointC || 95) + ((ref.dropTempC || 208) - (ref.targetTurningPointC || 95)) * Math.pow(p, 0.72);
      refRoR = Math.max(3.5, 22 * (1 - Math.pow(p, 0.65)));
    }

    // Scaled curve trajectory:
    let scaledBT = 0;
    let scaledRoR = 0;
    if (progress < 0.15) {
      const scaledTP = (ref.targetTurningPointC || 95) + (scaleRatio > 1 ? 2.5 : -3.5);
      scaledBT = clampedCharge - (clampedCharge - scaledTP) * Math.sin((progress / 0.15) * (Math.PI / 2));
      scaledRoR = Math.max(0, refRoR + (scaleRatio > 1 ? 1.2 : -1.8));
    } else {
      const p = (progress - 0.15) / 0.85;
      const scaledTP = (ref.targetTurningPointC || 95) + (scaleRatio > 1 ? 2.5 : -3.5);
      scaledBT = scaledTP + ((ref.dropTempC || 208) - scaledTP) * Math.pow(p, 0.72);
      // Scaled RoR smoothly matches reference
      scaledRoR = Math.max(3.2, refRoR * (scaleRatio > 1 ? 1.04 : 0.96));
    }

    simulatedRoRCurve.push({
      timeSec,
      referenceRoR: Math.round(refRoR * 10) / 10,
      scaledRoR: Math.round(scaledRoR * 10) / 10,
      referenceBeanTemp: Math.round(refBT * 10) / 10,
      scaledBeanTemp: Math.round(scaledBT * 10) / 10,
    });
  }

  const actionSummary_ar =
    scaleRatio > 1
      ? `لتحجيم الدفعة تصاعدياً من ${ref.batchSizeKg} كجم إلى ${targetBatchKg} كجم (معدل تضخيم ×${scaleRatio.toFixed(1)}): يجب رفع حرارة الدخول بمقدار +${chargeTempDeltaC}°C لتصل إلى ${clampedCharge}°C، وضبط الطاقة الأساسية عند ${recommendedGasScalingPercent}%، مع ${airflowDeltaDescription}`
      : `لتخفيض الدفعة من ${ref.batchSizeKg} كجم إلى ${targetBatchKg} كجم (معدل تقليص ×${scaleRatio.toFixed(2)}): يجب خفض حرارة الدخول بمقدار ${chargeTempDeltaC}°C لتصل إلى ${clampedCharge}°C، وتخفيف الغاز الأساسي إلى ${recommendedGasScalingPercent}%، مع ${airflowDeltaDescription}`;

  const scientificRationale_ar = `وفق مبادئ الديناميكا الحرارية للتحميص (Thermodynamics of Coffee Roasting)، ترتبط السعة الحرارية النوعية لكتلة البن (Specific Heat Capacity c_p ≈ 1.6 kJ/kg·K) مباشرة بالكتلة الحرارية لأسطوانة التحميص المعدنية. عند تغيير حجم الدفعة، يتغير معدل التبادل بين التوصيل الحراري (Conduction) من جدار الأسطوانة والحمل الحراري (Convection) من تيار الهواء الساخن. الحفاظ على نفس منحنى الـ RoR يتطلب موازنة الزخم الحراري المبدئي (Initial Momentum) ومعدل إخلاء الرطوبة الناتجة عن التبخير الطارد في منتصف التحميص.`;

  return {
    reference: {
      batchSizeKg: ref.batchSizeKg,
      chargeTempC: ref.chargeTempC,
      gasBaselinePercent: ref.gasBaselinePercent,
      airflowSetting: ref.airflowSetting,
      drumSpeedRpm: ref.drumSpeedRpm,
      roasterType: ref.roasterType,
      roasterModel: ref.roasterModel,
    },
    target: {
      batchSizeKg: targetBatchKg,
      scaleRatio: Math.round(scaleRatio * 100) / 100,
      recommendedChargeTempC: clampedCharge,
      chargeTempDeltaC,
      recommendedGasScalingPercent,
      gasScaleFactor: Math.round(theoreticalGasMultiplier * 100) / 100,
      recommendedAirflowSetting,
      airflowDeltaDescription,
      recommendedDrumSpeedRpm,
      drumSpeedDeltaRpm,
    },
    phaseByPhaseGuidance,
    thermodynamicAnalysis: {
      thermalMassRatioDescription:
        scaleRatio > 1
          ? `نسبة الكتلة الحرارية للبن ارتفعت بنسبة ${((scaleRatio - 1) * 100).toFixed(0)}% مقارنة بكتلة الأسطوانة الثابتة؛ يلزم طاقة كامنة أعلى في الشحن لمنع الركود.`
          : `نسبة الكتلة الحرارية للأسطوانة المعدنية أصبحت مهيمنة بمقدار ${((1 / scaleRatio - 1) * 100).toFixed(0)}% مقارنة بحجم البن الصغير؛ يلزم تقليل حرارة الشحن لمنع اللسع السطحي.`,
      convectiveDominanceDescription:
        ROASTER_TYPE_INFO[ref.roasterType]?.convectionShare || 'متوازن بين الحمل والتوصيل',
      criticalRisks,
      actionSummary_ar,
      scientificRationale_ar,
    },
    simulatedRoRCurve,
  };
}
