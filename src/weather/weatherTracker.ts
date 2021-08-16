import { WeatherData } from '../models/weatherData';
import { ModuleSettings } from '../module-settings';
import { ChatProxy } from '../proxies/chatProxy';
import { PrecipitationsGenerator } from './precipitationsGenerator';

/**
 * Manages all things related to  weather
 */
export class WeatherTracker {
  private weatherData: WeatherData;
  private precipitations: PrecipitationsGenerator;

  constructor(private gameRef: Game, private chatProxy: ChatProxy, private settings: ModuleSettings) {
    this.precipitations = new PrecipitationsGenerator(this.gameRef);
  }

  public loadWeatherData(weatherData: WeatherData) {
    this.weatherData = weatherData;
  }

  public generate(climateChanged = false): WeatherData {
    let seasonTemperatureOffset = this.weatherData.seasonTemp || 0;
    const climateTemperatureOffset = this.weatherData.climateTemp || 0;

    this.setTemperatureRange();

    if (this.weatherData.climate == 'tropical') {
      seasonTemperatureOffset = this.weatherData.seasonTemp * 0.5;
    }

    const timeOfYearOffset = seasonTemperatureOffset + climateTemperatureOffset;

    if (climateChanged) { // If climate has been changed
      this.weatherData.temp =
        this.randAroundValue(this.weatherData.lastTemp, 5) // Generate a new temperature from the previous, with a variance of 5
        + timeOfYearOffset // Add the season and climate offset
        + (this.rand(1, 20) === 20 ? 20 : 0); // On a nat 20, add 20 F to cause extreme temperature
    } else if (this.rand(1, 3) === 3) { // In one against 3 cases
      this.weatherData.temp = this.rand(40, 70) + timeOfYearOffset; // Generate a temperature between cold and room temp
    } else {
      this.weatherData.temp =
      this.randAroundValue(this.weatherData.lastTemp, 5) // Generate a new temperature from the previous, with a variance of 5
      + Math.floor(climateTemperatureOffset / 20 + seasonTemperatureOffset / 20); // Add the biggest offset between climate and  season. Will usually be 1, otherwise 2, maximum of 5
    }

    if (this.weatherData.temp > this.weatherData.tempRange.max) { // If current temperature is higher than the max
      // Increase the temperature by between 5 ⁰F and 10 ⁰F
      this.weatherData.temp = this.rand(this.weatherData.temp - 10, this.weatherData.temp - 5);
    } else if (this.weatherData.temp < this.weatherData.tempRange.min) { // If current temperature is lower than minimum
      // Decrease the temperature by between 5 ⁰F and 10 ⁰F
      this.weatherData.temp = this.rand(this.weatherData.temp + 5, this.weatherData.temp + 10);
    }

    // Save the last temperature
    this.weatherData.lastTemp = this.weatherData.temp;

    // Convert temperature to ⁰C
    this.weatherData.cTemp = Number(((this.weatherData.temp - 32) * 5 / 9).toFixed(1));

    this.weatherData.precipitation = this.precipitations.generate(this.rand(1, 20), this.weatherData);

    // Output to chat if enabled
    if (this.settings.getOutputWeatherToChat()) {
      this.output();
    }

    this.settings.setWeatherData(this.weatherData);
    return this.weatherData;
  }

  private setTemperatureRange() {
    if (this.weatherData.tempRange === undefined) {
      this.weatherData.tempRange = {
        max: 90,
        min: -20
      };
    }
  }

  private output() {
    let tempOut = '';
    if (this.settings.getUseCelcius()) {
      tempOut = this.weatherData.cTemp + ' °C';
    } else {
      tempOut = this.weatherData.temp + ' °F';
    }
    const gmUser = this.chatProxy.getWhisperRecipients('GM')[0];
    const chatOut = '<b>' + tempOut + '</b> - ' + this.weatherData.precipitation;

    this.chatProxy.create({
      speaker: {
        alias: this.gameRef.i18n.localize('cw.weather.tracker.Today'),
      },
      whisper: [gmUser.id],
      content: chatOut,
    });
  }

  /**
  * Generate a random number between to boundaries
  * @param min
  * @param max
  * @returns Random number
  */
  private rand(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Generate a random number around a middle value. The resulting value will no have a difference bigger than specified.
   * @param middleValue Value used as middle value
   * @param maxDifference Maximum difference from the middle value
   * @returns
   */
  private randAroundValue(middleValue: number, maxDifference: number) {
    return this.rand(middleValue - maxDifference, middleValue + maxDifference);
  }
}
