import { DateTime } from './libraries/simple-calendar/dateTime';
import { Log } from './logger/logger';
import { WeatherTracker } from './weather/weatherTracker';
import { Settings } from './settings';
import { ChatProxy } from './proxies/chatProxy';
import { defaultWeatherData, WeatherData } from './models/weatherData';
import { WeatherApplication } from './weatherApplication';

/**
 * The base class of the module.
 * Every FoundryVTT features must be injected in this so we can mcok them in tests.
 */
export class Weather {
  private weatherTracker: WeatherTracker;
  private settings: Settings;
  private weatherApplication: WeatherApplication;

  constructor(private gameRef: Game, private chatProxy: ChatProxy, private logger: Log) {
    this.settings = new Settings(this.gameRef);
    this.weatherTracker = new WeatherTracker(this.gameRef, this.chatProxy, this.settings);
    this.weatherApplication = new WeatherApplication(this.settings.getDateTime());
    this.logger.info('Init completed');
  }

  public onReady(): void {
    const weatherData = this.settings.getWeatherData();

    if (this.isWeatherDataValid(weatherData)) {
      this.logger.info('Using saved weather data');
      this.weatherTracker.loadWeatherData(this.settings.getWeatherData());
    } else {
      this.logger.info('No saved weather data - Using defaults');
      this.weatherTracker.loadWeatherData(defaultWeatherData);
      this.settings.setWeatherData(defaultWeatherData);
    }
  }

  public onDateTimeChange(dateTime: DateTime) {
    this.logger.debug('DateTime has changed', dateTime);

    if (this.dateHasChanged(dateTime)) {
      this.weatherTracker.generate();
    }

    this.updateWeatherDisplay(dateTime);
    this.settings.setDateTime(dateTime);
  }

  private dateHasChanged(dateTime: DateTime): boolean {
    const previous = this.settings.getDateTime();

    if (dateTime.day.number !== previous?.day.number
      || dateTime.month.number !== previous?.month.number
      || dateTime.year.number !== previous?.year.number) {
      return true;
    }

    return false;
  }

  private isWeatherDataValid(weatherData: WeatherData | ''): boolean {
    return this.settings.isSettingValueEmpty(weatherData);
  }

  private updateWeatherDisplay(dateTime: DateTime) {
    this.weatherApplication.updateDisplay(dateTime);
  }
}
