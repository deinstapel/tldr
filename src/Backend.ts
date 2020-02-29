export type LogVariables = { [name: string]: any };

export interface ILogBackend {
  write(context: LogVariables, level: string, msg: string, ts: number): void;
}
