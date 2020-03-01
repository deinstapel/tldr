import { ILogBackend, LogVariables } from '../Backend';

const VERBOSE_MAP: { [lv: string]: number } = {
  critical: 0,
  error: 1,
  warning: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

export type LevelFilterFunction = (level: string) => boolean;
export type FilterConfig = {
  minLevel: 'trace' | 'debug' | 'info' | 'warning' | 'error' | 'critical';
  allowCustomLevel: boolean | LevelFilterFunction;
};

export class LevelFilterBackend implements ILogBackend {
  private backends: ILogBackend[];
  private minLevel: number;

  constructor(private config: FilterConfig, ...pushTo: ILogBackend[]) {
    this.backends = pushTo.slice();
    this.minLevel = VERBOSE_MAP[config.minLevel];
  }
  write(context: LogVariables, level: string, msg: string, ts: Date): void {
    const v = VERBOSE_MAP[level] ?? -1;
    // Check for well-known log levels.
    if (v > this.minLevel) {
      return;
    }
    // Special handling for special levels
    if (v === -1) {
      // No custom levels allowed
      if (this.config.allowCustomLevel === false) {
        return;
      }
      // Dynamic decision
      if (typeof this.config.allowCustomLevel === 'function') {
        if (!this.config.allowCustomLevel(level)) {
          return;
        }
      }
    }
    this.backends.forEach(b => b.write(context, level, msg, ts))
  }
}
