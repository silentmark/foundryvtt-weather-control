import { CurrentDate } from 'src/models/currentDate';

import { SimpleCalendarApi } from './api';
import { Date } from './dateTime';

export abstract class SimpleCalendarPresenter {

  public static createDateObject(rawDate: Date): CurrentDate {
    const date: CurrentDate = new CurrentDate();
    date.raw = {
      year: rawDate.year,
      month: rawDate.month,
      weekdays: rawDate.weekdays,
      currentWeekdayIndex: rawDate.dayOfTheWeek,
      day: rawDate.day,
      hour: rawDate.hour,
      minute: rawDate.minute,
      second: rawDate.second,
    };
    date.display = {
      fullDate: rawDate.display.date,
      time: rawDate.display.time
    };

    return date;
  }

  public static timestampToDate(timestamp: number): CurrentDate {
    return this.createDateObject(SimpleCalendarApi.timestampToDate(timestamp));
  }
}
