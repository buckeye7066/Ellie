package org.ellie.assistant.audio

import android.content.Context
import android.speech.tts.TextToSpeech

/**
 * Thin wrapper around [TextToSpeech] used by the avatar
 * to speak responses.
 */
class TextToSpeechManager(private val context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = TextToSpeech(context, this)

    override fun onInit(status: Int) {
        // Configure language or voice once the engine is ready
    }

    /** Speak the supplied [text] immediately. */
    fun speak(text: String) {
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "ellie")
    }

    /** Shut down the TTS engine to free resources. */
    fun shutdown() {
        tts?.shutdown()
        tts = null
    }

    companion object
}
