import { ILogBackend, LogVariables } from '../Backend';

export type BufferConfig = {
  bufferedLines: number;
};

export class BufferedBackend implements ILogBackend {
  private backends: ILogBackend[];
  private buffer: [LogVariables, string, string, Date][] = [];
  private maxBuffer: number;

  constructor(config: BufferConfig, ...pushTo: ILogBackend[]) {
    this.backends = pushTo.slice();
    this.maxBuffer = config.bufferedLines;
  }
  write(context: LogVariables, level: string, msg: string, ts: Date): void {
    this.buffer.push([context, level, msg, ts]);
    if (this.buffer.length > this.maxBuffer) {
      this.buffer.splice(0, this.maxBuffer - this.buffer.length);
    }
    this.backends.forEach(b => b.write(context, level, msg, ts))
  }

  addBackend(b: ILogBackend): void {
    this.backends.push(b);
    this.buffer.forEach(v => b.write(...v));
  }
  removeBackend(b: ILogBackend): void {
    this.backends = this.backends.filter(v => v !== b);
  }
}
