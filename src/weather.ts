import Log from './logger/logger';

/**
 * The base class of the module.
 * Every FoundryVTT features must be injected in this so we can mcok them in tests.
 */
export default class Weather {
  constructor(private gameRef: Game, private logger: Log) {
    this.logger.info('Init completed');
  }

  public onReady(): void {
    this.registerSettings();
  }

  private registerSettings(): void {
    this.gameRef.settings.register('calendar-weather', 'calendarPos', {
      name: 'Calendar Position',
      scope: 'world',
      config: false,
      type: Object,
    });
    this.gameRef.settings.register('calendar-weather', 'calendarDisplay', {
      name: this.gameRef.i18n.localize('cw.settings.CalDispNonGm'),
      hint: this.gameRef.i18n.localize('cw.settings.CalDispNonGmHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
    this.gameRef.settings.register('calendar-weather', 'weatherDisplay', {
      name: this.gameRef.i18n.localize('cw.settings.Weather2Chat'),
      hint: this.gameRef.i18n.localize('cw.settings.Weather2ChatHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
    this.gameRef.settings.register('calendar-weather', 'moonDisplay', {
      name: this.gameRef.i18n.localize('cw.setting.2Chat'),
      hint: this.gameRef.i18n.localize('cw.setting.2ChatHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
    this.gameRef.settings.register('calendar-weather', 'is24', {
      name: this.gameRef.i18n.localize('cw.settings.Display24H'),
      hint: this.gameRef.i18n.localize('cw.settings.Display24HHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
    this.gameRef.settings.register('calendar-weather', 'noGlobal', {
      name: this.gameRef.i18n.localize('cw.settings.NoGlobal'),
      hint: this.gameRef.i18n.localize('cw.settings.NoGlobalHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });
    this.gameRef.settings.register('calendar-weather', 'useCelcius', {
      name: this.gameRef.i18n.localize('cw.settings.useCelcius'),
      hint: this.gameRef.i18n.localize('cw.settings.useCelciusHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
    this.gameRef.settings.register('calendar-weather', 'playerSeeWeather', {
      name: this.gameRef.i18n.localize('cw.settings.playerSeeWeather'),
      hint: this.gameRef.i18n.localize('cw.settings.playerSeeWeatherHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
    this.gameRef.settings.register('calendar-weather', 'useSanctions', {
      name: this.gameRef.i18n.localize('cw.settings.useSanctions'),
      hint: this.gameRef.i18n.localize('cw.settings.useSanctionsHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  }
}
