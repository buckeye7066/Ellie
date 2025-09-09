package org.ellie.assistant.audio

import android.content.Context
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

/**
 * Simple speech-to-text wrapper that exposes the latest
 * partial and final transcription through [StateFlow].
 *
 * This implementation only contains placeholders for the
 * actual Android speech recognition wiring.
 */
class SpeechToTextManager(private val context: Context) {
    private val _partial = MutableStateFlow("")
    val partial: StateFlow<String> = _partial

    private val _finalText = MutableStateFlow("")
    val finalText: StateFlow<String> = _finalText

    /** Start listening for speech input. */
    fun startListening(language: String? = null) {
        _partial.value = ""
        _finalText.value = ""
        // Real implementation would connect to Android's SpeechRecognizer
    }

    /** Stop listening without clearing previous results. */
    fun stopListening() {
        // Real implementation would stop the SpeechRecognizer
    }

    /** Release any underlying resources. */
    fun destroy() {
        stopListening()
    }
}
