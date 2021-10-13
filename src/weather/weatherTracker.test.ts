import { WeatherData } from '../models/weatherData';
import { ChatProxy } from '../proxies/chatProxy';
import { ModuleSettings } from '../settings/module-settings';
import { gameMock, mockClass } from '../testUtils';
import { WeatherTracker } from './weatherTracker';

const game = gameMock();

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

describe('WeatherTracker', () => {
  let weatherTracker: WeatherTracker;
  let settings;
  let chatProxy;

  beforeEach(() => {
    settings = mockClass(ModuleSettings);
    chatProxy = mockClass(ChatProxy);
    weatherTracker = new WeatherTracker(game, chatProxy, settings);
  });

  it('SHOULD exist', () => {
    expect(weatherTracker).toBeTruthy();
  });

  it('SHOULD output to chat when the setting is enabled', () => {
    (chatProxy.getWhisperRecipients as jest.Mock).mockReturnValue([{_id: '0'}]);
    weatherTracker.loadWeatherData(WEATHER_DATA);
    settings.getOutputWeatherToChat.mockReturnValue(true);

    weatherTracker.generate();

    expect(chatProxy.create).toHaveBeenCalled();
  });

  it('SHOULD save weather data after generating', () => {
    weatherTracker.loadWeatherData(WEATHER_DATA);
    weatherTracker.generate();
    expect(settings.setWeatherData).toHaveBeenCalled();
  });

  it('SHOULD return the current weather information', () => {
    weatherTracker.loadWeatherData(WEATHER_DATA);
    weatherTracker.generate();

    const currentWeather = weatherTracker.getCurrentWeather();

    expect(currentWeather).toBeTruthy();
  });
});
