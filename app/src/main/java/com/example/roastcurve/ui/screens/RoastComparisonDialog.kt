package com.example.roastcurve.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.roastcurve.model.GhostCurvePoint
import com.example.roastcurve.model.SavedRoastRecord
import com.example.roastcurve.ui.components.RoRChartCanvas
import com.example.roastcurve.ui.theme.*

@Composable
fun RoastComparisonDialog(
    roastA: SavedRoastRecord,
    roastB: SavedRoastRecord,
    onDismiss: () -> Unit
) {
    val diagA = roastA.diagnosis
    val diagB = roastB.diagnosis

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(
                onClick = onDismiss,
                colors = ButtonDefaults.buttonColors(containerColor = CopperPrimary)
            ) {
                Text("إغلاق المقارنة", fontWeight = FontWeight.Bold)
            }
        },
        title = {
            Text(
                text = "مقارنة ثرموديناميكية مزدوجة بين تحميصتين",
                color = SteamText,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
        },
        text = {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 520.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Header of the two roasts
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(CopperPrimary.copy(alpha = 0.15f))
                            .border(1.dp, CopperPrimary, RoundedCornerShape(8.dp))
                            .padding(8.dp)
                    ) {
                        Text("التحميصة (A)", color = CopperPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text(roastA.beanProfile.name, color = SteamText, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text("صحة المنحنى: ${diagA.roastHealthScore}", color = SlateMuted, fontSize = 10.sp)
                    }

                    Column(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(8.dp))
                            .background(CyanAccent.copy(alpha = 0.15f))
                            .border(1.dp, CyanAccent, RoundedCornerShape(8.dp))
                            .padding(8.dp)
                    ) {
                        Text("التحميصة (B)", color = CyanAccent, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text(roastB.beanProfile.name, color = SteamText, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text("صحة المنحنى: ${diagB.roastHealthScore}", color = SlateMuted, fontSize = 10.sp)
                    }
                }

                // Comparison Table
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(DarkSurfaceElevated)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                        .padding(10.dp)
                ) {
                    CompRow("حرارة الإسقاط (Charge)", "${diagA.extractedMetrics.chargeTempC.toInt()}°C", "${diagB.extractedMetrics.chargeTempC.toInt()}°C")
                    CompRow("حرارة التفريغ (Drop)", "${diagA.extractedMetrics.dropTempC.toInt()}°C", "${diagB.extractedMetrics.dropTempC.toInt()}°C")
                    CompRow("نسبة التطور DTR %", "%.1f%%".format(diagA.phaseRatios.dtrPercent), "%.1f%%".format(diagB.phaseRatios.dtrPercent))
                    CompRow("فرق حرارة التطور ΔT", "+%.1f°C".format(diagA.extractedMetrics.tempDevelopmentDeltaC), "+%.1f°C".format(diagB.extractedMetrics.tempDevelopmentDeltaC))
                    CompRow("تقييم SCA الحسي", "%.1f".format(diagA.scaCuppingAnalysis?.calibratedScaScore ?: 80f), "%.1f".format(diagB.scaCuppingAnalysis?.calibratedScaScore ?: 80f))
                    CompRow("أجترون المطحون", "%.0f".format(diagA.agtronAppearanceAnalysis?.agtronReadingGround ?: 80f), "%.0f".format(diagB.agtronAppearanceAnalysis?.agtronReadingGround ?: 80f))
                    CompRow("فارق الأجترون ΔAgtron", "%.1f".format(diagA.agtronAppearanceAnalysis?.deltaAgtronSpread ?: 10f), "%.1f".format(diagB.agtronAppearanceAnalysis?.deltaAgtronSpread ?: 10f))
                }

                // Dual RoR Curve
                val combinedPoints = diagA.ghostCurveTarget.mapIndexed { i, ptA ->
                    val ptB = diagB.ghostCurveTarget.getOrNull(i)
                    GhostCurvePoint(
                        timeMin = ptA.timeMin,
                        actualEstimatedRor = ptA.actualEstimatedRor,
                        targetRor = ptB?.actualEstimatedRor ?: ptA.targetRor,
                        tempC = ptA.tempC
                    )
                }
                RoRChartCanvas(points = combinedPoints)
            }
        },
        containerColor = BgBasalt
    )
}

@Composable
private fun CompRow(metric: String, valA: String, valB: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(metric, color = SlateMuted, fontSize = 11.sp, modifier = Modifier.weight(1.2f))
        Text(valA, color = CopperPrimary, fontSize = 12.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace, modifier = Modifier.weight(0.9f))
        Text(valB, color = CyanAccent, fontSize = 12.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace, modifier = Modifier.weight(0.9f))
    }
}
