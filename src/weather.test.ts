/* eslint-disable @typescript-eslint/no-explicit-any */
import { Weather } from './weather';

// declare global {
//   const game {
//     settings: any,
//   }
// }

// (window as any).game = {};

const gameMock = {
  settings: {
    register: jest.fn(),
  },
  i18n: {
    localize: jest.fn(),
  }
} as any;

describe('Weather', () => {
  let weather: Weather;

  it('SHOULD test', () => {
    weather = new Weather(gameMock);

    expect(weather).toBeTruthy();
  });

  it('SHOULD register settings when onReady is called', () => {
    weather = new Weather(gameMock);

    weather.onReady();

    expect(gameMock.settings.register).toHaveBeenCalledTimes(9);
  });
});
