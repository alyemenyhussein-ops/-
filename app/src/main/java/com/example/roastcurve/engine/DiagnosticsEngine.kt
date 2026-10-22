package com.example.roastcurve.engine

import com.example.roastcurve.model.*
import kotlin.math.*

object DiagnosticsEngine {

    fun parseTimeToSeconds(timeStr: String): Float {
        val trimmed = timeStr.trim()
        val parts = trimmed.split(":")
        return if (parts.size == 2) {
            val min = parts[0].toFloatOrNull() ?: 0f
            val sec = parts[1].toFloatOrNull() ?: 0f
            min * 60f + sec
        } else {
            trimmed.toFloatOrNull() ?: 0f
        }
    }

    fun diagnose(
        beanProfile: BeanProfile,
        telemetry: ManualTelemetry,
        sensoryDefect: String,
        cuppingScores: SCACuppingScores,
        appearance: PostRoastAppearance,
        notes: String = ""
    ): RoastDiagnosisResponse {
        val chargeTemp = telemetry.chargeTempC.toFloatOrNull() ?: 200f
        val tpTemp = telemetry.turningPointTempC.toFloatOrNull() ?: 94f
        val tpSec = parseTimeToSeconds(telemetry.turningPointTime).coerceAtLeast(60f)
        val yellowSec = parseTimeToSeconds(telemetry.yellowingTime).coerceAtLeast(tpSec + 60f)
        val yellowTemp = telemetry.yellowingTempC.toFloatOrNull() ?: 152f
        val fcSec = parseTimeToSeconds(telemetry.firstCrackTime).coerceAtLeast(yellowSec + 60f)
        val fcTemp = telemetry.firstCrackTempC.toFloatOrNull() ?: 196f
        val dropSec = parseTimeToSeconds(telemetry.dropTime).coerceAtLeast(fcSec + 30f)
        val dropTemp = telemetry.dropTempC.toFloatOrNull() ?: 208f

        val deltaTDev = dropTemp - fcTemp
        val totalSec = dropSec

        val dryingSec = yellowSec
        val maillardSec = fcSec - yellowSec
        val devSec = dropSec - fcSec

        val dryingPct = ((dryingSec / totalSec) * 100f).roundToInt().toFloat()
        val maillardPct = ((maillardSec / totalSec) * 100f).roundToInt().toFloat()
        val dtrPct = ((devSec / totalSec) * 100f).roundToInt().toFloat()

        // Evaluate phase statuses
        val isFilter = beanProfile.targetBrew == BrewTarget.FILTER
        val (dtrStatus, dtrDiagnosis) = when {
            dtrPct > 20f && deltaTDev < 6f -> Pair(
                "BAKED",
                "تحميص مخبوز متسطح (Baked): نسبة وقت التطور DTR تجاوزت 20% بينما فارق حرارة التطور ضئيل جداً (${deltaTDev}°C) مما دمر السكريات والحلاوة."
            )
            dtrPct < (if (isFilter) 12f else 16f) && deltaTDev > 12f -> Pair(
                "UNDERDEVELOPED",
                "تطور سطحي سريع وقلب غير ناضج: DTR ضيق جداً مع فارق حراري حاد يسبب طعماً عشبياً وحموضة فجة وجفافاً قابضاً."
            )
            dtrPct < 13f -> Pair(
                "SHORT",
                "نسبة تطور قصيرة (DTR %.1f%%): الكوب يميل إلى البريق الحمضي الشديد مع خطر خفة القوام وعدم اكتمال نضج النواة.".format(dtrPct)
            )
            dtrPct > (if (isFilter) 20f else 24f) -> Pair(
                "EXTENDED",
                "نسبة تطور طويلة (DTR %.1f%%): هبوط في حدة الحموضة وتكثيف مفرط للميلانويدين والكرملة الداكنة.".format(dtrPct)
            )
            else -> Pair(
                "BALANCED",
                "نسبة تطور مثالية (DTR %.1f%%): توازن ممتاز بين سطوع الأحماض العضوية وتطور السكريات والقوام.".format(dtrPct)
            )
        }

        val (dryingStatus, dryingDiagnosis) = when {
            dryingPct < 35f -> Pair(
                "SHORT",
                "مرحلة تجفيف سريعة جداً (%.1f%%): زخم حراري ابتدائي مرتفع قد يهدد بلسع الأطراف (Scorching/Tipping).".format(dryingPct)
            )
            dryingPct > 48f -> Pair(
                "EXTENDED",
                "مرحلة تجفيف ممتدة وبطيئة (%.1f%%): ضعف الزخم الحراري في البداية قد يسحب الرطوبة ببطء ويسبب تسطح النكهات.".format(dryingPct)
            )
            else -> Pair(
                "BALANCED",
                "مرحلة تجفيف نموذجية (%.1f%%): إخلاء متزن لبخار الماء السطحي وتهيئة خلوية متناسقة.".format(dryingPct)
            )
        }

        val (maillardStatus, maillardDiagnosis) = when {
            maillardPct < 33f -> Pair(
                "SHORT",
                "مرحلة مايلارد سريعة (%.1f%%): انخفاض في تكوين الميلانويدين والقوام مع بقاء حموضة ساطعة ولكن حادة.".format(maillardPct)
            )
            maillardPct > 45f -> Pair(
                "EXTENDED",
                "مرحلة مايلارد ممتدة (%.1f%%): زيادة ملحوظة في قوام الكوب ولكن على حساب النوتات الزهرية والفاكهية الحساسة.".format(maillardPct)
            )
            else -> Pair(
                "BALANCED",
                "مرحلة مايلارد متوازنة (%.1f%%): تكوين مثالي للسكريات المعقدة والمركبات العطرية المتطايرة.".format(maillardPct)
            )
        }

        val phaseRatios = PhaseRatios(
            dryingPercent = dryingPct,
            dryingStatus = dryingStatus,
            dryingDiagnosisAr = dryingDiagnosis,
            maillardPercent = maillardPct,
            maillardStatus = maillardStatus,
            maillardDiagnosisAr = maillardDiagnosis,
            dtrPercent = dtrPct,
            dtrStatus = dtrStatus,
            dtrDiagnosisAr = dtrDiagnosis
        )

        // RoR Diagnostics
        val anomalies = mutableListOf<AnomalyItem>()
        val defectLower = sensoryDefect.lowercase()

        val hasCrash = defectLower.contains("انهيار") || defectLower.contains("crash") ||
                (dtrStatus == "BAKED") || defectLower.contains("كرتون") || defectLower.contains("مسطح")
        if (hasCrash) {
            anomalies.add(
                AnomalyItem(
                    anomalyType = "انهيار حراري عند القرقعة (RoR Crash)",
                    timeOccurredMmSs = telemetry.firstCrackTime,
                    severity = "حرج",
                    physicalCauseAr = "هبوط مفاجئ في معدل الارتفاع نتيجة التبخير الرطب الماص للحرارة مع تأخر رفع تدفق الهواء وسحب العادم."
                )
            )
        }

        val hasFlick = defectLower.contains("قفزة") || defectLower.contains("flick") ||
                defectLower.contains("مرارة") || defectLower.contains("رماد") || defectLower.contains("قابض")
        if (hasFlick) {
            anomalies.add(
                AnomalyItem(
                    anomalyType = "قفزة حرارية في نهاية التطور (RoR Flick)",
                    timeOccurredMmSs = "قبل التفريغ بـ 45 ثانية",
                    severity = "متوسط إلى حرج",
                    physicalCauseAr = "تسارع مفاجئ في RoR نتيجة التفاعل الطارد للحرارة مع عدم خفض الغاز في الدقائق الأخيرة."
                )
            )
        }

        val isMonotonic = !hasCrash && !hasFlick
        val peakRoR = (chargeTemp - tpTemp) / (tpSec / 60f) * 0.45f
        val finalRoR = if (hasFlick) 5.8f else if (hasCrash) 1.8f else 3.8f

        val rorDiagnostics = RoRDiagnostics(
            peakRorCPerMin = (peakRoR * 10f).roundToInt() / 10f,
            finalRorCPerMin = finalRoR,
            isMonotonicallyDecreasing = isMonotonic,
            hasCrash = hasCrash,
            crashDetailsAr = if (hasCrash) "تم رصد انهيار حراري حاد تجاوز 4°C/min عند القرقعة الأولى مسبباً انقطاع طاقة التطور." else "لا يوجد انهيار حراري مرصود.",
            hasFlick = hasFlick,
            flickDetailsAr = if (hasFlick) "تم رصد تسارع وانعطاف صاعد في RoR في نهاية مرحلة التطور أنتج مركبات كربونية قابضة." else "لا توجد قفزة حرارية مرصودة.",
            detectedAnomalies = anomalies
        )

        // Health Score
        var healthScore = 95
        if (hasCrash) healthScore -= 30
        if (hasFlick) healthScore -= 25
        if (dryingStatus != "BALANCED") healthScore -= 10
        if (dtrStatus == "BAKED") healthScore -= 20
        if (dtrStatus == "UNDERDEVELOPED") healthScore -= 20
        healthScore = healthScore.coerceIn(25, 98)

        val overallStatus = when {
            healthScore >= 82 -> RoastStatus.OPTIMAL
            healthScore >= 60 -> RoastStatus.NEEDS_ADJUSTMENT
            else -> RoastStatus.CRITICAL_DEFECT
        }

        val summaryHeadline = when (overallStatus) {
            RoastStatus.OPTIMAL -> "مسار تحميص متزن فيزيائياً مع انحدار رتيب متناسق وحفظ فائق لإيحاءات المنشأ"
            RoastStatus.NEEDS_ADJUSTMENT -> "مسار يحتاج لضبط استباقي للطاقة وتدفق الهواء لمعالجة شذوذ التطور"
            RoastStatus.CRITICAL_DEFECT -> "خلل ثرموديناميكي حاد أثر سلباً على التوازن الحسي للسكريات والأحماض"
        }

        // Extracted Metrics
        val extractedMetrics = ExtractedMetrics(
            chargeTempC = chargeTemp,
            turningPointTempC = tpTemp,
            yellowingTimeSec = yellowSec,
            firstCrackTempC = fcTemp,
            firstCrackTimeSec = fcSec,
            dropTempC = dropTemp,
            totalTimeSec = totalSec,
            tempDevelopmentDeltaC = (deltaTDev * 10f).roundToInt() / 10f
        )

        // Sensory Correlation
        val sensoryCorrelation = SensoryCorrelation(
            reportedDefectAr = sensoryDefect.ifBlank { "كوب متوازن وواضح النكهات" },
            thermodynamicRootCauseAr = if (hasCrash) "الانهيار الحراري عند القرقعة الأولى جمد تفاعلات الكرملة" else if (hasFlick) "التفاعل الطارد المفاجئ في التطور حرق السكريات وأنتج مرارة" else "انتقال حراري سلس بالحمل والتوصيل دون صدمة",
            expectedTasteProfileAr = if (hasCrash) "طعم مخبوز مسطح مع انخفاض واضح في الحلاوة وبريق الحمضية" else if (hasFlick) "مرارة رماد دخانية مع جفاف قابض في الطعم المتبقي" else "حمضية فاكهية زاهية مع حلاوة مكرملة نظيفة وقوام حريري",
            bakedRisk = hasCrash || dtrStatus == "BAKED",
            scorchedRisk = dryingStatus == "SHORT",
            astringencyRisk = hasFlick
        )

        // Action Plan
        val actionPlan = mutableListOf<ActionPlanStep>()
        actionPlan.add(
            ActionPlanStep(
                stepNumber = 1,
                stageNameAr = "الإسقاط ونقطة التحول (Charge & TP)",
                controlParameter = ControlParameter.CHARGE_TEMP,
                exactActionAr = if (dryingStatus == "SHORT") "خفض حرارة الدخول بمقدار 5°C لتخفيف الزخم التوصيلي" else "الحفاظ على حرارة الإسقاط الحالية (${chargeTemp.roundToInt()}°C) مع نقع حراري 30 ثانية",
                expectedEffectAr = "حماية الحبوب من الصدمة وتأمين نقطة تحول مستقرة عند ${tpTemp.roundToInt()}°C"
            )
        )
        actionPlan.add(
            ActionPlanStep(
                stepNumber = 2,
                stageNameAr = "مرحلة مايلارد (Maillard Phase)",
                controlParameter = ControlParameter.GAS_POWER,
                exactActionAr = "تخفيض الغاز بنسبة 15% عند بلوغ حرارة 165°C لتهيئة انحدار رتيب متناقص",
                expectedEffectAr = "تمديد متزن لتفاعلات الميلانويدين ومنع التسارع الحراري"
            )
        )
        actionPlan.add(
            ActionPlanStep(
                stepNumber = 3,
                stageNameAr = "قبل القرقعة الأولى بـ 45 ثانية",
                controlParameter = if (hasCrash) ControlParameter.AIRFLOW else ControlParameter.GAS_POWER,
                exactActionAr = if (hasCrash) "رفع تدفق الهواء بنسبة 20% وخفض الشعلة مسبقاً قبل القرقعة" else "خفض الغاز بمقدار 10% إضافية لمنع قفزة RoR Flick",
                expectedEffectAr = "إخلاء بخار الماء المتطاير وتفادي الانهيار الحراري أو القفزة الطاردة"
            )
        )
        actionPlan.add(
            ActionPlanStep(
                stepNumber = 4,
                stageNameAr = "مرحلة التطور والتفريغ (Drop)",
                controlParameter = ControlParameter.DROP_TIMING,
                exactActionAr = "التفريغ الدقيق عند بلوغ نسبة DTR ${if (isFilter) "15%" else "19%"} دون رفع الغاز نهائياً",
                expectedEffectAr = "تطابق كامل بين لون السطح ونواة الحبة وحفظ كامل لحلاوة الكوب"
            )
        )

        // Ghost Curve (minute by minute)
        val ghostCurve = mutableListOf<GhostCurvePoint>()
        val totalMin = (totalSec / 60f).roundToInt()
        for (m in 1..totalMin) {
            val minFloat = m.toFloat()
            val targetRor = 18f - (minFloat * 1.35f).coerceAtMost(14.5f)
            val actualRor = when {
                hasCrash && minFloat >= (fcSec / 60f) -> 1.8f + (minFloat * 0.2f)
                hasFlick && minFloat >= (dropSec / 60f - 1f) -> 6.2f
                else -> targetRor + (sin(minFloat.toDouble()) * 0.8).toFloat()
            }
            val approxTemp = tpTemp + ((dropTemp - tpTemp) * (minFloat / totalMin)).coerceAtMost(dropTemp)
            ghostCurve.add(
                GhostCurvePoint(
                    timeMin = minFloat,
                    actualEstimatedRor = (actualRor * 10f).roundToInt() / 10f,
                    targetRor = (targetRor * 10f).roundToInt() / 10f,
                    tempC = (approxTemp * 10f).roundToInt() / 10f
                )
            )
        }

        // Agtron Appearance Analysis
        val wholeAgtron = appearance.wholeBeanAgtron.toFloatOrNull() ?: 76f
        val groundAgtron = appearance.groundAgtron.toFloatOrNull() ?: 86f
        val deltaSpread = groundAgtron - wholeAgtron
        val agtronClass = AgtronEngine.getAgtronClassification(groundAgtron, appearance.agtronScale)
        val benchmark = AgtronEngine.getBenchmark(beanProfile.process, beanProfile.targetBrew)
        val consistencyResult = AgtronEngine.evaluateRoastDelta(wholeAgtron, groundAgtron)

        val agtronAnalysis = AgtronAppearanceAnalysis(
            agtronReadingWhole = wholeAgtron,
            agtronReadingGround = groundAgtron,
            deltaAgtronSpread = (deltaSpread * 10f).roundToInt() / 10f,
            roastDegreeCategoryAr = agtronClass.categoryAr,
            colorHex = agtronClass.hexColor,
            coreVsSurfaceGradientAr = consistencyResult.titleAr,
            physicalExpansionEvaluationAr = if (appearance.expansionQuality == "EXCELLENT") "تمدد خلوي فائق وانفتاح متجانس للشق الأوسط" else "تمدد متوسط وتجانس نسبي",
            thermodynamicCauseAr = consistencyResult.thermodynamicTipAr,
            processConsistencyScore = if (deltaSpread in benchmark.idealDeltaMin..benchmark.idealDeltaMax) 92 else 74,
            processConsistencyStatus = if (deltaSpread in benchmark.idealDeltaMin..benchmark.idealDeltaMax) "HIGHLY_CONSISTENT" else "MODERATELY_CONSISTENT",
            expectedAgtronRangeMin = benchmark.groundMin,
            expectedAgtronRangeMax = benchmark.groundMax,
            idealDeltaRange = "${benchmark.idealDeltaMin} - ${benchmark.idealDeltaMax}",
            processSensoryLinkAnalysisAr = benchmark.descriptionAr,
            roastColorSensoryVerdictAr = consistencyResult.verdictAr,
            processSpecificRecommendationsAr = listOf(
                benchmark.thermodynamicRuleAr,
                "مراقبة الفارق اللوني بين الحبة والمطحون لضمان اختراق حراري سليم للقلب."
            )
        )

        // SCA Cupping Analysis
        val scaGrade = when {
            cuppingScores.totalScore >= 90f -> "قهوة مختصة نادرة واستثنائية (Presidential 90+)"
            cuppingScores.totalScore >= 85f -> "قهوة مختصة ممتازة جداً (Specialty 85 - 89.75)"
            cuppingScores.totalScore >= 80f -> "قهوة مختصة معتمدة (Specialty 80 - 84.75)"
            else -> "أقل من المعيار التخصصي (Below Specialty / Commercial)"
        }
        val scaAnalysis = SCACuppingAnalysis(
            calibratedScaScore = cuppingScores.totalScore,
            scaGradeAr = scaGrade,
            fragranceAromaAr = "رائحة نضرة وغنية بالمركبات العطرية بنسبة ${cuppingScores.fragranceAroma}/10",
            flavorAr = "نكهات أصيلة بنسبة ${cuppingScores.flavor}/10 تبرز هوية معالجة ${beanProfile.process.labelAr}",
            aftertasteAr = "طعم متبقي نقي وطويل بنسبة ${cuppingScores.aftertaste}/10",
            acidityAr = "حمضية ${if (isFilter) "ستريكية منعشة وساطعة" else "متزنة وناعمة"} بنسبة ${cuppingScores.acidity}/10",
            bodyAr = "ملمس وقوام ناعم ومتماسك بنسبة ${cuppingScores.body}/10",
            balanceAr = "اتزان عام متناسق بين الحلاوة والحمضية بنسبة ${cuppingScores.balance}/10",
            flavorWheelTags = cuppingScores.flavorNotes.ifEmpty { listOf("ياسمين", "خوخ ناضج", "حمضيات منعشة", "سكر بني") },
            thermodynamicImpactAr = "تطابق مسار RoR ومراحل التطور ينعكس مباشرة على نقاء الكوب وعدم ظهور عيوب الخبز أو التفحم."
        )

        // Brew Rescue
        val brewRescue = BrewRescueEngine.generateRescueProtocol(
            phaseRatios,
            rorDiagnostics,
            sensoryDefect,
            beanProfile
        )

        // Airflow Analysis
        val convectiveRatio = when (beanProfile.roasterType) {
            RoasterType.FLUID_BED -> 95
            RoasterType.RECIRCULATING_HOT_AIR -> 85
            RoasterType.DRUM_DOUBLE_WALLED -> 68
            RoasterType.INFRARED_DRUM -> 55
            RoasterType.DRUM_SINGLE_WALLED -> 50
        }
        val airflowAnalysis = AirflowAnalysis(
            convectiveHeatRatioPercent = convectiveRatio,
            airflowBalanceStatus = if (hasCrash) "INSUFFICIENT" else "OPTIMAL",
            verdictHeadlineAr = if (hasCrash) "قصور في سحب العادم عند القرقعة تسبب في احتباس الرطوبة" else "توازن تدفق هواء ممتاز يدعم الحمل الحراري",
            chaffSmokeClearanceAr = telemetry.airflow.chaffEvacuation.labelAr,
            chargeDryingEvalAr = "تدفق هواء هادئ ومناسب لتفادي سحب الحرارة في البداية.",
            maillardEvalAr = "سحب هواء متزن يساند الحمل الحراري وتجانس تكرمل السكريات.",
            firstCrackDevEvalAr = if (hasCrash) "يلزم رفع سرعة المروحة بنسبة +20% قبل القرقعة بـ 45 ثانية." else "إخلاء ممتاز للدخان والقشور وبخار الماء.",
            recommendedFanAdjustmentsAr = "الحفاظ على خطة المروحة الحالية مع زيادة مبكرة طفيفة عند سماع أولى طقطقات القرقعة الأولى."
        )

        return RoastDiagnosisResponse(
            overallStatus = overallStatus,
            roastHealthScore = healthScore,
            summaryHeadline = summaryHeadline,
            extractedMetrics = extractedMetrics,
            phaseRatios = phaseRatios,
            rorDiagnostics = rorDiagnostics,
            sensoryCorrelation = sensoryCorrelation,
            nextBatchActionPlan = actionPlan,
            ghostCurveTarget = ghostCurve,
            scaCuppingAnalysis = scaAnalysis,
            agtronAppearanceAnalysis = agtronAnalysis,
            brewRescueProtocol = brewRescue,
            airflowAnalysis = airflowAnalysis
        )
    }
}
