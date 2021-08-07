import DevModeApi from './libraries/devMode/devModeApi';
import { DateTime } from './libraries/simple-calendar/dateTime';
import { SimpleCalendarHooks } from './libraries/simple-calendar/hooks';
import { Log } from './logger/logger';
import { ChatProxy } from './proxies/chatProxy';
import { Weather } from './weather';

import '../styles/calendar.scss';

const logger = new Log();
const chatProxy = new ChatProxy();
let weather;

/**
* Register module in Developer Mode module (https://github.com/League-of-Foundry-Developers/foundryvtt-devMode)
* No need to spam the console more than it already is, we hide them between a flag.
*/
Hooks.once('devModeReady', ({ registerPackageDebugFlag: registerPackageDebugFlag }: DevModeApi) => {
  registerPackageDebugFlag('weather', 'level');

  try {
    logger.registerLevelCheckCallback(() => game.modules.get('_dev-mode')?.api?.getPackageDebugValue('weather', 'level'));
  // eslint-disable-next-line no-empty
  } catch (e) {}
});

Hooks.on('ready', () => {
  weather = new Weather(game, chatProxy, logger);
  weather.onReady();
});

Hooks.on(SimpleCalendarHooks.DateTimeChange, ({...data}: DateTime) => {
  weather.onDateTimeChange(data);
});
