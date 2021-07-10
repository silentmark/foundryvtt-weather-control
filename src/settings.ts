
enum SettingKeys {
  dateTime = 'dateTime',
  calendarPosition = 'calendarPos',
  calendarDisplay = 'calendarDisplay',
  weatherDisplay = 'weatherDisplay',
  moonDisplay = 'moonDisplay',
  is24h = 'is24',
  noGlobal = 'noGlobal',
  useCelcius = 'useCelcius',
  playerSeeWeather = 'playerSeeWeather',
  useSanctions = 'useSanctions',
}

export default class Settings {
  private packageJson = require('../package.json');

  constructor(private gameRef: Game) {
    this.registerSettings();
  }

  public getModuleName(): string {
    return this.packageJson.name;
  }

  public getDateTime(): any {// TODO: Need to define an interface for this
    return this.get(SettingKeys.dateTime);
  }

  public getCalendarPosition(): any { // TODO: Need to define an interface for this
    return this.get(SettingKeys.calendarPosition);
  }

  public getCalendarDisplay(): boolean {
    return this.get(SettingKeys.calendarDisplay);
  }

  public getWeatherDisplay(): boolean {
    return this.get(SettingKeys.weatherDisplay);
  }

  public getMoonDisplay(): boolean {
    return this.get(SettingKeys.moonDisplay);
  }

  public getIs24H(): boolean {
    return this.get(SettingKeys.is24h);
  }

  public getNoGlobal(): boolean {
    return this.get(SettingKeys.noGlobal);
  }

  public getUseCelcius(): boolean {
    return this.get(SettingKeys.useCelcius);
  }

  public getPlayerSeeWeather(): boolean {
    return this.get(SettingKeys.playerSeeWeather);
  }

  public getUseSanctions(): boolean {
    return this.get(SettingKeys.useSanctions);
  }

  private register(settingKey: string, settingConfig: ClientSettings.PartialSetting) {
    this.gameRef.settings.register(this.getModuleName(), settingKey, settingConfig);
  }

  private get(settingKey: SettingKeys): any {
    return this.gameRef.settings.get(this.getModuleName(), settingKey);
  }

  private registerSettings(): void {
    this.register(SettingKeys.dateTime, {
      name: 'Date/Time Data',
      scope: 'world',
      config: false,
      type: Object,
    });

    this.register(SettingKeys.calendarPosition, {
      name: 'Calendar Position',
      scope: 'world',
      config: false,
      type: Object,
    });

    // TODO: This one could become a setting called "Display weather in chat for GM only or all players"
    this.register(SettingKeys.calendarDisplay, {
      name: this.gameRef.i18n.localize('cw.settings.CalDispNonGm'),
      hint: this.gameRef.i18n.localize('cw.settings.CalDispNonGmHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    // TODO: This one might disappear. It currently is "Output weather to chat?"
    this.register(SettingKeys.weatherDisplay, {
      name: this.gameRef.i18n.localize('cw.settings.Weather2Chat'),
      hint: this.gameRef.i18n.localize('cw.settings.Weather2ChatHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    // TODO: This is going away
    this.register(SettingKeys.moonDisplay, {
      name: this.gameRef.i18n.localize('cw.setting.2Chat'),
      hint: this.gameRef.i18n.localize('cw.setting.2ChatHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    // TODO: This is going away
    this.register(SettingKeys.is24h, {
      name: this.gameRef.i18n.localize('cw.settings.Display24H'),
      hint: this.gameRef.i18n.localize('cw.settings.Display24HHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });

    // TODO: Currently is "Disable Global Illumination at Night". We might want to continue modifying world light level.
    // Simple Calendar or Small Time probably already does this, we could hook on it.
    this.register(SettingKeys.noGlobal, {
      name: this.gameRef.i18n.localize('cw.settings.NoGlobal'),
      hint: this.gameRef.i18n.localize('cw.settings.NoGlobalHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    // TODO: This one will stay. It is called "Use Celcius"
    this.register(SettingKeys.useCelcius, {
      name: this.gameRef.i18n.localize('cw.settings.useCelcius'),
      hint: this.gameRef.i18n.localize('cw.settings.useCelciusHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });

    // TODO: Called "Can Players see the Weather". Not yet sure what it does, switching it does not change anything.
    this.register(SettingKeys.playerSeeWeather, {
      name: this.gameRef.i18n.localize('cw.settings.playerSeeWeather'),
      hint: this.gameRef.i18n.localize('cw.settings.playerSeeWeatherHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });

    // TODO: This one will go away. We don't support moons anymore.
    this.register(SettingKeys.useSanctions, {
      name: this.gameRef.i18n.localize('cw.settings.useSanctions'),
      hint: this.gameRef.i18n.localize('cw.settings.useSanctionsHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  }
}
