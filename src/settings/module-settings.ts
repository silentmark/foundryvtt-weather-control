import moduleJson from '@module';

import { WeatherData } from '../models/weatherData';
import { WindowPosition } from '../models/windowPosition';

export enum SettingKeys {
  calendarDisplay = 'calendarDisplay',
  noticeVersion = 'noticeVersion',
  outputWeatherToChat = 'outputWeatherChat',
  playerSeeWeatherInfo = 'playerSeeWeatherInfo',
  useCelcius = 'useCelcius',
  weatherData = 'weatherData',
  windowPosition = 'windowPosition',
}

export class ModuleSettings {
  constructor(private gameRef: Game) {
    this.registerSettings();
  }

  public isSettingValueEmpty(setting: any): boolean {
    return Object.keys(setting).length === 0 || setting === null || setting === undefined;
  }

  public getModuleName(): string {
    return moduleJson.name;
  }

  public getVersion(): string {
    return moduleJson.version;
  }

  public getVersionsWithNotices(): Array<string> {
    return moduleJson.versionsWithNotices;
  }

  public getWeatherData(): WeatherData {
    return this.get(SettingKeys.weatherData);
  }

  public setWeatherData(value: WeatherData): Promise<void> {
    return this.set(SettingKeys.weatherData, value);
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

  public getUseCelcius(): boolean {
    return this.get(SettingKeys.useCelcius);
  }

  public getPlayerSeeWeather(): boolean {
    return this.get(SettingKeys.playerSeeWeatherInfo);
  }

  public getListOfReadNoticesVersions(): Array<string> {
    return this.get(SettingKeys.noticeVersion);
  }

  public addVersionToReadNotices(version: string) {
    const list = this.getListOfReadNoticesVersions();
    list.push(version);

    this.set(SettingKeys.noticeVersion, list);
  }

  private register(settingKey: string, settingConfig: ClientSettings.PartialSettingConfig) {
    this.gameRef.settings.register(this.getModuleName(), settingKey, settingConfig);
  }

  private get(settingKey: SettingKeys): any {
    return this.gameRef.settings.get(this.getModuleName(), settingKey);
  }

  private set(settingKey: SettingKeys, value: any): Promise<any> {
    return this.gameRef.settings.set(this.getModuleName(), settingKey, value);
  }

  private registerSettings(): void {
    this.register(SettingKeys.windowPosition, {
      name: 'Calendar Position',
      scope: 'client',
      config: false,
      type: Object,
      default: { top: 100, lefT: 100 }
    });

    this.register(SettingKeys.weatherData, {
      name: 'Weather Data',
      scope: 'world',
      config: false,
      type: Object,
      default: new WeatherData()
    });

    this.register(SettingKeys.weatherData + 'Backup', {
      name: 'Weather Data Backup',
      scope: 'world',
      config: false,
      type: Object,
      default: null
    });

    this.register(SettingKeys.noticeVersion, {
      name: 'Version of the last notice displayed',
      scope: 'world',
      config: false,
      type: Array,
      default: [],
    });

    this.register(SettingKeys.calendarDisplay, {
      name: this.gameRef.i18n.localize('wctrl.settings.DisplayWindowNonGM'),
      hint: this.gameRef.i18n.localize('wctrl.settings.DisplayWindowNonGMHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    this.register(SettingKeys.outputWeatherToChat, {
      name: this.gameRef.i18n.localize('wctrl.settings.OutputWeatherToChat'),
      hint: this.gameRef.i18n.localize('wctrl.settings.OutputWeatherToChatHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    this.register(SettingKeys.useCelcius, {
      name: this.gameRef.i18n.localize('wctrl.settings.useCelcius'),
      hint: this.gameRef.i18n.localize('wctrl.settings.useCelciusHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });

    this.register(SettingKeys.playerSeeWeatherInfo, {
      name: this.gameRef.i18n.localize('wctrl.settings.playerSeeWeather'),
      hint: this.gameRef.i18n.localize('wctrl.settings.playerSeeWeatherHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  }
}
