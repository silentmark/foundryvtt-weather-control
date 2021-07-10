import Settings from './settings';
import { gameMock } from './testUtils';

const game = gameMock();

describe('Settings', () => {
  let settings: Settings;

  beforeEach(() => {
    settings = new Settings(game);
    settings; // This is just so the linter does not think it is unused
  });

  it('SHOULD register all settings on construction', () => {
    expect(game.settings.register).toHaveBeenCalledTimes(10);
  });
});
