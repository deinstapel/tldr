import { Logger, IInternalRootLogger } from './Logger';
import { LogVariables, ILogBackend } from './Backend';

/**
 * Public Interface for the root logger, allows for dynamic updates and initial
 * configuration.
 * From this logger, child loggers can be derived.
 */
export interface IRootLogger {
  configureInstance(params: any): void;
  updateGlobalFields(fields: LogVariables): void;
  addBackends(...backends: ILogBackend[]): void;
}

export type Configuration = {
  globalContext: LogVariables;
  backends: ILogBackend[];
};

export class RootLogger extends Logger implements IInternalRootLogger, IRootLogger {
  /**
   * Log Variables contained in **all** log entries.
   * This object should be considered volatile from external
   * as well as derived child loggers.
   */
  public rootContext: LogVariables = {};
  /**
   * A flag whether this logger has already been configured through configureInstance.
   */
  private configured = false;


  constructor() {
    // Cast is requred to have strict null checking for the .root property.
    super(null as unknown as any, {}, []);
    this.root = this;
  }

  /**
   * Perform a dynamic update of the log variables.
   * New variables can be added and existing variables can be changed
   * but no variables can be deleted.
   * @param fields The new set of fields to set within the logger. Will be shallow-cloned.
   */
  public updateGlobalFields(fields: LogVariables): void {
    this.rootContext = Object.assign({}, this.rootContext, fields);
  }

  /**
   * Configure the logger.
   * @param params global context and backends to use.
   */
  public configureInstance(params: Configuration): void {
    if (this.configured) {
      throw new Error('Logger already configured');
    }
    this.rootContext = Object.assign({}, this.rootContext, params.globalContext);
    if (params.backends.length) {
      this.backends.push(...params.backends);
    }
    this.configured = true;
  }

  /**
   * Add backends to an existing logger globally.
   * @param backends Backends to add.
   */
  public addBackends(...backends: ILogBackend[]): void {
    if (backends.length) {
      this.backends.push(...backends);
    }
  }
}
