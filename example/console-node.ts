import { NodeConsoleBackend, Logger } from '@deinstapel/tldr';

/**
 * ConfigureInstance should be called **exactly** once.
 * Without configureInstance, all log messages will be dropped.
 */
Logger.configureInstance({
  globalContext: { session: Math.round(Math.random() * 10000000) },
  backends: [new NodeConsoleBackend({
    color: true,
    formatting: 'human',
  })],
});

/**
 * Create a child logger with fields and log an info message
 */
Logger.withFields({
  var: 'foo',
  var2: 'bar',
  answer: 42,
}).info('hello, world');

/**
 * Annotate a single field and log a message with custom log level
 */
Logger.withField('answer', 42).log('customlevel', 'custom message')

Logger.withField('err', new Error('test error')).debug('test');
