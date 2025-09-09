package org.ellie.assistant.ui;

import android.app.Application;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import java.util.List;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import org.ellie.assistant.audio.SpeechToTextManager;
import org.ellie.assistant.audio.TextToSpeechManager;
import org.ellie.assistant.nlp.IntentInterpreter;
import org.ellie.assistant.skills.Skill;

@ScopeMetadata
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast"
})
public final class MainViewModel_Factory implements Factory<MainViewModel> {
  private final Provider<Application> appProvider;

  private final Provider<SpeechToTextManager> sttProvider;

  private final Provider<TextToSpeechManager> ttsProvider;

  private final Provider<IntentInterpreter> interpreterProvider;

  private final Provider<List<? extends Skill>> skillsProvider;

  public MainViewModel_Factory(Provider<Application> appProvider,
      Provider<SpeechToTextManager> sttProvider, Provider<TextToSpeechManager> ttsProvider,
      Provider<IntentInterpreter> interpreterProvider,
      Provider<List<? extends Skill>> skillsProvider) {
    this.appProvider = appProvider;
    this.sttProvider = sttProvider;
    this.ttsProvider = ttsProvider;
    this.interpreterProvider = interpreterProvider;
    this.skillsProvider = skillsProvider;
  }

  @Override
  public MainViewModel get() {
    return newInstance(appProvider.get(), sttProvider.get(), ttsProvider.get(), interpreterProvider.get(), skillsProvider.get());
  }

  public static MainViewModel_Factory create(Provider<Application> appProvider,
      Provider<SpeechToTextManager> sttProvider, Provider<TextToSpeechManager> ttsProvider,
      Provider<IntentInterpreter> interpreterProvider,
      Provider<List<? extends Skill>> skillsProvider) {
    return new MainViewModel_Factory(appProvider, sttProvider, ttsProvider, interpreterProvider, skillsProvider);
  }

  public static MainViewModel newInstance(Application app, SpeechToTextManager stt,
      TextToSpeechManager tts, IntentInterpreter interpreter, List<? extends Skill> skills) {
    return new MainViewModel(app, stt, tts, interpreter, skills);
  }
}
