import '../styles/notices.scss';
import '../styles/weather-control.scss';

import { DevMode } from './libraries/devMode/devMode';
import { DevModeApi } from './libraries/devMode/devModeApi';
import { DateTime } from './libraries/simple-calendar/dateTime';
import { SimpleCalendarHooks } from './libraries/simple-calendar/hooks';
import { Log } from './logger/logger';
import { ChatProxy } from './proxies/chatProxy';
import { Weather } from './weather';

const logger = new Log();
const chatProxy = new ChatProxy();
let weather: Weather;

function getGame(): Game {
  if(!(game instanceof Game)) {
    throw new Error('Game is not initialized yet!');
  }
  return game;
}

/**
* Register module in Developer Mode module (https://github.com/League-of-Foundry-Developers/foundryvtt-devMode)
* No need to spam the console more than it already is, we hide them between a flag.
*/
Hooks.once('devModeReady', ({ registerPackageDebugFlag: registerPackageDebugFlag }: DevModeApi) => {
  registerPackageDebugFlag('weather', 'level');
  const devModeModule: DevMode = getGame().modules.get('_dev-mode') as unknown as DevMode;

  try {
    logger.registerLevelCheckCallback(() => devModeModule?.api?.getPackageDebugValue('weather', 'level'));
  // eslint-disable-next-line no-empty
  } catch (e) {}
});

Hooks.on('ready', () => {
  weather = new Weather(getGame(), chatProxy, logger);
  weather.onReady();

  Hooks.on(SimpleCalendarHooks.DateTimeChange, ({...data}: DateTime) => {
    weather.onDateTimeChange(data);
  });

  Hooks.on(SimpleCalendarHooks.ClockStartStop, () => {
    weather.onClockStartStop();
  });
});
