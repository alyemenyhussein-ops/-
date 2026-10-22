package com.example.roastcurve.engine

import com.example.roastcurve.model.*
import kotlin.math.*

object BatchScalerEngine {

    val PRESET_SCALERS = listOf(
        Pair("تحجيم تصاعدي: من عينة تجريبية 1 كجم إلى إنتاج 12 كجم (Giesen W12A)",
            ReferenceRoastProfile(
                batchSizeKg = 1.0f,
                chargeTempC = 195f,
                roasterType = RoasterType.DRUM_DOUBLE_WALLED,
                drumSpeedRpm = 60,
                airflowSetting = "35 Pa (مستوى 3)",
                gasBaselinePercent = 45,
                roasterModel = "Giesen W12A (تحجيم إنتاج)",
                beanOrigin = "إثيوبيا يرغاتشيفي - مغسول",
                beanProcess = ProcessingMethod.WASHED,
                beanDensity = 820f,
                targetTurningPointC = 92f,
                yellowingTimeSec = 270f,
                firstCrackTimeSec = 540f,
                dropTimeSec = 645f,
                dropTempC = 206f
            ) to 12.0f
        ),
        Pair("تخفيض حمولة: من دفعة كاملة 15 كجم إلى نصف حمولة 7.5 كجم (Diedrich IR-12)",
            ReferenceRoastProfile(
                batchSizeKg = 15.0f,
                chargeTempC = 218f,
                roasterType = RoasterType.INFRARED_DRUM,
                drumSpeedRpm = 54,
                airflowSetting = "50% هواء مفتوح",
                gasBaselinePercent = 78,
                roasterModel = "Diedrich IR-12",
                beanOrigin = "كولومبيا هويلا - مجفف",
                beanProcess = ProcessingMethod.NATURAL,
                beanDensity = 790f,
                targetTurningPointC = 104f,
                yellowingTimeSec = 285f,
                firstCrackTimeSec = 560f,
                dropTimeSec = 670f,
                dropTempC = 210f
            ) to 7.5f
        ),
        Pair("تحجيم صناعي كبير: من 5 كجم إلى 30 كجم (Loring S35 Kestrel)",
            ReferenceRoastProfile(
                batchSizeKg = 5.0f,
                chargeTempC = 205f,
                roasterType = RoasterType.RECIRCULATING_HOT_AIR,
                drumSpeedRpm = 48,
                airflowSetting = "مستوى الحمل 4",
                gasBaselinePercent = 55,
                roasterModel = "Loring S35 Kestrel",
                beanOrigin = "غواتيمالا أنتيغوا - مغسول",
                beanProcess = ProcessingMethod.WASHED,
                beanDensity = 815f,
                targetTurningPointC = 98f,
                yellowingTimeSec = 260f,
                firstCrackTimeSec = 530f,
                dropTimeSec = 630f,
                dropTempC = 207f
            ) to 30.0f
        ),
        Pair("دفعة صغرى تجريبية: 3.5 كجم على محمصة Probat UG22 (سعة 22 كجم)",
            ReferenceRoastProfile(
                batchSizeKg = 20.0f,
                chargeTempC = 224f,
                roasterType = RoasterType.DRUM_SINGLE_WALLED,
                drumSpeedRpm = 52,
                airflowSetting = "ضغط 45 Pa",
                gasBaselinePercent = 82,
                roasterModel = "Probat UG22",
                beanOrigin = "اليمن حراز - مجفف لاهوائي",
                beanProcess = ProcessingMethod.ANAEROBIC,
                beanDensity = 835f,
                targetTurningPointC = 108f,
                yellowingTimeSec = 300f,
                firstCrackTimeSec = 580f,
                dropTimeSec = 690f,
                dropTempC = 211f
            ) to 3.5f
        )
    )

    fun calculateThermodynamicScaling(
        ref: ReferenceRoastProfile,
        targetBatchKg: Float
    ): ScaledBatchPlan {
        val scaleRatio = targetBatchKg / max(0.1f, ref.batchSizeKg)

        // 1. Charge Temperature scaling: Delta Charge = log2(scaleRatio) * roasterConstant
        val roasterConstant = when (ref.roasterType) {
            RoasterType.DRUM_DOUBLE_WALLED -> 9.5f
            RoasterType.RECIRCULATING_HOT_AIR -> 6.0f
            RoasterType.FLUID_BED -> 4.0f
            RoasterType.INFRARED_DRUM -> 8.5f
            RoasterType.DRUM_SINGLE_WALLED -> 12.0f
        }

        val rawDelta = (log2(scaleRatio.toDouble()) * roasterConstant).toFloat()
        val proposedCharge = ref.chargeTempC + rawDelta
        val clampedCharge = max(165f, min(245f, proposedCharge.roundToInt().toFloat()))
        val chargeTempDeltaC = clampedCharge - ref.chargeTempC

        // 2. Gas / Power Scaling
        val gamma = if (ref.roasterType == RoasterType.FLUID_BED) 0.90f else 0.78f
        val theoreticalGasMultiplier = scaleRatio.toDouble().pow(gamma.toDouble()).toFloat()

        val recommendedGasScalingPercent = if (scaleRatio >= 1f) {
            min(95, (ref.gasBaselinePercent * scaleRatio.toDouble().pow(0.35)).roundToInt())
        } else {
            max(20, (ref.gasBaselinePercent * scaleRatio.toDouble().pow(0.45)).roundToInt())
        }

        // 3. Airflow adjustments
        val (recommendedAirflowSetting, airflowDeltaDescription) = when {
            scaleRatio > 1.8f -> Pair(
                "رفع تدفق الهواء بنسبة +25% عن المرجع (${ref.airflowSetting})",
                "زيادة سحب الهواء بمقدار 20% - 30% لزيادة الإخلاء الحجمي لبخار الرطوبة المتصاعد وتفادي اختناق السيكلون."
            )
            scaleRatio < 0.6f -> Pair(
                "خفض تدفق الهواء بنسبة -20% عن المرجع (${ref.airflowSetting})",
                "تقليل سحب الهواء بمقدار 15% - 25% للحفاظ على الرطوبة الجوية وتجنب التبريد السريع لكتلة البن الصغيرة."
            )
            else -> Pair(
                "مماثل للمرجع مع مراقبة تصريف الدخان (${ref.airflowSetting})",
                "تعديل طفيف (±5%) مع المحافظة على نفس سرعة الإخلاء ومعايرة سحب القشرة (Chaff)."
            )
        }

        // 4. Drum Speed
        var drumSpeedDeltaRpm = 0
        if (ref.roasterType != RoasterType.FLUID_BED) {
            if (scaleRatio < 0.5f) {
                drumSpeedDeltaRpm = -4
            } else if (scaleRatio > 2.0f) {
                drumSpeedDeltaRpm = +3
            }
        }
        val recommendedDrumSpeedRpm = max(35, min(80, ref.drumSpeedRpm + drumSpeedDeltaRpm))

        // 5. Phase-by-phase Guidance
        val phaseByPhaseGuidance = listOf(
            PhaseGuidanceItem(
                phase = "الشحن ونقطة التحول (Charge & Turning Point)",
                timingTarget = if (scaleRatio >= 1f) "75 - 90 ثانية" else "60 - 75 ثانية",
                gasAdjustment = if (scaleRatio > 1f)
                    "تطبيق نقع حراري (Soak) لمدة 30-45 ثانية ثم تطبيق غاز $recommendedGasScalingPercent% لتعويض سحب الحرارة."
                else
                    "خفض حرارة الشحن إلى ${clampedCharge.roundToInt()}°C مع بدء غاز هادئ ($recommendedGasScalingPercent%) لمنع صدمة الحبوب بالأسطوانة الساخنة.",
                airflowAdjustment = "سحب هواء منخفض إلى معتدل لتثبيت البيئة الحرارية في الأسطوانة.",
                thermodynamicNotes = if (scaleRatio > 1f)
                    "كتلة البن الأكبر تشكل ممتصاً حرارياً هائلاً، مما يؤدي لنقطة تحول أعمق إذا لم ترفع حرارة الشحن."
                else
                    "الأسطوانة المعدنية تحتفظ بطاقة كامنة هائلة مقارنة بكتلة البن الصغيرة، وخطر الاحتراق التوصيلي السطحي مرتفع جداً."
            ),
            PhaseGuidanceItem(
                phase = "مرحلة التجفيف والاصفرار (Drying to Yellowing)",
                timingTarget = "${(ref.yellowingTimeSec * if (scaleRatio > 1f) 1.05f else 0.95f).roundToInt()} ثانية",
                gasAdjustment = "الحفاظ على قوة غاز $recommendedGasScalingPercent% حتى درجة 145°C ثم خفض تدريجي أولي بمقدار 5-8%.",
                airflowAdjustment = if (scaleRatio > 1f) "رفع الهواء تدريجياً لسحب بخار الماء الكثيف." else "الحفاظ على هواء معتدل لتجنب فقدان الزخم الحراري.",
                thermodynamicNotes = "مرحلة ماصة للحرارة (Endothermic). انتقال الحرارة يعتمد بنسبة 60% على التوصيل في البداية ثم يتحول للحمل."
            ),
            PhaseGuidanceItem(
                phase = "مرحلة تفاعلات مايلارد (Maillard Phase)",
                timingTarget = "${(ref.firstCrackTimeSec - ref.yellowingTimeSec).roundToInt()} ثانية",
                gasAdjustment = "خفض الغاز على درجتين متتاليتين (-10% ثم -10%) لضمان انحدار رتيب متناقص للـ RoR دون تسطح.",
                airflowAdjustment = "زيادة سحب الهواء لمستوى التشغيل المعياري لتسهيل نقل الحرارة بالحمل.",
                thermodynamicNotes = "بناء السكريات المعقدة والمركبات العطرية. التناقص المستمر في RoR يمنع الطعم المخبوز والكرملة السريعة غير المتجانسة."
            ),
            PhaseGuidanceItem(
                phase = "القرقعة الأولى والتطوير (First Crack & Development)",
                timingTarget = "${(ref.dropTimeSec - ref.firstCrackTimeSec).roundToInt()} ثانية (DTR: 15-18%)",
                gasAdjustment = "خفض الغاز المسبق قبل القرقعة بـ 45 ثانية لتفادي الانهيار الحراري (RoR Crash) الناتج عن التبخير الطارد.",
                airflowAdjustment = "رفع سحب الهواء للحد الأعلى لنزع الدخان وبخار الماء وقشرة البن.",
                thermodynamicNotes = "تفاعل طارد للحرارة (Exothermic). الكتلة الصغيرة تتأثر بسرعة فائقة بالقوة الطاردة (خطر Flick)، بينما الكتلة الكبيرة قد تنهار (خطر Crash)."
            )
        )

        // 6. Critical Risks
        val criticalRisks = mutableListOf<String>()
        if (scaleRatio > 2.0f) {
            criticalRisks.add("خطر التسطح الحراري والخبز (Baking): لزيادة كتلة البن التي تتطلب طاقة حمل أعلى لاختراق مركز الحبوب.")
            criticalRisks.add("خطر انهيار معدل الارتفاع (RoR Crash) عند القرقعة الأولى بسبب الحجم الهائل لبخار الماء المتدفق.")
            criticalRisks.add("خطر انسداد مسار السيكلون أو تراكم القشرة (Chaff) إذا لم يتم رفع قوة سحب الهواء.")
        } else if (scaleRatio < 0.6f) {
            criticalRisks.add("خطر الاحتراق السطحي واحتراق الأطراف (Scorching & Tipping): لأن حرارة الأسطوانة تفوق قدرة امتصاص الحبوب.")
            criticalRisks.add("خطر القفزة الحرارية المفاجئة (RoR Flick) عند نهاية التحميص نتيجة سرعة استجابة الدفعة الصغيرة للطاقة الكامنة.")
            criticalRisks.add("عدم دقة قراءة مسبار حرارة البن (Bean Probe) إذا لم تكن كتلة البن مغمورة بالكامل فوق المسبار.")
        } else {
            criticalRisks.add("الانتقال ضمن النطاق الآمن للسعة: التركيز على الحفاظ على نفس زاوية انحدار RoR المنحدرة.")
        }

        // 7. Simulated RoR Curve
        val simulatedRoRCurve = mutableListOf<ScaledRoRCurvePoint>()
        val totalDuration = (ref.dropTimeSec * if (scaleRatio > 1f) 1.04f else 0.96f).roundToInt()
        val steps = 25
        val timeStep = totalDuration / steps

        for (i in 0..steps) {
            val timeSec = (i * timeStep).toFloat()
            val progress = timeSec / totalDuration.toFloat()

            var refBT: Float
            var refRoR: Float
            if (progress < 0.15f) {
                refBT = ref.chargeTempC - (ref.chargeTempC - ref.targetTurningPointC) * sin((progress / 0.15f) * (PI.toFloat() / 2f))
                refRoR = 18f - 8f * (progress / 0.15f)
            } else {
                val p = (progress - 0.15f) / 0.85f
                refBT = ref.targetTurningPointC + (ref.dropTempC - ref.targetTurningPointC) * p.toDouble().pow(0.72).toFloat()
                refRoR = max(3.5f, 22f * (1f - p.toDouble().pow(0.65).toFloat()))
            }

            var scaledBT: Float
            var scaledRoR: Float
            if (progress < 0.15f) {
                val scaledTP = ref.targetTurningPointC + if (scaleRatio > 1f) 2.5f else -3.5f
                scaledBT = clampedCharge - (clampedCharge - scaledTP) * sin((progress / 0.15f) * (PI.toFloat() / 2f))
                scaledRoR = max(0f, refRoR + if (scaleRatio > 1f) 1.2f else -1.8f)
            } else {
                val p = (progress - 0.15f) / 0.85f
                val scaledTP = ref.targetTurningPointC + if (scaleRatio > 1f) 2.5f else -3.5f
                scaledBT = scaledTP + (ref.dropTempC - scaledTP) * p.toDouble().pow(0.72).toFloat()
                scaledRoR = max(3.2f, refRoR * if (scaleRatio > 1f) 1.04f else 0.96f)
            }

            simulatedRoRCurve.add(
                ScaledRoRCurvePoint(
                    timeSec = timeSec,
                    referenceRoR = (refRoR * 10f).roundToInt() / 10f,
                    scaledRoR = (scaledRoR * 10f).roundToInt() / 10f,
                    referenceBeanTemp = (refBT * 10f).roundToInt() / 10f,
                    scaledBeanTemp = (scaledBT * 10f).roundToInt() / 10f
                )
            )
        }

        val actionSummaryAr = if (scaleRatio > 1f)
            "لتحجيم الدفعة تصاعدياً من ${ref.batchSizeKg} كجم إلى $targetBatchKg كجم (معدل تضخيم ×%.1f): يجب رفع حرارة الدخول بمقدار +%.1f°C لتصل إلى ${clampedCharge.roundToInt()}°C، وضبط الطاقة الأساسية عند $recommendedGasScalingPercent%%، مع $airflowDeltaDescription".format(scaleRatio, chargeTempDeltaC)
        else
            "لتخفيض الدفعة من ${ref.batchSizeKg} كجم إلى $targetBatchKg كجم (معدل تقليص ×%.2f): يجب خفض حرارة الدخول بمقدار %.1f°C لتصل إلى ${clampedCharge.roundToInt()}°C، وتخفيف الغاز الأساسي إلى $recommendedGasScalingPercent%%، مع $airflowDeltaDescription".format(scaleRatio, abs(chargeTempDeltaC))

        val scientificRationaleAr = "وفق مبادئ الديناميكا الحرارية للتحميص (Thermodynamics of Coffee Roasting)، ترتبط السعة الحرارية لكتلة البن (Specific Heat Capacity c_p ≈ 1.6 kJ/kg·K) مباشرة بالكتلة الحرارية لأسطوانة التحميص المعدنية. الحفاظ على نفس منحنى RoR يتطلب موازنة الزخم الحراري المبدئي وإخلاء الرطوبة الناتجة عن التبخير الطارد في منتصف التحميص."

        val thermalMassRatioDescription = if (scaleRatio > 1f)
            "نسبة الكتلة الحرارية للبن ارتفعت بنسبة %.0f%% مقارنة بكتلة الأسطوانة الثابتة؛ يلزم طاقة كامنة أعلى في الشحن لمنع الركود.".format((scaleRatio - 1f) * 100f)
        else
            "نسبة الكتلة الحرارية للأسطوانة المعدنية أصبحت مهيمنة بمقدار %.0f%% مقارنة بحجم البن الصغير؛ يلزم تقليل حرارة الشحن لمنع اللسع السطحي.".format((1f / scaleRatio - 1f) * 100f)

        return ScaledBatchPlan(
            reference = ref,
            targetBatchKg = targetBatchKg,
            scaleRatio = (scaleRatio * 100f).roundToInt() / 100f,
            recommendedChargeTempC = clampedCharge,
            chargeTempDeltaC = chargeTempDeltaC,
            recommendedGasScalingPercent = recommendedGasScalingPercent,
            gasScaleFactor = (theoreticalGasMultiplier * 100f).roundToInt() / 100f,
            recommendedAirflowSetting = recommendedAirflowSetting,
            airflowDeltaDescription = airflowDeltaDescription,
            recommendedDrumSpeedRpm = recommendedDrumSpeedRpm,
            drumSpeedDeltaRpm = drumSpeedDeltaRpm,
            phaseByPhaseGuidance = phaseByPhaseGuidance,
            thermalMassRatioDescription = thermalMassRatioDescription,
            convectiveDominanceDescription = ref.roasterType.labelAr,
            criticalRisks = criticalRisks,
            actionSummaryAr = actionSummaryAr,
            scientificRationaleAr = scientificRationaleAr,
            simulatedRoRCurve = simulatedRoRCurve
        )
    }
}
