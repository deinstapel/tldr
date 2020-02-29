import { Logger, IInternalRootLogger } from './Logger';
import { LogVariables } from './Backend';

/**
 * Public Interface for the root logger, allows for dynamic updates and initial
 * configuration.
 * From this logger, child loggers can be derived.
 */
export interface IRootLogger {
  configureInstance(params: any): void;
  updateGlobalFields(fields: LogVariables): void;
}

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
  updateGlobalFields(fields: LogVariables): void {
    this.rootContext = Object.assign({}, this.rootContext, fields);
  }

  /**
   * Configure the logger.
   * @param params
   */
  configureInstance(params: any): void {
    if (this.configured) {
      throw new Error('Logger already configured');
    }
    params.foo = params.bar;
  }
}
