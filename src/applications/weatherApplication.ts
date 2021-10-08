import moduleJson from '@module';

import { SimpleCalendarApi } from '../libraries/simple-calendar/api';
import { DateTime } from '../libraries/simple-calendar/dateTime';
import { Log } from '../logger/logger';
import { Climates, WeatherData } from '../models/weatherData';
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

  public getData(): any {
    return {
      isGM: this.isTimeManipulationEnabled(),
    };
  }

  public activateListeners(html: JQuery) {
    this.renderCompleteCallback();

    const dateFormatToggle = '#date-display';
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
    this.setClimate(html);
    this.listenToClimateChange(html);

    if (this.isTimeManipulationEnabled()) {
      this.listenToTimeSkipButtons(html);
    }

    global[moduleJson.class] = {};
    global[moduleJson.class].resetPosition = () => this.resetPosition();
  }

  public updateWeather(weatherData: WeatherData) {
    if (this.settings.getUseCelcius()) {
      document.getElementById('current-temperature').innerHTML = weatherData.cTemp + ' °C';
    } else {
      document.getElementById('current-temperature').innerHTML = weatherData.temp + ' °F';
    }
    document.getElementById('precipitation').innerHTML = weatherData.precipitation;
  }
  public updateClockStatus() {
    if (this.isTimeManipulationEnabled()) {
      if (SimpleCalendarApi.clockStatus().started) {
        this.getElementById('btn-advance_01').classList.add('disabled');
        this.getElementById('btn-advance_02').classList.add('disabled');
        this.getElementById('time-running').classList.add('isRunning');
        this.getElementById('clock-run-indicator').classList.add('isRunning');
      } else {
        this.getElementById('btn-advance_01').classList.remove('disabled');
        this.getElementById('btn-advance_02').classList.remove('disabled');
        this.getElementById('time-running').classList.remove('isRunning');
        this.getElementById('clock-run-indicator').classList.remove('isRunning');
      }
    }
  }

  public updateDateTime(dateTime: DateTime) {
    document.getElementById('weekday').innerHTML = dateTime.date.display.weekday;

    document.getElementById('date').innerHTML = this.getDateWordy(dateTime);
    document.getElementById('date-num').innerHTML = dateTime.date.day + '/' + dateTime.date.month + '/' + dateTime.date.year;
    document.getElementById('calendar-time').innerHTML = this.buildTimeString(dateTime);

    this.updateClockStatus();
  }

  public resetPosition() {
    const defaultPosition = { top: 100, left: 100 };
    const element = this.getElementById('weather-control-container');
    if (element) {
      this.logger.info('Resetting Window Position');
      element.style.top = defaultPosition.top + 'px';
      element.style.left = defaultPosition.left + 'px';
      this.settings.setWindowPosition({top: element.offsetTop, left: element.offsetLeft});
      element.style.bottom = null;
    }
  }

  private listenToWindowMove(html: JQuery) {
    const weather = '.weather-toggle';

    if (!this.gameRef.user.isGM && !this.settings.getPlayerSeeWeather()) {
      document.getElementById('weather-toggle').style.display = 'none';
    }

    html.find(weather).on('click', event => {
      event.preventDefault();
      if (this.gameRef.user.isGM || this.settings.getPlayerSeeWeather()) {
        document.getElementById('weather-control-container').classList.toggle('showWeather');
      }
    });
  }

  private listenToWeatherRefreshClick(html: JQuery) {
    const refreshWeather = '#weather-regenerate';

    html.find(refreshWeather).on('click', event => {
      event.preventDefault();
      this.updateWeather(this.weatherTracker.generate());
    });
  }

  private setClimate(html: JQuery) {
    const climateSelection = '#climate-selection';
    const climateName = this.settings.getWeatherData().climate?.name || Climates.temperate;
    html.find(climateSelection).val(climateName);
  }

  private listenToClimateChange(html: JQuery) {
    const climateSelection = '#climate-selection';

    html.find(climateSelection).on('change', (event) => {
      const target = event.originalEvent.target as HTMLSelectElement;
      const weatherData = this.weatherTracker.generate(target.value as Climates);
      this.updateWeather(weatherData);
    });
  }

  private buildTimeString(dateTime: DateTime): string {
    const date = dateTime.date;
    const hours = String(date.hour).padStart(2, '0');
    const minutes = String(date.minute).padStart(2, '0');
    const seconds = String(date.second).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  private getDateWordy(dateTime: DateTime): string {
    const display = dateTime.date.display;
    const day = `${display.day}${display.daySuffix}`;
    const month = `${display.monthName}`;
    const year = `${display.yearPrefix} ${display.year} ${display.yearPostfix}`;

    return `${day} of ${month}, ${year}`;
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
    const calendarMoveHandle = html.find('#window-move-handle');
    const window = calendarMoveHandle.parents('#weather-control-container').get(0);
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

  private listenToTimeSkipButtons(html: JQuery) {
    const advanceButtons = html.find('.advance-btn');
    advanceButtons.on('click', button => {
      const increment = button.target.getAttribute('data-increment');
      const unit = button.target.getAttribute('data-unit');

      SimpleCalendarApi.changeDate({ [unit]: Number(increment) });
    });
  }

  private isTimeManipulationEnabled(): boolean {
    return this.gameRef.user.isGM;
  }
}
