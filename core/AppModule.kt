package org.ellie.assistant.core

import android.content.Context
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import org.ellie.assistant.audio.SpeechToTextManager
import org.ellie.assistant.audio.TextToSpeechManager
import org.ellie.assistant.nlp.IntentInterpreter
import org.ellie.assistant.skills.Skill

/**
 * Application level dependency bindings for the assistant.
 */
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    fun provideTTS(context: Context): TextToSpeechManager =
        TextToSpeechManager(context)

    @Provides
    fun provideSTT(context: Context): SpeechToTextManager =
        SpeechToTextManager(context)

    @Provides
    fun provideInterpreter(): IntentInterpreter = IntentInterpreter()

    @Provides
    fun provideSkills(context: Context): List<Skill> = emptyList()
}
