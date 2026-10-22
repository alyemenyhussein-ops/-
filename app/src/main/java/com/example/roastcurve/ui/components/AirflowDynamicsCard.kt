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
import com.example.roastcurve.model.AirflowAnalysis
import com.example.roastcurve.ui.theme.*

@Composable
fun AirflowDynamicsCard(
    analysis: AirflowAnalysis,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("airflow_dynamics_card")
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "ديناميكا تدفق الهواء ومروحة السحب (Airflow Dynamics)",
                    color = SteamText,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = analysis.verdictHeadlineAr,
                    color = CyanAccent,
                    fontSize = 11.sp
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .background(CyanAccent.copy(alpha = 0.2f))
                    .border(1.dp, CyanAccent, RoundedCornerShape(6.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "حمل حراري: ${analysis.convectiveHeatRatioPercent}%",
                    color = CyanAccent,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Evacuation rating
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "كفاءة سحب القشور والدخان:",
                color = SlateMuted,
                fontSize = 12.sp
            )
            Text(
                text = analysis.chaffSmokeClearanceAr,
                color = SteamText,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Stage reviews
        Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
            StageRow("الإسقاط والتجفيف", analysis.chargeDryingEvalAr)
            StageRow("مرحلة مايلارد", analysis.maillardEvalAr)
            StageRow("القرقعة والتطوير", analysis.firstCrackDevEvalAr)
        }

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "توصية ضبط المروحة للدفعة القادمة: ${analysis.recommendedFanAdjustmentsAr}",
            color = CopperPrimary,
            fontSize = 11.sp,
            lineHeight = 15.sp
        )
    }
}

@Composable
private fun StageRow(stage: String, eval: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.Top
    ) {
        Text(
            text = "• $stage:",
            color = SlateMuted,
            fontSize = 11.sp,
            modifier = Modifier.width(110.dp)
        )
        Text(
            text = eval,
            color = SteamText,
            fontSize = 11.sp,
            modifier = Modifier.weight(1f),
            lineHeight = 15.sp
        )
    }
}
