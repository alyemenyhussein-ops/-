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
import androidx.compose.material.icons.filled.BookmarkAdd
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.RestartAlt
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.roastcurve.data.DemoPreset
import com.example.roastcurve.data.PresetsData
import com.example.roastcurve.data.RoastRepository
import com.example.roastcurve.engine.DiagnosticsEngine
import com.example.roastcurve.model.*
import com.example.roastcurve.ui.components.*
import com.example.roastcurve.ui.theme.*

@Composable
fun DiagnosticsScreen(
    modifier: Modifier = Modifier
) {
    var selectedPresetId by remember { mutableStateOf(PresetsData.PRESETS.first().id) }

    // Form inputs initialized with Yemen Haraz Preset
    var beanName by remember { mutableStateOf("اليمن حراز - وادي مسار لاهوائي") }
    var beanProcess by remember { mutableStateOf(ProcessingMethod.ANAEROBIC) }
    var beanDensity by remember { mutableStateOf("840") }
    var beanMoisture by remember { mutableStateOf("10.8") }
    var targetBrew by remember { mutableStateOf(BrewTarget.FILTER) }
    var roasterType by remember { mutableStateOf(RoasterType.DRUM_DOUBLE_WALLED) }

    var chargeTemp by remember { mutableStateOf("202") }
    var tpTemp by remember { mutableStateOf("94") }
    var tpTime by remember { mutableStateOf("01:25") }
    var yellowingTime by remember { mutableStateOf("04:45") }
    var yellowingTemp by remember { mutableStateOf("152") }
    var firstCrackTime by remember { mutableStateOf("08:40") }
    var firstCrackTemp by remember { mutableStateOf("197") }
    var dropTime by remember { mutableStateOf("10:15") }
    var dropTemp by remember { mutableStateOf("207") }

    var wholeAgtron by remember { mutableStateOf("74") }
    var groundAgtron by remember { mutableStateOf("84") }
    var sensoryDefect by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }

    var isSaved by remember { mutableStateOf(false) }
    var isExpandedInputs by remember { mutableStateOf(false) }

    // Run diagnosis state
    var diagnosisResult by remember {
        mutableStateOf<RoastDiagnosisResponse?>(
            DiagnosticsEngine.diagnose(
                beanProfile = BeanProfile(beanName, beanProcess, beanDensity, beanMoisture, targetBrew, roasterType),
                telemetry = ManualTelemetry(chargeTemp, tpTemp, tpTime, yellowingTime, yellowingTemp, firstCrackTime, firstCrackTemp, dropTime, dropTemp),
                sensoryDefect = sensoryDefect,
                cuppingScores = SCACuppingScores(),
                appearance = PostRoastAppearance(wholeBeanAgtron = wholeAgtron, groundAgtron = groundAgtron),
                notes = notes
            )
        )
    }

    fun applyPreset(preset: DemoPreset) {
        selectedPresetId = preset.id
        beanName = preset.beanProfile.name
        beanProcess = preset.beanProfile.process
        beanDensity = preset.beanProfile.densityGL
        beanMoisture = preset.beanProfile.moisturePct
        targetBrew = preset.beanProfile.targetBrew
        roasterType = preset.beanProfile.roasterType

        chargeTemp = preset.telemetry.chargeTempC
        tpTemp = preset.telemetry.turningPointTempC
        tpTime = preset.telemetry.turningPointTime
        yellowingTime = preset.telemetry.yellowingTime
        yellowingTemp = preset.telemetry.yellowingTempC
        firstCrackTime = preset.telemetry.firstCrackTime
        firstCrackTemp = preset.telemetry.firstCrackTempC
        dropTime = preset.telemetry.dropTime
        dropTemp = preset.telemetry.dropTempC

        wholeAgtron = preset.appearance.wholeBeanAgtron
        groundAgtron = preset.appearance.groundAgtron
        sensoryDefect = preset.sensoryDefect
        notes = preset.notes

        isSaved = false
        diagnosisResult = DiagnosticsEngine.diagnose(
            beanProfile = preset.beanProfile,
            telemetry = preset.telemetry,
            sensoryDefect = preset.sensoryDefect,
            cuppingScores = preset.cuppingScores,
            appearance = preset.appearance,
            notes = preset.notes
        )
    }

    fun runDiagnosis() {
        val beanProfile = BeanProfile(beanName, beanProcess, beanDensity, beanMoisture, targetBrew, roasterType)
        val telemetry = ManualTelemetry(chargeTemp, tpTemp, tpTime, yellowingTime, yellowingTemp, firstCrackTime, firstCrackTemp, dropTime, dropTemp)
        val cuppingScores = SCACuppingScores()
        val appearance = PostRoastAppearance(wholeBeanAgtron = wholeAgtron, groundAgtron = groundAgtron)

        diagnosisResult = DiagnosticsEngine.diagnose(
            beanProfile = beanProfile,
            telemetry = telemetry,
            sensoryDefect = sensoryDefect,
            cuppingScores = cuppingScores,
            appearance = appearance,
            notes = notes
        )
        isSaved = false
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(BgObsidian)
            .padding(horizontal = 14.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
        contentPadding = PaddingValues(top = 10.dp, bottom = 40.dp)
    ) {
        // Quick Demo Presets Selector
        item {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "النماذج الجاهزة والتجارب المعيارية السريعة:",
                    color = SlateMuted,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(PresetsData.PRESETS) { preset ->
                        val isSelected = preset.id == selectedPresetId
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(if (isSelected) CopperPrimary else DarkSurfaceElevated)
                                .border(1.dp, if (isSelected) CopperDark else BorderSubtle, RoundedCornerShape(8.dp))
                                .clickable { applyPreset(preset) }
                                .padding(horizontal = 12.dp, vertical = 8.dp)
                                .testTag("preset_${preset.id}")
                        ) {
                            Column {
                                Text(
                                    text = preset.titleAr.split("|").first().trim(),
                                    color = if (isSelected) SteamText else SlateMuted,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = preset.titleAr.split("|").getOrNull(1)?.trim() ?: "",
                                    color = if (isSelected) SteamText.copy(alpha = 0.85f) else SlateMuted.copy(alpha = 0.7f),
                                    fontSize = 10.sp
                                )
                            }
                        }
                    }
                }
            }
        }

        // Collapsible Inputs Section
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(BgBasalt)
                    .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                    .padding(14.dp)
                    .testTag("inputs_panel")
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = "بيانات التحميصة ومحددات القياس الحراري",
                            color = SteamText,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "$beanName (${targetBrew.labelAr})",
                            color = CopperPrimary,
                            fontSize = 11.sp
                        )
                    }

                    TextButton(
                        onClick = { isExpandedInputs = !isExpandedInputs },
                        modifier = Modifier.testTag("toggle_inputs_button")
                    ) {
                        Text(
                            text = if (isExpandedInputs) "إخفاء التفاصيل ▲" else "تعديل المدخلات ▼",
                            color = CyanAccent,
                            fontSize = 12.sp
                        )
                    }
                }

                if (isExpandedInputs) {
                    Spacer(modifier = Modifier.height(10.dp))

                    // Bean Name
                    OutlinedTextField(
                        value = beanName,
                        onValueChange = { beanName = it },
                        label = { Text("اسم البن والمصدر") },
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = CopperPrimary,
                            unfocusedBorderColor = BorderSubtle,
                            focusedTextColor = SteamText,
                            unfocusedTextColor = SteamText
                        )
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    // Row of Process & Target Brew
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text("المعالجة:", color = SlateMuted, fontSize = 11.sp)
                            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                ProcessingMethod.entries.forEach { p ->
                                    val isPSelected = beanProcess == p
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(if (isPSelected) CopperPrimary else DarkSurfaceElevated)
                                            .clickable { beanProcess = p }
                                            .padding(vertical = 6.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(p.name.take(3), color = SteamText, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }

                        Column(modifier = Modifier.weight(1f)) {
                            Text("الهدف:", color = SlateMuted, fontSize = 11.sp)
                            Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                                BrewTarget.entries.forEach { b ->
                                    val isBSelected = targetBrew == b
                                    Box(
                                        modifier = Modifier
                                            .weight(1f)
                                            .clip(RoundedCornerShape(6.dp))
                                            .background(if (isBSelected) CyanAccent else DarkSurfaceElevated)
                                            .clickable { targetBrew = b }
                                            .padding(vertical = 6.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(b.name, color = if (isBSelected) BgObsidian else SteamText, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    // Telemetry Grid
                    Text("القياسات الحرارية والزمنية:", color = SlateMuted, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        OutlinedTextField(
                            value = chargeTemp,
                            onValueChange = { chargeTemp = it },
                            label = { Text("Charge") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = tpTime,
                            onValueChange = { tpTime = it },
                            label = { Text("TP Time") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = yellowingTime,
                            onValueChange = { yellowingTime = it },
                            label = { Text("Yellow") },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        OutlinedTextField(
                            value = firstCrackTime,
                            onValueChange = { firstCrackTime = it },
                            label = { Text("FC Time") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = dropTime,
                            onValueChange = { dropTime = it },
                            label = { Text("Drop Time") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = dropTemp,
                            onValueChange = { dropTemp = it },
                            label = { Text("Drop °C") },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Agtron inputs
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedTextField(
                            value = wholeAgtron,
                            onValueChange = { wholeAgtron = it },
                            label = { Text("أجترون حبة كاملة") },
                            modifier = Modifier.weight(1f)
                        )
                        OutlinedTextField(
                            value = groundAgtron,
                            onValueChange = { groundAgtron = it },
                            label = { Text("أجترون مطحون") },
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    OutlinedTextField(
                        value = sensoryDefect,
                        onValueChange = { sensoryDefect = it },
                        label = { Text("العيب الحسي المرصود في الكوب (اختياري)") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = { runDiagnosis() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("run_diagnose_button"),
                        colors = ButtonDefaults.buttonColors(containerColor = CopperPrimary)
                    ) {
                        Icon(Icons.Default.PlayArrow, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("إعادة تشغيل محرك التشخيص الفيزيائي", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Diagnostics Results Section
        diagnosisResult?.let { diag ->
            // Health Score & Status
            item {
                HealthScoreCard(
                    status = diag.overallStatus,
                    score = diag.roastHealthScore,
                    headline = diag.summaryHeadline
                )
            }

            // RoR Anomaly alert if any
            item {
                RoRAnomaliesCard(diagnostics = diag.rorDiagnostics)
            }

            // Interactive RoR Chart Canvas
            item {
                RoRChartCanvas(points = diag.ghostCurveTarget)
            }

            // Milestones extracted metrics
            item {
                ExtractedMetricsGrid(metrics = diag.extractedMetrics)
            }

            // Phase Ratios Card
            item {
                PhaseRatiosCard(ratios = diag.phaseRatios)
            }

            // SCA Cupping Analysis Card
            diag.scaCuppingAnalysis?.let { sca ->
                item {
                    ScaCuppingCard(analysis = sca)
                }
            }

            // Agtron Analysis Card
            diag.agtronAppearanceAnalysis?.let { agtron ->
                item {
                    AgtronAnalysisCard(analysis = agtron)
                }
            }

            // Airflow Dynamics Card
            diag.airflowAnalysis?.let { airflow ->
                item {
                    AirflowDynamicsCard(analysis = airflow)
                }
            }

            // Brew Rescue Protocol Card
            diag.brewRescueProtocol?.let { rescue ->
                item {
                    BrewRescueCard(protocol = rescue)
                }
            }

            // Action Plan
            item {
                ActionPlanCard(steps = diag.nextBatchActionPlan)
            }

            // Action Buttons (Save to Vault)
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = {
                            val record = SavedRoastRecord(
                                id = "roast_${System.currentTimeMillis()}",
                                timestamp = System.currentTimeMillis(),
                                title = "$beanName - ${targetBrew.labelAr}",
                                beanProfile = BeanProfile(beanName, beanProcess, beanDensity, beanMoisture, targetBrew, roasterType),
                                sensoryDefect = sensoryDefect,
                                cuppingScores = SCACuppingScores(),
                                appearance = PostRoastAppearance(wholeBeanAgtron = wholeAgtron, groundAgtron = groundAgtron),
                                diagnosis = diag
                            )
                            RoastRepository.saveRoast(record)
                            isSaved = true
                        },
                        modifier = Modifier
                            .weight(1f)
                            .testTag("save_to_vault_button"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isSaved) EmeraldSuccess else CopperPrimary
                        )
                    ) {
                        Icon(if (isSaved) Icons.Default.Check else Icons.Default.BookmarkAdd, contentDescription = null)
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(if (isSaved) "تم الحفظ في الخزينة ✓" else "حفظ التحميصة في الخزينة")
                    }
                }
            }
        }
    }
}
