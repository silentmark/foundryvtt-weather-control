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
  public isVolcanic: boolean; // TODO: TBD
  public lastTemp: number; // Last temperature in farenheit
  public precipitation: string; // Description of current weather
  public temp: number; // Current temperature in farenheit
  public tempRange: { min: number, max: number }; // Temperature range of the current season - TODO: Confirm if this is true
}

export const defaultWeatherData: WeatherData = {
  dateTime: null,
  cTemp:  null,
  climate: null,
  isVolcanic: false,
  lastTemp: 50,
  precipitation: null,
  temp: 50,
  tempRange: { min: 30, max: 90 },
};
