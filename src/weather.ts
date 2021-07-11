import { DateTime } from './libraries/simple-calendar/dateTime';
import { Log } from './logger/logger';
import { WeatherTracker } from './weather/weatherTracker';
import { Settings } from './settings';
import { ChatProxy } from './proxies/chatProxy';
import { defaultWeatherData } from './models/weatherData';

/**
 * The base class of the module.
 * Every FoundryVTT features must be injected in this so we can mcok them in tests.
 */
export class Weather {
  private weatherTracker: WeatherTracker;
  private settings: Settings;

  constructor(private gameRef: Game, private chatProxy: ChatProxy, private logger: Log) {
    this.settings = new Settings(this.gameRef);
    this.weatherTracker = new WeatherTracker(this.gameRef, this.chatProxy, this.settings);
    this.logger.info('Init completed');
  }

  public onReady(): void {
    const weatherData = this.settings.getWeatherData();
    const emptyWeatherData = '';

    if ((weatherData as any) === emptyWeatherData) {
      this.logger.info('Using saved weather data');
      this.weatherTracker.loadWeatherData(this.settings.getWeatherData());
    } else {
      this.logger.info('No saved weather data - Using defaults');
      this.weatherTracker.loadWeatherData(defaultWeatherData);
      this.settings.setWeatherData(defaultWeatherData);
    }
  }

  public onDateTimeChange(dateTimeData: DateTime) {
    this.logger.info('DateTime has changed', dateTimeData);
    this.weatherTracker.generate();
  }
}
