import Log from './logger/logger';
import Weather from './weather';

const gameMock = {
  settings: {
    register: jest.fn(),
  },
  i18n: {
    localize: jest.fn(),
  }
} as any;
jest.mock('./logger/logger.ts');

describe('Weather', () => {
  let weather: Weather;
  let log;

  beforeEach(() => {
    log = new Log();
    weather = new Weather(gameMock, log);
  });

  it('SHOULD test', () => {
    expect(weather).toBeTruthy();
  });

  it('SHOULD register settings when onReady is called', () => {
    weather.onReady();

    expect(gameMock.settings.register).toHaveBeenCalledTimes(9);
  });
});
