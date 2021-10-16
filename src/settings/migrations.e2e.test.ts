import { Log } from '@src/logger/logger';
import { mockClass } from '@src/testUtils';

import { Migrations } from './migrations';
import { Migration1 } from './migrations/migration-1';

const EXPECTED_DATETIME = 'some-datetime';
const EXPECTED_CLIMATE = 'some-climate';
const EXPECTED_VOLCANIC = 'some-volcanic-state';
const EXPECTED_LAST_TEMP = 'some-last-temp';
const EXPECTED_PRECIPITATION = 'some-precipitation';
const EXPECTED_TEMP = 'some-temperature';

const STARTING_DATA = {
  version: 1,
  dateTime: EXPECTED_DATETIME,
  cTemp: 0,
  climate: EXPECTED_CLIMATE,
  isVolcanic: EXPECTED_VOLCANIC,
  lastTemp: EXPECTED_LAST_TEMP,
  precipitation: EXPECTED_PRECIPITATION,
  temp: EXPECTED_TEMP,
  tempRange: { min: 1, max: 2 },
};

const EXPECTED_DATA = {
  version: 1,
  dateTime: EXPECTED_DATETIME,
  climate: EXPECTED_CLIMATE,
  isVolcanic: EXPECTED_VOLCANIC,
  lastTemp: EXPECTED_LAST_TEMP,
  precipitation: EXPECTED_PRECIPITATION,
  temp: EXPECTED_TEMP,
};


describe('Migrations End-to-End', () => {

  it('SHOULD run all migrations from 0 to the latest', () => {
    const migrations = new Migrations(mockClass(Log));
    const migration1 = new Migration1();
    migrations.register(migration1);

    const result = migrations.run(0, STARTING_DATA);

    expect(result).toEqual(EXPECTED_DATA);
  });
});
