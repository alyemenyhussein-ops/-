package com.example.roastcurve.engine

import com.example.roastcurve.model.BrewTarget
import com.example.roastcurve.model.ProcessingMethod

data class AgtronClassification(
    val scale: String,
    val categoryAr: String,
    val categoryEn: String,
    val scaTile: String,
    val hexColor: String,
    val descriptionAr: String,
    val recommendedFor: String
)

data class RoastDeltaAssessment(
    val spread: Float,
    val status: String, // OPTIMAL, EXTREME_SPREAD, BAKED_STALLING
    val titleAr: String,
    val verdictAr: String,
    val thermodynamicTipAr: String
)

data class ProcessAgtronBenchmark(
    val process: ProcessingMethod,
    val targetBrew: BrewTarget,
    val wholeMin: Float,
    val wholeMax: Float,
    val groundMin: Float,
    val groundMax: Float,
    val idealDeltaMin: Float,
    val idealDeltaMax: Float,
    val descriptionAr: String,
    val chemicalBehaviorAr: String,
    val thermodynamicRuleAr: String
)

object AgtronEngine {

    fun getAgtronClassification(value: Float, scale: String = "GOURMET"): AgtronClassification {
        if (scale == "COMMERCIAL") {
            return when {
                value >= 85 -> AgtronClassification(
                    scale, "فاتح جداً (سينامون)", "Very Light / Cinnamon",
                    "#95", "#C4925D", "تحميص سطحي أولي، حمضية بارزة ونوتات عشبية.", "عينات فحص العيوب ومعايرة الشراء"
                )
                value >= 70 -> AgtronClassification(
                    scale, "فاتح (سيتي)", "Light / City",
                    "#85", "#A26B38", "إبراز أقصى للإيحاءات الزهرية والفاكهية المنشئية.", "قهوة الترشيح والفلتر (V60, Chemex)"
                )
                value >= 60 -> AgtronClassification(
                    scale, "متوسط فاتح (سيتي بلس)", "Medium-Light / City+",
                    "#75", "#8A5222", "توازن سلس بين سطوع الحمضية وبدايات حلاوة الكراميل.", "فلتر متزن أو إسبريسو ناصع العطرية"
                )
                value >= 50 -> AgtronClassification(
                    scale, "متوسط (فل سيتي)", "Medium / Full City",
                    "#65", "#6D3D16", "تطور كامل للسكريات، قوام ممتلئ وتوازن حمضي معتدل.", "إسبريسو كلاسيكي ومشروبات الحليب"
                )
                value >= 40 -> AgtronClassification(
                    scale, "متوسط داكن (فل سيتي بلس)", "Medium-Dark / Full City+",
                    "#55", "#532B0F", "بداية ظهور الزيوت السطحية وظهور نوتات الشوكولاتة الداكنة.", "إسبريسو إيطالي كثيف"
                )
                value >= 30 -> AgtronClassification(
                    scale, "داكن (فيينا)", "Dark / Vienna",
                    "#45", "#3B1B09", "سيادة نكهات الكرملة العميقة والمرارة الكربونية.", "خلطات تجارية ثقيلة"
                )
                else -> AgtronClassification(
                    scale, "داكن جداً (فرنسي / إيطالي)", "Very Dark / French / Italian",
                    "#35", "#260F04", "تفحم شبه كامل لألياف الحبة وزيوت لامعة بارزة.", "تحميص نمط داكن قديم"
                )
            }
        }

        // GOURMET SCALE
        return when {
            value >= 95 -> AgtronClassification(
                scale, "فاتح جداً (سينامون Cinnamon)", "Very Light / Cinnamon",
                "#95", "#C6935E", "تحميص خفيف جداً، تركيز عالٍ للأحماض العضوية مع قوام خفيف.", "عينات فحص المنشأ المخبرية"
            )
            value >= 80 -> AgtronClassification(
                scale, "فاتح مختص (سيتي City Roast)", "Light / City",
                "#85", "#9F6734", "المعيار الذهبي لقهوة الفلتر المقطرة؛ يحافظ على هوية التربة والفاكهية.", "قهوة الترشيح والتقطير المختص (V60, Aeropress)"
            )
            value >= 70 -> AgtronClassification(
                scale, "متوسط فاتح (سيتي بلس City+)", "Medium-Light / City+",
                "#75", "#864F21", "تطور سكري غني مع حمضية ناعمة؛ مناسب جداً للتحميص المشترك (Omni).", "تحميص شامل (Filter & Modern Espresso)"
            )
            value >= 55 -> AgtronClassification(
                scale, "متوسط متزن (فل سيتي Full City)", "Medium / Full City",
                "#65", "#6A3A17", "تكرمل متقدم للسكريات، قوام مخملي وغياب الحموضة الحادة.", "إسبريسو مختص كلاسيكي ومشروبات الحليب"
            )
            value >= 45 -> AgtronClassification(
                scale, "متوسط داكن (فل سيتي بلس Full City+)", "Medium-Dark / Full City+",
                "#55", "#512A0E", "بداية تسرب الزيوت؛ نوتات الكاكاو والتوابل الداكنة.", "إسبريسو تقليدي ذو كريما كثيفة"
            )
            value >= 35 -> AgtronClassification(
                scale, "داكن (فيينا Vienna Roast)", "Dark / Vienna",
                "#45", "#3A1B07", "انحسار النكهات المنشئية وظهور المرارة الدخانية اللذيذة.", "عشاق القهوة الثقيلة ذات التحميص الداكن"
            )
            else -> AgtronClassification(
                scale, "داكن جداً (فرنسي / إيطالي French / Italian)", "Very Dark / French",
                "#25", "#220E03", "احتراق لمعظم المركبات العضوية وتغطية زيتية كاملة.", "خلطات المحامص التقليدية التجارية"
            )
        }
    }

    fun evaluateRoastDelta(wholeBeanAgtron: Float, groundAgtron: Float): RoastDeltaAssessment {
        val spread = groundAgtron - wholeBeanAgtron
        return when {
            spread in 8f..15f -> RoastDeltaAssessment(
                spread = spread,
                status = "OPTIMAL",
                titleAr = "تدرج حراري مثالي ومتزن (Ideal Uniformity)",
                verdictAr = "الفارق بين السطح والقلب متطابق مع المعيار العالمي (8-15 نقطة)، مما يدل على اختراق حراري متجانس ونضج متناسق بين النواة والقشرة الخارجية دون صدمة سطحية.",
                thermodynamicTipAr = "حافظ على توازن الحمل الحراري وسرعة الهواء (Airflow) الحالية مع خفض الغاز التدريجي في مرحلة التطور."
            )
            spread > 18f -> RoastDeltaAssessment(
                spread = spread,
                status = "EXTREME_SPREAD",
                titleAr = "تدرج مفرط: سطح محترق وقلب نيء (Scorched Surface / Raw Core)",
                verdictAr = "فارق التدرج (%.1f نقطة) كبير جداً ويشير إلى تسارع سطحي مفرط؛ تكرمل السطح الخارجي بفعل حرارة التوصيل بينما ظل لب الحبة نيئاً.".format(spread),
                thermodynamicTipAr = "قم بخفض حرارة الإسقاط (Charge Temp) بمقدار 5-8°C، وزد سحب الهواء (Convection) في مرحلة التجفيف ومايلارد لضمان نضج النواة بالتساوي."
            )
            spread < 5f -> RoastDeltaAssessment(
                spread = spread,
                status = "BAKED_STALLING",
                titleAr = "تدرج راكد: مؤشر تحميص مخبوز (Baked / Thermal Stagnation)",
                verdictAr = "الفارق بين السطح واللب (%.1f نقطة فقط) منخفض للغاية وغير طبيعي؛ هذا التسطح اللوني يدل على طول مفرط في وقت التحميص مع فقدان الزخم الحراري.".format(spread),
                thermodynamicTipAr = "ارفع الزخم الحراري الابتدائي واختصر وقت مرحلة مايلارد لتفادي خمول الحرارة وتسطح المنحنى."
            )
            else -> RoastDeltaAssessment(
                spread = spread,
                status = "OPTIMAL",
                titleAr = "تدرج مقبول وقريب من النطاق المثالي",
                verdictAr = "فارق التدرج (%.1f نقطة) مقبول تجارياً، مع إمكانية تحسين تناسق نقل الحرارة للاقتراب من النطاق المثالي 9-14 نقطة.".format(spread),
                thermodynamicTipAr = "تحقق من تدفق الهواء وتجانس سرعة الطبل (Drum RPM) لتوزيع الحرارة بدقة أعلى."
            )
        }
    }

    fun getBenchmark(process: ProcessingMethod, targetBrew: BrewTarget): ProcessAgtronBenchmark {
        return when (process) {
            ProcessingMethod.WASHED -> when (targetBrew) {
                BrewTarget.FILTER -> ProcessAgtronBenchmark(
                    process, targetBrew, 74f, 86f, 82f, 92f, 8f, 13f,
                    "تحميص فاتح عالي النقاء للحفاظ على الأحماض الفاكهية والوضوح العطري الزهري النظيف.",
                    "خلايا البن المغسول كثيفة ومسامية منتظمة وخالية من الصمغ السطحي؛ يتطلب اختراقاً متساوياً بالحمل.",
                    "حافظ على حرارة دخول معتدلة-عالية وزد تدفق الهواء في مايلارد."
                )
                BrewTarget.ESPRESSO -> ProcessAgtronBenchmark(
                    process, targetBrew, 58f, 68f, 65f, 76f, 6f, 10f,
                    "تحميص متوسط يكسر حدة حموضة البن المغسول ويطور مركبات الميلانويدين لزيادة اللزوجة.",
                    "تكرمل السكروز وتحلل ألياف السليلوز يزيد استخلاص الزيوت ومستحلب الكريما الناعمة.",
                    "تمديد نسبي لمرحلة مايلارد بنسبة 38-42% مع خفض الغاز التدريجي قبل القرقعة الأولى."
                )
                BrewTarget.OMNI -> ProcessAgtronBenchmark(
                    process, targetBrew, 66f, 76f, 74f, 84f, 7f, 11f,
                    "توازن ذهبي يجمع بين الوضوح المنشئي العطري للفلتر مع قابلية الاستخلاص للإسبريسو.",
                    "تطور متوازن بين تكوين الأحماض العطرية والسكريات الكرملية المتوسطة.",
                    "DTR مضبوط بين 15% و17% مع انحدار RoR منتظم دون فلك."
                )
            }
            ProcessingMethod.NATURAL -> when (targetBrew) {
                BrewTarget.FILTER -> ProcessAgtronBenchmark(
                    process, targetBrew, 64f, 76f, 73f, 83f, 9f, 14f,
                    "لون أجترون يحفظ نوتات الفاكهة والتوت مع تفادي حرق السكريات الصمغية السطحية وتفادي طعم التخمر اللاذع.",
                    "البن المجفف غني بالفركتوز والغلوكوز على السطح مما يجعله يتكرمل أسرع؛ يقرأ السطح أغمق بـ 4-8 درجات.",
                    "ابدأ بحرارة دخول أقل بـ 5-8°C من المغسول واعتمد على تدفق الهواء اللطيف لتجنب الـ Scorching."
                )
                BrewTarget.ESPRESSO -> ProcessAgtronBenchmark(
                    process, targetBrew, 50f, 60f, 58f, 68f, 7f, 11f,
                    "إسبريسو غني بحلاوة السكر البني وقوام ثقيل وملمس حريري مع نوتات الشوكولاتة والكرز.",
                    "السكريات الطبيعية المعقدة تمنح كثافة كريما فائقة ومستوى ذائبية عالٍ جداً.",
                    "تدرج حراري بطيء بعد الاصفرار لمنع تفحم السكريات المتبقية على الشق الأوسط."
                )
                BrewTarget.OMNI -> ProcessAgtronBenchmark(
                    process, targetBrew, 58f, 68f, 66f, 76f, 8f, 12f,
                    "تحميص شامل يوازن بين الفاكهية المجففة العطرية وقوام الشوكولاتة الكريمي.",
                    "تكرمل متزن دون وصول لمرحلة خروج الزيوت السطحية.",
                    "تفادي أي RoR Flick نهائي للحفاظ على نقاء الكوب."
                )
            }
            ProcessingMethod.ANAEROBIC -> when (targetBrew) {
                BrewTarget.FILTER -> ProcessAgtronBenchmark(
                    process, targetBrew, 68f, 80f, 76f, 87f, 7f, 12f,
                    "تحميص دقيق جداً وفاتح؛ أي تحميص أغمق من 68 للمطحون يؤدي لتفحم النوتات المعقدة ومرارة فينولية.",
                    "بنية خلوية هشة جداً بسبب التخمر الطويل والأحماض المكثفة؛ امتصاص الحرارة سريع للغاية.",
                    "حرارة دخول منخفضة، وسقف RoR أقصى لا يتجاوز 14-16°C/min مع تفريغ مبكر وسريع."
                )
                BrewTarget.ESPRESSO -> ProcessAgtronBenchmark(
                    process, targetBrew, 55f, 65f, 63f, 73f, 6f, 10f,
                    "إسبريسو عصري متفجر بنكهات الفواكه الاستوائية مع حمضية لاكتيكية كريمية وتوازن غير تقليدي.",
                    "حساسية عالية؛ تخفيض وقت التطور النسبي لمنع تكسر النوتات العطرية الفريدة.",
                    "تجنب حرارة التفريغ العالية (>205°C) نهائياً لتفادي الطعم الطبي أو الخلوي الحاد."
                )
                BrewTarget.OMNI -> ProcessAgtronBenchmark(
                    process, targetBrew, 62f, 72f, 70f, 80f, 7f, 11f,
                    "تحميص استثنائي يبرز طابع التخمير الاستوائي بوضوح في الفلتر وتوازن فائق في الإسبريسو.",
                    "توازن دقيق بين حفظ الاسترات العطرية والسكريات المتبقية.",
                    "خفض الغاز بانتظام قبل القرقعة بـ 60 ثانية لتجنب الـ RoR Crash والـ Flick."
                )
            }
            ProcessingMethod.HONEY -> when (targetBrew) {
                BrewTarget.FILTER -> ProcessAgtronBenchmark(
                    process, targetBrew, 68f, 80f, 77f, 87f, 8f, 13f,
                    "لون فاتح-متوسط يحافظ على توازن رائع بين حلاوة العسل والنوتات الزهرية النظيفة.",
                    "طبقة الصمغ العسلية المحيطة بالحبة تتطلب مراقبة تكرمل السطح لتفادي احتراق التوصيل التلامسي.",
                    "زيادة تدفق الهواء بعد الاصفرار ونقل الحرارة بالحمل لمنع التبقع اللوني."
                )
                BrewTarget.ESPRESSO -> ProcessAgtronBenchmark(
                    process, targetBrew, 54f, 64f, 62f, 72f, 7f, 11f,
                    "إسبريسو عسلي فائق الحلاوة وقوام زبدي ومستحلب ذهبي ناعم.",
                    "تكرمل عميق لسكريات الصمغ يعطي نكهات العسل المكرمل واللوز المحمص.",
                    "تطوير تدريجي مع DTR بين 17% و20% وتفريغ لطيف."
                )
                BrewTarget.OMNI -> ProcessAgtronBenchmark(
                    process, targetBrew, 62f, 72f, 70f, 80f, 7f, 11f,
                    "توازن سلس ومثالي بين نقاء الفلتر وغنى قوام الإسبريسو.",
                    "توزيع متساوي للحرارة يمنع تبقع القشرة الخارجية.",
                    "تحكم دقيق بمعدل الانحدار وتبريد فوري في الصينية."
                )
            }
        }
    }
}
