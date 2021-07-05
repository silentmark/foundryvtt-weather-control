import { Weather } from './weather';

let weather;

Hooks.on('ready', () => {
  weather = new Weather(game);
  weather.onReady();
});
