export enum LogLevel {
  trace,
  debug,
  info,
  warn,
  error,
}

export type LoggerConfig = {
  logLevel: LogLevel;
};

const SEPARATOR = ' => ';

const initConfig: LoggerConfig = {
  logLevel: __DEV__ ? LogLevel.debug : LogLevel.info,
};

class LoggerFactory {
  private static instance: LoggerFactory;

  private constructor(readonly loggerConfig: LoggerConfig) {}

  public static init(config: LoggerConfig): LoggerFactory {
    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new LoggerFactory(config ?? initConfig);
    }
    // TODO  validate and process config
    return LoggerFactory.instance;
  }

  public static getInstance(): LoggerFactory {
    return LoggerFactory.instance;
  }

  static getLogger = (className: string, loggerConfig?: LoggerConfig) => {
    if (!LoggerFactory.instance && !loggerConfig) {
      LoggerFactory.instance = new LoggerFactory(initConfig);
    }
    return new Log(
      className,
      loggerConfig ?? LoggerFactory.instance.loggerConfig,
    );
  };
}
class Log {
  constructor(public className: string, readonly loggerConfig: LoggerConfig) {}

  trace(message?: any, ...optionalParams: any[]) {
    this.loggerConfig.logLevel <= LogLevel.trace &&
      console.debug(
        this.className + SEPARATOR + JSON.stringify(message),
        ...optionalParams,
      );
  }

  debug(message?: any, ...optionalParams: any[]) {
    this.loggerConfig.logLevel <= LogLevel.debug &&
      console.debug(
        this.className + SEPARATOR + JSON.stringify(message),
        ...optionalParams,
      );
  }

  info(message?: any, ...optionalParams: any[]) {
    this.loggerConfig.logLevel <= LogLevel.info &&
      console.log(
        this.className + SEPARATOR + JSON.stringify(message),
        ...optionalParams,
      );
  }

  warn(message?: any, ...optionalParams: any[]) {
    this.loggerConfig.logLevel <= LogLevel.warn &&
      console.warn(
        this.className + SEPARATOR + JSON.stringify(message),
        ...optionalParams,
      );
  }

  error(message?: any, ...optionalParams: any[]) {
    this.loggerConfig.logLevel <= LogLevel.error &&
      console.error(
        this.className + SEPARATOR + JSON.stringify(message),
        ...optionalParams,
      );
  }
}

export type LoggableProps = {
  async: boolean;
  measureTime?: boolean;
  params?: boolean;
  className?: string;
};

const Loggable =
  ({
    async = false,
    measureTime = false,
    params = true,
    className,
  }: LoggableProps) =>
  (target: Object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const cls = className ?? target.constructor.name;
    const logger = LoggerFactory.getLogger(cls + ' ' + propertyKey);
    const originalMethod = descriptor.value;
    const wrapper = (...args: any) => {
      params && logger.debug(args);
      let start = Date.now();
      const result = originalMethod.apply(this, args);
      measureTime && logger.debug('Execution time', Date.now() - start);

      return result;
    };
    const asyncWrapper = async (...args: any) => {
      let start = Date.now();
      params && logger.debug(args);
      const result = await originalMethod.apply(this, args);
      measureTime && logger.debug('Execution time', Date.now() - start);
      return result;
    };

    descriptor.value = async ? asyncWrapper : wrapper;
    return descriptor;
  };

const getLogger = LoggerFactory.getLogger;

export {LoggerFactory, Loggable, getLogger};
