import { defaultWeatherData } from '../models/weatherData';
import { ChatProxy } from '../proxies/chatProxy';
import { Settings } from '../settings';
import { gameMock, mockClass } from '../testUtils';
import { WeatherTracker } from './weatherTracker';

const game = gameMock();

describe('WeatherTracker', () => {
  let weatherTracker: WeatherTracker;
  let settings;
  let chatProxy;

  beforeEach(() => {
    settings = mockClass(Settings);
    chatProxy = mockClass(ChatProxy);
    weatherTracker = new WeatherTracker(game, chatProxy, settings);
  });

  it('SHOULD exist', () => {
    expect(weatherTracker).toBeTruthy();
  });

  it('SHOULD output to chat when the setting is enabled', () => {
    weatherTracker.loadWeatherData(defaultWeatherData);
    settings.getOutputWeatherToChat.mockReturnValue(true)

    weatherTracker.generate();

    expect(chatProxy.create).toHaveBeenCalled();
  });

  it('SHOULD save weather data after generating', () => {
    weatherTracker.loadWeatherData(defaultWeatherData);

    weatherTracker.generate();

    expect(settings.setWeatherData).toHaveBeenCalled();
  });
});
