import moduleJson from '@module';

import { DateTime } from './libraries/simple-calendar/dateTime';
import { WeatherData } from './models/weatherData';
import { WindowPosition } from './models/windowPosition';

enum SettingKeys {
  calendarDisplay = 'calendarDisplay',
  windowPosition = 'windowPosition',
  legacyDateTime = 'legacyDateTime',
  dateTime = 'dateTime',
  is24h = 'is24',
  moonDisplay = 'moonDisplay',
  noGlobal = 'noGlobal',
  outputWeatherToChat = 'weatherDisplay',
  playerSeeWeather = 'playerSeeWeather',
  useCelcius = 'useCelcius',
  useSanctions = 'useSanctions',
  weatherData = 'weatherData',
}

export class ModuleSettings {
  constructor(private gameRef: Game) {
    this.registerSettings();
  }

  public isSettingValueEmpty(setting: any): boolean {
    return setting === '';
  }

  public getModuleName(): string {
    return moduleJson.name;
  }

  public getWeatherData(): WeatherData {
    return this.get(SettingKeys.weatherData);
  }

  public setWeatherData(value: WeatherData) {
    this.set(SettingKeys.weatherData, value);
  }

  /**
   * @deprecated
   * @returns CWDateTime data
   */
  public getLegacyDateTime(): any {
    return this.get(SettingKeys.legacyDateTime);
  }

  public getDateTime(): DateTime {
    return this.get(SettingKeys.dateTime);
  }

  public setDateTime(value: DateTime) {
    this.set(SettingKeys.dateTime, value);
  }

  public getWindowPosition(): WindowPosition {
    return this.get(SettingKeys.windowPosition);
  }

  public setWindowPosition(position: WindowPosition) {
    this.set(SettingKeys.windowPosition, position);
  }

  public getCalendarDisplay(): boolean {
    return this.get(SettingKeys.calendarDisplay);
  }

  public getOutputWeatherToChat(): boolean {
    return this.get(SettingKeys.outputWeatherToChat);
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

  private set(settingKey: SettingKeys, value: any) {
    this.gameRef.settings.set(this.getModuleName(), settingKey, value);
  }

  private registerSettings(): void {
    // Deprecated
    this.register(SettingKeys.legacyDateTime, {
      name: 'Date/Time Data',
      scope: 'world',
      config: false,
      type: Object,
    });

    this.register(SettingKeys.dateTime, {
      name: 'Date/Time Data',
      scope: 'world',
      config: false,
      type: Object,
    });

    this.register(SettingKeys.windowPosition, {
      name: 'Calendar Position',
      scope: 'client',
      config: false,
      type: Object,
    });

    this.register(SettingKeys.weatherData, {
      name: 'Weather Data',
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
    this.register(SettingKeys.outputWeatherToChat, {
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
