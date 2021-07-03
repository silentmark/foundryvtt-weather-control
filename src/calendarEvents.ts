/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import { Gametime } from '../types/about-time';

export class CalendarEvents extends FormApplication {
  protected _updateObject(): Promise < unknown > {
    throw new Error('Method not implemented.');
  }

  data = {
    seasons: [],
    reEvents: [],
    events: [],
    moons: [],
    months: [],
    day: undefined,
    year: undefined
  };
  openCollapsables = [];
  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = 'modules/calendar-weather/templates/calendar-events.html';
    options.width = 600;
    options.height = 'auto';
    options.title = 'Calendar Weather Events';
    return options;
  }

  // save form data function
  saveData() {
    const savedData = {
      seasons: [],
      reEvents: [],
      events: [],
      moons: []
    };

    const moonName = document.getElementsByClassName('calendar-moon-name') as HTMLCollectionOf<HTMLInputElement>;
    const moonCycleLength = document.getElementsByClassName('calendar-moon-length') as HTMLCollectionOf<HTMLInputElement>;
    const moonPercent = document.getElementsByClassName('calendar-moon-percent') as HTMLCollectionOf<HTMLInputElement>;
    const moonWaxing = document.getElementsByClassName('calendar-moon-waxing') as HTMLCollectionOf<HTMLInputElement>;
    const moonLEclipse = document.getElementsByClassName('calendar-moon-leclipse') as HTMLCollectionOf<HTMLInputElement>;
    const moonSEclipse = document.getElementsByClassName('calendar-moon-seclipse') as HTMLCollectionOf<HTMLInputElement>;
    let moon = {};

    // iterate through all moons
    for (let i = 0; i < moonName.length; i++) {
      // Set the moon names
      if (moonName[i].value == '') {
        moon['name'] = 'Moon ' + i;
      } else {
        moon['name'] = moonName[i].value;
      }

      // length of lunar cycle
      if (parseInt(moonCycleLength[i].value) < 1 || isNaN(moonCycleLength[i].value as any)) {
        moon['cycleLength'] = 1;
      } else {
        moon['cycleLength'] = parseFloat(moonCycleLength[i].value);
      }

      // lunar cycle progress in percent
      if (parseFloat(moonPercent[i].value) < 0 || isNaN(moonPercent[i].value as any)) {
        moon['cyclePercent'] = 0;
      } else if (parseFloat(moonPercent[i].value) > 100) {
        moon['cyclePercent'] = 100;
      } else {
        moon['cyclePercent'] = parseFloat(moonPercent[i].value);
      }

      // moon is waxing
      moon['isWaxing'] = moonWaxing[i].checked;

      // lunar eclipse chance
      if (parseFloat(moonLEclipse[i].value) < 0 || isNaN(moonLEclipse[i].value as any)) {
        moon['lunarEclipseChance'] = 0;
      } else if (parseFloat(moonLEclipse[i].value) > 100) {
        moon['lunarEclipseChance'] = 100;
      } else {
        moon['lunarEclipseChance'] = parseFloat(moonLEclipse[i].value);
      }

      // solar eclipse chance
      if (parseFloat(moonSEclipse[i].value) < 0 || isNaN(moonSEclipse[i].value as any)) {
        moon['solarEclipseChance'] = 0;
      } else if (parseFloat(moonSEclipse[i].value) > 100) {
        moon['solarEclipseChance'] = 100;
      } else {
        moon['solarEclipseChance'] = parseFloat(moonSEclipse[i].value);
      }

      moon['referenceTime'] = Gametime.DTNow().toSeconds();
      moon['referencePercent'] = moonWaxing[i].checked ? moon['cyclePercent'] : 200 - moon['cyclePercent'];

      // push moon array data to moons array
      savedData.moons.push(moon);

      // clear moon array
      moon = {};
    }

    const seasonName = document.getElementsByClassName('calendar-season-name') as HTMLCollectionOf<HTMLInputElement>;
    const seasonMonth = document.getElementsByClassName('calendar-season-month-value') as HTMLCollectionOf<HTMLSelectElement>;
    const seasonDay = document.getElementsByClassName('calendar-season-day') as HTMLCollectionOf<HTMLSelectElement>;
    const seasonTemp = document.getElementsByClassName('calendar-season-temp') as HTMLCollectionOf<HTMLSelectElement>;
    const seasonHumid = document.getElementsByClassName('calendar-season-humidity') as HTMLCollectionOf<HTMLSelectElement>;
    const seasonColor = document.getElementsByClassName('calendar-season-color') as HTMLCollectionOf<HTMLSelectElement>;
    const seasonDawn = document.getElementsByClassName('calendar-dawn') as HTMLCollectionOf<HTMLInputElement>;
    const seasonDusk = document.getElementsByClassName('calendar-dusk') as HTMLCollectionOf<HTMLSelectElement>;
    const seasonRolltable = document.getElementsByClassName('calendar-season-rolltable') as HTMLCollectionOf<HTMLInputElement>;
    const dawnAmpm = document.getElementsByClassName('calendar-dawn-ampm') as HTMLCollectionOf<HTMLSelectElement>;
    const duskAmpm = document.getElementsByClassName('calendar-dusk-ampm') as HTMLCollectionOf<HTMLSelectElement>;
    let event = {};
    let day = 0;
    let hours = 0;
    for (let i = 0, max = seasonName.length; i < max; i++) {
      if (seasonName[i].value == '') {
        event['name'] = 'Season ' + i;
      } else {
        event['name'] = seasonName[i].value;
      }

      event['rolltable'] = seasonRolltable[i].value;

      day = Number(seasonDay[i].selectedIndex) + 1;
      event['date'] = {
        month: seasonMonth[i].options[seasonMonth[i].selectedIndex].value,
        day: day,
        combined: seasonMonth[i].options[seasonMonth[i].selectedIndex].value + '-' + day,
      };
      //temp
      event['temp'] = seasonTemp[i].options[seasonTemp[i].selectedIndex].value;
      //humid
      event['humidity'] = seasonHumid[i].options[seasonHumid[i].selectedIndex].value;
      //color
      event['color'] = seasonColor[i].options[seasonColor[i].selectedIndex].value;

      if (parseInt(seasonDawn[i].value)) {
        hours = parseInt(seasonDawn[i].value);
      }
      if (hours > 24 || hours < 0 || hours == null) {
        hours = 23;
      }
      if (dawnAmpm[i].value == 'PM' && hours < 12) {
        hours = hours + 12;
      }
      if (dawnAmpm[i].value == 'AM' && hours == 12) {
        hours = hours - 12;
      }
      event['dawn'] = hours;

      if (parseInt(seasonDusk[i].value)) {
        hours = parseInt(seasonDusk[i].value);
      }
      if (hours > 24 || hours < 0 || hours == null) {
        hours = 23;
      }
      if (duskAmpm[i].value == 'PM' && hours < 12) {
        hours = hours + 12;
      }
      if (duskAmpm[i].value == 'AM' && hours == 12) {
        hours = hours - 12;
      }
      event['dusk'] = hours;
      savedData.seasons.push(event);
      event = {};
    }

    const reEventName = document.getElementsByClassName('calendar-reEvent-name') as HTMLCollectionOf<HTMLInputElement>;
    const reEventMonth = document.getElementsByClassName('calendar-reEvent-month-value') as HTMLCollectionOf<HTMLSelectElement>;
    const reEventDay = document.getElementsByClassName('calendar-reEvent-day') as HTMLCollectionOf<HTMLSelectElement>;
    const reEventContent = document.getElementsByClassName('calendar-reEvent-text') as HTMLCollectionOf<HTMLSelectElement>;
    event = {};
    day = 0;
    for (let i = 0, max = reEventName.length; i < max; i++) {
      if (reEventName[i].value == '') {
        event['name'] = 'Event ' + i;
      } else {
        event['name'] = reEventName[i].value;
      }
      day = Number(reEventDay[i].selectedIndex) + 1;
      event['date'] = {
        month: reEventMonth[i].options[reEventMonth[i].selectedIndex].value,
        day: day,
        combined: reEventMonth[i].options[reEventMonth[i].selectedIndex].value + '-' + day,
      };
      event['text'] = reEventContent[i].value;
      savedData.reEvents.push(event);
      event = {};
    }

    const eventName = document.getElementsByClassName('calendar-event-name') as HTMLCollectionOf<HTMLInputElement>;
    const eventContent = document.getElementsByClassName('calendar-event-content') as HTMLCollectionOf<HTMLInputElement>;
    const eventMonth = document.getElementsByClassName('calendar-event-month-value') as HTMLCollectionOf<HTMLSelectElement>;
    const eventDay = document.getElementsByClassName('calendar-event-day') as HTMLCollectionOf<HTMLSelectElement>;
    const eventYear = document.getElementsByClassName('calendar-event-year') as HTMLCollectionOf<HTMLInputElement>;
    const eventHours = document.getElementsByClassName('calendar-event-time-hours') as HTMLCollectionOf<HTMLInputElement>;
    const eventMin = document.getElementsByClassName('calendar-event-time-min') as HTMLCollectionOf<HTMLInputElement>;
    const eventSec = document.getElementsByClassName('calendar-event-time-sec') as HTMLCollectionOf<HTMLInputElement>;
    const ampm = document.getElementsByClassName('calendar-event-ampm') as HTMLCollectionOf<HTMLSelectElement>;
    const allDay = document.getElementsByClassName('calendar-event-allDay') as HTMLCollectionOf<HTMLInputElement>;
    event = {};
    day = 0;

    let minutes = 0;
    let seconds = 0;

    for (let i = 0, max = eventName.length; i < max; i++) {
      if (eventName[i].value == '') {
        event['name'] = 'Event ' + i;
      } else {
        event['name'] = eventName[i].value;
      }
      day = Number(eventDay[i].selectedIndex) + 1;

      hours = Number(eventHours[i].value);
      if (hours > 24 || hours < 0) {
        hours = 23;
      }
      if (ampm[i].value == 'PM' && hours < 12) {
        hours = hours + 12;
      }
      if (ampm[i].value == 'AM' && hours == 12) {
        hours = hours - 12;
      }
      minutes = parseInt(eventMin[i].value);
      if (minutes > 59 || minutes < 0) {
        minutes = 59;
      }
      seconds = parseInt(eventSec[i].value);
      if (seconds > 59 || seconds < 0) {
        seconds = 59;
      }

      event['date'] = {
        month: eventMonth[i].options[eventMonth[i].selectedIndex].value,
        day: day,
        year: eventYear[i].value,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        combined: eventMonth[i].options[eventMonth[i].selectedIndex].value + '-' + day + '-' + eventYear[i].value,
      };
      event['text'] = eventContent[i].value;
      event['allDay'] = allDay[i].checked;

      savedData.events.push(event);
      event = {};
    }

    //keep collapsables open
    this.openCollapsables = [];
    const collapsables = document.getElementsByClassName('calendar-collapsable') as HTMLCollectionOf<HTMLButtonElement>;
    console.log(collapsables);
    for (const collapsable of collapsables as unknown as HTMLButtonElement[]) { // This is very bad since we are setting the type before, but it will do for now.
      if (collapsable.classList.contains('active')) this.openCollapsables.push(collapsable.name);
    }

    console.log(this.openCollapsables);

    this.data = Object.assign(this.data, savedData);
    return JSON.stringify(this.data);
  }

  getData(): any {
    return this.data;
  }

  async checkBoxes() {
    const moonName = document.getElementsByClassName('calendar-moon-name') as HTMLCollectionOf<HTMLInputElement>;
    const moonWaxing = document.getElementsByClassName('calendar-moon-waxing') as HTMLCollectionOf<HTMLInputElement>;
    let moon = undefined;
    for (let i = 0; i < moonWaxing.length; i++) {
      moon = this.data.moons.find(moon => moon.name == moonName[i].value);
      if (moon)
        moonWaxing[i].checked = moon.isWaxing;
    }

    let names = document.getElementsByClassName('calendar-season-name') as HTMLCollectionOf<HTMLInputElement>;
    let days = document.getElementsByClassName('calendar-season-day') as HTMLCollectionOf<HTMLInputElement>;
    let months = document.getElementsByClassName('calendar-season-month-value') as HTMLCollectionOf<HTMLInputElement>;
    const temp = document.getElementsByClassName('calendar-season-temp') as HTMLCollectionOf<HTMLSelectElement>;
    const humidity = document.getElementsByClassName('calendar-season-humidity') as HTMLCollectionOf<HTMLSelectElement>;
    const color = document.getElementsByClassName('calendar-season-color') as HTMLCollectionOf<HTMLSelectElement>;
    const seasonDawn = document.getElementsByClassName('calendar-dawn') as HTMLCollectionOf<HTMLInputElement>;
    const seasonDusk = document.getElementsByClassName('calendar-dusk') as HTMLCollectionOf<HTMLInputElement>;
    const dawnAmpm = document.getElementsByClassName('calendar-dawn-ampm') as HTMLCollectionOf<HTMLSelectElement>;
    const duskAmpm = document.getElementsByClassName('calendar-dusk-ampm') as HTMLCollectionOf<HTMLSelectElement>;
    //init vars
    let length = 0;
    let event = undefined;
    let numElements = this.data.seasons.length;

    //loop through all events setting dropdowns to correct value
    for (let i = 0; i < numElements; i++) {
      //makes sure element exists at i
      if (names[i] && months[i]) {
        //gets event that matches element from data
        event = this.data.seasons.find(fEvent => fEvent.name == names[i].value);
        if (event) {
          for (let k = 0, max = temp[i].getElementsByTagName('option').length; k < max; k++) {
            if (temp[i].getElementsByTagName('option')[k].value == event.temp) {
              temp[i].getElementsByTagName('option')[k].selected = true;
            }
          }
          for (let k = 0, max = humidity[i].getElementsByTagName('option').length; k < max; k++) {
            if (humidity[i].getElementsByTagName('option')[k].value == event.humidity) {
              humidity[i].getElementsByTagName('option')[k].selected = true;
            }
          }
          for (let k = 0, max = color[i].getElementsByTagName('option').length; k < max; k++) {
            if (color[i].getElementsByTagName('option')[k].value == event.color) {
              color[i].getElementsByTagName('option')[k].selected = true;
            }
          }

          for (let k = 0, max = months[i].getElementsByTagName('option').length; k < max; k++) {
            if (months[i].getElementsByTagName('option')[k].value == event.date.month) {
              months[i].getElementsByTagName('option')[k].selected = true;
              //also grabs the months length, while it's there.
              length = parseInt(months[i].getElementsByTagName('option')[k].attributes['name'].value);
            }
          }
          if (event.dawn >= 12) {
            dawnAmpm[i].getElementsByTagName('option')[1].selected = true;
          } else {
            dawnAmpm[i].getElementsByTagName('option')[0].selected = true;
          }
          seasonDawn[i].value = ((event.dawn + 11) % 12 + 1).toString();

          if (event.dusk >= 12) {
            duskAmpm[i].getElementsByTagName('option')[0].selected = true;
          } else {
            duskAmpm[i].getElementsByTagName('option')[1].selected = true;
          }
          seasonDusk[i].value = ((event.dusk + 11) % 12 + 1).toString();
          //create a whole bunch of options corresponding to each day in the selected month.
          const frag = document.createDocumentFragment();
          const element = days[i];
          //clears day selection to prevent day duplication
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          //create a dropdown option for the length of the selected month
          for (let k = 1, max = length + 1; k < max; k++) {
            const option = document.createElement('option');
            option.value = k.toString();
            //if the index is the same as the event's day, select it.
            if (k == event.date.day) {
              option.selected = true;
            }
            option.appendChild(document.createTextNode(k.toString()));
            frag.appendChild(option);
          }
          //add generated days to the day dropdown.
          element.appendChild(frag);
        }
      }
    }

    names = document.getElementsByClassName('calendar-reEvent-name') as HTMLCollectionOf<HTMLInputElement>;
    days = document.getElementsByClassName('calendar-reEvent-day') as HTMLCollectionOf<HTMLInputElement>;
    months = document.getElementsByClassName('calendar-reEvent-month-value') as HTMLCollectionOf<HTMLInputElement>;
    //init vars
    length = 0;
    event = undefined;
    numElements = this.data.reEvents.length;

    //loop through all events setting dropdowns to correct value
    for (let i = 0; i < numElements; i++) {
      //makes sure element exists at i
      if (names[i] && months[i]) {
        //gets event that matches element from data
        event = this.data.reEvents.find(fEvent => fEvent.name == names[i].value);
        if (event) {
          //loop through each option for the month dropdown, finding the one that matches the event's date and selects it
          for (let k = 0, max = months[i].getElementsByTagName('option').length; k < max; k++) {
            if (months[i].getElementsByTagName('option')[k].value == event.date.month) {
              months[i].getElementsByTagName('option')[k].selected = true;
              //also grabs the months length, while it's there.
              length = parseInt(months[i].getElementsByTagName('option')[k].attributes['name'].value);
            }
          }
          //create a whole bunch of options corresponding to each day in the selected month.
          const frag = document.createDocumentFragment();
          const element = days[i];
          //clears day selection to prevent day duplication
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          //create a dropdown option for the length of the selected month
          for (let k = 1, max = length + 1; k < max; k++) {
            const option = document.createElement('option');
            option.value = k.toString();
            //if the index is the same as the event's day, select it.
            if (k == event.date.day) {
              option.selected = true;
            }
            option.appendChild(document.createTextNode(k.toString()));
            frag.appendChild(option);
          }
          //add generated days to the day dropdown.
          element.appendChild(frag);
        }
      }
    }

    names = document.getElementsByClassName('calendar-event-name') as HTMLCollectionOf<HTMLInputElement>;
    days = document.getElementsByClassName('calendar-event-day') as HTMLCollectionOf<HTMLInputElement>;
    months = document.getElementsByClassName('calendar-event-month-value') as HTMLCollectionOf<HTMLInputElement>;
    const allDay = document.getElementsByClassName('calendar-event-allDay') as HTMLCollectionOf<HTMLInputElement>;
    const ampm = document.getElementsByClassName('calendar-event-ampm') as HTMLCollectionOf<HTMLSelectElement>;
    const hours = document.getElementsByClassName('calendar-event-time-hours') as HTMLCollectionOf<HTMLInputElement>;
    //init vars
    length = 0;
    event = undefined;
    numElements = this.data.events.length;

    //loop through all events setting dropdowns to correct value
    for (let i = 0; i < numElements; i++) {
      //makes sure element exists at i
      if (names[i] && months[i]) {
        //gets event that matches element from data
        event = this.data.events.find(fEvent => fEvent.name == names[i].value);
        if (event) {
          //loop through each option for the month dropdown, finding the one that matches the event's date and selects it
          for (let k = 0, max = months[i].getElementsByTagName('option').length; k < max; k++) {
            if (months[i].getElementsByTagName('option')[k].value == event.date.month) {
              months[i].getElementsByTagName('option')[k].selected = true;
              //also grabs the months length, while it's there.
              length = parseInt(months[i].getElementsByTagName('option')[k].attributes['name'].value);
            }
          }
          //create a whole bunch of options corresponding to each day in the selected month.
          const frag = document.createDocumentFragment();
          const element = days[i];
          //clears day selection to prevent day duplication
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
          //create a dropdown option for the length of the selected month
          for (let k = 1, max = length + 1; k < max; k++) {
            const option = document.createElement('option');
            option.value = k.toString();
            //if the index is the same as the event's day, select it.
            if (k == event.date.day) {
              option.selected = true;
            }
            option.appendChild(document.createTextNode(k.toString()));
            frag.appendChild(option);
          }
          //add generated days to the day dropdown.
          element.appendChild(frag);

          //check if the event is all day
          allDay[i].checked = event.allDay;

          if (event.date.hours >= 12) {
            ampm[i].getElementsByTagName('option')[1].selected = true;
          } else {
            ampm[i].getElementsByTagName('option')[0].selected = true;
          }
          hours[i].value = ((event.date.hours + 11) % 12 + 1).toString();

        }
      }
    }

    //keep collapsables open
    console.log(this.openCollapsables);
    if (this.openCollapsables.length != 0) {
      const collapsables = document.getElementsByClassName('calendar-collapsable');
      for (const collapsable of collapsables as unknown as any[]) {
        if (this.openCollapsables.includes(collapsable.name)) {
          collapsable.classList.toggle('active');
          const content = collapsable.nextElementSibling;
          if (content.style.display != 'block' || content.style.display === '') {
            content.style.display = 'block';
            collapsable.innerHTML = collapsable.innerHTML.replace('+', '-');
          }
        }
      }
      document.getElementById('calendar-events-form').parentElement.parentElement.style.height = 'auto';
    }
  }

  activateListeners(html) {
    const submit = '#calendar-events-submit';
    const addMoon = '#calendar-events-add-moon';
    const delMoon = 'button[class="calendar-moon-del"]';
    const addSeason = '#calendar-events-add-season';
    const delSeason = 'button[class=\'calendar-season-del\']';
    const addReEvent = '#calendar-events-add-reEvent';
    const delReEvent = 'button[class=\'calendar-reEvent-del\']';
    const addEvent = '#calendar-events-add-event';
    const delEvent = 'button[class=\'calendar-event-del\']';
    const collapsables = 'button[class=\'calendar-collapsable\']';

    html.find(submit).click(ev => {
      ev.preventDefault();
      Hooks.callAll('calendarEventsClose', this.saveData());
      this.close();
    });
    html.find(addMoon).click(ev => {
      ev.preventDefault();
      this.saveData();
      this.data.moons.push({
        cycleLength: 30,
        cyclePercent: 0,
        lunarEclipseChance: 0.02,
        solarEclipseChance: 0.0005
      });
      this.render(true);
    });
    html.find(addSeason).click(ev => {
      ev.preventDefault();
      this.saveData();
      this.data.seasons.push({
        month: '1',
        day: 1,
        dawn: 6,
        dusk: 7
      });
      this.render(true);
    });
    html.find(addReEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      this.data.reEvents.push({
        name: '',
        date: {
          month: '1',
          day: 1,
          combined: '1-' + 1
        }
      });
      this.render(true);
    });
    html.find(addEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      const dt = Gametime.DTNow();
      this.data.events.push({
        name: '',
        date: {
          month: this.data.months[dt.months].abbrev,
          day: this.data.day + 1,

          year: this.data.year,
          hours: dt.hours,
          minutes: dt.minutes,
          seconds: dt.seconds,
          combined: this.data.months[dt.months].abbrev + '-' + this.data.day + '-' + this.data.year
        },
        allDay: false,
      });
      this.render(true);
    });
    html.find(delMoon).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split('-');
      const index = targetName[targetName.length - 1];
      this.data.moons.splice(index, 1);
      this.render(true);
    });
    html.find(delSeason).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split('-');
      const index = targetName[targetName.length - 1];
      this.data.seasons.splice(index, 1);
      this.render(true);
    });
    html.find(delReEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split('-');
      const index = targetName[targetName.length - 1];
      this.data.reEvents.splice(index, 1);
      this.render(true);
    });
    html.find(delEvent).click(ev => {
      ev.preventDefault();
      this.saveData();
      const targetName = ev.currentTarget.name.split('-');
      const index = targetName[targetName.length - 1];
      this.data.events.splice(index, 1);
      this.render(true);
    });
    html.find(collapsables).click(ev => {
      ev.preventDefault();
      ev.currentTarget.classList.toggle('active');
      const content = ev.currentTarget.nextElementSibling;
      if (content.style.display != 'block' || content.style.display === '') {
        content.style.display = 'block';
        ev.currentTarget.innerHTML = ev.currentTarget.innerHTML.replace('+', '-');
      } else {
        content.style.display = 'none';
        ev.currentTarget.innerHTML = ev.currentTarget.innerHTML.replace('-', '+');
      }
      this.setPosition();
    });

    const reText = html.find('.calendar-reEvent-text');
    for (let i = 0; i < reText.length; i++) reText[i].ondrop = this.onDrop.bind(null, reText[i]);
    const evText = html.find('.calendar-event-content');
    for (let i = 0; i < evText.length; i++) evText[i].ondrop = this.onDrop.bind(null, evText[i]);
    const rollText = html.find('.calendar-season-rolltable');
    for (let i = 0; i < rollText.length; i++) rollText[i].ondrop = this.onRollDrop.bind(null, rollText[i]);
  }

  onDrop = (html, event) => {
    const collections = {
      JournalEntry: JournalEntry,
      Macro: Macro,
    };
    try {
      const data = JSON.parse(event.dataTransfer.getData('text'));
      if (collections[data.type]) {
        event.preventDefault();
        const name = collections[data.type].collection.get(data.id).data.name;
        html.value = `@${data.type}[${data.id}]{${name}}`;
      }
    } catch (err) {
      console.log(event.dataTransfer.getData('text'));
      console.warn(err);
    }
  }

  onRollDrop = (html, event) => {
    const collections = {
      RollTable: RollTable,
    };
    try {
      const data = JSON.parse(event.dataTransfer.getData('text'));
      if (collections[data.type]) {
        event.preventDefault();
        const name = collections[data.type].collection.get(data.id).data.name;
        html.value = `@${data.type}[${data.id}]{${name}}`;
      }
    } catch (err) {
      console.log(event.dataTransfer.getData('text'));
      console.warn(err);
    }
  }

  renderForm(newData) {
    this.data = Object.assign(this.data, JSON.parse(newData));
    const templatePath = 'modules/calendar-weather/templates/calendar-events.html';
    renderTemplate(templatePath, this.data).then(() => {
      this.render(true);
    });
  }
}
