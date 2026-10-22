package com.example.roastcurve.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.roastcurve.model.SCACuppingAnalysis
import com.example.roastcurve.ui.theme.*

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ScaCuppingCard(
    analysis: SCACuppingAnalysis,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("sca_cupping_card")
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "تقييم الكوب المعياري (SCA Cupping Form)",
                    color = SteamText,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = analysis.scaGradeAr,
                    color = CyanAccent,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(CopperPrimary.copy(alpha = 0.2f))
                    .border(1.dp, CopperPrimary, RoundedCornerShape(8.dp))
                    .padding(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "%.2f / 100".format(analysis.calibratedScaScore),
                    color = CopperPrimary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Attribute breakdown
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            AttributeRow(title = "الرائحة والعطر", text = analysis.fragranceAromaAr)
            AttributeRow(title = "النكهة وتنوعها", text = analysis.flavorAr)
            AttributeRow(title = "الطعم المتبقي", text = analysis.aftertasteAr)
            AttributeRow(title = "الحمضية وجودتها", text = analysis.acidityAr)
            AttributeRow(title = "القوام والملمس", text = analysis.bodyAr)
            AttributeRow(title = "الاتزان العام", text = analysis.balanceAr)
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Flavor Wheel Tags
        Text(
            text = "نوتات عجلة النكهات المستخلصة:",
            color = SlateMuted,
            fontSize = 11.sp
        )
        Spacer(modifier = Modifier.height(6.dp))

        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            analysis.flavorWheelTags.forEach { tag ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(DarkSurfaceElevated)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(6.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = "#$tag",
                        color = SteamText,
                        fontSize = 11.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun AttributeRow(title: String, text: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top
    ) {
        Text(
            text = "• $title:",
            color = SlateMuted,
            fontSize = 11.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.width(90.dp)
        )
        Text(
            text = text,
            color = SteamText,
            fontSize = 11.sp,
            modifier = Modifier.weight(1f),
            lineHeight = 15.sp
        )
    }
}
