package com.example.roastcurve.engine

import com.example.roastcurve.model.*

object TrainerEngine {

    val CHALLENGES = listOf(
        TrainerChallenge(
            id = "challenge-ror-crash",
            titleAr = "الانهيار الحراري الكلاسيكي عند القرقعة الأولى (RoR Crash)",
            difficulty = "INTERMEDIATE",
            scenarioBriefAr = "محصول إثيوبي مجفف تم تحميصه لغرض قهوة الفلتر. لاحظ العميل غياب النوتات العطرية الزهرية وظهور طعم مسطح يشبه الكرتون الرطب في الكوب.",
            beanProfile = BeanProfile(
                name = "إثيوبيا قوجي مجففة (Guji Natural)",
                process = ProcessingMethod.NATURAL,
                densityGL = "810",
                moisturePct = "11.2",
                targetBrew = BrewTarget.FILTER,
                roasterType = RoasterType.DRUM_DOUBLE_WALLED
            ),
            telemetry = ManualTelemetry(
                chargeTempC = "204",
                turningPointTempC = "93",
                turningPointTime = "01:20",
                yellowingTime = "04:40",
                yellowingTempC = "151",
                firstCrackTime = "08:35",
                firstCrackTempC = "198",
                dropTime = "10:15",
                dropTempC = "206"
            ),
            appearance = PostRoastAppearance(
                agtronScale = "GOURMET",
                wholeBeanAgtron = "80",
                groundAgtron = "89",
                expansionQuality = "MEDIUM",
                surfaceOil = "DRY",
                centerCutColor = "HONEY_BROWN"
            ),
            sensoryNotesAr = "غياب حلاوة الخوخ المتوقعة، نكهة مسطحة وخافتة (Baked/Flat)، حمضية كامدة، وطعم متبقي قصير مع لمحة سيلولوز باهتة.",
            ghostCurveTarget = listOf(
                GhostCurvePoint(1f, 12.0f, 14.5f, 90f),
                GhostCurvePoint(2f, 18.0f, 17.5f, 110f),
                GhostCurvePoint(3f, 15.5f, 15.0f, 128f),
                GhostCurvePoint(4f, 13.0f, 13.0f, 144f),
                GhostCurvePoint(5f, 11.2f, 11.5f, 157f),
                GhostCurvePoint(6f, 9.8f, 10.0f, 170f),
                GhostCurvePoint(7f, 8.5f, 8.8f, 182f),
                GhostCurvePoint(8f, 7.2f, 7.5f, 193f),
                GhostCurvePoint(8.5f, 6.8f, 6.8f, 198f),
                GhostCurvePoint(9f, 2.1f, 5.8f, 201f), // Crash
                GhostCurvePoint(9.5f, 1.8f, 5.0f, 203f),
                GhostCurvePoint(10f, 2.5f, 4.2f, 205f)
            ),
            hiddenAnomaly = HiddenAnomaly(
                defectNameAr = "الانهيار الحراري لمعدل الارتفاع (RoR Crash)",
                defectCategory = DefectCategory.ROR_CRASH,
                thermodynamicCauseAr = "عند بداية القرقعة الأولى (08:35)، حدث انفجار مفاجئ لبخار الماء الماص للحرارة. تأخر الحمّاص في خفض الشعلة ثم خفضها بقوة شديدة في نفس اللحظة مع إبقاء الهواء منخفضاً، مما سبب انهيار RoR من 6.8 إلى 1.8°C/min وتوقف الكرملة الناضجة.",
                optimalGasFixAr = "خفض الغاز تدريجياً بنسبة 25-30% قبل القرقعة الأولى بـ 45 إلى 60 ثانية لتهدئة تسارع الحبوب.",
                optimalAirflowFixAr = "رفع تدفق الهواء بدرجة أو درجتين قبل القرقعة بـ 30 ثانية لسحب بخار الماء الكثيف.",
                sensoryImpactAr = "يسبب تفلطح الكوب وتكون طعم مخبوز كامد وفقدان التعقيد العطري والزهري.",
                agtronClueAr = "فارق الأجترون 9 درجات متقارب مع بطء التطور مما يعكس تلبد الكوب."
            )
        ),
        TrainerChallenge(
            id = "challenge-ror-flick",
            titleAr = "القفزة الحرارية العنيفة في التطور (RoR Flick)",
            difficulty = "BEGINNER",
            scenarioBriefAr = "محصول كولومبي مغسول تم تحميصه بمستوى فلتر متوسط-فاتح، لكن عند التذوق الحسي اشتكى الفاحصون من جفاف قابض حاد في الحلق ومرارة رماد دخانية تطغى على النهاية.",
            beanProfile = BeanProfile(
                name = "كولومبيا هويلا مغسول (Huila Supremo)",
                process = ProcessingMethod.WASHED,
                densityGL = "830",
                moisturePct = "10.8",
                targetBrew = BrewTarget.FILTER,
                roasterType = RoasterType.DRUM_DOUBLE_WALLED
            ),
            telemetry = ManualTelemetry(
                chargeTempC = "212",
                turningPointTempC = "96",
                turningPointTime = "01:15",
                yellowingTime = "04:30",
                yellowingTempC = "152",
                firstCrackTime = "08:15",
                firstCrackTempC = "196",
                dropTime = "10:05",
                dropTempC = "211"
            ),
            appearance = PostRoastAppearance(
                agtronScale = "GOURMET",
                wholeBeanAgtron = "71",
                groundAgtron = "80",
                expansionQuality = "MEDIUM",
                surfaceOil = "SLIGHT_SWEAT",
                centerCutColor = "DARK_UNIFORM"
            ),
            sensoryNotesAr = "مرارة لاذعة وقابضة (Astringent Mouthfeel)، طعم رماد ودخان خفيف في مؤخرة الحلق، حجب النكهات الفاكهية اللطيفة.",
            ghostCurveTarget = listOf(
                GhostCurvePoint(1f, 13.5f, 15.0f, 95f),
                GhostCurvePoint(2f, 18.5f, 18.0f, 114f),
                GhostCurvePoint(3f, 16.0f, 15.5f, 132f),
                GhostCurvePoint(4f, 13.5f, 13.2f, 148f),
                GhostCurvePoint(5f, 11.5f, 11.5f, 161f),
                GhostCurvePoint(6f, 9.8f, 9.8f, 173f),
                GhostCurvePoint(7f, 8.2f, 8.4f, 183f),
                GhostCurvePoint(8f, 6.8f, 7.0f, 194f),
                GhostCurvePoint(8.5f, 5.5f, 6.0f, 199f),
                GhostCurvePoint(9f, 3.5f, 4.8f, 203f),
                GhostCurvePoint(9.5f, 6.2f, 3.8f, 207f), // Flick!
                GhostCurvePoint(10f, 5.8f, 3.0f, 211f)
            ),
            hiddenAnomaly = HiddenAnomaly(
                defectNameAr = "القفزة الحرارية لمعدل الارتفاع (RoR Flick)",
                defectCategory = DefectCategory.ROR_FLICK,
                thermodynamicCauseAr = "في الدقيقة الأخيرة، تحولت الحبوب لتفاعل طارد للحرارة مع طاقة كامنة مفرطة وعدم خفض الغاز في مرحلة التطور، فقفز الـ RoR من 3.5 إلى 6.2°C/min مسبباً تفحم الاسترات العطرية.",
                optimalGasFixAr = "خفض الغاز إلى الحد الأدنى بعد الدقيقة التاسعة، وعدم رفع الغاز نهائياً في التطور.",
                optimalAirflowFixAr = "رفع سحب الهواء في نهاية التحميص لتبريد البيئة وسحب الدخان العادم.",
                sensoryImpactAr = "ينتج مركبات كربونية قابضة ومرارة قاسية تحرم الكوب من النقاء وتترك جفافاً.",
                agtronClueAr = "عرق زيتي خفيف (Slight Sweat) على حبة بدرجة 71 أجترون يشير لتلف حراري سطحي."
            )
        ),
        TrainerChallenge(
            id = "challenge-scorching-raw-core",
            titleAr = "احتراق السطح والقلب النيء (Scorching & Raw Core)",
            difficulty = "EXPERT",
            scenarioBriefAr = "محصول برازيلي منخفض الكثافة ومجفف تم إسقاطه بحرارة عالية، فأظهر الكوب طعماً عشبياً لاذعاً ممتزجاً مع طعم فول سوداني محروق وقشرة بندق.",
            beanProfile = BeanProfile(
                name = "البرازيل سيرادو مجفف (Cerrado NY2)",
                process = ProcessingMethod.NATURAL,
                densityGL = "735",
                moisturePct = "11.8",
                targetBrew = BrewTarget.ESPRESSO,
                roasterType = RoasterType.DRUM_SINGLE_WALLED
            ),
            telemetry = ManualTelemetry(
                chargeTempC = "228",
                turningPointTempC = "108",
                turningPointTime = "00:55",
                yellowingTime = "03:40",
                yellowingTempC = "156",
                firstCrackTime = "07:10",
                firstCrackTempC = "197",
                dropTime = "08:50",
                dropTempC = "214"
            ),
            appearance = PostRoastAppearance(
                agtronScale = "GOURMET",
                wholeBeanAgtron = "58",
                groundAgtron = "82",
                expansionQuality = "POOR",
                surfaceOil = "DRY",
                centerCutColor = "DARK_UNIFORM",
                visualDefects = listOf("لسع سطحي داكن (Scorched spots)")
            ),
            sensoryNotesAr = "تناقض حاد: نكهة فول سوداني متفحم مع حمضية عشبية لاذعة جداً، وجفاف قابض.",
            ghostCurveTarget = listOf(
                GhostCurvePoint(1f, 22.0f, 16.0f, 115f),
                GhostCurvePoint(2f, 20.0f, 15.0f, 138f),
                GhostCurvePoint(3f, 17.5f, 13.0f, 155f),
                GhostCurvePoint(4f, 14.0f, 11.0f, 170f),
                GhostCurvePoint(5f, 11.5f, 9.5f, 183f),
                GhostCurvePoint(6f, 9.0f, 8.0f, 194f),
                GhostCurvePoint(7f, 7.5f, 6.5f, 203f),
                GhostCurvePoint(8f, 6.0f, 5.0f, 210f),
                GhostCurvePoint(8.8f, 5.5f, 4.0f, 214f)
            ),
            hiddenAnomaly = HiddenAnomaly(
                defectNameAr = "اللسع السطحي والقلب النيء (Scorching & Raw Core)",
                defectCategory = DefectCategory.SCORCHING,
                thermodynamicCauseAr = "حرارة دخول مرتفعة جداً (228°C) في أسطوانة جدار أحادي لبن منخفض الكثافة (735 g/L). احترق السطح الخارجي وظل القلب غير ناضج مع فارق أجترون شاسع (24 نقطة).",
                optimalGasFixAr = "خفض حرارة الدخول إلى 195°C وبدء التحميص بنقع حراري أو شعلة هادئة.",
                optimalAirflowFixAr = "الاعتماد على تدفق هواء أعلى لزيادة الحمل الحراري وتقليل التوصيل المباشر.",
                sensoryImpactAr = "امتزاج طعم الحرق بالحموضة العشبية الفجة.",
                agtronClueAr = "فارق أجترون 24 نقطة (كامل 58 ومطحون 82) دليل قاطع على عدم نضج اللب."
            )
        )
    )

    fun gradeSubmission(challenge: TrainerChallenge, submission: TrainerSubmission): TrainerGradingResult {
        var defectScore = 0
        var controlScore = 0
        var reasoningScore = 0

        // 1. Defect Identification (40 pts)
        val isExactDefect = submission.identifiedDefectCategory == challenge.hiddenAnomaly.defectCategory
        if (isExactDefect) {
            defectScore = 40
        } else {
            // Partial match
            val isRelated = (submission.identifiedDefectCategory == DefectCategory.BAKED && challenge.hiddenAnomaly.defectCategory == DefectCategory.ROR_CRASH) ||
                    (submission.identifiedDefectCategory == DefectCategory.TIPPING && challenge.hiddenAnomaly.defectCategory == DefectCategory.SCORCHING)
            defectScore = if (isRelated) 26 else 12
        }

        // 2. Control Adjustments (40 pts)
        val optimalGasAction = when (challenge.hiddenAnomaly.defectCategory) {
            DefectCategory.ROR_CRASH -> "EARLIER_REDUCTION"
            DefectCategory.ROR_FLICK -> "CUT_OFF"
            DefectCategory.SCORCHING -> "DECREASE"
            DefectCategory.BAKED -> "INCREASE"
            else -> "DECREASE"
        }
        if (submission.gasAction == optimalGasAction || submission.gasAction == "DECREASE" || submission.gasAction == "EARLIER_REDUCTION") {
            controlScore += 20
        } else {
            controlScore += 8
        }

        if (submission.airflowAction == "INCREASE" || submission.airflowAction == "PULSE_VENT") {
            controlScore += 20
        } else {
            controlScore += 8
        }

        // 3. Thermodynamic Reasoning (20 pts)
        val reasoningLength = submission.thermodynamicReasoningAr.trim().length
        reasoningScore = when {
            reasoningLength > 60 -> 18
            reasoningLength > 25 -> 14
            reasoningLength > 10 -> 10
            else -> 6
        }

        val totalScore = (defectScore + controlScore + reasoningScore).coerceIn(20, 100)

        val tier = when {
            totalScore >= 88 -> "خبير تحميص معتمد (Master Roaster)"
            totalScore >= 75 -> "حمّاص متقدم (Advanced Roaster)"
            totalScore >= 60 -> "حمّاص ممارس (Practitioner)"
            else -> "متدرب يحتاج لإعادة المحاولة (Trainee)"
        }

        val defectCritique = if (isExactDefect) {
            "تشخيص ممتاز ودقيق! قمت برصد الخلل الحقيقي (${challenge.hiddenAnomaly.defectNameAr}) في مكانه الصحيح من المنحنى."
        } else {
            "تشخيصك (${submission.identifiedDefectCategory.labelAr}) كان قريباً، لكن الخلل الدقيق هو (${challenge.hiddenAnomaly.defectNameAr})."
        }

        val gasAirflowCritique = "خطة التحكم المقدمة: تعاملت مع الغاز بإجراء (${submission.gasAction}) والهواء بإجراء (${submission.airflowAction}). الحل النموذجي هو: ${challenge.hiddenAnomaly.optimalGasFixAr} و ${challenge.hiddenAnomaly.optimalAirflowFixAr}."

        val keyPoints = listOf(
            challenge.hiddenAnomaly.thermodynamicCauseAr,
            challenge.hiddenAnomaly.optimalGasFixAr,
            challenge.hiddenAnomaly.optimalAirflowFixAr,
            if (challenge.hiddenAnomaly.agtronClueAr.isNotBlank()) challenge.hiddenAnomaly.agtronClueAr else "مراقبة منحنى RoR بصرياً قبل القرقعة بـ 45 ثانية."
        )

        return TrainerGradingResult(
            totalScore = totalScore,
            gradeTierAr = tier,
            scoreBreakdown = ScoreBreakdown(defectScore, controlScore, reasoningScore),
            overallFeedbackAr = "تقييم احترافي: أظهرت فهماً ${if (totalScore >= 75) "عميقاً" else "مقبولاً"} لديناميكا انتقال الحرارة وتوازن الحمل والتوصيل في مسار التحميص.",
            defectCritiqueAr = defectCritique,
            gasAirflowCritiqueAr = gasAirflowCritique,
            revealedTruthAr = challenge.hiddenAnomaly.thermodynamicCauseAr,
            keyLearningPointsAr = keyPoints
        )
    }
}
