import { Migrations } from './migrations';
import { Migration } from './migrations/migration';

class TestableMigration extends Migration {
  constructor(version: number, private migrationSpy: () => void) {
    super(version);
  }

  public migrate() {
    this.migrationSpy();
  }
}

describe('Migrations', () => {
  it('SHOULD call all version starting from the lowest', () => {
    const migrations = new Migrations();
    const migrationSpy1 = jest.fn();
    const migration1 = new TestableMigration(1, migrationSpy1);
    const migrationSpy2 = jest.fn();
    const migration2 = new TestableMigration(2, migrationSpy2);
    migrations.register(migration2);
    migrations.register(migration1);

    migrations.run(0);

    expect(migrationSpy1).toHaveBeenCalledBefore(migrationSpy2);
  });

  it('SHOULD run migrations that are superios to the current version', () => {
    const migrations = new Migrations();
    const migrationSpy1 = jest.fn();
    const migration1 = new TestableMigration(1, migrationSpy1);
    const migrationSpy2 = jest.fn();
    const migration2 = new TestableMigration(2, migrationSpy2);
    const migrationSpy3 = jest.fn();
    const migration3 = new TestableMigration(3, migrationSpy3);
    migrations.register(migration2);
    migrations.register(migration1);
    migrations.register(migration3);

    migrations.run(1);

    expect(migrationSpy1).not.toHaveBeenCalled();
    expect(migrationSpy2).toHaveBeenCalledBefore(migrationSpy3);
  });
});
