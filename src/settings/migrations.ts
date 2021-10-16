import { Log } from 'src/logger/logger';
import { WeatherData } from 'src/models/weatherData';

import { Migration } from './migrations/migration';


export class Migrations {
  private migrations: Set<Migration> = new Set();

  constructor(private logger: Log) {}

  public register(migration: Migration) {
    this.migrations.add(migration);
  }

  public run(currentVersion: number, currentData: unknown): WeatherData {
    const sortedMigration = this.buildListOfMigrations(currentVersion);
    let data = currentData;

    sortedMigration.forEach((migration: Migration) => {
      data = migration.migrate(data);
      this.logger.info('Migration to ' + migration.version + ' applied');
    });

    return data as WeatherData;
  }

  private buildListOfMigrations(currentVersion: number): Migration[] {
    const filteredMigrations = [...this.migrations].filter(migration => migration.version > currentVersion);
    return filteredMigrations.sort((a, b) => { return a.version - b.version; });
  }
}
