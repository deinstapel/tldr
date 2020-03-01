import { ILogBackend, LogVariables } from '../Backend';

export type FilterFunction = (value: any) => boolean;
export type FilterConfig = { [contextVar: string]: string | RegExp | FilterFunction }

export class ContextFilterBackend implements ILogBackend {
  private backends: ILogBackend[];
  constructor(private config: FilterConfig, ...pushTo: ILogBackend[]) {
    this.backends = pushTo.slice();
  }
  write(context: LogVariables, level: string, msg: string, ts: Date): void {
    for (const x of Object.entries(this.config)) {
      if (typeof x[1] === 'function') {
        if (!x[1](context[x[0]])) {
          return;
        }
      } else if (typeof x[1] === 'string') {
        if (x[1] !== context[x[0]]) {
          return;
        }
      } else {
        if (!x[1].exec(context[x[0]])) {
          return;
        }
      }
    }
    this.backends.forEach(b => b.write(context, level, msg, ts))
  }
}
