import { LogVariables, ILogBackend } from './Backend';

export interface IInternalRootLogger {
  rootContext: LogVariables;
}

/**
 * A logger is the object which is consumed by user code.
 * Loggers can be used to create derived loggers and actually log
 * entries.
 */
export class Logger {
  /**
   * Create a new logger from an existing context and an existing root logger.
   * @param root The root logger. Must not be null, except for the root logger.
   * @param context Context of the parent logger.
   */
  constructor(
    protected root: (Logger & IInternalRootLogger),
    private context: LogVariables,
    protected backends: ILogBackend[],
  ) { }

  /**
   * Creates a new derived logger with the given variables.
   * @param fields The data to merge into the existing context.
   */
  public withFields(fields: LogVariables): Logger {
    return new Logger(this.root, Object.assign({}, this.context, fields), this.backends);
  }

  /**
   * Creates a new derived logger with the specified field.
   * @param field Field name to annotate.
   * @param value Field value to annotate.
   */
  public withField(field: string, value: any): Logger {
    return this.withFields({ [field]: value });
  }

  /**
   * Creates a new derived logger with the specified backends.
   * This can be used to redirect the logs for a certain modul to another target.
   * @param backends A list of backends to attach to the child logger.
   */
  public withBackends(...backends: ILogBackend[]): Logger {
    return new Logger(this.root, this.context, [...this.backends, ...backends]);
  }

  /**
   * Create a log entry with the specified level and message.
   * This function can be used to generate log entries with arbitrary log levels.
   * **WARNING**: Arbitrary log levels will break other plugins down in the processing chain.
   */
  public log(level: string, msg: string): void {
    const time = new Date();
    this.backends.forEach(backend => {
      setTimeout(() => {
        try {
          backend.write(
            Object.assign(
              {},
              this.root.rootContext,
              this.context,
            ),
            level,
            msg,
            time,
          );
        } catch (e) {
          // eslint-disable-next-line no-console
          // eslint-disable-next-line no-unused-expressions
          console?.warn('Log backend write failed', e);
        }
      });
    })

  }


  /**
   * Convenience methods for well-known log levels.
   */
  public trace = this.log.bind(this, 'trace');
  public debug = this.log.bind(this, 'debug');
  public info = this.log.bind(this, 'info');
  public warn = this.log.bind(this, 'warn');
  public error = this.log.bind(this, 'error');
  public critical = this.log.bind(this, 'critical');
}

