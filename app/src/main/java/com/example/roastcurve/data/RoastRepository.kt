package com.example.roastcurve.data

import com.example.roastcurve.engine.DiagnosticsEngine
import com.example.roastcurve.model.SavedRoastRecord
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

object RoastRepository {

    private val _savedRoasts = MutableStateFlow<List<SavedRoastRecord>>(emptyList())
    val savedRoasts: StateFlow<List<SavedRoastRecord>> = _savedRoasts.asStateFlow()

    init {
        // Pre-populate with initial demonstration roasts
        val initialList = PresetsData.PRESETS.map { preset ->
            val diag = DiagnosticsEngine.diagnose(
                beanProfile = preset.beanProfile,
                telemetry = preset.telemetry,
                sensoryDefect = preset.sensoryDefect,
                cuppingScores = preset.cuppingScores,
                appearance = preset.appearance,
                notes = preset.notes
            )
            SavedRoastRecord(
                id = preset.id,
                timestamp = System.currentTimeMillis() - (PresetsData.PRESETS.indexOf(preset) * 86400000L),
                title = preset.titleAr,
                beanProfile = preset.beanProfile,
                sensoryDefect = preset.sensoryDefect,
                cuppingScores = preset.cuppingScores,
                appearance = preset.appearance,
                diagnosis = diag
            )
        }
        _savedRoasts.value = initialList
    }

    fun saveRoast(record: SavedRoastRecord) {
        val current = _savedRoasts.value.toMutableList()
        current.removeAll { it.id == record.id }
        current.add(0, record)
        _savedRoasts.value = current
    }

    fun deleteRoast(id: String) {
        val current = _savedRoasts.value.toMutableList()
        current.removeAll { it.id == id }
        _savedRoasts.value = current
    }

    fun getRoast(id: String): SavedRoastRecord? {
        return _savedRoasts.value.find { it.id == id }
    }
}
