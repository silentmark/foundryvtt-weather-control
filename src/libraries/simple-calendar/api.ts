import { Date } from './dateTime';

declare global {
  interface Window { SimpleCalendar: any; }
}

export class SimpleCalendarApi {
  private static get SimpleCalendar() {
    return window.SimpleCalendar.api;
  }

  static clockStatus(): { started: boolean, stopped: boolean, paused: boolean } {
    return this.SimpleCalendar.clockStatus();
  }

  static isPrimaryGM(): boolean {
    return this.SimpleCalendar.isPrimaryGM();
  }

  static startClock(): boolean {
    return this.SimpleCalendar.startClock();
  }

  static stopClock(): boolean {
    return this.SimpleCalendar.stopClock();
  }

  static timestamp(): number {
    return this.SimpleCalendar.timestamp();
  }

  static timestampToDate(timestamp: number): Date {
    return this.SimpleCalendar.timestampToDate(timestamp);
  }
}
