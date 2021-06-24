
declare class Gametime {
  static isMaster(): boolean;
  static isRunning(): boolean;
  static DTNow(): DateTime;
}

declare class DateTime extends DTMod {

  /**
   * Returns the number of days represented by a date. Returns the residual hours minutes seconds as well.
   */
  public toDays(): {days: number, time: DTMod};
}

declare class DTMod {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor({years = 0, months = 0, days = 0,hours = 0, minutes = 0, seconds = 0})

  static create(data = {}): DTMod;
}
