import { ModuleSettings } from './module-settings';
import { gameMock } from './testUtils';

describe('Settings', () => {
  let game;
  let settings: ModuleSettings;

  beforeEach(() => {
    game = gameMock();
    settings = new ModuleSettings(game);
    settings; // This is just so the linter does not think it is unused
  });

  it('SHOULD register all settings on construction', () => {
    expect(game.settings.register).toHaveBeenCalledTimes(6);
  });
});
