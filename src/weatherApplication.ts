import { SimpleCalendarApi } from './libraries/simple-calendar/api';
import { DateTime } from './libraries/simple-calendar/dateTime';
import { Log } from './logger/logger';
import { WeatherData } from './models/weatherData';
import { ModuleSettings } from './module-settings';
import { WeatherTracker } from './weather/weatherTracker';

export class WeatherApplication extends Application {
  constructor(
    private gameRef: Game,
    private settings: ModuleSettings,
    private currentDateTime: DateTime,
    private weatherTracker: WeatherTracker,
    private logger: Log) {
    super();
    this.render(true);
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = 'modules/weather/templates/calendar.html';
    options.popOut = false;
    options.resizable = false;

    return options;
  }

  public activateListeners(html: JQuery) {
    this.updateDateTime(this.currentDateTime);

    const calendarMove = '#calendar--move-handle';
    const dateFormatToggle = '#calendar--date-display';
    const startStopClock = '#start-stop-clock';
    const weather = '#calendar-weather';
    const refreshWeather = '#calendar-weather-regenerate';

    html.find(calendarMove).on('mousedown', event => {
      this.handleDragMove(event);
    });

    html.find(dateFormatToggle).on('mousedown', event => {
      this.toggleDateFormat(event);
    });

    html.find(startStopClock).on('mousedown', event => {
      this.startStopClock(event);
    });

    html.find(weather).on('click', event => {
      event.preventDefault();
      if (this.gameRef.user.isGM || this.settings.getPlayerSeeWeather()) {
        document.getElementById('calendar-time-container').classList.toggle('showWeather');
      }
    });

    html.find(refreshWeather).on('click', event => {
      event.preventDefault();
      this.updateWeather(this.weatherTracker.generate());
    });
  }

  public updateDateTime(dateTime: DateTime) {
    document.getElementById('calendar-weekday').innerHTML = dateTime.date.display.weekday;

    document.getElementById('calendar-date').innerHTML = this.getDateWordy(dateTime);
    document.getElementById('calendar-date-num').innerHTML = dateTime.date.day + '/' + dateTime.date.month + '/' + dateTime.date.year;
    document.getElementById('calendar-time').innerHTML = dateTime.date.hour + ':' + dateTime.date.minute + ':' + dateTime.date.second;

    this.updateClockStatus();
  }

  public updateWeather(weatherData: WeatherData) {
    document.getElementById('calendar-weather--temp').innerHTML = weatherData.cTemp + ' °C';
    document.getElementById('calendar-weather-precip').innerHTML = weatherData.precipitation;

    // if (game.settings.get( 'calendar-weather', 'useCelcius')) {
    //   temp.innerHTML = cwdtData.dt.getWeatherObj().cTemp + ' °C';
    // } else {
    //   temp.innerHTML = cwdtData.dt.getWeatherObj().temp + ' °F';
    // }
  }

  private getDateWordy(dateTime: DateTime): string {
    const display = dateTime.date.display;
    const day = `${display.day}${display.daySuffix}`;
    const month = `${display.monthName}`;
    const year = `${display.yearPrefix} ${display.year} ${display.yearPostfix}`;

    return `${day} of ${month}, ${year}`;
  }

  public updateClockStatus() {
    if (SimpleCalendarApi.clockStatus().started) {
      this.getElementById('calendar-btn-advance_01').classList.add('disabled');
      this.getElementById('calendar-btn-advance_02').classList.add('disabled');
      this.getElementById('calendar-time-running').classList.add('isRunning');
      this.getElementById('clock-run-indicator').classList.add('isRunning');
    } else {
      this.getElementById('calendar-btn-advance_01').classList.remove('disabled');
      this.getElementById('calendar-btn-advance_02').classList.remove('disabled');
      this.getElementById('calendar-time-running').classList.remove('isRunning');
      this.getElementById('clock-run-indicator').classList.remove('isRunning');
    }
  }

  private getElementById(id: string): HTMLElement {
    return document.getElementById(id);
  }

  private handleDragMove(event) {
    event.preventDefault();
    event = event || window.event;
    const isRightMB = this.isRightMouseButton(event);

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
          this.logger.info(`Setting window position to x: ${xPos}px, y: ${yPos}px`);
          this.gameRef.user.update({flags: {'weather':{ 'windowPos': {top: yPos, left: xPos}}}});
        }
      }
    } else if(isRightMB){
      WeatherApplication.resetPos();
    }
  }

  private isRightMouseButton(event): boolean {
    let isRightMB = false;
    if ('which' in event) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      isRightMB = event.which == 3;
    } else if ('button' in event) { // IE, Opera
      isRightMB = event.button == 2;
    }

    return isRightMB;
  }

  private toggleDateFormat(event) {
    event.currentTarget.classList.toggle('altFormat');
  }

  private startStopClock(event) {
    event.preventDefault();
    event = event || window.event;

    if (SimpleCalendarApi.isPrimaryGM()) {
      if (SimpleCalendarApi.clockStatus().started) {
        this.logger.debug('Stopping clock');
        SimpleCalendarApi.stopClock();
      } else {
        this.logger.debug('Starting clock');
        SimpleCalendarApi.startClock();
      }
    }

    this.updateClockStatus();
  }

  static resetPos(): Promise<void> {
    const pos = {bottom: 8, left: 15};
    return new Promise(resolve => {
      function check() {
        const elmnt = this.getElementById('calendar-time-container');
        if (elmnt) {
          this.logger.info('Resetting Calendar Position');
          elmnt.style.top = null;
          elmnt.style.bottom = (pos.bottom) + '%';
          elmnt.style.left = (pos.left) + '%';
          this.gameRef.user.update({flags: {'weather':{ 'windowPos': {top: elmnt.offsetTop, left: elmnt.offsetLeft}}}});
          elmnt.style.bottom = null;
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    });
  }
}
