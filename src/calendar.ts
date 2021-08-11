/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import  { CalendarEvents } from './calendarEvents';
import { _myCalendarSpec, DateTime as CWDateTime } from './dateTime';
import { Month } from './month';
import { WeatherTrackerLegacy } from './weatherTrackerLegacy';
import { CalendarForm } from './calendarForm';
import { cwdtData } from './calendar-weather';

export class Calendar extends Application {
  public isLoading = false;

  isOpen = false;
  toggled = true;
  showToPlayers = true;
  eventsForm = new CalendarEvents();
  // weatherForm = new WeatherForm();
  cwdtData = {};
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = 'modules/calendar-weather/templates/calendar.html';
    options.popOut = false;
    options.resizable = false;
    return options;
  }

  getData() {
    return cwdtData;
  }

  getPlayerDisp() {
    return this.showToPlayers;
  }

  setPos(pos) {
    return new Promise<void>(resolve => {
      function check() {
        const elmnt = document.getElementById('calendar-time-container');
        if (elmnt) {
          elmnt.style.bottom = null;
          const xPos = (pos.left) > window.innerWidth ? window.innerWidth-200 : pos.left;
          const yPos = (pos.top) > window.innerHeight-20 ? window.innerHeight-100 : pos.top;
          elmnt.style.top = (yPos) + 'px';
          elmnt.style.left = (xPos) + 'px';
          elmnt.style.position = 'fixed';
          elmnt.style.zIndex = '100';
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    });
  }

  loadSettings() {
    const data = game.settings.get('calendar-weather', 'dateTime') as any;
    if(game.user.data.flags.calendarWeather){
      // FIXME: Not the right way to type this. There probably is a better way to get the flag value too.
      const pos = (game.user.data.flags.calendarWeather as any).calendarPos;
      this.setPos(pos);
    }
    this.showToPlayers = game.settings.get('calendar-weather', 'calendarDisplay') as boolean;
    cwdtData.dt.is24 = game.settings.get('calendar-weather', 'is24') as boolean;
    if (!data || !data.months) {
      if (data.default) {
        console.log('calendar-weather | rebuilding data', data.default);
        // recover previous data
        cwdtData.dt = new CWDateTime();
        data.default.months = data.default.months.map((m, i) => {
          m.leapLength = m.length;
          if (!m.abbrev) m.abbrev = `${i+1}`;
          return m;
        });
        cwdtData.dt.months = data.default.months;
        cwdtData.dt.daysOfTheWeek = data.default.daysOfTheWeek;
        cwdtData.dt.setDayLength(data.default.dayLength);
        CWDateTime.updateDTC(); // set the calendar spec for correct date time calculations
        cwdtData.dt.era = data.default.era;
        cwdtData.dt.weather = cwdtData.dt.weather.load(data.default.weather);
        cwdtData.dt.seasons = data.default.seasons;
        cwdtData.dt.reEvents = data.default.reEvents;
        cwdtData.dt.events = data.default.events;
        cwdtData.dt.moons = data.default.moons;
        const timeout = game.settings.get('about-time', 'election-timeout') as number;
        setTimeout(function () {
          if (Gametime.isMaster()) {
            Gametime.setAbsolute({
              years: data.default.year,
              months: data.default.currentMonth,
              days: data.default.day - 1,
              hours: 0,
              minutes: 0,
              seconds: 0
            });
            const now = Gametime.DTNow();
            cwdtData.dt.currentWeekDay = cwdtData.dt.daysOfTheWeek[now.dow()];
            cwdtData.dt.timeDisp = now.shortDate().time;
          }
        }, timeout * 1000 + 100);

      } else {
        this.populateData();
        const timeout = game.settings.get('about-time', 'election-timeout') as  number;
        setTimeout(() => {
          if (Gametime.isMaster()) {
            Gametime.setAbsolute({
              years: 2020,
              months: 0,
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0
            });
          }
        }, timeout * 1000 + 100);
      }
    } else {
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
    }
  }

  checkEventBoxes() {
    this.eventsForm.checkBoxes();
    return;
  }

  populateData() {
    cwdtData.dt = new CWDateTime();
    const newMonth1 = new Month(game.i18n.localize('cw.calendar.settings.DefMonth'), 30, 30, true, '1');
    cwdtData.dt.addMonth(newMonth1);
    cwdtData.dt.addWeekday(game.i18n.localize('cw.calendar.Monday'));
    cwdtData.dt.addWeekday(game.i18n.localize('cw.calendar.Tuesday'));
    cwdtData.dt.addWeekday(game.i18n.localize('cw.calendar.Wednesday'));
    cwdtData.dt.addWeekday(game.i18n.localize('cw.calendar.Thursday'));
    cwdtData.dt.setDayLength(24);
    cwdtData.dt.settings = [];
    cwdtData.dt.events = [];
    cwdtData.dt.reEvents = [];
    cwdtData.dt.weather = new WeatherTrackerLegacy();
    CWDateTime.updateDTC();
    cwdtData.dt.setEra('AD');
  }

  settingsOpen(isOpen) {
    this.isOpen = isOpen;
    if (isOpen) {
      Gametime.stopRunning();
      console.log('calendar-weather | Pausing real time clock.');
    }
    // else {
    //   game.Gametime.startRunning();
    //   console.log("calendar-weather | Resuming real time clock.");
    // }
  }

  rebuild(obj) {
    cwdtData.dt = new CWDateTime();
    if (obj.months.length != 0) {
      cwdtData.dt.months = obj.months;
    }
    if (obj.daysOfTheWeek != []) {
      cwdtData.dt.daysOfTheWeek = obj.daysOfTheWeek;
    }
    const now = Gametime.DTNow();
    if (obj.dayLength != 0) {
      cwdtData.dt.dayLength = obj.dayLength;
    }
    const years = obj.year !== 0 ? obj.year : now.years;
    const months = obj.currentMonth;
    const days = obj.day;
    Gametime.setAbsolute(now.setAbsolute({
      years,
      months,
      days
    }));
    cwdtData.dt.numDayOfTheWeek = obj.numDayOfTheWeek;

    if (obj.dateWordy != '') {
      cwdtData.dt.dateWordy = obj.dateWordy;
    } else cwdtData.dt.genDateWordy();
    if (obj.era != '') {
      cwdtData.dt.era = obj.era;
    }
    if (obj.dateNum != '') {
      cwdtData.dt.dateNum = obj.dateNum;
    }

  }

  setEvents(newData) {
    const data = JSON.parse(newData);
    cwdtData.dt.seasons = data.seasons;
    cwdtData.dt.reEvents = data.reEvents;
    cwdtData.dt.events = data.events;
    cwdtData.dt.moons = data.moons;
    cwdtData.dt.checkEvents();
    cwdtData.dt.checkMoons();
  }

  updateSettings() {
    if (game.user.isGM) {
      game.settings.set('calendar-weather', 'dateTime', this.toObject());
      if (Gametime.DTC.saveUserCalendar && game.user.isGM) {
        Gametime.DTC.saveUserCalendar(_myCalendarSpec);
        // set about-time to use our calendar spec on startup
        if (game.settings.get('about-time', 'calendar') !== 0) game.settings.set('about-time', 'calendar', 0);
      }
      if (Gametime.isMaster()) Gametime._save(true);
    }
    console.log('AFTER UPDATE', game.settings.get('calendar-weather', 'dateTime'));
  }

  static resetPos(): Promise<void> {
    const pos = {bottom: 8, left: 15};
    return new Promise(resolve => {
      function check() {
        const elmnt = document.getElementById('calendar-time-container');
        if (elmnt) {
          console.log('calendar-weather | Resetting Calendar Position');
          elmnt.style.top = null;
          elmnt.style.bottom = (pos.bottom) + '%';
          elmnt.style.left = (pos.left) + '%';
          game.user.update({flags: {'calendar-weather':{ 'calendarPos': {top: elmnt.offsetTop, left: elmnt.offsetLeft}}}});
          elmnt.style.bottom = null;
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    });
  }

  static toggleCalendar(calendar){
    console.log('calendar-weather | Toggling calendar display.');
    const templatePath = 'modules/calendar-weather/templates/calendar.html';
    if (calendar.toggled) {
      calendar.toggled = false;
      calendar.close();
    } else {
      calendar.toggled = true;
      renderTemplate(templatePath, cwdtData).then(() => {
        calendar.render(true);
      }).then(
        calendar.setPos((game.user.data as Data).flags.calendarWeather.calendarPos)
      );
    }
  }

  updateDisplay() {
    const now = Gametime.DTNow();

    document.getElementById('calendar-weekday').innerHTML = Gametime.DTC.weekDays[now.dow()];

    document.getElementById('calendar-date').innerHTML = cwdtData.dt.dateWordy;
    document.getElementById('calendar-date-num').innerHTML = cwdtData.dt.dateNum;
    cwdtData.dt.setTimeDisp();
    document.getElementById('calendar-time').innerHTML = cwdtData.dt.timeDisp;

    const temp = document.getElementById('calendar-weather--temp');
    if (temp && this) {

      if (game.settings.get( 'calendar-weather', 'useCelcius')) {
        temp.innerHTML = cwdtData.dt.getWeatherObj().cTemp + ' °C';
      } else {
        temp.innerHTML = cwdtData.dt.getWeatherObj().temp + ' °F';
      }
      document.getElementById('calendar-weather-precip').innerHTML = cwdtData.dt.getWeatherObj().precipitation;


      const offset = document.getElementById('calendar-time-container');
      document.getElementById('calendar-weather--container').style.left = (parseInt(offset.style.left.slice(0, -2)) + offset.offsetWidth) + 'px';
      // this.weatherForm.updateData(cwdtData.dt.getWeatherObj());
    }
    if (Gametime.isRunning()) {
      document.getElementById('calendar-btn-advance_01').classList.add('disabled');
      document.getElementById('calendar-btn-advance_02').classList.add('disabled');
      document.getElementById('calendar-time-running').classList.add('isRunning');
      document.getElementById('clock-run-indicator').classList.add('isRunning');
    } else {
      document.getElementById('calendar-btn-advance_01').classList.remove('disabled');
      document.getElementById('calendar-btn-advance_02').classList.remove('disabled');
      document.getElementById('calendar-time-running').classList.remove('isRunning');
      document.getElementById('clock-run-indicator').classList.remove('isRunning');
    }

    //   let units = " °F";
    //   if (this.data.isC) {
    //     units = " °C";
    //     document.getElementsByClassName("calendar-weather-temp")[0].innerHTML = this.data.cTemp;
    //   } else {
    //     document.getElementsByClassName("calendar-weather-temp")[0].innerHTML = this.data.temp;
    //   }
    //   document.getElementById("calendar-weather-units").innerHTML = units;
    //   Hooks.callAll('calendarWeatherUpdateUnits', this.data.isC);
    // }


    Gametime._save(true);
  }

  toObject() {
    return {
      months: cwdtData.dt.months,
      daysOfTheWeek: cwdtData.dt.daysOfTheWeek,
      year: cwdtData.dt.year,
      day: cwdtData.dt.day,
      numDayOfTheWeek: cwdtData.dt.numDayOfTheWeek,
      first_day: _myCalendarSpec.first_day,
      currentMonth: cwdtData.dt.currentMonth,
      currentWeekday: cwdtData.dt.currentWeekDay,
      dateWordy: cwdtData.dt.dateWordy,
      era: cwdtData.dt.era,
      dayLength: cwdtData.dt.dayLength,
      timeDisp: cwdtData.dt.timeDisp,
      dateNum: cwdtData.dt.dateNum,
      weather: cwdtData.dt.weather,
      seasons: cwdtData.dt.seasons,
      reEvents: cwdtData.dt.reEvents,
      events: cwdtData.dt.events,
      moons: cwdtData.dt.moons
    };
  }

  activateListeners(html) {
    const toggleDateFormat = '#calendar--date-display';
    const advanceToDawn = '#calendar-btn-dawn';
    const advanceToNoon = '#calendar-btn-noon';
    const advanceToDusk = '#calendar-btn-dusk';
    const advanceToMidnight = '#calendar-btn-midnight';
    const advance = '.advance-btn';
    const calendarSetup = '#calendar-setup';
    const calendarMove = '#calendar--move-handle';
    const startStopClock = '#start-stop-clock';
    const events = '#calendar-events';
    const weather = '#calendar-weather';
    const refreshWeather = '#calendar-weather-regenerate';
    this.updateDisplay();
    cwdtData.dt.checkEvents();
    const form = new CalendarForm(JSON.stringify(this.toObject()));

    // toggle date format
    html.find(toggleDateFormat).click(ev =>{
      ev.preventDefault();
      ev.currentTarget.classList.toggle('altFormat');
    });

    //Next Dawn
    html.find(advanceToDawn).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log('calendar-weather | Advancing to dawn.');
        const now = Gametime.DTNow();
        const newDT = now.add({
          days: now.hours < 7 ? 0 : 1
        } as DTMod).setAbsolute({
          hours: 7,
          minutes: 0,
          seconds: 0
        });
        Gametime.setAbsolute(newDT);
      }
    });

    //To Midday
    html.find(advanceToNoon).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log('calendar-weather | Advancing to midday.');
        const now = Gametime.DTNow();
        const newDT = now.add({
          days: now.hours < 12 ? 0 : 1
        } as DTMod).setAbsolute({
          hours: 12,
          minutes: 0,
          seconds: 0
        });
        Gametime.setAbsolute(newDT);
      }
    });

    //To Dusk
    html.find(advanceToDusk).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log('calendar-weather | Advancing to dusk.');
        const now = Gametime.DTNow();
        const newDT = now.add({
          days: now.hours < 20 ? 0 : 1
        } as DTMod).setAbsolute({
          hours: 20,
          minutes: 0,
          seconds: 0
        });
        Gametime.setAbsolute(newDT);
      }
    });

    //To Midnight
    html.find(advanceToMidnight).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM) {
        console.log('calendar-weather | Advancing to midnight.');
        const newDT = Gametime.DTNow().add({
          days: 1
        } as DTMod).setAbsolute({
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        Gametime.setAbsolute(newDT);
      }
    });

    //advance granular
    html.find(advance).click(ev => {
      ev.preventDefault();
      if (!this.isOpen && game.user.isGM && !ev.target.classList.contains('disabled')) {
        const unit = ev.target.dataset.unit;
        const step = parseInt(ev.target.dataset.step);
        if (unit == 's'){
          Gametime.advanceClock(step);
        } else if (unit == 'min'){
          Gametime.advanceTime({
            minutes: step
          });
        } else if (unit == 'h'){
          Gametime.advanceTime({
            hours: step
          });
        }
      }
    });

    //toggles real time clock on off, disabling granular controls
    html.find(startStopClock).click(ev => {
      ev.preventDefault();
      ev = ev || window.event;

      if (!this.isOpen && Gametime.isMaster()) {
        if (Gametime.isRunning()) {
          console.log('calendar-weather | Stopping about-time pseudo clock.');
          Gametime.stopRunning();
        } else {
          console.log('calendar-weather | Starting about-time pseudo clock.');
          Gametime.startRunning();
        }
        this.updateDisplay();
        this.updateSettings();
      }
    });

    //Launch Calendar Form
    html.find(calendarSetup).click(ev => {
      ev.preventDefault();
      ev = ev || window.event;
      if (game.user.isGM) {
        form.renderForm(JSON.stringify(this.toObject()));
      }
    });

    html.find(calendarMove).mousedown(ev => {
      ev.preventDefault();
      ev = ev || window.event;
      let isRightMB = false;
      if ('which' in ev) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = ev.which == 3;
      } else if ('button' in ev) { // IE, Opera
        isRightMB = ev.button == 2;
      }

      if (!isRightMB) {
        dragElement(document.getElementById('calendar-time-container'));
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // eslint-disable-next-line no-inner-declarations
        function dragElement(elmnt) {
          elmnt.onmousedown = dragMouseDown;
          function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.bottom = null;
            elmnt.style.top = (elmnt.offsetTop - pos2) + 'px';
            elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px';
            elmnt.style.position = 'fixed';
            elmnt.style.zIndex = 100;
          }

          function closeDragElement() {
            // stop moving when mouse button is released:
            elmnt.onmousedown = null;
            document.onmouseup = null;
            document.onmousemove = null;
            let xPos = (elmnt.offsetLeft - pos1) > window.innerWidth ? window.innerWidth-200 : (elmnt.offsetLeft - pos1);
            let yPos = (elmnt.offsetTop - pos2) > window.innerHeight-20 ? window.innerHeight-100 : (elmnt.offsetTop - pos2);
            xPos = xPos < 0 ? 0 : xPos;
            yPos = yPos < 0 ? 0 : yPos;
            if(xPos != (elmnt.offsetLeft - pos1) || yPos != (elmnt.offsetTop - pos2)){
              elmnt.style.top = (yPos) + 'px';
              elmnt.style.left = (xPos) + 'px';
            }
            console.log(`calendar-weather | Setting calendar position to x: ${xPos}px, y: ${yPos}px`);
            game.user.update({flags: {'calendarWeather':{ 'calendarPos': {top: yPos, left: xPos}}}});
          }
        }
      } else if(isRightMB){
        Calendar.resetPos();
      }
    });

    html.find(events).click(ev => {
      ev.preventDefault();
      if (game.user.isGM) {
        this.eventsForm.renderForm(JSON.stringify(this.toObject()));
      }
    });
    html.find(weather).click(ev => {
      ev.preventDefault();
      if (game.user.isGM || game.settings.get('calendar-weather', 'playerSeeWeather')) {
        document.getElementById('calendar-time-container').classList.toggle('showWeather');
      }
    });
    html.find(refreshWeather).click(ev => {
      ev.preventDefault();
      cwdtData.dt.weather.generate();
      this.updateDisplay();
      this.updateSettings();
    });
  }
}
