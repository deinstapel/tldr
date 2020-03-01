import { NodeConsoleBackend, ContextFilterBackend, Logger } from '@deinstapel/tldr';

/**
 * ConfigureInstance should be called **exactly** once.
 * Without configureInstance, all log messages will be dropped.
 */
Logger.configureInstance({
  globalContext: { session: Math.round(Math.random() * 10000000) },
  backends: [new ContextFilterBackend({
      answer: 42, // Filter out all wrong answers.
    },
    new NodeConsoleBackend({
      color: true,
      formatting: 'human',
    })
  )],
});

/**
 * Create a child logger with fields and log an info message
 */
Logger.withFields({
  var: 'foo',
  var2: 'bar',
  answer: 42,
}).info('I will be logged');

/**
 * Wrong answer, will not get logged.
 */
Logger.withField('answer', 21).info('I will not get logged');
