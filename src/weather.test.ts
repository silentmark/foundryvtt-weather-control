import { Log } from './logger/logger';
import { ChatProxy } from './proxies/chatProxy';
import { gameMock, mockClass } from './testUtils';
import { Weather } from './weather';

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

  it('SHOULD test', () => {
    expect(weather).toBeTruthy();
  });
});
