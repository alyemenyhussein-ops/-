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
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.School
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
import com.example.roastcurve.engine.TrainerEngine
import com.example.roastcurve.model.DefectCategory
import com.example.roastcurve.model.TrainerChallenge
import com.example.roastcurve.model.TrainerGradingResult
import com.example.roastcurve.model.TrainerSubmission
import com.example.roastcurve.ui.components.RoRChartCanvas
import com.example.roastcurve.ui.theme.*

@Composable
fun TrainerScreen(
    modifier: Modifier = Modifier
) {
    var selectedChallenge by remember { mutableStateOf<TrainerChallenge>(TrainerEngine.CHALLENGES.first()) }

    var selectedDefect by remember { mutableStateOf(DefectCategory.ROR_CRASH) }
    var gasAction by remember { mutableStateOf("EARLIER_REDUCTION") }
    var gasTiming by remember { mutableStateOf("قبل القرقعة بـ 45 ثانية") }
    var gasMagnitude by remember { mutableStateOf("خفض 25%") }

    var airflowAction by remember { mutableStateOf("INCREASE") }
    var airflowTiming by remember { mutableStateOf("عند بداية القرقعة") }
    var airflowMagnitude by remember { mutableStateOf("رفع مروحة السحب بنسبة 20%") }

    var reasoningText by remember { mutableStateOf("لتعويض التبخير الرطب الماص للحرارة عند القرقعة الأولى وتفادي انهيار RoR المفاجئ.") }
    var gradingResult by remember { mutableStateOf<TrainerGradingResult?>(null) }

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
                    Icon(Icons.Default.School, contentDescription = null, tint = CopperPrimary, modifier = Modifier.size(24.dp))
                    Text(
                        text = "أكاديمية مدرب التحميص المعياري (Roast Master Academy)",
                        color = SteamText,
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Text(
                    text = "فحص المنحنيات المعيبة وتشخيص الخلل الحراري الخفي وتصحيح الغاز والهواء وفق معايير SCA",
                    color = SlateMuted,
                    fontSize = 11.sp
                )
            }
        }

        // Challenge Selector
        item {
            Text(
                text = "اختر السيناريو التدريبي (Training Challenges):",
                color = SlateMuted,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(TrainerEngine.CHALLENGES) { challenge ->
                    val isSelected = challenge.id == selectedChallenge.id
                    val diffColor = when (challenge.difficulty) {
                        "EXPERT" -> RedDefect
                        "INTERMEDIATE" -> AmberWarning
                        else -> EmeraldSuccess
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(if (isSelected) CopperPrimary else DarkSurfaceElevated)
                            .border(1.dp, if (isSelected) CopperDark else BorderSubtle, RoundedCornerShape(8.dp))
                            .clickable {
                                selectedChallenge = challenge
                                gradingResult = null
                            }
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                            .testTag("challenge_${challenge.id}")
                    ) {
                        Column {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                Text(
                                    text = challenge.difficulty,
                                    color = if (isSelected) BgObsidian else diffColor,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = challenge.titleAr.split("(").first().trim(),
                                    color = if (isSelected) SteamText else SlateMuted,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }

        // Scenario Brief & Defective Curve
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
                    text = "سياق السيناريو: ${selectedChallenge.titleAr}",
                    color = CopperPrimary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = selectedChallenge.scenarioBriefAr,
                    color = SteamText,
                    fontSize = 12.sp,
                    lineHeight = 16.sp
                )
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "الملاحظات الحسية المبلغ عنها: ${selectedChallenge.sensoryNotesAr}",
                    color = AmberWarning,
                    fontSize = 11.sp,
                    lineHeight = 15.sp
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Render the defective curve
                RoRChartCanvas(points = selectedChallenge.ghostCurveTarget)
            }
        }

        // Trainee Diagnosis & Intervention Form
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(BgBasalt)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(14.dp)
                    .testTag("trainee_form")
            ) {
                Text(
                    text = "نموذج إجابة الحمّاص المتدرب (Trainee Solution):",
                    color = SteamText,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(10.dp))

                // 1. Defect Category Selector
                Text("1. ما هو الخلل الثرموديناميكي المشخص؟", color = SlateMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(DefectCategory.entries) { cat ->
                        val isSelected = selectedDefect == cat
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (isSelected) CopperPrimary else DarkSurfaceElevated)
                                .clickable { selectedDefect = cat }
                                .padding(horizontal = 8.dp, vertical = 6.dp)
                        ) {
                            Text(cat.labelAr, color = SteamText, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // 2. Gas Adjustment Plan
                Text("2. خطة تعديل طاقة الغاز (Gas Adjustment):", color = SlateMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    listOf("EARLIER_REDUCTION" to "خفض مبكر", "DECREASE" to "خفض", "HOLD" to "تثبيت", "CUT_OFF" to "إيقاف تام").forEach { (action, label) ->
                        val isSelected = gasAction == action
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (isSelected) CopperPrimary else DarkSurfaceElevated)
                                .clickable { gasAction = action }
                                .padding(vertical = 6.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(label, color = SteamText, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    OutlinedTextField(
                        value = gasTiming,
                        onValueChange = { gasTiming = it },
                        label = { Text("توقيت الغاز") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = gasMagnitude,
                        onValueChange = { gasMagnitude = it },
                        label = { Text("مقدار الغاز") },
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // 3. Airflow Adjustment Plan
                Text("3. خطة تدفق الهواء ومروحة السحب (Airflow):", color = SlateMuted, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(4.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    listOf("INCREASE" to "رفع الهواء", "HOLD" to "تثبيت", "DECREASE" to "خفض الهواء", "PULSE_VENT" to "نبضات تفريغ").forEach { (action, label) ->
                        val isSelected = airflowAction == action
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(6.dp))
                                .background(if (isSelected) CyanAccent else DarkSurfaceElevated)
                                .clickable { airflowAction = action }
                                .padding(vertical = 6.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(label, color = if (isSelected) BgObsidian else SteamText, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    OutlinedTextField(
                        value = airflowTiming,
                        onValueChange = { airflowTiming = it },
                        label = { Text("توقيت الهواء") },
                        modifier = Modifier.weight(1f)
                    )
                    OutlinedTextField(
                        value = airflowMagnitude,
                        onValueChange = { airflowMagnitude = it },
                        label = { Text("مقدار الهواء") },
                        modifier = Modifier.weight(1f)
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                // 4. Reasoning
                OutlinedTextField(
                    value = reasoningText,
                    onValueChange = { reasoningText = it },
                    label = { Text("التفسير الفيزيائي والثرموديناميكي لخطة العلاج") },
                    modifier = Modifier.fillMaxWidth(),
                    minLines = 2
                )

                Spacer(modifier = Modifier.height(12.dp))

                // Submit Button
                Button(
                    onClick = {
                        val sub = TrainerSubmission(
                            identifiedDefectCategory = selectedDefect,
                            defectDescriptionAr = selectedDefect.labelAr,
                            gasAction = gasAction,
                            gasTimingAr = gasTiming,
                            gasMagnitudeAr = gasMagnitude,
                            airflowAction = airflowAction,
                            airflowTimingAr = airflowTiming,
                            airflowMagnitudeAr = airflowMagnitude,
                            thermodynamicReasoningAr = reasoningText
                        )
                        gradingResult = TrainerEngine.gradeSubmission(selectedChallenge, sub)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("submit_trainer_answer_button"),
                    colors = ButtonDefaults.buttonColors(containerColor = CopperPrimary)
                ) {
                    Icon(Icons.Default.EmojiEvents, contentDescription = null)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("إرسال الإجابة للتقييم والتحكيم الفوري", fontWeight = FontWeight.Bold)
                }
            }
        }

        // Grading Evaluation Card
        gradingResult?.let { grade ->
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(BgBasalt)
                        .border(1.5.dp, if (grade.totalScore >= 75) EmeraldSuccess else AmberWarning, RoundedCornerShape(12.dp))
                        .padding(16.dp)
                        .testTag("grading_result_card")
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "نتيجة تقييم لجنة تحكيم التحميص:",
                                color = SteamText,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = grade.gradeTierAr,
                                color = if (grade.totalScore >= 75) EmeraldSuccess else AmberWarning,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        Box(
                            modifier = Modifier
                                .size(58.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .background(CopperPrimary.copy(alpha = 0.2f))
                                .border(1.5.dp, CopperPrimary, RoundedCornerShape(10.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "${grade.totalScore}",
                                color = CopperPrimary,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Rubric Breakdown
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        RubricTile("تشخيص الخلل", "${grade.scoreBreakdown.defectIdentification}/40", Modifier.weight(1f))
                        RubricTile("ضبط الغاز والهواء", "${grade.scoreBreakdown.controlAdjustments}/40", Modifier.weight(1f))
                        RubricTile("المنطق العلمي", "${grade.scoreBreakdown.thermodynamicReasoning}/20", Modifier.weight(1f))
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(text = grade.overallFeedbackAr, color = SteamText, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "• ${grade.defectCritiqueAr}", color = SlateMuted, fontSize = 11.sp)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "• ${grade.gasAirflowCritiqueAr}", color = SlateMuted, fontSize = 11.sp)

                    Spacer(modifier = Modifier.height(10.dp))

                    // Revealed Truth
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(DarkSurfaceElevated)
                            .padding(10.dp)
                    ) {
                        Text(
                            text = "الحقيقة العلمية المكتشفة (Revealed Truth):",
                            color = CyanAccent,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = grade.revealedTruthAr,
                            color = SteamText,
                            fontSize = 11.sp,
                            lineHeight = 15.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun RubricTile(label: String, score: String, modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(6.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(6.dp))
            .padding(6.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(label, color = SlateMuted, fontSize = 9.sp)
            Text(score, color = CopperPrimary, fontSize = 13.sp, fontWeight = FontWeight.Bold, fontFamily = FontFamily.Monospace)
        }
    }
}
