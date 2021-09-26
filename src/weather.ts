import { WeatherApplication } from './applications/weatherApplication';
import { SimpleCalendarApi } from './libraries/simple-calendar/api';
import { DateTime } from './libraries/simple-calendar/dateTime';
import { Log } from './logger/logger';
import { Climates, WeatherData } from './models/weatherData';
import { ModuleSettings } from './module-settings';
import { Notices } from './notices/notices';
import { ChatProxy } from './proxies/chatProxy';
import { WeatherTracker } from './weather/weatherTracker';

/**
 * The base class of the module.
 * Every FoundryVTT features must be injected in this so we can mcok them in tests.
 */
export class Weather {
  private weatherTracker: WeatherTracker;
  private settings: ModuleSettings;
  private weatherApplication: WeatherApplication;
  private notices: Notices;

  constructor(private gameRef: Game, private chatProxy: ChatProxy, private logger: Log) {
    this.settings = new ModuleSettings(this.gameRef);
    this.weatherTracker = new WeatherTracker(this.gameRef, this.chatProxy, this.settings);

    this.logger.info('Init completed');
  }

  public onReady() {
    this.initializeNotices();
    this.initializeWeatherData();
    this.initializeWeatherApplication();
  }

  public onDateTimeChange(dateTime: DateTime) {
    this.logger.info('DateTime has changed', dateTime);
    let weather = this.mergePreviousDateTimeWithNewOne(dateTime);

    if (this.hasDateChanged(dateTime) && this.gameRef.user.isGM) {
      weather = this.weatherTracker.generate();
      weather.dateTime.date.day = dateTime.date.day;
      weather.dateTime.date.month = dateTime.date.month;
      weather.dateTime.date.year = dateTime.date.year;
      this.logger.info('Generated new weather');
    }

    if (this.gameRef.user.isGM) {
      this.settings.setWeatherData(weather);
    }

    if (this.isWeatherApplicationAvailable()) {
      this.logger.debug('Update weather display');
      this.updateWeatherDisplay(dateTime);
    }
  }

  public onClockStartStop() {
    if (this.isWeatherApplicationAvailable()) {
      this.weatherApplication.updateClockStatus();
    }
  }

  public resetWindowPosition() {
    if (this.isWeatherApplicationAvailable()) {
      this.weatherApplication.resetPosition();
    }
  }

  private isWeatherApplicationAvailable(): boolean {
    return this.settings.getCalendarDisplay() || this.gameRef.user.isGM;
  }

  private initializeNotices() {
    if (this.gameRef.user.isGM) {
      this.notices = new Notices(this.gameRef, this.settings);
      this.notices.checkForNotices();
    }
  }

  private initializeWeatherData() {
    const weatherData = this.settings.getWeatherData();

    if (this.isWeatherDataValid(weatherData)) {
      this.logger.info('Using saved weather data');
      this.weatherTracker.loadWeatherData(weatherData);
    } else {
      this.logger.info('No saved weather data - Generating weather');

      const baseWeatherData = new WeatherData();
      baseWeatherData.dateTime.date = SimpleCalendarApi.timestampToDate(SimpleCalendarApi.timestamp());

      this.weatherTracker.loadWeatherData(baseWeatherData);
      this.weatherTracker.generate(Climates.temperate);
    }
  }

  private initializeWeatherApplication() {
    if (this.isWeatherApplicationAvailable()) {
      this.weatherApplication = new WeatherApplication(
        this.gameRef,
        this.settings,
        this.weatherTracker,
        this.logger,
        () => {
          this.weatherApplication.updateDateTime(this.weatherTracker.getCurrentWeather().dateTime);
          this.weatherApplication.updateWeather(this.weatherTracker.getCurrentWeather());
        });
    }
  }

  private mergePreviousDateTimeWithNewOne(dateTime: DateTime): WeatherData {
    return Object.assign({}, this.settings.getWeatherData(), {dateTime});
  }

  private hasDateChanged(dateTime: DateTime): boolean {
    const previous = this.settings.getWeatherData().dateTime?.date;
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
    if (this.isDefined(date.second) && this.isDefined(date.minute) && this.isDefined(date.day) &&
    this.isDefined(date.month) && this.isDefined(date.year)) {
      return true;
    }

    return false;
  }

  private isDefined(value: unknown) {
    return value !== undefined && value !== null;
  }

  private isWeatherDataValid(weatherData: WeatherData | ''): boolean {
    return !this.settings.isSettingValueEmpty(weatherData);
  }

  private updateWeatherDisplay(dateTime: DateTime) {
    this.weatherApplication.updateDateTime(dateTime);
    this.weatherApplication.updateWeather(this.weatherTracker.getCurrentWeather());
  }
}
