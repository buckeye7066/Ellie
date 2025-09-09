package org.ellie.assistant.core;

import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import org.ellie.assistant.nlp.IntentInterpreter;

@ScopeMetadata("javax.inject.Singleton")
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
public final class AppModule_ProvideInterpreterFactory implements Factory<IntentInterpreter> {
  @Override
  public IntentInterpreter get() {
    return provideInterpreter();
  }

  public static AppModule_ProvideInterpreterFactory create() {
    return InstanceHolder.INSTANCE;
  }

  public static IntentInterpreter provideInterpreter() {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideInterpreter());
  }

  private static final class InstanceHolder {
    private static final AppModule_ProvideInterpreterFactory INSTANCE = new AppModule_ProvideInterpreterFactory();
  }
}
