package com.example.roastcurve.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Scale
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.roastcurve.engine.BatchScalerEngine
import com.example.roastcurve.model.GhostCurvePoint
import com.example.roastcurve.model.ReferenceRoastProfile
import com.example.roastcurve.model.RoasterType
import com.example.roastcurve.model.ScaledBatchPlan
import com.example.roastcurve.ui.components.RoRChartCanvas
import com.example.roastcurve.ui.theme.*

@Composable
fun BatchScalerScreen(
    modifier: Modifier = Modifier
) {
    var referenceProfile by remember {
        mutableStateOf(BatchScalerEngine.PRESET_SCALERS.first().second.first)
    }
    var targetBatchKg by remember {
        mutableStateOf(BatchScalerEngine.PRESET_SCALERS.first().second.second)
    }

    var selectedPresetIndex by remember { mutableStateOf(0) }

    val scaledPlan: ScaledBatchPlan = remember(referenceProfile, targetBatchKg) {
        BatchScalerEngine.calculateThermodynamicScaling(referenceProfile, targetBatchKg)
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(BgObsidian)
            .padding(horizontal = 14.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(top = 10.dp, bottom = 40.dp)
    ) {
        // Header
        item {
            Column(modifier = Modifier.fillMaxWidth()) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Scale, contentDescription = null, tint = CopperPrimary, modifier = Modifier.size(24.dp))
                    Text(
                        text = "محرك تحجيم الدفعات الثرموديناميكي (Batch Scaler)",
                        color = SteamText,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Text(
                    text = "تطبيق قوانين الكتلة الحرارية لسكوت راو ومعادلات الطاقة لنقل البروفايل بين أحجام الدفعات المختلفة",
                    color = SlateMuted,
                    fontSize = 11.sp
                )
            }
        }

        // Preset Scalers
        item {
            Text(
                text = "سيناريوهات التحجيم النموذجية الجاهزة:",
                color = SlateMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(BatchScalerEngine.PRESET_SCALERS.indices.toList()) { index ->
                    val (title, pair) = BatchScalerEngine.PRESET_SCALERS[index]
                    val isSelected = selectedPresetIndex == index
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) CopperPrimary else DarkSurfaceElevated)
                            .border(1.dp, if (isSelected) CopperDark else BorderSubtle, RoundedCornerShape(8.dp))
                            .clickable {
                                selectedPresetIndex = index
                                referenceProfile = pair.first
                                targetBatchKg = pair.second
                            }
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                            .testTag("scaler_preset_$index")
                    ) {
                        Text(
                            text = title.split("(").first().trim(),
                            color = if (isSelected) SteamText else SlateMuted,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Target Batch Size Slider & Controls
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(BgBasalt)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(14.dp)
                    .testTag("batch_size_controls")
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "حجم الدفعة المستهدفة الجديدة (Target Batch Size):",
                            color = SteamText,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "الدفعة المرجعية الأصلية: ${referenceProfile.batchSizeKg} كجم",
                            color = SlateMuted,
                            fontSize = 11.sp
                        )
                    }

                    Text(
                        text = "%.1f كجم".format(targetBatchKg),
                        color = CopperPrimary,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Slider(
                    value = targetBatchKg,
                    onValueChange = { targetBatchKg = ((it * 10).toInt() / 10f).coerceIn(0.5f, 60f) },
                    valueRange = 0.5f..60f,
                    colors = SliderDefaults.colors(
                        thumbColor = CopperPrimary,
                        activeTrackColor = CopperPrimary,
                        inactiveTrackColor = BorderSubtle
                    ),
                    modifier = Modifier.testTag("target_batch_slider")
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("0.5 كجم (عينة)", color = SlateMuted, fontSize = 10.sp)
                    Text("معدل التحجيم: ×%.2f".format(scaledPlan.scaleRatio), color = CyanAccent, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Text("60 كجم (إنتاج ضخم)", color = SlateMuted, fontSize = 10.sp)
                }
            }
        }

        // Scaled Recommendations Highlights
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(BgBasalt)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(14.dp)
                    .testTag("scaling_recommendations")
            ) {
                Text(
                    text = "التعديلات الثرموديناميكية الموصى بها للدفعة الجديدة:",
                    color = CopperPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    ScalingPill(
                        title = "حرارة الدخول",
                        value = "${scaledPlan.recommendedChargeTempC.toInt()}°C",
                        delta = "${if (scaledPlan.chargeTempDeltaC >= 0) "+" else ""}${scaledPlan.chargeTempDeltaC.toInt()}°C",
                        color = AmberWarning,
                        modifier = Modifier.weight(1f)
                    )
                    ScalingPill(
                        title = "طاقة الغاز الأساسية",
                        value = "${scaledPlan.recommendedGasScalingPercent}%",
                        delta = "معامل ×%.2f".format(scaledPlan.gasScaleFactor),
                        color = CopperPrimary,
                        modifier = Modifier.weight(1f)
                    )
                    ScalingPill(
                        title = "دوران الأسطوانة",
                        value = "${scaledPlan.recommendedDrumSpeedRpm} RPM",
                        delta = "${if (scaledPlan.drumSpeedDeltaRpm >= 0) "+" else ""}${scaledPlan.drumSpeedDeltaRpm} RPM",
                        color = VioletAccent,
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                Text(
                    text = "تدفق الهواء: ${scaledPlan.recommendedAirflowSetting}",
                    color = CyanAccent,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = scaledPlan.airflowDeltaDescription,
                    color = SlateMuted,
                    fontSize = 11.sp,
                    lineHeight = 15.sp
                )
            }
        }

        // Simulated Dual RoR Curve Canvas
        item {
            val chartPoints = scaledPlan.simulatedRoRCurve.map {
                GhostCurvePoint(
                    timeMin = it.timeSec / 60f,
                    actualEstimatedRor = it.scaledRoR,
                    targetRor = it.referenceRoR,
                    tempC = it.scaledBeanTemp
                )
            }
            RoRChartCanvas(points = chartPoints)
        }

        // Phase by phase Guidance
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(BgBasalt)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(14.dp)
            ) {
                Text(
                    text = "التوجيه التشغيلي مرحلة بمرحلة (Phase-by-Phase Execution):",
                    color = SteamText,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )

                Spacer(modifier = Modifier.height(10.dp))

                scaledPlan.phaseByPhaseGuidance.forEach { phase ->
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(DarkSurfaceElevated)
                            .padding(10.dp)
                    ) {
                        Text(phase.phase, color = CopperPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text("الهدف الزمني: ${phase.timingTarget}", color = SlateMuted, fontSize = 10.sp)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text("• الغاز: ${phase.gasAdjustment}", color = SteamText, fontSize = 11.sp)
                        Text("• الهواء: ${phase.airflowAdjustment}", color = CyanAccent, fontSize = 11.sp)
                        Text("• الفيزياء: ${phase.thermodynamicNotes}", color = SlateMuted, fontSize = 10.sp)
                    }
                    if (phase != scaledPlan.phaseByPhaseGuidance.last()) {
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }
        }

        // Critical Risks
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(BgBasalt)
                    .border(1.dp, AmberWarning.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                    .padding(14.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Icon(Icons.Default.Warning, contentDescription = null, tint = AmberWarning, modifier = Modifier.size(18.dp))
                    Text(
                        text = "المخاطر الفيزيائية الحرجة الواجب الحذر منها:",
                        color = AmberWarning,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                scaledPlan.criticalRisks.forEach { risk ->
                    Text(
                        text = "• $risk",
                        color = SteamText,
                        fontSize = 11.sp,
                        lineHeight = 15.sp,
                        modifier = Modifier.padding(vertical = 2.dp)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = scaledPlan.actionSummaryAr,
                    color = CopperPrimary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

@Composable
private fun ScalingPill(title: String, value: String, delta: String, color: androidx.compose.ui.graphics.Color, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
            .padding(8.dp)
    ) {
        Column {
            Text(title, color = SlateMuted, fontSize = 10.sp)
            Spacer(modifier = Modifier.height(2.dp))
            Text(value, color = color, fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
            Spacer(modifier = Modifier.height(2.dp))
            Text(delta, color = SlateMuted, fontSize = 9.sp)
        }
    }
}
