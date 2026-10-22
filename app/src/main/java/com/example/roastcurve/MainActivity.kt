package com.example.roastcurve

import android.os.Bundle
import com.example.R
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Scale
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import com.example.roastcurve.model.SavedRoastRecord
import com.example.roastcurve.ui.components.AppHeader
import com.example.roastcurve.ui.screens.*
import com.example.roastcurve.ui.theme.*

enum class AppTab(val titleRes: Int) {
    DIAGNOSTICS(R.string.tab_diagnostics),
    VAULT(R.string.tab_vault),
    TRAINER(R.string.tab_trainer),
    SCALER(R.string.tab_scaler)
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            RoastDiagnosticsTheme {
                MainAppScreen()
            }
        }
    }
}

@Composable
fun MainAppScreen() {
    var currentTab by remember { mutableStateOf(AppTab.DIAGNOSTICS) }
    var showGuideDialog by remember { mutableStateOf(false) }
    var comparisonPair by remember { mutableStateOf<Pair<SavedRoastRecord, SavedRoastRecord>?>(null) }

    BackHandler(enabled = currentTab != AppTab.DIAGNOSTICS || showGuideDialog || comparisonPair != null) {
        if (comparisonPair != null) {
            comparisonPair = null
        } else if (showGuideDialog) {
            showGuideDialog = false
        } else {
            currentTab = AppTab.DIAGNOSTICS
        }
    }

    Scaffold(
        topBar = {
            AppHeader(
                onOpenGuide = { showGuideDialog = true }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = BgBasalt,
                contentColor = SteamText,
                tonalElevation = 8.dp,
                modifier = Modifier.testTag("main_bottom_nav")
            ) {
                NavigationBarItem(
                    selected = currentTab == AppTab.DIAGNOSTICS,
                    onClick = { currentTab = AppTab.DIAGNOSTICS },
                    icon = { Icon(Icons.Default.LocalFireDepartment, contentDescription = null) },
                    label = { Text(stringResource(AppTab.DIAGNOSTICS.titleRes)) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = CopperPrimary,
                        selectedTextColor = CopperPrimary,
                        indicatorColor = CopperPrimary.copy(alpha = 0.2f),
                        unselectedIconColor = SlateMuted,
                        unselectedTextColor = SlateMuted
                    ),
                    modifier = Modifier.testTag("nav_diagnostics")
                )
                NavigationBarItem(
                    selected = currentTab == AppTab.VAULT,
                    onClick = { currentTab = AppTab.VAULT },
                    icon = { Icon(Icons.Default.Bookmark, contentDescription = null) },
                    label = { Text(stringResource(AppTab.VAULT.titleRes)) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = CopperPrimary,
                        selectedTextColor = CopperPrimary,
                        indicatorColor = CopperPrimary.copy(alpha = 0.2f),
                        unselectedIconColor = SlateMuted,
                        unselectedTextColor = SlateMuted
                    ),
                    modifier = Modifier.testTag("nav_vault")
                )
                NavigationBarItem(
                    selected = currentTab == AppTab.TRAINER,
                    onClick = { currentTab = AppTab.TRAINER },
                    icon = { Icon(Icons.Default.School, contentDescription = null) },
                    label = { Text(stringResource(AppTab.TRAINER.titleRes)) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = CopperPrimary,
                        selectedTextColor = CopperPrimary,
                        indicatorColor = CopperPrimary.copy(alpha = 0.2f),
                        unselectedIconColor = SlateMuted,
                        unselectedTextColor = SlateMuted
                    ),
                    modifier = Modifier.testTag("nav_trainer")
                )
                NavigationBarItem(
                    selected = currentTab == AppTab.SCALER,
                    onClick = { currentTab = AppTab.SCALER },
                    icon = { Icon(Icons.Default.Scale, contentDescription = null) },
                    label = { Text(stringResource(AppTab.SCALER.titleRes)) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = CopperPrimary,
                        selectedTextColor = CopperPrimary,
                        indicatorColor = CopperPrimary.copy(alpha = 0.2f),
                        unselectedIconColor = SlateMuted,
                        unselectedTextColor = SlateMuted
                    ),
                    modifier = Modifier.testTag("nav_scaler")
                )
            }
        },
        containerColor = BgObsidian
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentTab) {
                AppTab.DIAGNOSTICS -> DiagnosticsScreen()
                AppTab.VAULT -> RoastVaultScreen(
                    onSelectForCompare = { a, b ->
                        comparisonPair = a to b
                    }
                )
                AppTab.TRAINER -> TrainerScreen()
                AppTab.SCALER -> BatchScalerScreen()
            }
        }
    }

    if (showGuideDialog) {
        ThermodynamicGuideDialog(
            onDismiss = { showGuideDialog = false }
        )
    }

    comparisonPair?.let { (roastA, roastB) ->
        RoastComparisonDialog(
            roastA = roastA,
            roastB = roastB,
            onDismiss = { comparisonPair = null }
        )
    }
}
