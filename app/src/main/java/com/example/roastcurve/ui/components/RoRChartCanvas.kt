package com.example.roastcurve.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.roastcurve.model.GhostCurvePoint
import com.example.roastcurve.ui.theme.*
import kotlin.math.max

@Composable
fun RoRChartCanvas(
    points: List<GhostCurvePoint>,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("ror_chart_container")
    ) {
        // Chart Header and Legend
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "منحنى معدل الارتفاع (RoR) ومنحنى الشبح المستهدف",
                    color = SteamText,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Rate of Rise (°C/min) vs. Target Ghost Curve",
                    color = SlateMuted,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )
            }

            // Legend
            Row(
                horizontalArrangement = Arrangement.spacedBy(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Box(modifier = Modifier.size(10.dp, 3.dp).background(CopperPrimary))
                    Text("الفعلي المستنتج", color = CopperPrimary, fontSize = 11.sp)
                }
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    Box(modifier = Modifier.size(10.dp, 3.dp).background(CyanAccent))
                    Text("منحنى الشبح", color = CyanAccent, fontSize = 11.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Canvas Curve
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(200.dp)
        ) {
            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .testTag("ror_canvas")
            ) {
                val canvasWidth = size.width
                val canvasHeight = size.height
                val paddingLeft = 40f
                val paddingBottom = 40f
                val paddingTop = 20f
                val paddingRight = 20f

                val plotWidth = canvasWidth - paddingLeft - paddingRight
                val plotHeight = canvasHeight - paddingTop - paddingBottom

                val maxMinutes = max(11f, points.maxOfOrNull { it.timeMin } ?: 11f)
                val maxRor = 24f

                // Draw Grid lines
                val gridColor = BorderSubtle.copy(alpha = 0.6f)
                val horizontalSteps = 4
                for (i in 0..horizontalSteps) {
                    val y = paddingTop + plotHeight * (i.toFloat() / horizontalSteps)
                    drawLine(
                        color = gridColor,
                        start = Offset(paddingLeft, y),
                        end = Offset(canvasWidth - paddingRight, y),
                        strokeWidth = 1f
                    )
                }

                val verticalSteps = 10
                for (i in 0..verticalSteps) {
                    val x = paddingLeft + plotWidth * (i.toFloat() / verticalSteps)
                    drawLine(
                        color = gridColor,
                        start = Offset(x, paddingTop),
                        end = Offset(x, canvasHeight - paddingBottom),
                        strokeWidth = 1f
                    )
                }

                if (points.isNotEmpty()) {
                    val targetPath = Path()
                    val actualPath = Path()

                    points.forEachIndexed { index, pt ->
                        val x = paddingLeft + (pt.timeMin / maxMinutes) * plotWidth
                        val targetY = paddingTop + (1f - (pt.targetRor / maxRor).coerceIn(0f, 1f)) * plotHeight
                        val actualY = paddingTop + (1f - (pt.actualEstimatedRor / maxRor).coerceIn(0f, 1f)) * plotHeight

                        if (index == 0) {
                            targetPath.moveTo(x, targetY)
                            actualPath.moveTo(x, actualY)
                        } else {
                            targetPath.lineTo(x, targetY)
                            actualPath.lineTo(x, actualY)
                        }
                    }

                    // Draw Target Ghost Curve (Cyan Dashed)
                    drawPath(
                        path = targetPath,
                        color = CyanAccent,
                        style = Stroke(
                            width = 3.5f,
                            cap = StrokeCap.Round,
                            pathEffect = PathEffect.dashPathEffect(floatArrayOf(12f, 8f), 0f)
                        )
                    )

                    // Draw Actual Curve (Copper Solid)
                    drawPath(
                        path = actualPath,
                        color = CopperPrimary,
                        style = Stroke(
                            width = 4.5f,
                            cap = StrokeCap.Round
                        )
                    )

                    // Draw Point Highlights on Actual Curve
                    points.forEach { pt ->
                        val x = paddingLeft + (pt.timeMin / maxMinutes) * plotWidth
                        val actualY = paddingTop + (1f - (pt.actualEstimatedRor / maxRor).coerceIn(0f, 1f)) * plotHeight
                        drawCircle(
                            color = BgBasalt,
                            radius = 5f,
                            center = Offset(x, actualY)
                        )
                        drawCircle(
                            color = CopperPrimary,
                            radius = 3.5f,
                            center = Offset(x, actualY)
                        )
                    }
                }
            }
        }

        // X-axis minute labels
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 32.dp, end = 16.dp, top = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            for (m in 1..10 step 2) {
                Text(
                    text = "${m}m",
                    color = SlateMuted,
                    fontSize = 11.sp,
                    fontFamily = FontFamily.Monospace
                )
            }
        }
    }
}
