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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.roastcurve.model.ActionPlanStep
import com.example.roastcurve.model.ControlParameter
import com.example.roastcurve.ui.theme.*

@Composable
fun ActionPlanCard(
    steps: List<ActionPlanStep>,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("action_plan_card")
    ) {
        Text(
            text = "خطة التدخل التشغيلي للدفعة القادمة (Next Batch Action Plan)",
            color = SteamText,
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = "خطوات تصحيح الغاز وتدفق الهواء وحرارة الدخول مرتبة زمنياً",
            color = SlateMuted,
            fontSize = 11.sp
        )

        Spacer(modifier = Modifier.height(14.dp))

        steps.forEach { step ->
            StepRow(step = step)
            if (step != steps.last()) {
                Spacer(modifier = Modifier.height(10.dp))
            }
        }
    }
}

@Composable
private fun StepRow(step: ActionPlanStep) {
    val paramColor = when (step.controlParameter) {
        ControlParameter.GAS_POWER -> CopperPrimary
        ControlParameter.AIRFLOW -> CyanAccent
        ControlParameter.CHARGE_TEMP -> AmberWarning
        ControlParameter.DRUM_SPEED -> VioletAccent
        ControlParameter.DROP_TIMING -> EmeraldSuccess
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
            .padding(10.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.Top
    ) {
        // Step number circle
        Box(
            modifier = Modifier
                .size(24.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(paramColor.copy(alpha = 0.2f))
                .border(1.dp, paramColor, RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "${step.stepNumber}",
                color = paramColor,
                fontSize = 11.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Column(modifier = Modifier.weight(1f)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = step.stageNameAr,
                    color = SteamText,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = step.controlParameter.name,
                    color = paramColor,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold
                )
            }
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = step.exactActionAr,
                color = CopperPrimary,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = "الأثر: ${step.expectedEffectAr}",
                color = SlateMuted,
                fontSize = 10.sp,
                lineHeight = 13.sp
            )
        }
    }
}
