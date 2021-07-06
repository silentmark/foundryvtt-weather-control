import { DateTime } from './libraries/simple-calendar/dateTime';
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

  public onDateTimeChange(dateTimeData: DateTime) {
    this.logger.info('DateTime has changed', dateTimeData);
  }

  private registerSettings(): void {
    this.gameRef.settings.register('weather', 'calendarPos', {
      name: 'Calendar Position',
      scope: 'world',
      config: false,
      type: Object,
    });

    // TODO: This one could become a setting called "Display weather in chat for GM only or all players"
    this.gameRef.settings.register('weather', 'calendarDisplay', {
      name: this.gameRef.i18n.localize('cw.settings.CalDispNonGm'),
      hint: this.gameRef.i18n.localize('cw.settings.CalDispNonGmHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    // TODO: This one might disappear. It currently is "Output weather to chat?"
    this.gameRef.settings.register('weather', 'weatherDisplay', {
      name: this.gameRef.i18n.localize('cw.settings.Weather2Chat'),
      hint: this.gameRef.i18n.localize('cw.settings.Weather2ChatHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    // TODO: This is going away
    this.gameRef.settings.register('weather', 'moonDisplay', {
      name: this.gameRef.i18n.localize('cw.setting.2Chat'),
      hint: this.gameRef.i18n.localize('cw.setting.2ChatHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    // TODO: This is going away
    this.gameRef.settings.register('weather', 'is24', {
      name: this.gameRef.i18n.localize('cw.settings.Display24H'),
      hint: this.gameRef.i18n.localize('cw.settings.Display24HHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });

    // TODO: Currently is "Disable Global Illumination at Night". We might want to continue modifying world light level.
    // Simple Calendar or Small Time probably already does this, we could hook on it.
    this.gameRef.settings.register('weather', 'noGlobal', {
      name: this.gameRef.i18n.localize('cw.settings.NoGlobal'),
      hint: this.gameRef.i18n.localize('cw.settings.NoGlobalHelp'),
      scope: 'world',
      config: true,
      default: true,
      type: Boolean,
    });

    // TODO: This one will stay. It is called "Use Celcius"
    this.gameRef.settings.register('weather', 'useCelcius', {
      name: this.gameRef.i18n.localize('cw.settings.useCelcius'),
      hint: this.gameRef.i18n.localize('cw.settings.useCelciusHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });

    // TODO: Called "Can Players see the Weather". Not yet sure what it does, switching it does not change anything.
    this.gameRef.settings.register('weather', 'playerSeeWeather', {
      name: this.gameRef.i18n.localize('cw.settings.playerSeeWeather'),
      hint: this.gameRef.i18n.localize('cw.settings.playerSeeWeatherHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });

    // TODO: This one will go away. We don't support moons anymore.
    this.gameRef.settings.register('weather', 'useSanctions', {
      name: this.gameRef.i18n.localize('cw.settings.useSanctions'),
      hint: this.gameRef.i18n.localize('cw.settings.useSanctionsHelp'),
      scope: 'world',
      config: true,
      default: false,
      type: Boolean,
    });
  }
}
