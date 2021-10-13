import { WeatherApplication } from './applications/weatherApplication';
import { Date, DateTime } from './libraries/simple-calendar/dateTime';
import { Log } from './logger/logger';
import { WeatherData } from './models/weatherData';
import { ChatProxy } from './proxies/chatProxy';
import { ModuleSettings } from './settings/module-settings';
import { gameMock, mockClass } from './testUtils';
import { Weather } from './weather';
import { WeatherTracker } from './weather/weatherTracker';

const WEATHER_DATA: WeatherData = {
  version: 1,
  dateTime: {
    date: {
      currentSeason: null,
      day: 1,
      dayOfTheWeek: 1,
      dayOffset: 0,
      display: null,
      hour: 0,
      isLeapYear: false,
      minute: 0,
      month: 0,
      second: 0,
      showWeekdayHeadings: false,
      weekdays: [],
      year: 0,
      yearZero: 0,
    },
    moons: null
  },
  cTemp:  null,
  climate: null,
  isVolcanic: false,
  lastTemp: 50,
  precipitation: null,
  temp: 50,
  tempRange: { min: 30, max: 90 },
};

describe('Weather', () => {
  let weather: Weather;
  let log;
  let game;
  let chatProxy;

  beforeEach(() => {
    game = gameMock();
    log = mockClass(Log);
    chatProxy = mockClass(ChatProxy);
    weather = new Weather(game, chatProxy, log);
  });

  it('SHOULD call the weatherTracker when weather need to be generated', () => {
    game.user = { isGM: true };
    givenAWeatherApplicationMock();
    givenModuleSettingsWithDateTime();
    const weatherTracker = getWeatherTracker();
    weatherTracker.generate = jest.fn().mockReturnValue(WEATHER_DATA);

    weather.onDateTimeChange(givenADifferentDateTime());

    expect(weatherTracker.generate).toHaveBeenCalled();
  });

  it('SHOULD NOT call weatherTracker when the date does not change', () => {
    game.user = { isGM: true };
    givenAWeatherApplicationMock();
    givenModuleSettingsWithDateTime();
    const weatherTracker = getWeatherTracker();
    weatherTracker.generate = jest.fn();

    weather.onDateTimeChange(givenADifferentTime());

    expect(weatherTracker.generate).not.toHaveBeenCalled();
  });

  it('SHOULD NOT call weatherTracker when the new date object is partially undefined', () => {
    game.user = { isGM: true };
    givenAWeatherApplicationMock();
    givenModuleSettingsWithDateTime();
    const weatherTracker = getWeatherTracker();
    weatherTracker.generate = jest.fn();
    const invalidDateObject = givenADifferentDateTime();
    delete invalidDateObject.date.day;

    weather.onDateTimeChange(invalidDateObject);

    expect(weatherTracker.generate).not.toHaveBeenCalled();
  });

  it('SHOULD call weatherTracker when the previous date object is partially undefined', () => {
    game.user = { isGM: true };
    givenAWeatherApplicationMock();
    const invalidDateObject = givenADateTime();
    delete invalidDateObject.date.day;
    givenModuleSettingsWithDateTime();
    const weatherTracker = getWeatherTracker();
    weatherTracker.generate = jest.fn().mockReturnValue(WEATHER_DATA);

    weather.onDateTimeChange(givenADifferentDateTime());

    expect(weatherTracker.generate).toHaveBeenCalled();
  });

  describe('weather application', () => {
    it('SHOULD be instantiated if the user is the GM', () => {
      givenModuleSettingsWithDateTime();
      game.user = { isGM: true };

      weather.onReady();

      expect(getWeatherApplication()).toBeDefined();
    });

    it('SHOULD be instantiated if the setting is turned on AND the user is not a GM', () => {
      const settings = givenModuleSettingsWithDateTime();
      settings.getCalendarDisplay = jest.fn().mockReturnValue(true);
      game.user = { isGM: false };

      weather.onReady();

      expect(getWeatherApplication()).toBeDefined();
    });

    it('SHOULD NOT be intantiated if the setting is turned off and the user is a player', () => {
      const settings = givenModuleSettingsWithDateTime();
      settings.getCalendarDisplay = jest.fn().mockReturnValue(false);
      game.user = { isGM: false };

      weather.onReady();

      expect(getWeatherApplication()).toBeUndefined();
    });
  });

  describe('onClockStartStop', () => {
    it('SHOULD call weather application WHEN user is a GM', () => {
      game.user = { isGM: true };
      weather = new Weather(game, chatProxy, log);
      const weatherApplication = givenAWeatherApplicationMock();

      weather.onClockStartStop();

      expect(weatherApplication.updateClockStatus).toHaveBeenCalled();
    });

    it('SHOULD call weather application WHEN user is allowed to see the window', () => {
      game.user = { isGM: false };
      weather = new Weather(game, chatProxy, log);
      givenCalendarDisplaySetting(true);
      const weatherApplication = givenAWeatherApplicationMock();

      weather.onClockStartStop();

      expect(weatherApplication.updateClockStatus).toHaveBeenCalled();
    });

    it('SHOULD NOT call weather application WHEN user is not allowed to see the window', () => {
      game.user = { isGM: false };
      weather = new Weather(game, chatProxy, log);
      givenCalendarDisplaySetting(false);
      const weatherApplication = givenAWeatherApplicationMock();

      weather.onClockStartStop();

      expect(weatherApplication.updateClockStatus).not.toHaveBeenCalled();
    });
  });

  function getModuleSettings(): ModuleSettings {
    return weather['settings'];
  }

  function givenModuleSettingsWithDateTime(): ModuleSettings {
    const settings = getModuleSettings();
    settings.getWeatherData = jest.fn().mockReturnValue({ dateTime: givenADateTime() });

    return settings;
  }

  function givenCalendarDisplaySetting(allowed: boolean) {
    const settings = getModuleSettings();
    settings.getCalendarDisplay = jest.fn().mockReturnValue(allowed);
  }

  function getWeatherTracker(): WeatherTracker {
    return weather['weatherTracker'];
  }

  function givenAWeatherApplicationMock() {
    weather['weatherApplication'] = mockClass(WeatherApplication);
    return getWeatherApplication();
  }

  function getWeatherApplication(): WeatherApplication {
    return weather['weatherApplication'];
  }

  function givenADateTime(): DateTime {
    const dateTime = new DateTime();
    dateTime.date = new Date();
    dateTime.date.day = 1;
    dateTime.date.month = 2;
    dateTime.date.year = 3;
    dateTime.date.second = 4;
    dateTime.date.minute = 5;
    dateTime.date.hour = 6;

    return dateTime;
  }

  function givenADifferentTime(): DateTime {
    const dateTime = givenADateTime();
    dateTime.date.second = 22;
    dateTime.date.minute = 23;
    dateTime.date.hour = 24;

    return dateTime;
  }

  function givenADifferentDateTime(): DateTime {
    const dateTime = new DateTime();
    dateTime.date = new Date();
    dateTime.date.day = 11;
    dateTime.date.month = 12;
    dateTime.date.year = 13;
    dateTime.date.second = 14;
    dateTime.date.minute = 15;
    dateTime.date.hour = 16;

    return dateTime;
  }
});
