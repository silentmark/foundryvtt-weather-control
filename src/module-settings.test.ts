import { ModuleSettings, SettingKeys } from './module-settings';
import { gameMock } from './testUtils';

describe('Settings', () => {
  let game;
  let settings: ModuleSettings;

  beforeEach(() => {
    game = gameMock();
    settings = new ModuleSettings(game);
  });

  it('SHOULD register all required settings', () => {
    expect(game.settings.register).toHaveBeenCalledWith(settings.getModuleName(), SettingKeys.calendarDisplay, expect.any(Object));
    expect(game.settings.register).toHaveBeenCalledWith(settings.getModuleName(), SettingKeys.noticeVersion, expect.any(Object));
    expect(game.settings.register).toHaveBeenCalledWith(settings.getModuleName(), SettingKeys.outputWeatherToChat, expect.any(Object));
    expect(game.settings.register).toHaveBeenCalledWith(settings.getModuleName(), SettingKeys.playerSeeWeatherInfo, expect.any(Object));
    expect(game.settings.register).toHaveBeenCalledWith(settings.getModuleName(), SettingKeys.useCelcius, expect.any(Object));
    expect(game.settings.register).toHaveBeenCalledWith(settings.getModuleName(), SettingKeys.weatherData, expect.any(Object));
    expect(game.settings.register).toHaveBeenCalledWith(settings.getModuleName(), SettingKeys.windowPosition, expect.any(Object));
  });
});
