import Log from './logger/logger';
import Weather from './weather';
import { gameMock } from './testUtils';

const game = gameMock();
jest.mock('./logger/logger.ts');

describe('Weather', () => {
  let weather: Weather;
  let log;

  beforeEach(() => {
    log = new Log();
    weather = new Weather(game, log);
  });

  it('SHOULD test', () => {
    expect(weather).toBeTruthy();
  });
});
