package org.ellie.assistant.core;

import android.content.Context;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import java.util.List;
import javax.annotation.processing.Generated;
import javax.inject.Provider;
import org.ellie.assistant.skills.Skill;

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
public final class AppModule_ProvideSkillsFactory implements Factory<List<? extends Skill>> {
  private final Provider<Context> contextProvider;

  public AppModule_ProvideSkillsFactory(Provider<Context> contextProvider) {
    this.contextProvider = contextProvider;
  }

  @Override
  public List<? extends Skill> get() {
    return provideSkills(contextProvider.get());
  }

  public static AppModule_ProvideSkillsFactory create(Provider<Context> contextProvider) {
    return new AppModule_ProvideSkillsFactory(contextProvider);
  }

  public static List<? extends Skill> provideSkills(Context context) {
    return Preconditions.checkNotNullFromProvides(AppModule.INSTANCE.provideSkills(context));
  }
}
