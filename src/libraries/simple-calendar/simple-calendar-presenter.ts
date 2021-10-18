import { CurrentDate } from 'src/models/currentDate';

import { SimpleCalendarApi } from './api';
import { Date, DateTime } from './dateTime';

export abstract class SimpleCalendarPresenter {

  public static createDateObject(rawDate: DateTime): CurrentDate {
    const scDate: Date = rawDate.date;
    const date: CurrentDate = new CurrentDate();
    date.raw = {
      year: scDate.year,
      yearName: scDate.yearName,
      yearPostfix: scDate.yearPostfix,
      yearPrefix: scDate.yearPrefix,
      month: scDate.month,
      monthName: scDate.monthName,
      weekdays: scDate.weekdays,
      currentWeekdayIndex: scDate.dayOfTheWeek,
      day: scDate.day,
      hour: scDate.hour,
      minute: scDate.minute,
      second: scDate.second,
    };
    date.display = {
      fullDate: scDate.display.date,
      time: scDate.display.time
    };

    console.log('date', date);
    return date;
  }

  public static timestampToDate(timestamp: number): CurrentDate {
    return this.createDateObject(SimpleCalendarApi.timestampToDate(timestamp));
  }
}
