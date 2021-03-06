import { RootLogger } from './RootLogger';

/*
 * tldr - Public API
 * (c) 2020 - MIT License
 * Martin Koppehel
 * Johann Wagner
 * Marten Gartner
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Logger = new RootLogger();
export { ConsoleBackend as BrowserConsoleBackend } from './backends/console-browser';
export { ConsoleBackend as NodeConsoleBackend } from './backends/console-node';
export { ContextFilterBackend } from './backends/context-filter';
export { LevelFilterBackend } from './backends/level-filter';
export { BufferedBackend } from './backends/buffered';
export { Logger as DerivedLogger } from './Logger'
export { ILogBackend, LogVariables } from './Backend';
