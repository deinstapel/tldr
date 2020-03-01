import { NodeConsoleBackend, Logger } from '@deinstapel/tldr';

Logger.configureInstance({
  globalContext: { session: Math.round(Math.random() * 10000000) },
  backends: [new NodeConsoleBackend({
    color: true,
    formatting: 'human',
  })],
});

Logger.withFields({
  var: 'foo',
  var2: 'bar',
  answer: 42,
}).info('hello, world');

Logger.withField('answer', 42).log('customlevel', 'custom message')
