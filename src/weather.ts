import { DateTime } from './libraries/simple-calendar/dateTime';
import { Log } from './logger/logger';
import { defaultWeatherData, WeatherData } from './models/weatherData';
import { ModuleSettings } from './module-settings';
import { ChatProxy } from './proxies/chatProxy';
import { WeatherTracker } from './weather/weatherTracker';
import { WeatherApplication } from './weatherApplication';

/**
 * The base class of the module.
 * Every FoundryVTT features must be injected in this so we can mcok them in tests.
 */
export class Weather {
  private weatherTracker: WeatherTracker;
  private settings: ModuleSettings;
  private weatherApplication: WeatherApplication;

  constructor(private gameRef: Game, private chatProxy: ChatProxy, private logger: Log) {
    this.settings = new ModuleSettings(this.gameRef);
    this.weatherTracker = new WeatherTracker(this.gameRef, this.chatProxy, this.settings);
    this.weatherApplication = new WeatherApplication(this.gameRef, this.settings, this.settings.getDateTime(), this.weatherTracker, this.logger);
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

  public onClockStartStop() {
    this.weatherApplication.updateClockStatus();
  }

  private dateHasChanged(dateTime: DateTime): boolean {
    const previous = this.settings.getDateTime()?.date;
    const date = dateTime.date;

    if (this.isDateTimeValid(dateTime)) {
      if (date.day !== previous.day
        || date.month !== previous.month
        || date.year !== previous.year) {
        return true;
      }
    }

    return false;
  }

  private isDateTimeValid(dateTime: DateTime): boolean {
    const date = dateTime.date;
    if (date.second && date.minute && date.minute &&
        date.day && date.month && date.year) {
      return true;
    }

    return false;
  }

  private isWeatherDataValid(weatherData: WeatherData | ''): boolean {
    return !this.settings.isSettingValueEmpty(weatherData);
  }

  private updateWeatherDisplay(dateTime: DateTime) {
    this.weatherApplication.updateDateTime(dateTime);
    this.weatherApplication.updateWeather(this.weatherTracker.getCurrentWeather());
  }
}
