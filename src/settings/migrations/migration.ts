
export abstract class Migration {
  public readonly version: number;

  constructor(version: number) {
    this.version = version;
  }

  public abstract migrate(): void;
}
