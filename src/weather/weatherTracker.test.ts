import { WeatherTracker } from './weatherTracker';

describe('WeatherTracker', () => {
  let weatherTracker: WeatherTracker;

  beforeEach(() => {
    weatherTracker = new WeatherTracker();
  });

  it('SHOULD exist', () => {
    expect(weatherTracker).toBeTruthy();
  });
});
