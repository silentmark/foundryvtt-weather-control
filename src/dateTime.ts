/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  WeatherTracker
} from './weatherTracker';
import {
  Month
} from './month';
// import {
//   cwdtData
// } from "./calendar-weather";
// import { DTMod, Gametime } from '../types/about-time/index.js';

declare const canvas: Canvas; // FIXME: I don't like doing this but I can't figure out where it really comes from

export let _myCalendarSpec = {
  'leap_year_rule': () => 0,
  'clock_start_year': 0,
  'first_day': 0,
  'notes': {},
  'hours_per_day': 24,
  'seconds_per_minute': 60,
  'minutes_per_hour': 60,
  'has_year_0': true,
  'month_len': {},
  'weekdays': [],
};

class DateTimeStatics {
  _weather = new WeatherTracker();
  _seasons = [];
  _reEvents = [];
  _events = [];
  _moons = [];
  _months = [];
  _daysOfTheWeek = [];
  _lastDays = 0;
}

const dateTimeStatics = new DateTimeStatics();

export class DateTime {
  is24 = false;
  dayLength: any;
  settings: any[];
  hours: number;
  minutes: number;
  seconds: number;

  static updateDTC() { // update the calendar spec so that about-time will know the new calendar
    Gametime.DTC.createFromData(_myCalendarSpec);
  }

  static updateFromDTC(calendarName) {
    const calSpec = duplicate(Gametime.calendars[calendarName]);
    if (calSpec) {
      _myCalendarSpec = calSpec;
      _myCalendarSpec.leap_year_rule = Gametime.calendars[calendarName].leap_year_rule;
      // Remove this when leap years are supported in this module
      _myCalendarSpec.leap_year_rule = () => 0;
      this.months = Object.keys(calSpec.month_len).map((k, i) => {
        const m = calSpec.month_len[k];
        return new Month(k, m.days[0], m.days[1], !m.intercalary, m.intercalary ? 'XX' : `${i+1}`);
      });
      this.daysOfTheWeek = calSpec.weekdays;
      Gametime.DTC.createFromData(_myCalendarSpec);
    }
  }

  _year = 0;
  _dateWordy = '';
  _era = '';
  timeDisp = '';
  _dateNum = '';

  static get lastDays() {
    return dateTimeStatics._lastDays;
  }
  static set lastDays(days) {
    dateTimeStatics._lastDays = days;
  }
  get lastDays() {
    return DateTime.lastDays;
  }
  set lastDays(days) {
    DateTime.lastDays = days;
  }

  static get moons() {
    return dateTimeStatics._moons ? dateTimeStatics._moons : [];
  }
  static set moons(moons) {
    dateTimeStatics._moons = moons || [];
  }
  get moons() {
    return DateTime.moons;
  }
  set moons(moons) {
    DateTime.moons = moons;
  }

  static get reEvents() {
    return dateTimeStatics._reEvents ? dateTimeStatics._reEvents : [];
  }
  static set reEvents(reEvents) {
    dateTimeStatics._reEvents = reEvents || [];
  }
  get reEvents() {
    return DateTime.reEvents;
  }
  set reEvents(reEvents) {
    DateTime.reEvents = reEvents;
  }

  static get events() {
    return dateTimeStatics._events ? dateTimeStatics._events : [];
  }
  static set events(events) {
    dateTimeStatics._events = events || [];
  }
  get events() {
    return DateTime.events;
  }
  set events(events) {
    DateTime.events = events;
  }

  static get seasons() {
    return dateTimeStatics._seasons ? dateTimeStatics._seasons : [];
  }
  static set seasons(seasons) {
    dateTimeStatics._seasons = seasons || [];
  }
  get seasons() {
    return DateTime.seasons;
  }
  set seasons(seasons) {
    DateTime.seasons = seasons;
  }

  static get weather(): WeatherTracker {
    return dateTimeStatics._weather ? dateTimeStatics._weather : new WeatherTracker();
  }
  static set weather(weather) {
    dateTimeStatics._weather = weather || new WeatherTracker();
  }
  get weather() {
    return DateTime.weather;
  }
  set weather(weather) {
    DateTime.weather = weather;
  }

  static get months() {
    return dateTimeStatics._months;
  }
  static set months(months) {
    months.forEach(m => _myCalendarSpec.month_len[m.name] = {
      'days': [Number(m.length), Number(m.leapLength)],
      'intercalary': !m.isNumbered
    });
    dateTimeStatics._months = months;
  }
  get months() {
    return DateTime.months;
  }
  set months(months) {
    DateTime.months = months;
  }

  static set daysOfTheWeek(days) {
    _myCalendarSpec.weekdays = days;
    dateTimeStatics._daysOfTheWeek = days;
  }
  static get daysOfTheWeek() {
    return dateTimeStatics._daysOfTheWeek;
  }
  set daysOfTheWeek(days) {
    DateTime.daysOfTheWeek = days;
  }
  get daysOfTheWeek() {
    return DateTime.daysOfTheWeek;
  }

  get year() {
    return Gametime.DTNow().years;
  }
  set year(y) {
    this.setYear(y);
  }

  get day() {
    return Gametime.DTNow().days;
  }

  get dateWordy() {
    return this._dateWordy;
  }
  set dateWordy(dateWordy) {
    this._dateWordy = dateWordy;
  }

  currentWeekDay = (): string => {
    return Gametime.weekDays[Gametime.DTNow().dow()];
  }

  addMonth(month) {
    DateTime.months.push(month);
    _myCalendarSpec.month_len[month.name] = {
      days: [Number(month.length), Number(month.leapLength)]
    };
    // Gametime.DTC.createFromData(_myCalendarSpec);
  }

  addWeekday(day) {
    _myCalendarSpec.weekdays.push(day);
    DateTime.daysOfTheWeek.push(day);
    // Gametime.DTC.createFromData(_myCalendarSpec);
  }

  setYear(year) {
    Gametime.setAbsolute(Gametime.DTNow().setAbsolute({
      years: Number(year)
    }));
    this._year = year;
  }

  get currentMonth() {
    return Gametime.DTNow().months;
  }
  set currentMonth(currentMonth) {
    Gametime.setAbsolute(Gametime.DTNow().setAbsolute({
      months: Number(currentMonth)
    }));
  }

  set era(era) {
    this._era = era;
  }
  get era() {
    return this._era;
  }
  setEra(era) {
    this._era = era;
  }

  setDayLength(length) {
    _myCalendarSpec.hours_per_day = Number(length);
    if (isNaN(_myCalendarSpec.hours_per_day)) {
      console.warn('Error setting day length to', length);
      _myCalendarSpec.hours_per_day = 24;

    }
  }

  set numDayOfTheWeek(dow) {
    Gametime.DTNow().setCalDow(dow);
    _myCalendarSpec.first_day = Gametime.DTC.firstDay;
  }
  get numDayOfTheWeek() {
    return Gametime.DTNow().dow();
  }


  get dateNum() {
    return this._dateNum;
  }
  set dateNum(dateNum) {
    this._dateNum = dateNum;
  }

  get weekday() {
    return this.daysOfTheWeek[this.numDayOfTheWeek];
  }
  set weekday(day) {
    const newDow = this.daysOfTheWeek.indexOf(day);
    if (newDow != -1) this.numDayOfTheWeek = newDow;
  }

  getEntity(text, collection, matchRe) {
    if (text && text.startsWith('@')) {
      const macroMatch = text.match(matchRe);
      if (macroMatch && macroMatch.length === 2) {
        // match by id
        let entity = collection.get(macroMatch[1]);
        // if no match search by name
        if (!entity) entity = collection.entities.find(m => m.name === macroMatch[1]);
        return entity;
      }
    }
    return null;
  }

  findSeason(dateTime) {
    const targetDay = dateTime.days + 1;
    const targetMonth = dateTime.months;
    const abbrevs = this.months.map(m => `${m.abbrev}`); // need text abbreviations here so they can be looked up

    // find the first season after today (if there is one) and set the current season to the one before that or the last season if nothing matched.
    const seasonArr = this.seasons;
    seasonArr.sort((lhs, rhs) => {
      return parseInt(lhs.date.month) - parseInt(rhs.date.month);
    });
    let season = seasonArr.find(s => {
      const smn = abbrevs.indexOf(s.date.month);
      return (smn === targetMonth && s.date.day < targetDay) || smn + 1 > targetMonth;
    });
    if (season && (abbrevs.indexOf(season.date.month) > targetMonth || (abbrevs.indexOf(season.date.month) === targetMonth && season.date.day > targetDay))) {
      season = seasonArr[seasonArr.indexOf(season) - 1];
    } else if (!season) {
      season = this.seasons[this.seasons.length - 1];
    }

    return this.seasons.find(s => season.name === s.name);
  }

  checkMoons() {
    if (!Gametime.isMaster()) return;
    let updatedMoons = '';
    let moonDisplayOutput = '';
    const moonInfo = [];

    if (!(this.moons as any).lastMoons) { // Rant: Sure, go ahead, try to access an array like an object and bastardize the whole thing that you don't own.
      this.moons['lastMoons'] = {};
    }

    this.moons.forEach((moon, index) => {

      // Initialize the references to the current settings if they aren't set
      if (!Number.isFinite(moon.referenceTime)) {
        moon.referenceTime = Gametime.DTNow().toSeconds();
      }

      if (!Number.isFinite(moon.referencePercent)) {
        if (Number.isFinite(moon.cyclePercent) && moon.cyclePercent <= 100) {
          moon.referencePercent = moon.isWaxing ? moon.cyclePercent : 200 - moon.cyclePercent;
        } else {
          moon.referencePercent = 0;
        }
      }

      // Calculate the difference in days since the reference (with decimal fraction)
      const daysSinceReference = (Gametime.DTNow().toSeconds() - moon.referenceTime) / Gametime.DTC.spd;

      // Determine where in the cycle the moon is in its cycle
      moon.cyclePercent = moon.referencePercent + ((daysSinceReference / (moon.cycleLength * 2)) % 1 * 200);

      if (moon.cyclePercent > 200) {
        moon.cyclePercent -= 200;
      }

      moon.isWaxing = true;
      if (moon.cyclePercent > 100) {
        moon.cyclePercent = 200 - moon.cyclePercent;
        moon.isWaxing = false;
      }

      let moonPhase = '';
      let phasePrefix = '';
      let moonSymbol = '';
      let moonSymbolPrefix = '';
      let moonSymbolSuffix = '';
      let sanction = '';

      if (moon.isWaxing) {
        phasePrefix = game.i18n.localize('cw.moon.IsWaxing');
        moonSymbolPrefix = 'waxing';
      } else {
        phasePrefix = game.i18n.localize('cw.moon.Waning');
        moonSymbolPrefix = 'waning';
      }

      if (moon.cyclePercent <= 7) {
        // New moon 7%
        moonSymbolPrefix = 'new';
        moonPhase = game.i18n.localize('cw.moon.New');
        phasePrefix = '';
      } else if (moon.cyclePercent <= 43) {
        // Crescent 36%
        moonSymbolSuffix = 'Crescent';
        moonPhase = game.i18n.localize('cw.moon.Crescent');
      } else if (moon.cyclePercent <= 57) {
        // Half 14%
        moonSymbolSuffix = 'Quarter';
        moonSymbolPrefix = moon.isWaxing ? 'first' : 'third';
        phasePrefix = game.i18n.localize(moon.isWaxing ? 'cw.moon.FirstQuarter' : 'cw.moon.ThirdQuarter');
        moonPhase = game.i18n.localize('cw.moon.Quarter');
      } else if (moon.cyclePercent <= 93) {
        // Gibbous 36%
        moonSymbolSuffix = 'Gibbous';
        moonPhase = game.i18n.localize('cw.moon.Gibbous');
      } else {
        // Full 7%
        moonSymbolPrefix = 'full';
        moonPhase = game.i18n.localize('cw.moon.Full');
        phasePrefix = '';
      }

      //Check Moon Sanctions - which 'quarter of the cycle the moon is in'
      if (game.settings.get('calendar-weather', 'useSanctions')) {
        if (moon.cyclePercent <= 25) {
          // Low Sanction
          sanction = game.i18n.localize('cw.moon.LowSanction');
        } else if (moon.cyclePercent >= 75) {
          // High Sanction
          sanction = game.i18n.localize('cw.moon.HighSanction');
        }
      }

      moonSymbol = './modules/calendar-weather/icons/' + moonSymbolPrefix + moonSymbolSuffix + '.svg';

      //add moons to display
      if (!document.getElementById(`calender-moon-symbol-${index}`)) {
        moonDisplayOutput += `<img src="${moonSymbol}" id='calender-moon-symbol-${index}'>`;
      }

      if ((this.moons as any).lastMoons && (this.moons as any).lastMoons[index] != moonSymbol) {
        updatedMoons += `<div class="calendar-weather-chat"> <img src="${moonSymbol}"> <div class="calendar-weather-chat--description"> <h4>${moon.name}</h4> <p>${phasePrefix} ${moonPhase}${sanction == '' ? '' : `, ${sanction}`}</p></div></div>`;
        moonInfo.push({
          index: index,
          symbol: moonSymbol,
          name: moon.name,
          phase: moonPhase,
          prefix: phasePrefix,
          sanction: sanction
        });
      }

      (this.moons as any).lastMoons[index] = moonSymbol;

      //check solar eclipse
      const roll = Math.random() * 100;
      if (roll < moon.solarEclipseChance) {
        const chatOut = `<div class="calendar-weather-chat"> <img src="${'./modules/calendar-weather/icons/sEclipse.svg'}"> <div class="calendar-weather-chat--description"> <h4>${moon.name}</h4> <p>${game.i18n.localize('cw.moon.SEclipseEventIncoming')}</p></div></div>`;
        ChatMessage.create({
          speaker: {
            alias: moon.name,
          },
          whisper: ChatMessage.getWhisperRecipients('GM'),
          content: chatOut,
        });
        const solarEclipse = (moon, index, moonSymbol, moonPhase, phasePrefix) => {
          let chatOut = '';
          if ((document.getElementById(`calender-moon-symbol-${index}`) as HTMLImageElement).src.includes('Eclipse')) {
            chatOut = `<div class="calendar-weather-chat"> <img src="${moonSymbol}"> <div class="calendar-weather-chat--description"> <h4>${moon.name}</h4> <p>${game.i18n.localize('cw.moon.SEclipseEventEnd')}</p></div></div>`;
            (document.getElementById(`calender-moon-symbol-${index}`) as HTMLImageElement).src = moonSymbol;
            document.getElementById(`calender-moon-symbol-${index}`).title = `${moon.name} | ${phasePrefix} ${moonPhase}`;
            if (this.weather.doNightCycle && Gametime.isMaster()) {
              canvas.scene.update({
                darkness: 0
              }, {
                animateDarkness: true
              });
            }
          } else {
            chatOut = `<div class="calendar-weather-chat"> <img src="${'./modules/calendar-weather/icons/sEclipse.svg'}"> <div class="calendar-weather-chat--description"> <h4>${moon.name}</h4> <p>${game.i18n.localize('cw.moon.SEclipseEvent')}</p></div></div>`;
            (document.getElementById(`calender-moon-symbol-${index}`) as HTMLImageElement).src = './modules/calendar-weather/icons/sEclipse.svg';
            (document.getElementById(`calender-moon-symbol-${index}`) as HTMLImageElement).title = `${moon.name} | ${game.i18n.localize('cw.moon.SEclipseEvent')}`;
            if (this.weather.doNightCycle && Gametime.isMaster()) {
              canvas.scene.update({
                darkness: 1
              }, {
                animateDarkness: true
              });
            }
            Gametime.doIn({
              minutes: 30
            } as DTMod, solarEclipse, moon, index, moonSymbol, moonPhase, phasePrefix);
          }

          ChatMessage.create({
            speaker: {
              alias: moon.name,
            },
            whisper: ChatMessage.getWhisperRecipients('GM'),
            content: chatOut,
          });

        };
        Gametime.doAt(Gametime.DTNow().setAbsolute({
          hours: 11,
          minutes: 45
        }), solarEclipse, moon, index, moonSymbol, moonPhase, phasePrefix);
      } else {
        const roll = Math.random() * 100;
        if (roll < moon.lunarEclipseChance) {
          let chatOut = '';
          if (moonPhase == game.i18n.localize('cw.moon.Full')) {
            chatOut = `<div class="calendar-weather-chat"> <img src="${'./modules/calendar-weather/icons/totalLEclipse.svg'}"> <div class="calendar-weather-chat--description"> <h4>${moon.name}</h4> <p>${game.i18n.localize('cw.moon.TotalLEclipse')}</p></div></div>`;
            (document.getElementById(`calender-moon-symbol-${index}`) as HTMLImageElement).src = './modules/calendar-weather/icons/totalLEclipse.svg';
            (document.getElementById(`calender-moon-symbol-${index}`) as HTMLImageElement).title = `${moon.name} | ${game.i18n.localize('cw.moon.TotalLEclipse')}`;
          } else if ((document.getElementById(`calender-moon-symbol-${index}`) as HTMLImageElement)) {
            chatOut = `<div class="calendar-weather-chat"> <img src="${moonSymbol}"> <div class="calendar-weather-chat--description"> <h4>${moon.name}</h4> <p>${game.i18n.localize('cw.moon.PartialLEclipse')}</p></div></div>`;
            (document.getElementById(`calender-moon-symbol-${index}`) as HTMLImageElement).title = `${moon.name} | ${game.i18n.localize('cw.moon.PartialLEclipse')}`;
          }
          const messageLvl = ChatMessage.getWhisperRecipients('GM');
          ChatMessage.create({
            speaker: {
              alias: moon.name,
            },
            whisper: messageLvl,
            content: chatOut,
          });
        }
      }
    });

    /* display single/multiple moons */
    if (this.moons.length > 1) {
      document.getElementById('calendar--moon-list').classList.add('hasMoon');
      document.getElementById('calendar--moon-list').innerHTML += moonDisplayOutput;
    } else {
      document.getElementById('calendar--moon').classList.add('hasMoon');
      document.getElementById('calendar--moon').innerHTML += moonDisplayOutput;
    }

    moonInfo.forEach((moon) => {
      (document.getElementById(`calender-moon-symbol-${moon.index}`) as HTMLImageElement).src = moon.symbol;
      (document.getElementById(`calender-moon-symbol-${moon.index}`) as HTMLImageElement).title = `${moon.name} | ${moon.prefix} ${moon.phase}${moon.sanction == '' ? '' : `, ${moon.sanction}`}`;
    });

    if (updatedMoons && game.settings.get('calendar-weather', 'moonDisplay')) {
      const messageLvl = ChatMessage.getWhisperRecipients('GM');
      ChatMessage.create({
        speaker: {
          alias: game.i18n.localize('cw.moon.ChatTitle'),
        },
        whisper: messageLvl,
        content: updatedMoons,
      });
    }
  }

  checkEvents() {
    if (!Gametime.isMaster()) return;

    const currentMonth = this.currentMonth;
    let combinedDate = (this.months[currentMonth].abbrev) + '-' + (this.day + 1);

    // seasons
    const newSeason = this.findSeason(Gametime.DTNow());
    let newTemp = 0;
    let newHumidity = 0;
    if (newSeason) {
      if (newSeason.temp == '-') {
        newTemp = -10;
      } else if (newSeason.temp == '+') {
        newTemp = 10;
      }
      if (newSeason.humidity == '-') {
        newHumidity = -1;
      } else if (newSeason.humidity == '+') {
        newHumidity = 1;
      }
      const updateFlag = this.weather.season !== newSeason.name ||
        this.weather.dawn !== newSeason.dawn ||
        this.weather.dusk !== newSeason.dusk ||
        this.weather.seasonColor !== newSeason.color ||
        this.weather.seasonTemp !== newTemp ||
        this.weather.seasonHumidity !== newHumidity ||
        this.weather.seasonRolltable !== newSeason.rolltable;
      if (newSeason && updateFlag) {
        // season change
        this.weather.setSeason(newSeason);
        if (this.weather.season !== newSeason.name) {
          const chatOut = '<b>' + newSeason.name + '</b> - ' + this.dateNum;
          ChatMessage.create({
            speaker: {
              alias: 'Season Change:',
            },
            whisper: ChatMessage.getWhisperRecipients('GM'),
            content: chatOut,
          });
        }
      }
    }

    //Find reoccuring events
    // eslint-disable-next-line no-useless-escape
    const macroRe = /\@Macro\[(.*)\].*/;
    // eslint-disable-next-line no-useless-escape
    const journalRe = /\@\@JournalEntry\[(.*)\].*/;

    const filtReEvents = this.reEvents.filter(event => event.date.combined === combinedDate);
    filtReEvents.forEach((event) => {
      const macro = this.getEntity(event.text, game.macros, macroRe);
      if (macro) {
        macro.execute();
      } else {
        const journal = this.getEntity(event.text, game.journal, journalRe);
        const chatOut = '<b>' + event.name + '</b> - ' + this.dateNum + '<hr>' + (journal ? journal.data.content : event.text);
        ChatMessage.create({
          speaker: {
            alias: 'Reoccuring Event:',
          },
          whisper: ChatMessage.getWhisperRecipients('GM'),
          content: chatOut,
        });
      }
    });

    combinedDate += '-' + this.year;
    const filtEvents = this.events.filter(event => event.date.combined === combinedDate);
    this.events = this.events.filter(event => event.date.combined !== combinedDate);

    filtEvents.forEach((event) => {
      let dt = Gametime.DTNow();
      let timeOut = '';
      if (event.allDay) {
        dt = dt.setAbsolute({
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      } else {
        let hours = event.date.hours;
        const AmOrPm = hours >= 12 ? 'PM' : 'AM';
        hours = (hours % 12) || 12;
        timeOut = ', ' + hours + ':' + `${event.date.minutes}`.padStart(2, '0') + ':' + `${event.date.seconds}`.padStart(2, '0') + ' ' + AmOrPm;
        dt = dt.setAbsolute({
          hours: event.date.hours,
          minutes: event.date.minutes,
          seconds: event.date.seconds
        });
      }
      const macro = this.getEntity(event.text, game.macros, macroRe);
      if (macro) {
        Gametime.doAt(dt, macro.name);
      } else {
        const journal = this.getEntity(event.text, game.journal, journalRe);
        const infoOut = (journal != null) ? journal.data.content : event.text;
        const chatOut = '<b>' + event.name + '</b> - ' + this.dateNum + timeOut + '<hr>' + infoOut;
        Gametime.reminderAt(dt, chatOut, 'Event:', 'GM');
      }
    });
  }

  getWeatherObj() {
    return {
      temp: this.weather.temp,
      cTemp: this.weather.cTemp,
      humidity: this.weather.humidity,
      lastTemp: this.weather.lastTemp,
      season: this.weather.season,
      seasonColor: this.weather.seasonColor,
      seasonTemp: this.weather.seasonTemp,
      seasonHumidity: this.weather.seasonHumidity,
      climate: this.weather.climate,
      climateTemp: this.weather.climateTemp,
      climateHumidity: this.weather.climateHumidity,
      precipitation: this.weather.precipitation,
      isVolcanic: this.weather.isVolcanic,
      isC: this.weather.isC,
      weatherFX: this.weather.weatherFX,
      dawn: this.weather.dawn,
      dusk: this.weather.dusk,
      tempRange: this.weather.tempRange
    };
  }

  genAbbrev() {
    let monthNum = 1;
    for (let i = 0, max = this.months.length; i < max; i++) {
      if (this.months[i].isNumbered) {
        this.months[i].abbrev = monthNum;
        monthNum += 1;
      }
    }
  }

  setTimeDisp() {
    const dt = Gametime.DTNow();
    let hours = dt.hours;
    const minutes = dt.minutes;
    const sec = dt.seconds;
    const AmOrPm = hours >= 12 ? 'PM' : 'AM';

    let dispMinutes = '';
    let dispSeconds = '';

    if (minutes < 10) {
      dispMinutes = '0' + minutes.toString();
    }
    if (sec < 10) {
      dispSeconds = '0' + sec;
    }
    if (this.is24) {
      this.timeDisp = hours + ':' + dispMinutes + ':' + dispSeconds;
    } else {
      hours = (hours % 12) || 12;
      this.timeDisp = hours + ':' + dispMinutes + ':' + dispSeconds + ' ' + AmOrPm;
    }
  }

  genDateWordy() {
    const now = Gametime.DTNow();
    const days = now.days + 1;
    let dayAppendage = '';
    if (days % 10 == 1 && days != 11) {
      dayAppendage = game.i18n.localize('cw.time.First');
    } else if (days % 10 == 2 && days != 12) {
      dayAppendage = game.i18n.localize('cw.time.Second');
    } else if (days % 10 == 3 && days != 13) {
      dayAppendage = game.i18n.localize('cw.time.Third');
    } else {
      dayAppendage = game.i18n.localize('cw.time.Fourth');
    }
    this.dateWordy = days + dayAppendage + ' of ' +
      this.months[now.months].name + ', ' + now.years + ' ' + this.era;

    const abbrev = this.months[now.months] ? this.months[now.months].abbrev : now.months;

    this.dateNum = days + '/' + `${abbrev}` + '/' + now.years + ' ' + this.era;
  }

  advanceMonth() {
    Gametime.setAbsolute(Gametime.DTNow().add({
      months: 1
    } as DTMod));
  }
}
