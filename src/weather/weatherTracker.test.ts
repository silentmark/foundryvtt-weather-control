import { defaultWeatherData } from '../models/weatherData';
import { ModuleSettings } from '../module-settings';
import { ChatProxy } from '../proxies/chatProxy';
import { gameMock, mockClass } from '../testUtils';
import { WeatherTracker } from './weatherTracker';

const game = gameMock();

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
    weatherTracker.loadWeatherData(defaultWeatherData);
    settings.getOutputWeatherToChat.mockReturnValue(true);

    weatherTracker.generate();

    expect(chatProxy.create).toHaveBeenCalled();
  });

  it('SHOULD save weather data after generating', () => {
    weatherTracker.loadWeatherData(defaultWeatherData);
    weatherTracker.generate();
    expect(settings.setWeatherData).toHaveBeenCalled();
  });

  it('SHOULD return the current weather information', () => {
    weatherTracker.loadWeatherData(defaultWeatherData);
    weatherTracker.generate();

    const currentWeather = weatherTracker.getCurrentWeather();

    expect(currentWeather).toBeTruthy();
  });
});
