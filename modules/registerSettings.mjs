export const registerSettings = function(calendar) {
  game.settings.register('calendar-weather', 'dateTime', {
    name: "Date/Time Data",
    scope: 'world',
    config: false,
    type: Object,
    onChange: calendar.loadSettings.bind(calendar)
  });
  game.settings.register('calendar-weather', 'calendarPos', {
    name: "Calendar Position",
    scope: 'world',
    config: false,
    type: Object,
  });
  game.settings.register('calendar-weather', 'calendarDisplay', {
    name: game.i18n.localize("cw.setting.CalDispNonGm"),
    hint: game.i18n.localize("cw.setting.CalDispNonGmHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'weatherDisplay', {
    name: game.i18n.localize("cw.setting.Weather2Chat"),
    hint: game.i18n.localize("cw.setting.Weather2ChatHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'moonDisplay', {
    name: game.i18n.localize("cw.setting.2Chat"),
    hint: game.i18n.localize("cw.setting.2ChatHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'is24', {
    name: game.i18n.localize("cw.setting.Display24H"),
    hint: game.i18n.localize("cw.setting.Display24HHelp"),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'noGlobal', {
    name: game.i18n.localize("cw.setting.NoGlobal"),
    hint: game.i18n.localize("cw.setting.NoGlobalHelp"),
    scope: 'world',
    config: true,
    default: true,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'useCelcius', {
    name: game.i18n.localize("cw.setting.useCelcius"),
    hint: game.i18n.localize("cw.setting.useCelciusHelp"),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'playerSeeWeather', {
    name: game.i18n.localize("cw.setting.playerSeeWeather"),
    hint: game.i18n.localize("cw.setting.playerSeeWeatherHelp"),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
  game.settings.register('calendar-weather', 'useSanctions', {
    name: game.i18n.localize("cw.setting.useSanctions"),
    hint: game.i18n.localize("cw.setting.useSanctionsHelp"),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });
}
