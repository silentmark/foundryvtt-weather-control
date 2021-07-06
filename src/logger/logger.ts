import { LogLevel } from './logLevel';

export default class Log {
  private messagePrefix = 'Weather | ';
  private checkLevel: () => LogLevel = () => LogLevel.NONE;

  public registerLevelCheckCallback(callback: () => LogLevel) {
    this.checkLevel = callback;
  }

  public info(message: any, ...optionalParams: any[]): void {
    if (this.checkLevel() >= LogLevel.INFO) {
      console.info(this.messagePrefix + message, ...optionalParams);
    }
  }

  public error(message: any, ...optionalParams: any[]): void {
    if (this.checkLevel() >= LogLevel.ERROR) {
      console.error(this.messagePrefix + message, ...optionalParams);
    }
  }

  public debug(message: any, ...optionalParams: any[]): void {
    if (this.checkLevel() >= LogLevel.DEBUG) {
      console.debug(this.messagePrefix + message, ...optionalParams);
    }
  }

  public warn(message: any, ...optionalParams: any[]): void {
    if (this.checkLevel() >= LogLevel.WARN) {
      console.warn(this.messagePrefix + message, ...optionalParams);
    }
  }

  public log(message: any, ...optionalParams: any[]): void {
    if (this.checkLevel() >= LogLevel.ALL) {
      console.log(this.messagePrefix + message, ...optionalParams);
    }
  }
}

