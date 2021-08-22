// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const registerSettings = function(calendar) {
  game.settings.register('calendar-weather', 'dateTime', {
    name: 'Date/Time Data',
    scope: 'world',
    config: false,
    type: Object,
    onChange: calendar.loadSettings.bind(calendar)
  });
  game.settings.register('calendar-weather', 'calendarPos', {
    name: 'Calendar Position',
    scope: 'world',
    config: false,
    type: Object,
  });
  game.settings.register('calendar-weather', 'calendarDisplay', {
    name: game.i18n.localize('wctrl.settings.CalDispNonGm'),
    hint: game.i18n.localize('wctrl.settings.CalDispNonGmHelp'),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'weatherDisplay', {
    name: game.i18n.localize('wctrl.settings.Weather2Chat'),
    hint: game.i18n.localize('wctrl.settings.Weather2ChatHelp'),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'moonDisplay', {
    name: game.i18n.localize('wctrl.setting.2Chat'),
    hint: game.i18n.localize('wctrl.setting.2ChatHelp'),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'is24', {
    name: game.i18n.localize('wctrl.settings.Display24H'),
    hint: game.i18n.localize('wctrl.settings.Display24HHelp'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'noGlobal', {
    name: game.i18n.localize('wctrl.settings.NoGlobal'),
    hint: game.i18n.localize('wctrl.settings.NoGlobalHelp'),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'useCelcius', {
    name: game.i18n.localize('wctrl.settings.useCelcius'),
    hint: game.i18n.localize('wctrl.settings.useCelciusHelp'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'playerSeeWeather', {
    name: game.i18n.localize('wctrl.settings.playerSeeWeather'),
    hint: game.i18n.localize('wctrl.settings.playerSeeWeatherHelp'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'useSanctions', {
    name: game.i18n.localize('wctrl.settings.useSanctions'),
    hint: game.i18n.localize('wctrl.settings.useSanctionsHelp'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
};
