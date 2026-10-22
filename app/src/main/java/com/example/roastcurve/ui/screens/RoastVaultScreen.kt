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
import androidx.compose.material.icons.filled.CompareArrows
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
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
import com.example.roastcurve.data.RoastRepository
import com.example.roastcurve.model.BrewTarget
import com.example.roastcurve.model.SavedRoastRecord
import com.example.roastcurve.ui.components.RoRChartCanvas
import com.example.roastcurve.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun RoastVaultScreen(
    onSelectForCompare: (SavedRoastRecord, SavedRoastRecord) -> Unit,
    modifier: Modifier = Modifier
) {
    val savedRoasts by RoastRepository.savedRoasts.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedBrewFilter by remember { mutableStateOf<BrewTarget?>(null) }
    var selectedForCompareA by remember { mutableStateOf<SavedRoastRecord?>(null) }
    var selectedForCompareB by remember { mutableStateOf<SavedRoastRecord?>(null) }
    var viewedRoastDetail by remember { mutableStateOf<SavedRoastRecord?>(null) }

    val filteredRoasts = savedRoasts.filter { record ->
        val matchesSearch = record.title.contains(searchQuery, ignoreCase = true) ||
                record.beanProfile.name.contains(searchQuery, ignoreCase = true)
        val matchesBrew = selectedBrewFilter == null || record.beanProfile.targetBrew == selectedBrewFilter
        matchesSearch && matchesBrew
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(BgObsidian)
            .padding(horizontal = 14.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(top = 10.dp, bottom = 40.dp)
    ) {
        // Vault Header
        item {
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "خزينة سجلات التحميص (Roast Vault)",
                    color = SteamText,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "أرشيف الدفعات السابقة والمقارنة المعيارية لمعدل الارتفاع والنتائج الحسية",
                    color = SlateMuted,
                    fontSize = 12.sp
                )
            }
        }

        // Compare Toolbar if selecting
        item {
            if (selectedForCompareA != null || selectedForCompareB != null) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(DarkSurfaceElevated)
                        .border(1.dp, CopperPrimary, RoundedCornerShape(8.dp))
                        .padding(10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("مقارنة تحميصتين:", color = CopperPrimary, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        Text(
                            text = "A: ${selectedForCompareA?.beanProfile?.name ?: "لم يُحدد"} | B: ${selectedForCompareB?.beanProfile?.name ?: "اختر الثانية"}",
                            color = SteamText,
                            fontSize = 11.sp
                        )
                    }

                    if (selectedForCompareA != null && selectedForCompareB != null) {
                        Button(
                            onClick = {
                                onSelectForCompare(selectedForCompareA!!, selectedForCompareB!!)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = CyanAccent),
                            modifier = Modifier.testTag("launch_compare_button")
                        ) {
                            Icon(Icons.Default.CompareArrows, contentDescription = null, tint = BgObsidian)
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("بدء المقارنة", color = BgObsidian, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                        }
                    }
                }
            }
        }

        // Search & Filters
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = { Text("بحث في المحاصيل وسجلات الخزينة...") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = SlateMuted) },
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("search_vault_input"),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = CopperPrimary,
                    unfocusedBorderColor = BorderSubtle,
                    focusedTextColor = SteamText,
                    unfocusedTextColor = SteamText
                )
            )
        }

        item {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                FilterChip(
                    selected = selectedBrewFilter == null,
                    onClick = { selectedBrewFilter = null },
                    label = { Text("الكل (${savedRoasts.size})") }
                )
                BrewTarget.entries.forEach { target ->
                    FilterChip(
                        selected = selectedBrewFilter == target,
                        onClick = { selectedBrewFilter = target },
                        label = { Text(target.labelAr.split("(").first().trim()) }
                    )
                }
            }
        }

        // List of saved roasts
        if (filteredRoasts.isEmpty()) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 40.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "لا توجد تحميصات محفوظة تطابق البحث",
                        color = SlateMuted,
                        fontSize = 13.sp
                    )
                }
            }
        } else {
            items(filteredRoasts) { record ->
                val diag = record.diagnosis
                val dateStr = SimpleDateFormat("yyyy/MM/dd", Locale.getDefault()).format(Date(record.timestamp))

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(BgBasalt)
                        .border(1.dp, BorderSubtle, RoundedCornerShape(12.dp))
                        .padding(14.dp)
                        .clickable { viewedRoastDetail = record }
                        .testTag("roast_card_${record.id}")
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.Top
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = record.title,
                                color = SteamText,
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = "$dateStr • ${record.beanProfile.process.labelAr} • ${record.beanProfile.targetBrew.labelAr}",
                                color = SlateMuted,
                                fontSize = 11.sp
                            )
                        }

                        // Score & Delete
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(CopperPrimary.copy(alpha = 0.2f))
                                    .padding(horizontal = 6.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "صحة: ${diag.roastHealthScore}",
                                    color = CopperPrimary,
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace
                                )
                            }

                            IconButton(
                                onClick = { RoastRepository.deleteRoast(record.id) },
                                modifier = Modifier.size(28.dp)
                            ) {
                                Icon(Icons.Default.Delete, contentDescription = "حذف", tint = SlateMuted, modifier = Modifier.size(16.dp))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Metrics Strip
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        VaultPill(text = "DTR: %.1f%%".format(diag.phaseRatios.dtrPercent), color = CyanAccent)
                        VaultPill(text = "ΔT: +%.1f°C".format(diag.extractedMetrics.tempDevelopmentDeltaC), color = AmberWarning)
                        val scaScore = diag.scaCuppingAnalysis?.calibratedScaScore ?: 80f
                        VaultPill(text = "SCA: %.1f".format(scaScore), color = EmeraldSuccess)
                        val agtron = diag.agtronAppearanceAnalysis?.agtronReadingGround ?: 80f
                        VaultPill(text = "Agtron: %.0f".format(agtron), color = CopperPrimary)
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    // Compare selection checkboxes
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = diag.summaryHeadline,
                            color = SlateMuted,
                            fontSize = 11.sp,
                            maxLines = 1,
                            modifier = Modifier.weight(1f)
                        )

                        TextButton(
                            onClick = {
                                if (selectedForCompareA == null) {
                                    selectedForCompareA = record
                                } else if (selectedForCompareB == null && selectedForCompareA?.id != record.id) {
                                    selectedForCompareB = record
                                } else {
                                    selectedForCompareA = record
                                    selectedForCompareB = null
                                }
                            }
                        ) {
                            Text(
                                text = if (selectedForCompareA?.id == record.id) "المحددة A ✓"
                                else if (selectedForCompareB?.id == record.id) "المحددة B ✓"
                                else "+ تحديد للمقارنة",
                                color = if (selectedForCompareA?.id == record.id || selectedForCompareB?.id == record.id) CopperPrimary else SlateMuted,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }

    // Roast Detail Modal
    viewedRoastDetail?.let { detail ->
        AlertDialog(
            onDismissRequest = { viewedRoastDetail = null },
            confirmButton = {
                TextButton(onClick = { viewedRoastDetail = null }) {
                    Text("إغلاق", color = CopperPrimary)
                }
            },
            title = {
                Text(detail.title, color = SteamText, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            },
            text = {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .heightIn(max = 450.dp)
                ) {
                    RoRChartCanvas(points = detail.diagnosis.ghostCurveTarget)
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "التشخيص العلمي: ${detail.diagnosis.summaryHeadline}",
                        color = CopperPrimary,
                        fontSize = 12.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "وصفة الإنقاذ: ${detail.diagnosis.brewRescueProtocol?.bestUseRecommendationAr ?: ""}",
                        color = SlateMuted,
                        fontSize = 11.sp
                    )
                }
            },
            containerColor = BgBasalt
        )
    }
}

@Composable
private fun VaultPill(text: String, color: androidx.compose.ui.graphics.Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(4.dp))
            .background(DarkSurfaceElevated)
            .border(1.dp, BorderSubtle, RoundedCornerShape(4.dp))
            .padding(horizontal = 6.dp, vertical = 2.dp)
    ) {
        Text(
            text = text,
            color = color,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            fontFamily = FontFamily.Monospace
        )
    }
}
