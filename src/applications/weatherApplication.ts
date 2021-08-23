import moduleJson from '@module';

import { SimpleCalendarApi } from '../libraries/simple-calendar/api';
import { DateTime } from '../libraries/simple-calendar/dateTime';
import { Log } from '../logger/logger';
import { WeatherData } from '../models/weatherData';
import { WindowPosition } from '../models/windowPosition';
import { ModuleSettings } from '../module-settings';
import { WeatherTracker } from '../weather/weatherTracker';
import { WindowDrag } from './windowDrag';

export class WeatherApplication extends Application {
  private windowDragHandler: WindowDrag;

  constructor(
    private gameRef: Game,
    private settings: ModuleSettings,
    private weatherTracker: WeatherTracker,
    private logger: Log,
    private renderCompleteCallback: () => void) {
    super();
    this.render(true);
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = `modules/${moduleJson.name}/templates/calendar.html`;
    options.popOut = false;
    options.resizable = false;

    return options;
  }

  public activateListeners(html: JQuery) {
    this.renderCompleteCallback();

    const dateFormatToggle = '#calendar--date-display';
    const startStopClock = '#start-stop-clock';

    this.initializeWindowInteractions(html);

    html.find(dateFormatToggle).on('mousedown', event => {
      this.toggleDateFormat(event);
    });

    html.find(startStopClock).on('mousedown', event => {
      this.startStopClock(event);
    });

    this.listenToWindowMove(html);
    this.listenToWeatherRefreshClick(html);

    global[moduleJson.class].resetPosition = this.resetPosition();
  }

  private listenToWindowMove(html: JQuery) {
    const weather = '#calendar-weather';

    html.find(weather).on('click', event => {
      event.preventDefault();
      if (this.gameRef.user.isGM || this.settings.getPlayerSeeWeather()) {
        document.getElementById('calendar-time-container').classList.toggle('showWeather');
      }
    });
  }

  private listenToWeatherRefreshClick(html: JQuery) {
    const refreshWeather = '#calendar-weather-regenerate';

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

  private initializeWindowInteractions(html: JQuery) {
    const calendarMoveHandle = html.find('#calendar--move-handle');
    const window = calendarMoveHandle.parents('#calendar-time-container').get(0);
    const windowPosition = this.settings.getWindowPosition();

    window.style.top = windowPosition.top + 'px';
    window.style.left = windowPosition.left + 'px';

    this.windowDragHandler = new WindowDrag();
    calendarMoveHandle.on('mousedown', () => {
      this.windowDragHandler.start(window, (windowPos: WindowPosition) => {
        this.settings.setWindowPosition(windowPos);
      });
    });
  }

  public resetPosition(): Promise<void> {
    const defaultPosition = { top: 100, left: 100 };
    return new Promise(resolve => {
      function check() {
        const element = this.getElementById('calendar-time-container');
        if (element) {
          this.logger.info('Resetting Calendar Position');
          element.style.top = defaultPosition.top;
          element.style.left = defaultPosition.left;
          this.settings.setWindowPosition({top: element.offsetTop, left: element.offsetLeft});
          element.style.bottom = null;
          resolve();
        } else {
          setTimeout(check, 30);
        }
      }
      check();
    });
  }
}
