/**
 * We're creating a console log backend, so no-console doesn't make any sense.
 */
/* eslint-disable no-console */
import { ILogBackend, LogVariables } from '../Backend';

const DEFAULT_COLOR_MAP: ColorStyleMap = {
  trace: 'color: gray',
  debug: 'color: gray',
  info: 'color: blue',
  warn: 'color: yellow',
  error: 'color: red',
  critical: 'color: purple',
};

export type ColorStyleMap = { [level: string]: string };
/**
 * Console logging options.
 */
export type Options = {
  formatting: 'json' | 'human';
  color: boolean;
  colorStyleMap: ColorStyleMap;
};

export class ConsoleBackend implements ILogBackend {
  private options: Options;
  constructor(options: Partial<Options>) {
    this.options = {
      formatting: options.formatting ?? 'human',
      color: options.color ?? false,
      colorStyleMap: DEFAULT_COLOR_MAP,
    };
    if (options.color) {
      options.colorStyleMap = Object.assign({}, DEFAULT_COLOR_MAP, options.colorStyleMap);
    }
  }

  public write(context: LogVariables, level: string, msg: string, ts: Date): void {
    if (this.options.formatting === 'json') {
      // JSON formatting does not support coloring in order to pipe it to a LMS
      console.log(JSON.stringify({ ...context, level, msg, time: ts.toISOString() }));
    } else {
      // Human readable output supports coloring.
      const shouldAddColor = this.options.color && this.options.colorStyleMap[level];
      const coloredLevel = shouldAddColor ? `%c${level}%c` : level;
      const contextEntries = Object.keys(context).map(key => [key, '=', context[key]]);
      const contextFormat = ([] as any[]).concat(...contextEntries);
      const message = [`[${ts.toISOString()}] ${coloredLevel} ${msg}`, ...contextFormat];
      if (shouldAddColor) {
        console.log(...message, this.options.colorStyleMap[level], 'color: initial');
      } else {
        console.log(...message);
      }
    }
  }
}
