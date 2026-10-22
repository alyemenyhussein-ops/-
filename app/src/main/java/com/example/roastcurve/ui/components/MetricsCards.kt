package com.example.roastcurve.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.roastcurve.model.ExtractedMetrics
import com.example.roastcurve.model.RoRDiagnostics
import com.example.roastcurve.model.RoastStatus
import com.example.roastcurve.ui.theme.*

@Composable
fun HealthScoreCard(
    status: RoastStatus,
    score: Int,
    headline: String,
    modifier: Modifier = Modifier
) {
    val (statusLabel, statusColor) = when (status) {
        RoastStatus.OPTIMAL -> Pair("مسار متزن (Optimal)", EmeraldSuccess)
        RoastStatus.NEEDS_ADJUSTMENT -> Pair("يحتاج لتعديل (Needs Adjustment)", AmberWarning)
        RoastStatus.CRITICAL_DEFECT -> Pair("خلل حراري حرج (Critical Defect)", RedDefect)
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, statusColor.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("health_score_card"),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(10.dp)
                        .clip(RoundedCornerShape(5.dp))
                        .background(statusColor)
                )
                Text(
                    text = statusLabel,
                    color = statusColor,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = headline,
                color = SteamText,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                lineHeight = 18.sp
            )
        }

        Spacer(modifier = Modifier.width(16.dp))

        // Score Badge
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(statusColor.copy(alpha = 0.15f))
                .border(1.5.dp, statusColor, RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "$score",
                    color = statusColor,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
                Text(
                    text = "صحة المنحنى",
                    color = SlateMuted,
                    fontSize = 9.sp
                )
            }
        }
    }
}

@Composable
fun ExtractedMetricsGrid(
    metrics: ExtractedMetrics,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("extracted_metrics_grid")
    ) {
        Text(
            text = "المعالم الحرارية المستخلصة (Thermal Milestones)",
            color = SteamText,
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(12.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            MetricTile(label = "حرارة الإسقاط", value = "${metrics.chargeTempC.toInt()}°C", color = CopperPrimary, modifier = Modifier.weight(1f))
            MetricTile(label = "نقطة التحول", value = "${metrics.turningPointTempC.toInt()}°C", color = CyanAccent, modifier = Modifier.weight(1f))
            MetricTile(label = "القرقعة الأولى", value = "${metrics.firstCrackTempC.toInt()}°C", color = AmberWarning, modifier = Modifier.weight(1f))
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            MetricTile(label = "حرارة التفريغ", value = "${metrics.dropTempC.toInt()}°C", color = CopperPrimary, modifier = Modifier.weight(1f))
            MetricTile(label = "فرق حرارة التطور (ΔT)", value = "+%.1f°C".format(metrics.tempDevelopmentDeltaC), color = EmeraldSuccess, modifier = Modifier.weight(1f))
            val totalMin = (metrics.totalTimeSec / 60).toInt()
            val totalSec = (metrics.totalTimeSec % 60).toInt()
            MetricTile(label = "الوقت الإجمالي", value = "%02d:%02d".format(totalMin, totalSec), color = SteamText, modifier = Modifier.weight(1f))
        }
    }
}

@Composable
private fun MetricTile(
    label: String,
    value: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
            .padding(horizontal = 10.dp, vertical = 8.dp)
    ) {
        Column {
            Text(text = label, color = SlateMuted, fontSize = 10.sp)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = value, color = color, fontSize = 14.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
        }
    }
}

@Composable
fun RoRAnomaliesCard(
    diagnostics: RoRDiagnostics,
    modifier: Modifier = Modifier
) {
    if (diagnostics.detectedAnomalies.isEmpty()) {
        Row(
            modifier = modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(10.dp))
                .background(EmeraldSuccess.copy(alpha = 0.1f))
                .border(1.dp, EmeraldSuccess.copy(alpha = 0.3f), RoundedCornerShape(10.dp))
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldSuccess, modifier = Modifier.size(20.dp))
            Text(
                text = "انحدار رتيب متناقص وخالٍ تماماً من الانهيارات الحرارية أو القفزات الطاردة.",
                color = SteamText,
                fontSize = 12.sp
            )
        }
    } else {
        Column(
            modifier = modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(12.dp))
                .background(BgBasalt)
                .border(1.dp, RedDefect.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                .padding(14.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Icon(Icons.Default.Warning, contentDescription = null, tint = RedDefect, modifier = Modifier.size(18.dp))
                Text(
                    text = "شذوذ حراري مرصود في منحنى RoR:",
                    color = RedDefect,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            diagnostics.detectedAnomalies.forEach { anomaly ->
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Text(
                        text = "• ${anomaly.anomalyType} (${anomaly.timeOccurredMmSs}) - خطورة: ${anomaly.severity}",
                        color = AmberWarning,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        text = anomaly.physicalCauseAr,
                        color = SlateMuted,
                        fontSize = 11.sp,
                        lineHeight = 15.sp
                    )
                }
            }
        }
    }
}
