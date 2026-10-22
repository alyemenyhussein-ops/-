package com.example.roastcurve.model

enum class RoastStatus {
    OPTIMAL,
    NEEDS_ADJUSTMENT,
    CRITICAL_DEFECT
}

enum class ControlParameter {
    CHARGE_TEMP,
    GAS_POWER,
    AIRFLOW,
    DRUM_SPEED,
    DROP_TIMING
}

enum class ProcessingMethod(val labelAr: String) {
    WASHED("معالجة مغسولة (Washed)"),
    NATURAL("معالجة مجففة (Natural)"),
    ANAEROBIC("معالجة لاهوائية (Anaerobic)"),
    HONEY("معالجة عسلية (Honey)")
}

enum class BrewTarget(val labelAr: String) {
    FILTER("ترشيح وفلتر (Filter)"),
    ESPRESSO("إسبريسو (Espresso)"),
    OMNI("تحميص شامل (Omni)")
}

enum class RoasterType(val labelAr: String) {
    DRUM_SINGLE_WALLED("أسطوانة تقليدية جدار أحادي (Single Walled)"),
    DRUM_DOUBLE_WALLED("أسطوانة جدار مزدوج عازل (Double Walled)"),
    RECIRCULATING_HOT_AIR("هواء ساخن معاد تدويره (Recirculating Hot Air)"),
    FLUID_BED("سرير مائع هوائي (Fluid Bed / Air Roaster)"),
    INFRARED_DRUM("موقد إشعاعي تحت أحمر (Infrared Drum)")
}

enum class AirflowUnit(val labelAr: String) {
    PERCENT("نسبة مئوية % (0-100%)"),
    STEP("درجات الصمام (Damper Notches 1-10)"),
    PASCAL("ضغط تفاضلي (Pascal / Pa)"),
    RPM("سرعة المروحة (RPM)")
}

enum class ChaffEvacuation(val labelAr: String) {
    OPTIMAL("ممتازة وتصريف تام"),
    MODERATE("متوسطة مع بعض العوالق"),
    POOR("ضعيفة وتراكم دخان وقشور")
}

data class RoasterAirflowSettings(
    val unit: AirflowUnit = AirflowUnit.PERCENT,
    val chargeAirflow: String = "30%",
    val dryingAirflow: String = "50%",
    val maillardAirflow: String = "65%",
    val firstCrackAirflow: String = "85%",
    val chaffEvacuation: ChaffEvacuation = ChaffEvacuation.OPTIMAL,
    val notes: String = ""
)

data class BeanProfile(
    val name: String = "",
    val process: ProcessingMethod = ProcessingMethod.WASHED,
    val densityGL: String = "820",
    val moisturePct: String = "11.0",
    val targetBrew: BrewTarget = BrewTarget.FILTER,
    val roasterType: RoasterType = RoasterType.DRUM_DOUBLE_WALLED
)

data class ManualTelemetry(
    val chargeTempC: String = "200",
    val turningPointTempC: String = "94",
    val turningPointTime: String = "01:20",
    val yellowingTime: String = "04:30",
    val yellowingTempC: String = "152",
    val firstCrackTime: String = "08:20",
    val firstCrackTempC: String = "196",
    val dropTime: String = "10:10",
    val dropTempC: String = "208",
    val airflow: RoasterAirflowSettings = RoasterAirflowSettings()
)

data class SCACuppingScores(
    val fragranceAroma: Float = 8.0f,
    val flavor: Float = 8.0f,
    val aftertaste: Float = 7.75f,
    val acidity: Float = 8.0f,
    val acidityIntensity: String = "MEDIUM", // LOW, MEDIUM, HIGH
    val body: Float = 7.75f,
    val bodyLevel: String = "MEDIUM", // LIGHT, MEDIUM, HEAVY
    val balance: Float = 8.0f,
    val uniformity: Float = 10.0f,
    val cleanCup: Float = 10.0f,
    val sweetness: Float = 10.0f,
    val overall: Float = 8.0f,
    val defectsPoints: Float = 0.0f,
    val totalScore: Float = 87.5f,
    val flavorNotes: List<String> = listOf("ياسمين", "خوخ ناضج", "حمضيات منعشة", "سكر بني")
)

data class PostRoastAppearance(
    val agtronScale: String = "GOURMET", // GOURMET or COMMERCIAL
    val wholeBeanAgtron: String = "76",
    val groundAgtron: String = "86",
    val expansionQuality: String = "EXCELLENT", // EXCELLENT, MEDIUM, POOR
    val surfaceOil: String = "DRY", // DRY, SLIGHT_SWEAT, OILY
    val centerCutColor: String = "HONEY_BROWN", // WHITE_PALE, HONEY_BROWN, DARK_UNIFORM
    val visualDefects: List<String> = emptyList()
)

data class GhostCurvePoint(
    val timeMin: Float,
    val actualEstimatedRor: Float,
    val targetRor: Float,
    val tempC: Float = 0f
)

data class ExtractedMetrics(
    val chargeTempC: Float,
    val turningPointTempC: Float,
    val yellowingTimeSec: Float,
    val firstCrackTempC: Float,
    val firstCrackTimeSec: Float,
    val dropTempC: Float,
    val totalTimeSec: Float,
    val tempDevelopmentDeltaC: Float
)

data class PhaseRatios(
    val dryingPercent: Float,
    val dryingStatus: String,
    val dryingDiagnosisAr: String,
    val maillardPercent: Float,
    val maillardStatus: String,
    val maillardDiagnosisAr: String,
    val dtrPercent: Float,
    val dtrStatus: String,
    val dtrDiagnosisAr: String
)

data class AnomalyItem(
    val anomalyType: String,
    val timeOccurredMmSs: String,
    val severity: String,
    val physicalCauseAr: String
)

data class RoRDiagnostics(
    val peakRorCPerMin: Float,
    val finalRorCPerMin: Float,
    val isMonotonicallyDecreasing: Boolean,
    val hasCrash: Boolean,
    val crashDetailsAr: String,
    val hasFlick: Boolean,
    val flickDetailsAr: String,
    val detectedAnomalies: List<AnomalyItem>
)

data class SensoryCorrelation(
    val reportedDefectAr: String,
    val thermodynamicRootCauseAr: String,
    val expectedTasteProfileAr: String,
    val bakedRisk: Boolean = false,
    val scorchedRisk: Boolean = false,
    val astringencyRisk: Boolean = false
)

data class ActionPlanStep(
    val stepNumber: Int,
    val stageNameAr: String,
    val controlParameter: ControlParameter,
    val exactActionAr: String,
    val expectedEffectAr: String
)

data class SCACuppingAnalysis(
    val calibratedScaScore: Float,
    val scaGradeAr: String,
    val fragranceAromaAr: String,
    val flavorAr: String,
    val aftertasteAr: String,
    val acidityAr: String,
    val bodyAr: String,
    val balanceAr: String,
    val flavorWheelTags: List<String>,
    val thermodynamicImpactAr: String
)

data class AgtronAppearanceAnalysis(
    val agtronReadingWhole: Float,
    val agtronReadingGround: Float,
    val deltaAgtronSpread: Float,
    val roastDegreeCategoryAr: String,
    val colorHex: String,
    val coreVsSurfaceGradientAr: String,
    val physicalExpansionEvaluationAr: String,
    val thermodynamicCauseAr: String,
    val processConsistencyScore: Int,
    val processConsistencyStatus: String,
    val expectedAgtronRangeMin: Float,
    val expectedAgtronRangeMax: Float,
    val idealDeltaRange: String,
    val processSensoryLinkAnalysisAr: String,
    val roastColorSensoryVerdictAr: String,
    val processSpecificRecommendationsAr: List<String>
)

data class WaterChemistryTarget(
    val targetGhPpm: String,
    val targetKhPpm: String,
    val mgToCaRatio: String,
    val waterExplanationAr: String
)

data class FilterRescueRecipe(
    val waterTempC: String,
    val brewRatio: String,
    val grindAdjustmentAr: String,
    val bloomAndPourTechniqueAr: String
)

data class EspressoRescueRecipe(
    val waterTempC: String,
    val yieldRatio: String,
    val shotTimeSec: String,
    val preInfusionAndPressureAr: String
)

data class BrewRescueProtocol(
    val salvageabilityPercent: Int,
    val bestUseRecommendationAr: String,
    val degassingRestDaysAr: String,
    val waterChemistryTarget: WaterChemistryTarget,
    val filterRescueRecipe: FilterRescueRecipe,
    val espressoRescueRecipe: EspressoRescueRecipe
)

data class AirflowAnalysis(
    val convectiveHeatRatioPercent: Int,
    val airflowBalanceStatus: String, // OPTIMAL, INSUFFICIENT, EXCESSIVE
    val verdictHeadlineAr: String,
    val chaffSmokeClearanceAr: String,
    val chargeDryingEvalAr: String,
    val maillardEvalAr: String,
    val firstCrackDevEvalAr: String,
    val recommendedFanAdjustmentsAr: String
)

data class RoastDiagnosisResponse(
    val overallStatus: RoastStatus,
    val roastHealthScore: Int,
    val summaryHeadline: String,
    val extractedMetrics: ExtractedMetrics,
    val phaseRatios: PhaseRatios,
    val rorDiagnostics: RoRDiagnostics,
    val sensoryCorrelation: SensoryCorrelation,
    val nextBatchActionPlan: List<ActionPlanStep>,
    val ghostCurveTarget: List<GhostCurvePoint>,
    val scaCuppingAnalysis: SCACuppingAnalysis? = null,
    val agtronAppearanceAnalysis: AgtronAppearanceAnalysis? = null,
    val brewRescueProtocol: BrewRescueProtocol? = null,
    val airflowAnalysis: AirflowAnalysis? = null
)

data class SavedRoastRecord(
    val id: String,
    val timestamp: Long,
    val title: String,
    val beanProfile: BeanProfile,
    val sensoryDefect: String,
    val cuppingScores: SCACuppingScores? = null,
    val appearance: PostRoastAppearance? = null,
    val diagnosis: RoastDiagnosisResponse
)

enum class DefectCategory(val labelAr: String) {
    ROR_CRASH("انهيار معدل الارتفاع (RoR Crash)"),
    ROR_FLICK("القفزة الحرارية في التطور (RoR Flick)"),
    SCORCHING("احتراق السطح بالتوصيل (Scorching)"),
    TIPPING("احتراق الأطراف (Tipping)"),
    BAKED("تحميص مخبوز متسطح (Baked Roast)"),
    UNDERDEVELOPED("تطور ناقص وقلب غير ناضج (Underdeveloped)"),
    STALLING("ركود حراري (Thermal Stalling)"),
    EXOTHERMIC_RUNAWAY("انفلات طارد للحرارة (Exothermic Runaway)"),
    OVER_EXTENDED_DRYING("إطالة مفرطة في التجفيف")
}

data class HiddenAnomaly(
    val defectNameAr: String,
    val defectCategory: DefectCategory,
    val thermodynamicCauseAr: String,
    val optimalGasFixAr: String,
    val optimalAirflowFixAr: String,
    val sensoryImpactAr: String,
    val agtronClueAr: String = ""
)

data class TrainerChallenge(
    val id: String,
    val titleAr: String,
    val difficulty: String, // BEGINNER, INTERMEDIATE, EXPERT
    val scenarioBriefAr: String,
    val beanProfile: BeanProfile,
    val telemetry: ManualTelemetry,
    val appearance: PostRoastAppearance? = null,
    val sensoryNotesAr: String,
    val ghostCurveTarget: List<GhostCurvePoint>,
    val hiddenAnomaly: HiddenAnomaly
)

data class TrainerSubmission(
    val identifiedDefectCategory: DefectCategory,
    val defectDescriptionAr: String,
    val gasAction: String, // INCREASE, DECREASE, HOLD, CUT_OFF, EARLIER_REDUCTION
    val gasTimingAr: String,
    val gasMagnitudeAr: String,
    val airflowAction: String, // INCREASE, DECREASE, HOLD, PULSE_VENT
    val airflowTimingAr: String,
    val airflowMagnitudeAr: String,
    val thermodynamicReasoningAr: String
)

data class ScoreBreakdown(
    val defectIdentification: Int, // max 40
    val controlAdjustments: Int,   // max 40
    val thermodynamicReasoning: Int // max 20
)

data class TrainerGradingResult(
    val totalScore: Int,
    val gradeTierAr: String,
    val scoreBreakdown: ScoreBreakdown,
    val overallFeedbackAr: String,
    val defectCritiqueAr: String,
    val gasAirflowCritiqueAr: String,
    val revealedTruthAr: String,
    val keyLearningPointsAr: List<String>
)

data class ReferenceRoastProfile(
    val batchSizeKg: Float,
    val chargeTempC: Float,
    val roasterType: RoasterType,
    val drumSpeedRpm: Int,
    val airflowSetting: String,
    val gasBaselinePercent: Int,
    val roasterModel: String = "",
    val beanOrigin: String = "إثيوبيا يرغاتشيفي",
    val beanProcess: ProcessingMethod = ProcessingMethod.WASHED,
    val beanDensity: Float = 820f,
    val targetTurningPointC: Float = 94f,
    val yellowingTimeSec: Float = 270f,
    val firstCrackTimeSec: Float = 530f,
    val dropTimeSec: Float = 640f,
    val dropTempC: Float = 208f
)

data class ScaledRoRCurvePoint(
    val timeSec: Float,
    val referenceRoR: Float,
    val scaledRoR: Float,
    val referenceBeanTemp: Float,
    val scaledBeanTemp: Float
)

data class PhaseGuidanceItem(
    val phase: String,
    val timingTarget: String,
    val gasAdjustment: String,
    val airflowAdjustment: String,
    val thermodynamicNotes: String
)

data class ScaledBatchPlan(
    val reference: ReferenceRoastProfile,
    val targetBatchKg: Float,
    val scaleRatio: Float,
    val recommendedChargeTempC: Float,
    val chargeTempDeltaC: Float,
    val recommendedGasScalingPercent: Int,
    val gasScaleFactor: Float,
    val recommendedAirflowSetting: String,
    val airflowDeltaDescription: String,
    val recommendedDrumSpeedRpm: Int,
    val drumSpeedDeltaRpm: Int,
    val phaseByPhaseGuidance: List<PhaseGuidanceItem>,
    val thermalMassRatioDescription: String,
    val convectiveDominanceDescription: String,
    val criticalRisks: List<String>,
    val actionSummaryAr: String,
    val scientificRationaleAr: String,
    val simulatedRoRCurve: List<ScaledRoRCurvePoint>
)
