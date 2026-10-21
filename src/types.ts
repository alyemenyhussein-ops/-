export type RoastStatus = 'OPTIMAL' | 'NEEDS_ADJUSTMENT' | 'CRITICAL_DEFECT';

export type ControlParameter =
  | 'CHARGE_TEMP'
  | 'GAS_POWER'
  | 'AIRFLOW'
  | 'DRUM_SPEED'
  | 'DROP_TIMING';

export interface ExtractedMetrics {
  charge_temp_c: number;
  turning_point_temp_c: number;
  yellowing_time_sec: number;
  first_crack_temp_c: number;
  first_crack_time_sec: number;
  drop_temp_c: number;
  total_time_sec: number;
  temp_development_delta_c: number;
}

export interface PhaseRatios {
  drying_percent: number;
  drying_status: string;
  drying_diagnosis_ar: string;
  maillard_percent: number;
  maillard_status: string;
  maillard_diagnosis_ar: string;
  dtr_percent: number;
  dtr_status: string;
  dtr_diagnosis_ar: string;
}

export interface AnomalyItem {
  anomaly_type: string;
  time_occurred_mm_ss: string;
  severity: 'منخفض' | 'متوسط' | 'حرج' | string;
  physical_cause_ar: string;
}

export interface RoRDiagnostics {
  peak_ror_c_per_min: number;
  final_ror_c_per_min: number;
  is_monotonically_decreasing: boolean;
  detected_anomalies: AnomalyItem[];
}

export interface SensoryCorrelation {
  reported_defect_ar: string;
  thermodynamic_root_cause_ar: string;
}

export interface ActionPlanStep {
  step_number: number;
  stage_name_ar: string;
  control_parameter: ControlParameter;
  exact_action_ar: string;
  expected_effect_ar: string;
}

export interface GhostCurvePoint {
  time_min: number;
  actual_estimated_ror: number;
  target_ror: number;
  temp_c?: number;
}

export interface SCACuppingScores {
  fragrance_aroma: number; // 6.00 to 10.00
  flavor: number; // 6.00 to 10.00
  aftertaste: number; // 6.00 to 10.00
  acidity: number; // 6.00 to 10.00
  acidity_intensity: 'LOW' | 'MEDIUM' | 'HIGH';
  body: number; // 6.00 to 10.00
  body_level: 'LIGHT' | 'MEDIUM' | 'HEAVY';
  balance: number; // 6.00 to 10.00
  uniformity: number; // usually 10
  clean_cup: number; // usually 10
  sweetness: number; // usually 10
  overall: number; // 6.00 to 10.00
  defects_points: number; // 0, 2, 4, etc.
  total_score: number; // Final SCA 0-100 score
  flavor_notes: string[];
}

export interface SCACuppingAnalysis {
  calibrated_sca_score: number;
  sca_grade_ar: string;
  attributes_eval: {
    fragrance_aroma_ar: string;
    flavor_ar: string;
    aftertaste_ar: string;
    acidity_ar: string;
    body_ar: string;
    balance_ar: string;
  };
  flavor_wheel_tags: string[];
  cupping_thermodynamic_impact_ar: string;
}

export interface PostRoastAppearance {
  agtron_scale: 'GOURMET' | 'COMMERCIAL';
  whole_bean_agtron: number | string;
  ground_agtron: number | string;
  expansion_quality: 'EXCELLENT' | 'MEDIUM' | 'POOR';
  surface_oil: 'DRY' | 'SLIGHT_SWEAT' | 'OILY';
  center_cut_color: 'WHITE_PALE' | 'HONEY_BROWN' | 'DARK_UNIFORM';
  visual_defects: string[];
}

export interface AgtronAppearanceAnalysis {
  agtron_reading_whole: number;
  agtron_reading_ground: number;
  delta_agtron_spread: number;
  roast_degree_category_ar: string;
  color_hex: string;
  core_vs_surface_gradient_ar: string;
  physical_expansion_evaluation_ar: string;
  thermodynamic_cause_ar: string;
  process_consistency_score?: number;
  process_consistency_status?: 'HIGHLY_CONSISTENT' | 'MODERATELY_CONSISTENT' | 'INCONSISTENT' | 'CRITICAL_MISMATCH';
  expected_agtron_range?: {
    min_ground: number;
    max_ground: number;
    ideal_delta_range: string;
  };
  process_sensory_link_analysis_ar?: string;
  roast_color_sensory_verdict_ar?: string;
  process_specific_recommendations_ar?: string[];
}

export interface WaterChemistryTarget {
  target_gh_ppm: string;
  target_kh_ppm: string;
  mg_to_ca_ratio: string;
  water_explanation_ar: string;
}

export interface FilterRescueRecipe {
  water_temp_c: string;
  brew_ratio: string;
  grind_adjustment_ar: string;
  bloom_and_pour_technique_ar: string;
}

export interface EspressoRescueRecipe {
  water_temp_c: string;
  yield_ratio: string;
  shot_time_sec: string;
  pre_infusion_and_pressure_ar: string;
}

export interface BrewRescueProtocol {
  salvageability_percent: number;
  best_use_recommendation_ar: string;
  degassing_rest_days_ar: string;
  water_chemistry_target: WaterChemistryTarget;
  filter_rescue_recipe: FilterRescueRecipe;
  espresso_rescue_recipe: EspressoRescueRecipe;
}

export type AirflowUnit = 'PERCENT' | 'STEP' | 'PASCAL' | 'RPM';

export interface RoasterAirflowSettings {
  unit: AirflowUnit; // PERCENT (0-100%), STEP (1-10 or 1-5 damper), PASCAL (Pa / ΔP), RPM
  chargeAirflow: number | string; // هواء الإسقاط ونقطة التحول
  dryingAirflow: number | string; // هواء مرحلة التجفيف
  maillardAirflow: number | string; // هواء مرحلة مايلارد
  firstCrackAirflow: number | string; // هواء القرقعة الأولى والتطوير
  chaffEvacuationRating?: 'OPTIMAL' | 'MODERATE' | 'POOR'; // كفاءة سحب القشور وتصريف الدخان
  notes?: string; // ملاحظات تدفق الهواء والعادم
}

export interface AirflowAnalysis {
  convective_heat_ratio_percent: number; // e.g. 65% convective vs 35% conductive
  airflow_balance_status: 'OPTIMAL' | 'INSUFFICIENT' | 'EXCESSIVE';
  verdict_headline_ar: string;
  chaff_smoke_clearance_ar: string;
  stage_evaluation: {
    charge_drying_eval_ar: string;
    maillard_eval_ar: string;
    first_crack_dev_eval_ar: string;
  };
  recommended_fan_adjustments_ar: string;
}

export interface RoastDiagnosisResponse {
  overall_status: RoastStatus;
  roast_health_score: number;
  summary_headline: string;
  extracted_metrics: ExtractedMetrics;
  phase_ratios: PhaseRatios;
  ror_diagnostics: RoRDiagnostics;
  sensory_correlation: SensoryCorrelation;
  next_batch_action_plan: ActionPlanStep[];
  ghost_curve_target: GhostCurvePoint[];
  sca_cupping_analysis?: SCACuppingAnalysis;
  agtron_appearance_analysis?: AgtronAppearanceAnalysis;
  brew_rescue_protocol?: BrewRescueProtocol;
  airflow_analysis?: AirflowAnalysis;
}

export type ProcessingMethod = 'WASHED' | 'NATURAL' | 'ANAEROBIC' | 'HONEY';
export type BrewTarget = 'FILTER' | 'ESPRESSO' | 'OMNI';

export interface BeanProfile {
  name: string;
  process: ProcessingMethod;
  density_g_l: number | string;
  moisture_pct: number | string;
  targetBrew: BrewTarget;
  roasterType: string;
}

export interface ManualTelemetry {
  chargeTempC: number | string;
  turningPointTempC: number | string;
  turningPointTime: string; // "01:15"
  yellowingTime: string; // "04:30"
  yellowingTempC: number | string;
  firstCrackTime: string; // "08:15"
  firstCrackTempC: number | string;
  dropTime: string; // "10:00"
  dropTempC: number | string;
  airflow?: RoasterAirflowSettings;
}

export interface DiagnosticRequestPayload {
  image?: {
    mimeType: string;
    data: string; // base64
  };
  telemetry?: ManualTelemetry;
  beanProfile: BeanProfile;
  sensoryDefect: string;
  cuppingScores?: SCACuppingScores;
  appearance?: PostRoastAppearance;
  notes?: string;
}

export interface SavedRoastRecord {
  id: string;
  timestamp: number;
  title: string;
  beanProfile: BeanProfile;
  sensoryDefect: string;
  cuppingScores?: SCACuppingScores;
  appearance?: PostRoastAppearance;
  diagnosis: RoastDiagnosisResponse;
  hasImage: boolean;
}

export type DefectCategory =
  | 'ROR_CRASH'
  | 'ROR_FLICK'
  | 'SCORCHING'
  | 'TIPPING'
  | 'BAKED'
  | 'UNDERDEVELOPED'
  | 'STALLING'
  | 'EXOTHERMIC_RUNAWAY'
  | 'OVER_EXTENDED_DRYING';

export interface TrainerChallenge {
  id: string;
  title_ar: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  scenario_brief_ar: string;
  beanProfile: BeanProfile;
  telemetry: ManualTelemetry;
  appearance?: PostRoastAppearance;
  ghost_curve_target: GhostCurvePoint[];
  sensory_notes_ar: string;
  cuppingScores?: SCACuppingScores;
  hiddenAnomaly: {
    defect_name_ar: string;
    defect_category: DefectCategory;
    thermodynamic_cause_ar: string;
    optimal_gas_fix_ar: string;
    optimal_airflow_fix_ar: string;
    sensory_impact_ar: string;
    agtron_clue_ar?: string;
  };
}

export interface TrainerSubmission {
  identified_defect_category: DefectCategory | string;
  defect_description_ar: string;
  gas_action: 'INCREASE' | 'DECREASE' | 'HOLD' | 'CUT_OFF' | 'EARLIER_REDUCTION';
  gas_timing_ar: string;
  gas_magnitude_ar: string;
  airflow_action: 'INCREASE' | 'DECREASE' | 'HOLD' | 'PULSE_VENT';
  airflow_timing_ar: string;
  airflow_magnitude_ar: string;
  thermodynamic_reasoning_ar: string;
}

export interface TrainerGradingResult {
  total_score: number; // 0 - 100
  grade_tier_ar: string; // e.g., 'خبير تحميص معتمد (Master Roaster)'
  score_breakdown: {
    defect_identification: number; // out of 40
    control_adjustments: number; // out of 40
    thermodynamic_reasoning: number; // out of 20
  };
  overall_feedback_ar: string;
  defect_critique_ar: string;
  gas_airflow_critique_ar: string;
  revealed_truth_ar: string;
  key_learning_points_ar: string[];
}

export type RoasterType =
  | 'DRUM_SINGLE_WALLED'
  | 'DRUM_DOUBLE_WALLED'
  | 'RECIRCULATING_HOT_AIR'
  | 'FLUID_BED'
  | 'INFRARED_DRUM';

export interface ReferenceRoastProfile {
  batchSizeKg: number;
  chargeTempC: number;
  roasterType: RoasterType;
  drumSpeedRpm: number;
  airflowSetting: string;
  gasBaselinePercent: number;
  roasterModel?: string;
  beanOrigin?: string;
  beanProcess?: string;
  beanDensity?: number;
  targetTurningPointC?: number;
  yellowingTimeSec?: number;
  firstCrackTimeSec?: number;
  dropTimeSec?: number;
  dropTempC?: number;
}

export interface ScaledRoRCurvePoint {
  timeSec: number;
  referenceRoR: number;
  scaledRoR: number;
  referenceBeanTemp: number;
  scaledBeanTemp: number;
}

export interface PhaseGuidanceItem {
  phase: string;
  timingTarget: string;
  gasAdjustment: string;
  airflowAdjustment: string;
  thermodynamicNotes: string;
}

export interface ScaledBatchPlan {
  reference: {
    batchSizeKg: number;
    chargeTempC: number;
    gasBaselinePercent: number;
    airflowSetting: string;
    drumSpeedRpm: number;
    roasterType: RoasterType;
    roasterModel?: string;
  };
  target: {
    batchSizeKg: number;
    scaleRatio: number;
    recommendedChargeTempC: number;
    chargeTempDeltaC: number;
    recommendedGasScalingPercent: number;
    gasScaleFactor: number;
    recommendedAirflowSetting: string;
    airflowDeltaDescription: string;
    recommendedDrumSpeedRpm: number;
    drumSpeedDeltaRpm: number;
  };
  phaseByPhaseGuidance: PhaseGuidanceItem[];
  thermodynamicAnalysis: {
    thermalMassRatioDescription: string;
    convectiveDominanceDescription: string;
    criticalRisks: string[];
    actionSummary_ar: string;
    scientificRationale_ar: string;
  };
  simulatedRoRCurve: ScaledRoRCurvePoint[];
}
