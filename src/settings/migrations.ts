import { Log } from 'src/logger/logger';
import { WeatherData } from 'src/models/weatherData';

import { Migration } from './migrations/migration';


export class Migrations {
  private migrations: Set<Migration> = new Set();

  constructor(private logger: Log) {}

  public register(migration: Migration) {
    this.migrations.add(migration);
  }

  public run(currentVersion = 0, currentData: unknown): WeatherData | false {
    const sortedMigrations = this.buildListOfMigrations(currentVersion);

    if (sortedMigrations.length > 0) {
      let data = currentData;

      sortedMigrations.forEach((migration: Migration) => {
        data = migration.migrate(data);
        this.logger.info('Migration to version ' + migration.version + ' applied');
      });

      return data as WeatherData;
    } else {
      this.logger.info('No migration needed');
      return false;
    }
  }

  private buildListOfMigrations(currentVersion: number): Migration[] {
    const filteredMigrations = [...this.migrations].filter(migration => migration.version > currentVersion);
    return filteredMigrations.sort((a, b) => { return a.version - b.version; });
  }
}
