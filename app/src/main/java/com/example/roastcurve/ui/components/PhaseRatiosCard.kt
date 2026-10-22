package com.example.roastcurve.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.LinearProgressIndicator
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
import com.example.roastcurve.model.PhaseRatios
import com.example.roastcurve.ui.theme.*

@Composable
fun PhaseRatiosCard(
    ratios: PhaseRatios,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("phase_ratios_card")
    ) {
        Text(
            text = "النسب المئوية لمراحل التحميص (Phase Ratios & DTR)",
            color = SteamText,
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "توازن انتقال الطاقة بين التجفيف وتفاعلات مايلارد ونسبة وقت التطور",
            color = SlateMuted,
            fontSize = 11.sp
        )

        Spacer(modifier = Modifier.height(14.dp))

        // 1. Drying Phase
        PhaseItem(
            nameAr = "مرحلة التجفيف (Drying)",
            percent = ratios.dryingPercent,
            idealRange = "35% - 45%",
            status = ratios.dryingStatus,
            diagnosisAr = ratios.dryingDiagnosisAr,
            barColor = AmberWarning
        )

        Spacer(modifier = Modifier.height(12.dp))

        // 2. Maillard Phase
        PhaseItem(
            nameAr = "مرحلة مايلارد (Maillard)",
            percent = ratios.maillardPercent,
            idealRange = "35% - 45%",
            status = ratios.maillardStatus,
            diagnosisAr = ratios.maillardDiagnosisAr,
            barColor = CopperPrimary
        )

        Spacer(modifier = Modifier.height(12.dp))

        // 3. Development Time Ratio (DTR)
        PhaseItem(
            nameAr = "نسبة وقت التطور (DTR %)",
            percent = ratios.dtrPercent,
            idealRange = "14% - 19% فلتر / 18% - 22% إسبريسو",
            status = ratios.dtrStatus,
            diagnosisAr = ratios.dtrDiagnosisAr,
            barColor = if (ratios.dtrStatus == "BAKED") RedDefect else CyanAccent
        )
    }
}

@Composable
private fun PhaseItem(
    nameAr: String,
    percent: Float,
    idealRange: String,
    status: String,
    diagnosisAr: String,
    barColor: Color
) {
    Column(modifier = Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = nameAr,
                    color = SteamText,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Text(
                    text = "[المثالي: $idealRange]",
                    color = SlateMuted,
                    fontSize = 10.sp
                )
            }

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                StatusBadge(status = status)
                Text(
                    text = "%.1f%%".format(percent),
                    color = barColor,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(6.dp))

        LinearProgressIndicator(
            progress = { (percent / 60f).coerceIn(0f, 1f) },
            modifier = Modifier
                .fillMaxWidth()
                .height(7.dp)
                .clip(RoundedCornerShape(4.dp)),
            color = barColor,
            trackColor = BorderSubtle
        )

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = diagnosisAr,
            color = SlateMuted,
            fontSize = 11.sp,
            lineHeight = 15.sp
        )
    }
}

@Composable
fun StatusBadge(status: String) {
    val (label, bg, fg) = when (status) {
        "BALANCED", "OPTIMAL" -> Triple("متزن", EmeraldSuccess.copy(alpha = 0.2f), EmeraldSuccess)
        "BAKED" -> Triple("مخبوز Baked", RedDefect.copy(alpha = 0.2f), RedDefect)
        "UNDERDEVELOPED" -> Triple("ناقص", AmberWarning.copy(alpha = 0.2f), AmberWarning)
        "SHORT" -> Triple("قصير", AmberWarning.copy(alpha = 0.2f), AmberWarning)
        "EXTENDED" -> Triple("ممتد", CyanAccent.copy(alpha = 0.2f), CyanAccent)
        else -> Triple(status, BorderSubtle, SlateMuted)
    }

    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(4.dp))
            .background(bg)
            .padding(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Text(
            text = label,
            color = fg,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold
        )
    }
}
