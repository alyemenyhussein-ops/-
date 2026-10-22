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
import com.example.roastcurve.model.BrewRescueProtocol
import com.example.roastcurve.ui.theme.*

@Composable
fun BrewRescueCard(
    protocol: BrewRescueProtocol,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(BgBasalt)
            .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
            .padding(16.dp)
            .testTag("brew_rescue_card")
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "بروتوكول إنقاذ الدفعة وهندسة الاستخلاص (Brew Rescue)",
                    color = SteamText,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "وصفة تعويضية للباريستا ومعادلة العيب عبر كيمياء المياه",
                    color = SlateMuted,
                    fontSize = 11.sp
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .background(EmeraldSuccess.copy(alpha = 0.2f))
                    .border(1.dp, EmeraldSuccess, RoundedCornerShape(8.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = "قابلية الإنقاذ: ${protocol.salvageabilityPercent}%",
                    color = EmeraldSuccess,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    fontFamily = FontFamily.Monospace
                )
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        Text(
            text = "الاستخدام الأفضل: ${protocol.bestUseRecommendationAr}",
            color = CopperPrimary,
            fontSize = 12.sp,
            fontWeight = FontWeight.SemiBold
        )
        Text(
            text = "فترة راحة البن (Degassing): ${protocol.degassingRestDaysAr}",
            color = SlateMuted,
            fontSize = 11.sp
        )

        Spacer(modifier = Modifier.height(12.dp))

        // Water Chemistry Target Box
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(DarkSurfaceElevated)
                .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                .padding(10.dp)
        ) {
            Text(
                text = "هندسة كيمياء المياه المستهدفة لمعادلة العيب:",
                color = CyanAccent,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = "GH: ${protocol.waterChemistryTarget.targetGhPpm}", color = SteamText, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                Text(text = "KH: ${protocol.waterChemistryTarget.targetKhPpm}", color = SteamText, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
                Text(text = "Mg:Ca: ${protocol.waterChemistryTarget.mgToCaRatio}", color = SteamText, fontSize = 11.sp, fontFamily = FontFamily.Monospace)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = protocol.waterChemistryTarget.waterExplanationAr,
                color = SlateMuted,
                fontSize = 10.sp,
                lineHeight = 14.sp
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Recipes Split
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Filter Recipe
            Column(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(8.dp))
                    .background(DarkSurfaceElevated)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                    .padding(8.dp)
            ) {
                Text("وصفة المقطر (V60)", color = AmberWarning, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(2.dp))
                Text("حرارة: ${protocol.filterRescueRecipe.waterTempC}", color = SteamText, fontSize = 10.sp)
                Text("نسبة: ${protocol.filterRescueRecipe.brewRatio}", color = SteamText, fontSize = 10.sp)
                Text(protocol.filterRescueRecipe.grindAdjustmentAr, color = SlateMuted, fontSize = 9.sp, lineHeight = 12.sp)
            }

            // Espresso Recipe
            Column(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(8.dp))
                    .background(DarkSurfaceElevated)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(8.dp))
                    .padding(8.dp)
            ) {
                Text("وصفة الإسبريسو", color = CopperPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(2.dp))
                Text("حرارة: ${protocol.espressoRescueRecipe.waterTempC}", color = SteamText, fontSize = 10.sp)
                Text("نسبة: ${protocol.espressoRescueRecipe.yieldRatio}", color = SteamText, fontSize = 10.sp)
                Text("وقت: ${protocol.espressoRescueRecipe.shotTimeSec}", color = SteamText, fontSize = 10.sp)
                Text(protocol.espressoRescueRecipe.preInfusionAndPressureAr, color = SlateMuted, fontSize = 9.sp, lineHeight = 12.sp)
            }
        }
    }
}
