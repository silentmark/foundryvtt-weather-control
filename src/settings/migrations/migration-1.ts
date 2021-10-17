import { Climate } from 'src/models/climate';

import { DateTime } from '../../libraries/simple-calendar/dateTime';
import { Migration } from './migration';

interface PreviousWeatherData {
  version: number,
  dateTime: DateTime,
  cTemp: number,
  climate: Climate,
  isVolcanic: boolean,
  lastTemp: number,
  precipitation: string,
  temp: number,
  tempRange: { min: number, max: number },
}

interface TargetWeatherData {
  version: number,
  dateTime: DateTime,
  climate: Climate,
  isVolcanic: boolean,
  lastTemp: number,
  precipitation: string,
  temp: number,
  tempRange: { min: number, max: number },
}

export class Migration1 extends Migration {

  constructor() {
    const version = 1;
    super(version);
  }

  public migrate(previous: PreviousWeatherData): TargetWeatherData  {
    const data: TargetWeatherData = {
      version: 1,
      dateTime: previous.dateTime,
      climate: previous.climate,
      isVolcanic: previous.isVolcanic,
      lastTemp: previous.lastTemp,
      precipitation: previous.precipitation,
      temp: previous.temp,
      tempRange: previous.tempRange,
    };
    return data;
  }
}
