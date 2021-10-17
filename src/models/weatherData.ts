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
  public version: number;
  public dateTime: DateTime = new DateTime(); // DateTime provided by Simple Calendar

  public climate: Climate; // Current climate - TODO: Should be an enum
  public isVolcanic: boolean; // TODO: TBD
  public lastTemp: number; // Last temperature in farenheit
  public precipitation: string; // Description of current weather
  public temp: number; // Current temperature in farenheit
  public tempRange: { min: number, max: number }; // Temperature range of the current season - TODO: Confirm if this is true
}
