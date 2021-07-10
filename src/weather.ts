import { DateTime } from './libraries/simple-calendar/dateTime';
import Log from './logger/logger';
import WeatherTracker from './weather/weatherTracker';
import Settings from './settings';

/**
 * The base class of the module.
 * Every FoundryVTT features must be injected in this so we can mcok them in tests.
 */
export default class Weather {
  private weatherTracker: WeatherTracker;
  private settings: Settings;

  constructor(private gameRef: Game, private logger: Log) {
    this.settings = new Settings(this.gameRef);
    this.weatherTracker = new WeatherTracker(this.settings);
    this.logger.info('Init completed');
  }

  public onReady(): void {
    this.weatherTracker.loadWeatherData(this.gameRef.settings.get('calendar-weather', 'dateTime') as any);
  }

  public onDateTimeChange(dateTimeData: DateTime) {
    this.logger.info('DateTime has changed', dateTimeData);
    this.weatherTracker.generate();
  }
}
