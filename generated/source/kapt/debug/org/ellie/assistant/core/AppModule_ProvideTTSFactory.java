package org.ellie.assistant.core;

import android.content.Context;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import org.ellie.assistant.audio.TextToSpeechManager;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata("dagger.hilt.android.qualifiers.ApplicationContext")
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
public final class AppModule_ProvideTTSFactory implements Factory<TextToSpeechManager> {
  private final Provider<Context> contextProvider;

  public AppModule_ProvideTTSFactory(Provider<Context> contextProvider) {
    this.contextProvider = contextProvider;
  }

  @Override
  public TextToSpeechManager get() {
    return provideTTS(contextProvider.get());
  }

  public static AppModule_ProvideTTSFactory create(Provider<Context> contextProvider) {
    return new AppModule_ProvideTTSFactory(contextProvider);
  }

  public static TextToSpeechManager provideTTS(Context context) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideTTS(context));
  }
}
