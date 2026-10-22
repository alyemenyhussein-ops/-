package com.example.roastcurve.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.example.roastcurve.model.AgtronAppearanceAnalysis
import com.example.roastcurve.ui.theme.*

@Composable
fun AgtronAnalysisCard(
    analysis: AgtronAppearanceAnalysis,
    modifier: Modifier = Modifier
) {
    // Parse color hex safely
    val parsedColor = try {
        Color(android.graphics.Color.parseColor(analysis.colorHex))
    } catch (e: Exception) {
        CopperPrimary
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("agtron_analysis_card")
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Color preview swatch
                Box(
                    modifier = Modifier
                        .size(34.dp)
                        .clip(CircleShape)
                        .background(parsedColor)
                        .border(2.dp, SteamText.copy(alpha = 0.5f), CircleShape)
                )

                Column {
                    Text(
                        text = "تحليل لون الأجترون والتدرج (Agtron & Appearance)",
                        color = SteamText,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = analysis.roastDegreeCategoryAr,
                        color = parsedColor,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }

            // Consistency Badge
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(
                        if (analysis.processConsistencyStatus == "HIGHLY_CONSISTENT")
                            EmeraldSuccess.copy(alpha = 0.2f)
                        else AmberWarning.copy(alpha = 0.2f)
                    )
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "اتساق: ${analysis.processConsistencyScore}%",
                    color = if (analysis.processConsistencyStatus == "HIGHLY_CONSISTENT") EmeraldSuccess else AmberWarning,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // Readings Grid
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ReadingTile(
                title = "الحبة الكاملة",
                value = "%.0f".format(analysis.agtronReadingWhole),
                desc = "السطح الخارجي",
                modifier = Modifier.weight(1f)
            )
            ReadingTile(
                title = "البن المطحون",
                value = "%.0f".format(analysis.agtronReadingGround),
                desc = "عمق النواة",
                modifier = Modifier.weight(1f)
            )
            ReadingTile(
                title = "فارق التدرج (ΔAgtron)",
                value = "%.1f".format(analysis.deltaAgtronSpread),
                desc = "المثالي: ${analysis.idealDeltaRange}",
                modifier = Modifier.weight(1.2f)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Thermodynamic Gradient verdict
        Text(
            text = analysis.coreVsSurfaceGradientAr,
            color = CopperPrimary,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = analysis.roastColorSensoryVerdictAr,
            color = SlateMuted,
            fontSize = 11.sp,
            lineHeight = 15.sp
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "توصية المعالجة: ${analysis.processSpecificRecommendationsAr.firstOrNull() ?: ""}",
            color = CyanAccent,
            fontSize = 11.sp,
            lineHeight = 15.sp
        )
    }
}

@Composable
private fun ReadingTile(
    title: String,
    value: String,
    desc: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
            .padding(8.dp)
    ) {
        Column {
            Text(text = title, color = SlateMuted, fontSize = 10.sp)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = value, color = SteamText, fontSize = 15.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = desc, color = SlateMuted, fontSize = 9.sp)
        }
    }
}
