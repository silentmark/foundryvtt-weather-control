import '../styles/notices.scss';
import '../styles/weather-control.scss';

import { DevMode } from './libraries/devMode/devMode';
import { DevModeApi } from './libraries/devMode/devModeApi';
import { DateTime } from './libraries/simple-calendar/dateTime';
import { SimpleCalendarHooks } from './libraries/simple-calendar/hooks';
import { SimpleCalendarPresenter } from './libraries/simple-calendar/simple-calendar-presenter';
import { Log } from './logger/logger';
import { Notices } from './notices/notices';
import { ChatProxy } from './proxies/chatProxy';
import { Migrations } from './settings/migrations';
import { Migration1 } from './settings/migrations/migration-1';
import { ModuleSettings } from './settings/module-settings';
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
  registerPackageDebugFlag('weather-control', 'level');
  const devModeModule: DevMode = getGame().modules.get('_dev-mode') as unknown as DevMode;

  try {
    logger.registerLevelCheckCallback(() => devModeModule?.api?.getPackageDebugValue('weather-control', 'level'));
  // eslint-disable-next-line no-empty
  } catch (e) {}
});

Hooks.on('simple-calendar-ready', () => {
  initializeModule();
});

function initializeModule() {
  const moduleSettings = new ModuleSettings(getGame());
  initializeNotices(moduleSettings);
  applyMigrations(moduleSettings).then(() => {
    weather = new Weather(getGame(), chatProxy, logger, moduleSettings);

    Hooks.on(SimpleCalendarHooks.DateTimeChange, ({...data}: DateTime) => {
      weather.onDateTimeChange(SimpleCalendarPresenter.createDateObject(data.date));
    });

    Hooks.on(SimpleCalendarHooks.ClockStartStop, () => {
      weather.onClockStartStop();
    });

    weather.onReady();
  });
}

function applyMigrations(settings: ModuleSettings): Promise<void> {
  return new Promise((resolve) => {
    const migrations = new Migrations(logger);
    migrations.register(new Migration1());

    const weatherData = settings.getWeatherData();
    const migratedData = migrations.run(weatherData.version, weatherData);

    if (migratedData) {
      logger.info('Saving migrated data');
      settings.setWeatherData(migratedData).then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
}

function initializeNotices(settings: ModuleSettings) {
  if (getGame().user.isGM) {
    const notices = new Notices(getGame(), settings);
    notices.checkForNotices();
  }
}
