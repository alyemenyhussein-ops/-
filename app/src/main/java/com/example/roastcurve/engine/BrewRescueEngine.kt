package com.example.roastcurve.engine

import com.example.roastcurve.model.*

object BrewRescueEngine {

    fun generateRescueProtocol(
        phaseRatios: PhaseRatios,
        rorDiagnostics: RoRDiagnostics,
        sensoryDefect: String,
        beanProfile: BeanProfile
    ): BrewRescueProtocol {
        val hasCrash = rorDiagnostics.hasCrash || rorDiagnostics.detectedAnomalies.any {
            it.anomalyType.contains("crash", ignoreCase = true) || it.anomalyType.contains("انهيار")
        }

        val hasFlick = rorDiagnostics.hasFlick || rorDiagnostics.detectedAnomalies.any {
            it.anomalyType.contains("flick", ignoreCase = true) || it.anomalyType.contains("قفزة")
        }

        val defectLower = sensoryDefect.lowercase()
        val isBaked = hasCrash ||
                phaseRatios.dtrStatus.contains("خبز") ||
                phaseRatios.dtrStatus == "BAKED" ||
                defectLower.contains("خبز") ||
                defectLower.contains("baked") ||
                defectLower.contains("تسطح")

        val isFlickDefect = hasFlick ||
                defectLower.contains("قفزة") ||
                defectLower.contains("flick") ||
                defectLower.contains("مرارة") ||
                defectLower.contains("قبوض") ||
                defectLower.contains("دخاني")

        val isScorched = defectLower.contains("حرق") ||
                defectLower.contains("scorching") ||
                defectLower.contains("tipping") ||
                phaseRatios.dryingPercent < 32f

        val isUnderdeveloped = phaseRatios.dtrPercent < 12f ||
                phaseRatios.dtrStatus.contains("ناقص") ||
                phaseRatios.dtrStatus == "UNDERDEVELOPED" ||
                defectLower.contains("حموضة حادة") ||
                defectLower.contains("عشبي")

        // 1. Baked or RoR Crash
        if (isBaked) {
            return BrewRescueProtocol(
                salvageabilityPercent = 88,
                bestUseRecommendationAr = "مناسبة للمقطر بنسبة مركزة قصيرة، أو كأساس غني لمشروبات الفلات وايت واللاتيه",
                degassingRestDaysAr = "8 إلى 12 يوماً بعد التحميص",
                waterChemistryTarget = WaterChemistryTarget(
                    targetGhPpm = "85 ppm (صلابة كلية غنية بالمغنيسيوم)",
                    targetKhPpm = "20 ppm (قلوية منخفضة للحفاظ على الحمضية)",
                    mgToCaRatio = "3:1 (تركيز المغنيسيوم لجذب السكريات)",
                    waterExplanationAr = "الماء منخفض القلوية جداً (20 ppm) يحافظ على ما تبقى من الأحماض العضوية الفاكهية، بينما الصلابة المرتفعة تسحب السكريات لتعويض التسطح."
                ),
                filterRescueRecipe = FilterRescueRecipe(
                    waterTempC = "93°C - 94°C (حرارة استخلاص عالية لزيادة الطاقة الحركية)",
                    brewRatio = "1:14.5 (نسبة استخلاص مركزة وقصيرة لتعزيز الحلاوة والقوام)",
                    grindAdjustmentAr = "أنعم بنقطة واحدة من طحنة الكاليبراشن لرفع معدل الاستخلاص التراكمي للسكريات",
                    bloomAndPourTechniqueAr = "ترطيب بـ 45ml لمدة 40 ثانية مع هزة خفيفة، يليه صبتان دائريتان مركزتان في المنتصف (100ml ثم 100ml)."
                ),
                espressoRescueRecipe = EspressoRescueRecipe(
                    waterTempC = "94°C",
                    yieldRatio = "1:1.8 (ريستريتو مركز - 19g بن إلى 34g استخلاص)",
                    shotTimeSec = "25 - 27 ثانية",
                    preInfusionAndPressureAr = "ترطيب مسبق 6 ثوانٍ عند 3 بار يتبعه استخلاص سلس عند 8.5 بار مع إنهاء مبكر قبل الشقراء."
                )
            )
        }

        // 2. Flick or Astringent
        if (isFlickDefect) {
            return BrewRescueProtocol(
                salvageabilityPercent = 82,
                bestUseRecommendationAr = "مناسبة للمقطر بتقنية التخطي المائي (Bypass Brewing)، أو استخلاص كولد برو بنقع بارد بطيء",
                degassingRestDaysAr = "10 إلى 14 يوماً بعد التحميص",
                waterChemistryTarget = WaterChemistryTarget(
                    targetGhPpm = "50 ppm (صلابة منخفضة لتخفيف سحب المركبات الثقيلة)",
                    targetKhPpm = "40 ppm (قلوية معتدلة لعمل بفر كيميائي ضد المرارة)",
                    mgToCaRatio = "2:1 (توازن لطيف لعدم المبالغة في سحب الاسترات)",
                    waterExplanationAr = "خفض الصلابة الكلية يقلل قوة المذيب ويمنع استخلاص مركبات الفحم، بينما القلوية تعزل الطعم القابض."
                ),
                filterRescueRecipe = FilterRescueRecipe(
                    waterTempC = "86°C - 88°C (حرارة استخلاص هادئة لتفادي إثارة المركبات المرة)",
                    brewRatio = "1:12 استخلاص أولي + إضافة 60ml ماء ساخن نقي (Bypass) للكوب",
                    grindAdjustmentAr = "أخشن بنقطتين كاملتين من طحنة الكاليبراشن المعتادة لتقليل مساحة التلامس",
                    bloomAndPourTechniqueAr = "ترطيب 50ml لمدة 35 ثانية، ثم صبة واحدة بطيئة حتى 180ml، ثم سحب القمع وإضافة 60ml ماء نقي ساخن للكوب مباشرة."
                ),
                espressoRescueRecipe = EspressoRescueRecipe(
                    waterTempC = "88°C - 89°C",
                    yieldRatio = "1:2.0",
                    shotTimeSec = "21 - 23 ثانية (استخلاص سريع وخاطف)",
                    preInfusionAndPressureAr = "استخلاص مباشر بدون ترطيب طويل عند 8 بار مع قطع الاستخلاص فوراً عند أول تبدل في اللون."
                )
            )
        }

        // 3. Scorched
        if (isScorched) {
            return BrewRescueProtocol(
                salvageabilityPercent = 76,
                bestUseRecommendationAr = "توجيهها لمشروبات الحليب (كورتادو، فلات وايت) بعد غربلة القشور المحترقة",
                degassingRestDaysAr = "12 إلى 16 يوماً بعد التحميص",
                waterChemistryTarget = WaterChemistryTarget(
                    targetGhPpm = "70 ppm",
                    targetKhPpm = "65 ppm (قلوية مرتفعة لمعادلة الأحماض النيئة ومرارة الحرق)",
                    mgToCaRatio = "1.5:1 (كالسيوم متوازن لتعزيز القوام مع الحليب)",
                    waterExplanationAr = "رفع القلوية يوفر دارئة كيميائية تعادل الحمضية غير الناضجة وتكبح حدة تفحم أطراف الحبوب."
                ),
                filterRescueRecipe = FilterRescueRecipe(
                    waterTempC = "ترطيب بـ 93°C ثم إكمال الصب بـ 86°C (تقنية الحرارة المتدرجة)",
                    brewRatio = "1:15",
                    grindAdjustmentAr = "طحن متوسط مع النفخ اللطيف لطرد القشور (Chaff) المتفحمة",
                    bloomAndPourTechniqueAr = "ترطيب بماء ساخن 93°C لتحفيز استخلاص قلب الحبة، ثم خفض حرارة الصب إلى 86°C لمنع سحب كربون السطح."
                ),
                espressoRescueRecipe = EspressoRescueRecipe(
                    waterTempC = "91°C",
                    yieldRatio = "1:2.2",
                    shotTimeSec = "26 - 28 ثانية",
                    preInfusionAndPressureAr = "ترطيب مسبق 5 ثوانٍ، واستخدام Puck screen لمنع القنوات وامتزاج نكهات التفحم."
                )
            )
        }

        // 4. Underdeveloped
        if (isUnderdeveloped) {
            return BrewRescueProtocol(
                salvageabilityPercent = 85,
                bestUseRecommendationAr = "مناسبة للفلتر بحرارة ماء قصوى وترطيب مطول، وتتطلب فترة راحة أطول قبل التقديم",
                degassingRestDaysAr = "14 إلى 18 يوماً لطرد غاز CO2 المحبوس في النواة الصلبة",
                waterChemistryTarget = WaterChemistryTarget(
                    targetGhPpm = "75 ppm",
                    targetKhPpm = "65 ppm (قلوية مرتفعة لمعادلة الأحماض العشبية)",
                    mgToCaRatio = "2.5:1",
                    waterExplanationAr = "القلوية العالية تعادل الأحماض الماليكية الحادة، والحرارة القصوى تجبر الحبة على إطلاق مركباتها السكرية."
                ),
                filterRescueRecipe = FilterRescueRecipe(
                    waterTempC = "95°C - 96°C (أقصى حرارة لاستخلاص عميق)",
                    brewRatio = "1:16.5",
                    grindAdjustmentAr = "أنعم بنقطتين لزيادة مساحة السطح التفاعلية للبن الصلب",
                    bloomAndPourTechniqueAr = "ترطيب مبدئي لمدة 60 ثانية مع تحريك خفيف، ثم صبات متتالية لزيادة وقت التلامس."
                ),
                espressoRescueRecipe = EspressoRescueRecipe(
                    waterTempC = "95°C",
                    yieldRatio = "1:2.4 (لونغ كورتادو / استخلاص ممتد)",
                    shotTimeSec = "28 - 30 ثانية",
                    preInfusionAndPressureAr = "ترطيب مسبق 8 ثوانٍ عند 2.5 بار لضمان تشبع النواة الصلبة قبل ضغط 9 بار."
                )
            )
        }

        // 5. Optimal / Balanced
        return BrewRescueProtocol(
            salvageabilityPercent = 96,
            bestUseRecommendationAr = "تحميص مثالي ومنضبط؛ جاهزة للتقديم للفلتر والإسبريسو بالوصفة الذهبية المعتمدة لإبراز النوتات الأصلية",
            degassingRestDaysAr = "7 إلى 10 أيام بعد التحميص",
            waterChemistryTarget = WaterChemistryTarget(
                targetGhPpm = "65 ppm (صلابة مثالية لمعايير SCA)",
                targetKhPpm = "35 ppm (قلوية متزنة لحماية بريق الحمضية الطبيعية)",
                mgToCaRatio = "2:1 (توازن ذهبي بين المغنيسيوم والكالسيوم)",
                waterExplanationAr = "كيمياء ماء قياسية متوازنة تماماً تتيح إطلاق كامل الإمكانات العطرية والفاكهية للبن دون أي كبح طعمي."
            ),
            filterRescueRecipe = FilterRescueRecipe(
                waterTempC = "91°C - 92°C",
                brewRatio = "1:15.5 إلى 1:16",
                grindAdjustmentAr = "طحنة الكاليبراشن القياسية (متوسطة النعومة كحبات ملح البحر الناعم)",
                bloomAndPourTechniqueAr = "ترطيب 50ml لمدة 40 ثانية، ثم 3 صبات متساوية بهدوء مركزي حتى الوصول إلى 250ml عند دقيقة 02:30."
            ),
            espressoRescueRecipe = EspressoRescueRecipe(
                waterTempC = "92.5°C",
                yieldRatio = "1:2.0 (18g بن إلى 36g استخلاص)",
                shotTimeSec = "26 - 28 ثانية",
                preInfusionAndPressureAr = "ترطيب مسبق 4 ثوانٍ عند 3 بار، يليه تدفق مستقر عند 9 بار مع كريما مخملية ذهبية متسقة."
            )
        )
    }
}
