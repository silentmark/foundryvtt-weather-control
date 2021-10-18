import { Climate } from './climate';
import { CurrentDate } from './currentDate';

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

  public currentDate: CurrentDate = new CurrentDate();

  public climate: Climate; // Current climate
  public isVolcanic: boolean; // TODO: Should be moved into Climate/Biome data
  public lastTemp: number; // Last temperature in farenheit
  public precipitation: string; // Description of current weather
  public temp: number; // Current temperature in farenheit
  public tempRange: { min: number, max: number }; // Temperature range of the current season
}
