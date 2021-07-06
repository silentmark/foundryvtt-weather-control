import DevModeApi from './devMode/devModeApi';
import Log from './logger/logger';
import Weather from './weather';

const logger = new Log();
let weather;

/**
* Register module in Developer Mode module (https://github.com/League-of-Foundry-Developers/foundryvtt-devMode)
* No need to spam the console more than it already is, we hide them between a flag.
*/
Hooks.once('devModeReady', ({ registerPackageDebugFlag: registerPackageDebugFlag }: DevModeApi) => {
  console.log('DEV MODE READY');
  registerPackageDebugFlag('calendar-weather', 'level');

  try {
    logger.registerLevelCheckCallback(() => game.modules.get('_dev-mode')?.api?.getPackageDebugValue('calendar-weather', 'level'));
  // eslint-disable-next-line no-empty
  } catch (e) {}
});

Hooks.on('ready', () => {
  weather = new Weather(game, logger);
  weather.onReady();
});
