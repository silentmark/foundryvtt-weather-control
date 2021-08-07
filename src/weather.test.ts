import { Log } from './logger/logger';
import { Weather } from './weather';
import { gameMock, mockClass } from './testUtils';
import { ChatProxy } from './proxies/chatProxy';

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

  it('SHOULD render the calendar display', () => {
    const renderTemplateMock = jest.fn();
    global.renderTemplate = renderTemplateMock;

    weather.onReady();

    expect(renderTemplateMock).toHaveBeenCalled();
  });
});
