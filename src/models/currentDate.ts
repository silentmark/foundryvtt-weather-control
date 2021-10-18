export class RawDate {
  public year: number;
  public yearName: string;
  public yearPostfix: string;
  public yearPrefix: string;
  public month: number;
  public monthName: string;
  public weekdays: string[];
  public currentWeekdayIndex: number;
  public day: number;
  public hour: number;
  public minute: number;
  public second: number;
}

export class FormattedDate {
  public fullDate: string;
  public time: string;
}

export class CurrentDate {
  public raw: RawDate;
  public display: FormattedDate;
}
