import { DateTime } from '../libraries/simple-calendar/dateTime';
import { Climate } from './climate';

export enum Climates {
  temperate = 'temperate',
  temperateMountain = 'temperateMountain',
  desert = 'desert',
  tundra = 'tundra',
  tropical = 'tropical',
  taiga = 'taiga',
  volcanic = 'volcanic',
  polar = 'polar',
}

export class WeatherData {
  public dateTime: DateTime = new DateTime(); // DateTime provided by Simple Calendar

  public cTemp: number; // Temperature in celcius
  public climate: Climate; // Current climate - TODO: Should be an enum
  public dawn: number; // Hour of dawn begins - FIXME: This might instead come from Simple Calendar
  public dusk: number; // Hour of dusk begins - FIXME: This might instead come from Simple Calendar
  public isC: boolean; // Is temparature displayed as celcius - TODO: Move to settings
  public isVolcanic: boolean; // TODO: TBD
  public lastTemp: number; // Last temperature in farenheit
  public outputToChat: boolean; // Should output weather to chat - TODO: Move to settings
  public precipitation: string; // Description of current weather
  public showFX: boolean; // Show weather effect with FXMaster - TODO: Move to settings
  public temp: number; // Current temperature in farenheit
  public tempRange: { min: number, max: number }; // Temperature range of the current season - TODO: Confirm if this is true
  public weatherFX: Array<{ type: string, options: any}> // Currently active weather effects - TODO: Confirm if this is true
}

export const defaultWeatherData: WeatherData = {
  dateTime: null,
  cTemp:  null,
  climate: null,
  dawn: 5,
  dusk: 21,
  isC: false,
  isVolcanic: false,
  lastTemp: 50,
  outputToChat: true,
  precipitation: null,
  showFX: false,
  temp: 50,
  tempRange: { min: 30, max: 90 },
  weatherFX: null,
};
