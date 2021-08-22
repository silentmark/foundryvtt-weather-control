import { DateTime } from 'src/libraries/simple-calendar/dateTime';

export interface WeatherData {
  dateTime: DateTime; // DateTime provided by Simple Calendar

  cTemp: number; // Temperature in celcius
  climate: string; // Current climate - TODO: Should be an enum
  climateTemp: number; // Temperature modifier of the current climate
  dawn: number; // Hour of dawn begins - FIXME: This might instead come from Simple Calendar
  dusk: number; // Hour of dusk begins - FIXME: This might instead come from Simple Calendar
  isC: boolean; // Is temparature displayed as celcius - TODO: Move to settings
  isVolcanic: boolean; // TODO: TBD
  lastTemp: number; // Last temperature in farenheit
  outputToChat: boolean; // Should output weather to chat - TODO: Move to settings
  precipitation: string; // Description of current weather
  season: string; // Name of current season
  seasonColor: string; // Name of current season's color - TODO: Should ben an enum
  seasonRolltable: string; // TODO: TBD
  seasonTemp: number; // Temperature modifier of the current season
  showFX: boolean; // Show weather effect with FXMaster - TODO: Move to settings
  temp: number; // Current temperature in farenheit
  tempRange: { min: number, max: number }; // Temperature range of the current season - TODO: Confirm if this is true
  weatherFX: Array<{ type: string, options: any}> // Currently active weather effects - TODO: Confirm if this is true
}

export const defaultWeatherData: WeatherData = {
  dateTime: null,
  cTemp:  null,
  climate: null,
  climateTemp: 0,
  dawn: 5,
  dusk: 21,
  isC: false,
  isVolcanic: false,
  lastTemp: 50,
  outputToChat: true,
  precipitation: null,
  season: null,
  seasonColor: null,
  seasonRolltable: null,
  seasonTemp: 0,
  showFX: false,
  temp: 50,
  tempRange: { min: 30, max: 90 },
  weatherFX: null,
};
