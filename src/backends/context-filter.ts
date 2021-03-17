import { ILogBackend, LogVariables } from '../Backend';
import { typedKeys } from '../util/typedObject';

export type FilterFunction = (value: any) => boolean;
export type FilterConfig = { [contextVar: string]: unknown | RegExp | FilterFunction }

export class ContextFilterBackend implements ILogBackend {
  private backends: ILogBackend[];
  constructor(private config: FilterConfig, ...pushTo: ILogBackend[]) {
    this.backends = pushTo.slice();
  }
  write(context: LogVariables, level: string, msg: string, ts: Date): void {
    for (const k of typedKeys(this.config)) {
      const v = this.config[k]
      if (typeof v === 'function') {
        if (!v(context[k])) {
          return;
        }
      } else if (v instanceof RegExp) {
        if (!v.exec(context[k])) {
          return;
        }
      } else {
        if (v !== context[k]) {
          return;
        }
      }
    }
    this.backends.forEach(b => b.write(context, level, msg, ts))
  }
}
