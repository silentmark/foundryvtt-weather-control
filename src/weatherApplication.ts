import { DateTime } from './libraries/simple-calendar/dateTime';

export class WeatherApplication extends Application {
  constructor(private dateTime: DateTime) {
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

  public activateListeners(html) {
    this.updateDisplay(this.dateTime);

    const calendarMove = '#calendar--move-handle';

    html.find(calendarMove).mousedown(event => {
      this.handleDragMove(event);
    });
  }

  public updateDisplay(dateTime: DateTime) {
    // document.getElementById('calendar-weekday').innerHTML = Gametime.DTC.weekDays[now.dow()];

    // document.getElementById('calendar-date').innerHTML = cwdtData.dt.dateWordy;
    document.getElementById('calendar-date-num').innerHTML = dateTime.day.number + '/' + dateTime.month.number + '/' + dateTime.year.number;
    // cwdtData.dt.setTimeDisp();
    document.getElementById('calendar-time').innerHTML = dateTime.time.hour + ':' + dateTime.time.minute + ':' + dateTime.time.second;

    const temp = document.getElementById('calendar-weather--temp');
    if (temp && this) {

      // if (game.settings.get( 'calendar-weather', 'useCelcius')) {
      //   temp.innerHTML = cwdtData.dt.getWeatherObj().cTemp + ' °C';
      // } else {
      //   temp.innerHTML = cwdtData.dt.getWeatherObj().temp + ' °F';
      // }
      // document.getElementById('calendar-weather-precip').innerHTML = cwdtData.dt.getWeatherObj().precipitation;


      const offset = document.getElementById('calendar-time-container');
      document.getElementById('calendar-weather--container').style.left = (parseInt(offset.style.left.slice(0, -2)) + offset.offsetWidth) + 'px';
      // this.weatherForm.updateData(cwdtData.dt.getWeatherObj());
    }
    // if (Gametime.isRunning()) {
    //   document.getElementById('calendar-btn-advance_01').classList.add('disabled');
    //   document.getElementById('calendar-btn-advance_02').classList.add('disabled');
    //   document.getElementById('calendar-time-running').classList.add('isRunning');
    //   document.getElementById('clock-run-indicator').classList.add('isRunning');
    // } else {
    //   document.getElementById('calendar-btn-advance_01').classList.remove('disabled');
    //   document.getElementById('calendar-btn-advance_02').classList.remove('disabled');
    //   document.getElementById('calendar-time-running').classList.remove('isRunning');
    //   document.getElementById('clock-run-indicator').classList.remove('isRunning');
    // }
  }

  private handleDragMove(event) {
    event.preventDefault();
    event = event || window.event;
    let isRightMB = false;
    if ('which' in event) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      isRightMB = event.which == 3;
    } else if ('button' in event) { // IE, Opera
      isRightMB = event.button == 2;
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
      WeatherApplication.resetPos();
    }
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
}
