package com.example.roastcurve.data

import com.example.roastcurve.model.*

data class DemoPreset(
    val id: String,
    val titleAr: String,
    val subtitleAr: String,
    val beanProfile: BeanProfile,
    val telemetry: ManualTelemetry,
    val cuppingScores: SCACuppingScores,
    val appearance: PostRoastAppearance,
    val sensoryDefect: String,
    val notes: String
)

object PresetsData {

    val PRESETS = listOf(
        DemoPreset(
            id = "preset-yemen-haraz-optimal",
            titleAr = "اليمن حراز | تحميص مثالي متزن (Balanced Masterpiece)",
            subtitleAr = "بن كثيف جداً (840 g/L) معالجة لاهوائية، انحدار رتيب متناسق بدون شذوذ",
            beanProfile = BeanProfile(
                name = "اليمن حراز - وادي مسار لاهوائي",
                process = ProcessingMethod.ANAEROBIC,
                densityGL = "840",
                moisturePct = "10.8",
                targetBrew = BrewTarget.FILTER,
                roasterType = RoasterType.DRUM_DOUBLE_WALLED
            ),
            telemetry = ManualTelemetry(
                chargeTempC = "202",
                turningPointTempC = "94",
                turningPointTime = "01:25",
                yellowingTime = "04:45",
                yellowingTempC = "152",
                firstCrackTime = "08:40",
                firstCrackTempC = "197",
                dropTime = "10:15",
                dropTempC = "207",
                airflow = RoasterAirflowSettings(
                    unit = AirflowUnit.PERCENT,
                    chargeAirflow = "35%",
                    dryingAirflow = "50%",
                    maillardAirflow = "65%",
                    firstCrackAirflow = "80%",
                    chaffEvacuation = ChaffEvacuation.OPTIMAL,
                    notes = "سحب هواء ناعم يحافظ على النوتات العطرية المعقدة للبن اليمني."
                )
            ),
            cuppingScores = SCACuppingScores(
                fragranceAroma = 9.0f,
                flavor = 8.75f,
                aftertaste = 8.5f,
                acidity = 8.5f,
                acidityIntensity = "MEDIUM",
                body = 8.75f,
                bodyLevel = "HEAVY",
                balance = 8.75f,
                uniformity = 10.0f,
                cleanCup = 10.0f,
                sweetness = 10.0f,
                overall = 8.75f,
                defectsPoints = 0f,
                totalScore = 91.0f,
                flavorNotes = listOf("هيل معطر", "مشمش مجفف", "شوكولاتة داكنة", "عسل سدر يمني", "خوخ أسود")
            ),
            appearance = PostRoastAppearance(
                agtronScale = "GOURMET",
                wholeBeanAgtron = "74",
                groundAgtron = "84",
                expansionQuality = "EXCELLENT",
                surfaceOil = "DRY",
                centerCutColor = "HONEY_BROWN",
                visualDefects = emptyList()
            ),
            sensoryDefect = "",
            notes = "دفعة نموذجية نفذت باحترافية على محمصة مزدوجة الجدار؛ حلاوة فائقة وتعقيد منشئي نقي."
        ),
        DemoPreset(
            id = "preset-ethiopia-crash",
            titleAr = "إثيوبيا قوجي | انهيار حراري حاد (RoR Crash & Baked)",
            subtitleAr = "هبوط عنيف في معدل الارتفاع عند القرقعة مع طعم مخبوز وتسطح الحلاوة",
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
                dropTempC = "206",
                airflow = RoasterAirflowSettings(
                    unit = AirflowUnit.PERCENT,
                    chargeAirflow = "25%",
                    dryingAirflow = "40%",
                    maillardAirflow = "50%",
                    firstCrackAirflow = "55%",
                    chaffEvacuation = ChaffEvacuation.POOR,
                    notes = "تأخر في رفع مروحة السحب عند القرقعة مما حبس الرطوبة."
                )
            ),
            cuppingScores = SCACuppingScores(
                fragranceAroma = 7.25f,
                flavor = 7.0f,
                aftertaste = 6.75f,
                acidity = 7.0f,
                acidityIntensity = "LOW",
                body = 7.0f,
                bodyLevel = "LIGHT",
                balance = 7.0f,
                uniformity = 10.0f,
                cleanCup = 10.0f,
                sweetness = 7.0f,
                overall = 7.0f,
                defectsPoints = 0f,
                totalScore = 79.0f,
                flavorNotes = listOf("طعم خبز ومخبوزات", "كرتون رطب", "تسطح في الحلاوة")
            ),
            appearance = PostRoastAppearance(
                agtronScale = "GOURMET",
                wholeBeanAgtron = "80",
                groundAgtron = "89",
                expansionQuality = "MEDIUM",
                surfaceOil = "DRY",
                centerCutColor = "HONEY_BROWN",
                visualDefects = emptyList()
            ),
            sensoryDefect = "غياب حلاوة الخوخ المتوقعة، نكهة مسطحة وخافتة (Baked/Flat)، حمضية كامدة، وطعم كرتون باهت.",
            notes = "حدث تفريغ ماص للحرارة عند القرقعة الأولى وتأخر المشغل في خفض الغاز فخفضه بقوة مفرطة."
        ),
        DemoPreset(
            id = "preset-colombia-flick",
            titleAr = "كولومبيا هويلا | قفزة حرارية في التطور (RoR Flick)",
            subtitleAr = "تسارع مفاجئ في الدقائق الأخيرة سبب مرارة رماد دخانية وجفافاً قابضاً",
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
                dropTempC = "211",
                airflow = RoasterAirflowSettings(
                    unit = AirflowUnit.PERCENT,
                    chargeAirflow = "30%",
                    dryingAirflow = "50%",
                    maillardAirflow = "65%",
                    firstCrackAirflow = "70%",
                    chaffEvacuation = ChaffEvacuation.MODERATE
                )
            ),
            cuppingScores = SCACuppingScores(
                fragranceAroma = 7.5f,
                flavor = 7.25f,
                aftertaste = 6.5f,
                acidity = 7.25f,
                acidityIntensity = "MEDIUM",
                body = 7.5f,
                bodyLevel = "MEDIUM",
                balance = 7.0f,
                uniformity = 10.0f,
                cleanCup = 9.0f,
                sweetness = 7.25f,
                overall = 7.0f,
                defectsPoints = 0f,
                totalScore = 80.25f,
                flavorNotes = listOf("مرارة رماد دخانية", "جفاف قابض في مؤخرة اللسان", "شوكولاتة محترقة")
            ),
            appearance = PostRoastAppearance(
                agtronScale = "GOURMET",
                wholeBeanAgtron = "71",
                groundAgtron = "80",
                expansionQuality = "MEDIUM",
                surfaceOil = "SLIGHT_SWEAT",
                centerCutColor = "DARK_UNIFORM",
                visualDefects = listOf("احتراق في الشق الأوسط (Darkened Chaff)")
            ),
            sensoryDefect = "مرارة لاذعة وقابضة (Astringent Mouthfeel)، طعم رماد ودخان خفيف يحجب النكهات المنشئية.",
            notes = "تحول طارد للحرارة مع طاقة كامنة عالية في الطبل لم تخفض بالغاز."
        ),
        DemoPreset(
            id = "preset-brazil-scorched",
            titleAr = "البرازيل سيرادو | احتراق سطحي وقلب نيء (Scorching & Raw Core)",
            subtitleAr = "حرارة دخول مفرطة لبن قليل الكثافة مع فارق أجترون واسع (24 نقطة)",
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
            cuppingScores = SCACuppingScores(
                fragranceAroma = 6.75f,
                flavor = 6.5f,
                aftertaste = 6.25f,
                acidity = 6.5f,
                acidityIntensity = "HIGH",
                body = 7.0f,
                bodyLevel = "LIGHT",
                balance = 6.25f,
                uniformity = 10.0f,
                cleanCup = 8.0f,
                sweetness = 6.5f,
                overall = 6.5f,
                defectsPoints = 2.0f,
                totalScore = 73.25f,
                flavorNotes = listOf("فول سوداني محروق", "حموضة عشبية فجة", "خشب جاف")
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
            sensoryDefect = "تناقض حاد: نكهة تفحم سطحي مع حموضة عشبية فجة وجفاف شديد في الحلق.",
            notes = "صدمة حرارية في البداية؛ احترق السطح وبقي اللب نيئاً."
        )
    )
}
