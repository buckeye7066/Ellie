package org.ellie.assistant.core;

import android.content.Context;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import org.ellie.assistant.audio.SpeechToTextManager;

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
public final class AppModule_ProvideSTTFactory implements Factory<SpeechToTextManager> {
  private final Provider<Context> contextProvider;

  public AppModule_ProvideSTTFactory(Provider<Context> contextProvider) {
    this.contextProvider = contextProvider;
  }

  @Override
  public SpeechToTextManager get() {
    return provideSTT(contextProvider.get());
  }

  public static AppModule_ProvideSTTFactory create(Provider<Context> contextProvider) {
    return new AppModule_ProvideSTTFactory(contextProvider);
  }

  public static SpeechToTextManager provideSTT(Context context) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideSTT(context));
  }
}
