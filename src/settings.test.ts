import { Settings } from './settings';
import { gameMock } from './testUtils';

describe('Settings', () => {
  let game;
  let settings: Settings;

  beforeEach(() => {
    game = gameMock();
    settings = new Settings(game);
    settings; // This is just so the linter does not think it is unused
  });

  it('SHOULD register all settings on construction', () => {
    expect(game.settings.register).toHaveBeenCalledTimes(12);
  });
});
