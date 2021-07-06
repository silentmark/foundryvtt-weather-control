// Documentation: https://github.com/vigoren/foundryvtt-simple-calendar/blob/main/docs/Hooks.md#season-properties

interface Year {
  number: number;
  prefix: string;
  postfix: string;
  isLeapYear: boolean;
}

interface Month {
  number: number;
  name: string;
  numberOfDays: number;
  numberOfLeapYearDays: number;
  intercalary: boolean;
}

interface Day {
  number: number;
}

interface Time {
  hour: number;
  minute: number;
  second: number;
}

interface Season {
  name: string;
  color: string;
}

interface Moon {
  name: string;
  color: string;
  cycleLength: number;
  cycleDayAdjust: number;
  currentPhase: MoonPhase;
}

interface MoonPhase {
  name: string;
  icon: string;
  length: number;
  sungleDay: boolean;
}

export interface DateTime {
  year: Year;
  month: Month;
  day: Day;
  time: Time;
  season: Season;
  moons: Moon;
}
