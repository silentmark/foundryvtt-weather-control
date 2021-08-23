import { WeatherApplication } from './applications/weatherApplication';
import { Date, DateTime } from './libraries/simple-calendar/dateTime';
import { Log } from './logger/logger';
import { ModuleSettings } from './module-settings';
import { ChatProxy } from './proxies/chatProxy';
import { gameMock, mockClass } from './testUtils';
import { Weather } from './weather';
import { WeatherTracker } from './weather/weatherTracker';

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
    givenAWeatherApplicationMock();
    givenModuleSettingsWithDateTime();
    const weatherTracker = getWeatherTracker();
    weatherTracker.generate = jest.fn();

    weather.onDateTimeChange(givenADifferentDateTime());

    expect(weatherTracker.generate).toHaveBeenCalled();
  });

  it('SHOULD NOT call weatherTracker when the date does not change', () => {
    givenAWeatherApplicationMock();
    givenModuleSettingsWithDateTime();
    const weatherTracker = getWeatherTracker();
    weatherTracker.generate = jest.fn();

    weather.onDateTimeChange(givenADifferentTime());

    expect(weatherTracker.generate).not.toHaveBeenCalled();
  });

  it('SHOULD NOT call weatherTracker when the new date object is partially undefined', () => {
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
    givenAWeatherApplicationMock();
    const invalidDateObject = givenADateTime();
    delete invalidDateObject.date.day;
    givenModuleSettingsWithDateTime();
    const weatherTracker = getWeatherTracker();
    weatherTracker.generate = jest.fn();

    weather.onDateTimeChange(givenADifferentDateTime());

    expect(weatherTracker.generate).toHaveBeenCalled();
  });

  function givenModuleSettingsWithDateTime(): ModuleSettings {
    const settings = weather['settings'];
    settings.getWeatherData = jest.fn().mockReturnValue({ dateTime: givenADateTime() });

    return settings;
  }

  function getWeatherTracker(): WeatherTracker {
    return weather['weatherTracker'];
  }

  function givenAWeatherApplicationMock() {
    weather['weatherApplication'] = mockClass(WeatherApplication);
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
