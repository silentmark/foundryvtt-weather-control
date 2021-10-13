import { Migration } from './migrations/migration';


export class Migrations {
  private migrations: Set<Migration> = new Set();

  public register(migration: Migration) {
    this.migrations.add(migration);
  }

  public run(currentVersion: number) {
    const sortedMigration = this.buildListOfMigrations(currentVersion);

    sortedMigration.forEach((migration: Migration) => {
      migration.migrate();
    });
  }

  private buildListOfMigrations(currentVersion: number): Migration[] {
    const filteredMigrations = [...this.migrations].filter(migration => migration.version > currentVersion);
    return filteredMigrations.sort((a, b) => { return a.version - b.version; });
  }
}
