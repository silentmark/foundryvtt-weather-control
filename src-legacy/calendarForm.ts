import { cwdtData } from './calendar-weather';
import { _myCalendarSpec, DateTime as CWDateTime } from './dateTime';
import { Month } from './month';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { Gametime } from '../types/about-time/index.js';

export class CalendarForm extends FormApplication {
  protected _updateObject(): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  data: any = {};

  constructor(newData: any) {
    super();
    newData = JSON.parse(newData);
    const now = Gametime.DTNow();

    this.data = {
      months: newData.months,
      daysOfTheWeek: newData.daysOfTheWeek,
      year: now.years,
      day: now.days + 1,
      numDayOfTheWeek: now.dow(),
      currentMonth: now.months + 1,
      currentWeekday: Gametime.DTC.weekDays[now.dow()],
      era: newData.era,
      hours: now.hours,
      minutes: now.minutes,
      seconds: now.seconds,
    };
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = 'modules/calendar-weather/templates/calendar-form.html';
    options.width = 600;
    options.height = 'auto';
    options.title = 'Calendar Weather Settings';
    return options;
  }

  saveData() {
    const savedData = new CWDateTime();

    let year = parseInt(
      (document.getElementById('calendar-form-year-input') as HTMLInputElement).value
    );
    if (year < 0) {
      year = 1;
    }


    savedData.era = (document.getElementById('calendar-form-era-input') as HTMLInputElement).value;

    let hours = parseInt(
      (document.getElementById('calendar-form-hour-input') as HTMLInputElement).value
    );
    if (hours > 24 || hours < 0) {
      hours = 23;
    }

    if (
      (document.getElementById('calendar-form-ampm') as HTMLInputElement).value == 'PM' &&
      hours < 12
    ) {
      hours = hours + 12;
    }
    if (
      (document.getElementById('calendar-form-ampm') as HTMLInputElement).value == 'AM' &&
      hours == 12
    ) {
      hours = hours - 12;
    }

    let minutes = parseInt(
      (document.getElementById('calendar-form-minute-input') as HTMLInputElement).value
    );
    if (minutes > 59 || minutes < 0) {
      minutes = 59;
    }

    let seconds = parseInt(
      (document.getElementById('calendar-form-second-input') as HTMLInputElement).value
    );
    if (seconds > 59 || seconds < 0) {
      seconds = 59;
    }

    const newMonthsName = document.getElementsByClassName(
      'calendar-form-month-input'
    ) as HTMLCollectionOf<HTMLInputElement>;
    const newMonthsLength = document.getElementsByClassName(
      'calendar-form-month-length-input'
    ) as HTMLCollectionOf<HTMLInputElement>;
    const newMonthsIsNum = document.getElementsByClassName(
      'calendar-form-month-isnum'
    ) as HTMLCollectionOf<HTMLInputElement>;
    const newMonthsAbbrev = document.getElementsByClassName(
      'calendar-form-month-abbrev'
    ) as HTMLCollectionOf<HTMLInputElement>;

    const newMonths = [];
    if (newMonthsName.length < 1) {
      savedData.addMonth(new Month('Month 1', 30, 30, true));
    }

    for (let i = 0; i < newMonthsName.length; i++) {
      const tempMonth = new Month('Month 1', 30, 30, true);

      if (newMonthsName[i].value == '') {
        tempMonth.name = 'New Month';
      } else {
        tempMonth.name = newMonthsName[i].value;
      }
      tempMonth.length = Number(newMonthsLength[i].value);
      // change this for leapYears
      tempMonth.leapLength = Number(newMonthsLength[i].value);
      tempMonth.isNumbered = !newMonthsIsNum[i].checked;
      if (newMonthsIsNum[i].checked) {
        if (newMonthsAbbrev[i].value) {
          tempMonth.abbrev = newMonthsAbbrev[i].value;
        } else {
          console.log('calendar-weather| Generating month abbrev');
          tempMonth.abbrev = tempMonth.name.substring(0, 2).toUpperCase();
        }
      } else tempMonth.abbrev = newMonthsAbbrev[i].value;
      newMonths.push(tempMonth);
    }
    savedData.months = newMonths;

    let weekDays = [];
    const newWeekdays = document.getElementsByClassName(
      'calendar-form-weekday-input'
    ) as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < newWeekdays.length; i++) {
      if (!newWeekdays[i].value) newWeekdays[i].value = 'Weekday';
      weekDays.push(newWeekdays[i].value);
    }
    if (weekDays.length < 1) weekDays = ['Weekday'];
    savedData.daysOfTheWeek = weekDays;

    savedData.setDayLength(24);

    CWDateTime.updateDTC();

    let monthTarget = 0;
    if (
      document.querySelector(
        'input[class="calendar-form-month-radio"]:checked'
      ) == null
    ) {
      monthTarget = savedData.months.length - 1;
    } else {
      monthTarget = Number((document.querySelector(
        'input[class="calendar-form-month-radio"]:checked'
      ) as HTMLInputElement).value);
    }
    monthTarget = Number(monthTarget);

    let day = parseInt(
      (document.getElementById('calendar-form-cDay-input') as HTMLInputElement).value
    );
    if (savedData.months[monthTarget].length < day) {
      day = savedData.months[monthTarget].length;
    }
    day -= 1;

    const timeSettings = {
      years: Number(year),
      months: Number(monthTarget),
      days: Number(day),
      hours: Number(hours),
      minutes: Number(minutes),
      seconds: Number(seconds),
    };

    const newDT = Gametime.DTf(timeSettings);
    let weekdayTarget = 0;
    if (
      document.querySelector(
        'input[class="calendar-form-weekday-radio"]:checked'
      ) == null
    ) {
      weekdayTarget = savedData.daysOfTheWeek.length - 1;
    } else {
      weekdayTarget = Number((document.querySelector(
        'input[class="calendar-form-weekday-radio"]:checked'
      ) as HTMLInputElement).value);
    }

    savedData.hours = newDT.hours;
    savedData.minutes = newDT.minutes;
    savedData.seconds = newDT.seconds;

    savedData.numDayOfTheWeek = Number(weekdayTarget);
    Gametime.setTime({hours: savedData.hours, minutes: savedData.minutes, seconds: savedData.seconds});

    savedData.setTimeDisp();
    savedData.genAbbrev();
    const returnData = {
      months: savedData.months,
      daysOfTheWeek: savedData.daysOfTheWeek,
      year: newDT.years,
      day: newDT.days,
      numDayOfTheWeek: newDT.dow(),
      firstDay: _myCalendarSpec.first_day,
      currentMonth: newDT.months,
      currentWeekday: Gametime.DTC.weekDays[newDT.dow()],
      dateWordy: savedData.dateWordy,
      era: savedData.era,
      dayLength: Gametime.DTC.hpd,
      timeDisp: savedData.timeDisp,
      dateNum: savedData.dateNum,
      events: CWDateTime.events,
    };

    console.log(
      'calendar-weather | Building new calendar with the following object:',
      returnData
    );
    return returnData;
  }

  activateListeners(html) {
    const submit = '#calendar-form-submit';
    const addWeekday = '#calendar-form-add-weekday';
    const addMonth = '#calendar-form-add-month';
    const delWeekday = 'button[class=\'calendar-form-weekday-del\']';
    const delMonth = 'button[class=\'calendar-form-month-del\']';
    const loadDefault = '#calendar-form-load-default';
    const exportBtn = '#calendar-form-export';
    const importBtn = '#calendar-form-import';

    html.find(submit).click((ev) => {
      ev.preventDefault();
      this.close();
      Hooks.callAll('calendarSettingsClose', JSON.stringify(this.saveData()));
    });
    html.find(addWeekday).click((ev) => {
      ev.preventDefault();
      this.data = this.saveData();
      this.data.daysOfTheWeek.push('');
      this.render(true);
      this.checkBoxes();
    });
    html.find(addMonth).click((ev) => {
      ev.preventDefault();
      this.data = this.saveData();
      const newMonth = new Month('', 30, 30, true);
      this.data.months.push(newMonth);
      this.render(true);
      this.checkBoxes();
    });
    html.find(delWeekday).click((ev) => {
      ev.preventDefault();
      this.data = this.saveData();
      const targetName = ev.currentTarget.name.split('-');
      const index = targetName[targetName.length - 1];
      this.data.daysOfTheWeek.splice(index, 1);
      this.render(true);
      this.checkBoxes();
    });
    html.find(delMonth).click((ev) => {
      ev.preventDefault();
      this.data = this.saveData();
      const targetName = ev.currentTarget.name.split('-');
      const index = targetName[targetName.length - 1];
      this.data.months.splice(index, 1);
      this.render(true);
      this.checkBoxes();
    });
    html.find(loadDefault).click((ev) => {
      ev.preventDefault();
      const defaultCalendar = Object.keys(Gametime.calendars)[
        game.settings.get('about-time', 'calendar') as any
      ];
      new Dialog({
        default: '', // FIXME: Not sure this is right, but it is required by the type
        title: 'Choose Calendar',
        content: `<p>${defaultCalendar}</p>`,
        buttons: {
          yes: {
            icon: '<i class="fas fa-check"></i>',
            label: 'Load',
            callback: async () => {
              CWDateTime.updateFromDTC(defaultCalendar);
              CWDateTime.updateDTC();
              this.data.months = CWDateTime.months;
              this.data.daysOfTheWeek = CWDateTime.daysOfTheWeek;
              await this.render(true);
              try {
                await this.checkBoxes();
              } catch (err) { return; }
            },
          },
          no: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Don\'t Load',
          },
        },
      }).render(true);
    });

    html.find(exportBtn).click((ev) => {
      ev.preventDefault();
      const calendarData = JSON.stringify(game.settings.get('calendar-weather', 'dateTime'));
      // console.log(calendarData)
      const el = document.createElement('textarea');
      el.value = calendarData;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      console.log('calendar-weather | Calendar data copied');
      ui.notifications.info(game.i18n.localize('wctrl.export.copied'));
    });

    html.find(importBtn).click(ev => {
      ev.preventDefault();
      new Dialog({
        default: '', // FIXME: Not sure this is right, but it is required by the type
        title: 'Import Calendar',
        content: '<p>Paste calendar data into the following input field, then click "Upload Calendar Data"</p><input id="uploadedData" title="Data Here..."></input>',
        buttons: {
          data: {
            icon: '<i class="fas fa-upload"></i>',
            label: 'Import Calendar Data',
            callback: async () => {
              let data = (document.getElementById('uploadedData') as HTMLInputElement).value as any;
              try {
                data = JSON.parse(data);
                console.log(data);
                const now = Gametime.DTNow();
                if (!cwdtData.dt) cwdtData.dt = new CWDateTime();
                cwdtData.dt.months = data.months;
                cwdtData.dt.daysOfTheWeek = data.daysOfTheWeek;
                cwdtData.dt.setDayLength(data.dayLength);
                _myCalendarSpec.first_day = data.first_day;
                CWDateTime.updateDTC(); // set the calendar spec for correct date time calculations
                cwdtData.dt.currentWeekDay = cwdtData.dt.daysOfTheWeek[now.dow()];
                cwdtData.dt.era = data.era;
                cwdtData.dt.dayLength = Gametime.DTC.hpd;
                cwdtData.dt.timeDisp = now.shortDate().time;
                cwdtData.dt.weather = cwdtData.dt.weather.load(data.weather);
                cwdtData.dt.seasons = data.seasons;
                cwdtData.dt.reEvents = data.reEvents;
                cwdtData.dt.events = data.events;
                cwdtData.dt.moons = data.moons;
                cwdtData.dt.genDateWordy();
                this.close();
                ui.notifications.info(game.i18n.localize('wctrl.import.success'));
              } catch (err) {
                ui.notifications.error(`${game.i18n.localize('wctrl.import.failure')} ${err}`);
              }
            }
          },
          close: {
            icon: '<i class="fas fa-times"></i>',
            label: 'Cancel',
          }
        }
      }).render(true);
    });

    html.find('*').keydown((ev) => {
      if (ev.which == 13) {
        ev.preventDefault();
        this.close();
        Hooks.callAll('calendarSettingsClose', JSON.stringify(this.saveData()));
      }
    });
  }

  getData() {
    const now = Gametime.DTNow();
    this.data.year = now.years;
    this.data.day = now.days + 1;
    this.data.numDayOfTheWeek = now.dow();
    this.data.currentMonth = now.months;
    this.data.currentWeekday = Gametime.DTC.weekDays[now.dow()];
    this.data.hours = ((now.hours + 11) % 12) + 1;
    this.data.minutes = now.minutes;
    this.data.seconds = now.seconds;
    return this.data;
  }

  formLoaded() {
    return new Promise<void>((resolve) => {
      function check() {
        if (document.getElementById('calendar-form-submit')) {
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    });
  }

  async checkBoxes() {
    await this.formLoaded();
    const weekdays = document.getElementsByClassName(
      'calendar-form-weekday-radio'
    ) as HTMLCollectionOf<HTMLInputElement>;
    const monthsNum = document.getElementsByClassName(
      'calendar-form-month-isnum'
    ) as HTMLCollectionOf<HTMLInputElement>;
    const monthsAbbrev = document.getElementsByClassName(
      'calendar-form-month-abbrev'
    ) as HTMLCollectionOf<HTMLInputElement>;
    const months = document.getElementsByClassName('calendar-form-month-radio') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0, max = weekdays.length; i < max; i++) {
      weekdays[i].checked = i === this.data.numDayOfTheWeek;
    }

    for (let i = 0, max: number = this.data.months.length; i < max; i++) {
      if (monthsNum[i]) {
        monthsNum[i].checked = !this.data.months[i].isNumbered;
        if (monthsNum[i].checked) {
          monthsAbbrev[i].disabled = false;
          monthsAbbrev[i].style.cursor = 'auto';
          monthsAbbrev[i].value = this.data.months[i].abbrev;
        }
      }
    }
    months[this.data.currentMonth].checked = true;

    if (Gametime.DTNow().hours >= 12) {
      document.getElementById('calendar-form-ampm')[1].selected = 'true';
    } else {
      document.getElementById('calendar-form-ampm')[0].selected = 'true';
    }
  }

  renderForm(newData) {
    const templatePath = 'modules/calendar-weather/templates/calendar-form.html';
    this.data = JSON.parse(newData);
    const now = Gametime.DTNow();
    this.data['hours'] = now.hours % 12 || 12;
    this.data['minutes'] = now.minutes;
    this.data['seconds'] = now.seconds;
    renderTemplate(templatePath, this.data)
      .then(() => {
        this.render(true);
      })
      .then(() => this.checkBoxes());

    Hooks.callAll('calendarSettingsOpen');
  }
}
