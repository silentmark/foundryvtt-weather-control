import { LogLevel } from '../logger/logLevel';

export default interface DevModeApi {
  registerPackageDebugFlag(packageName: string, kind?: 'boolean' | 'level', options?: {
      default?: boolean | LogLevel;
  }): Promise<boolean>;

  getPackageDebugValue(packageName: string, kind?: 'boolean' | 'level'): boolean | LogLevel;
}
