# TLDR - Typescript Logging Done Right

## Introduction

TLDR is a logging library driven by and designed for TypeScript. It follows the design and functionality of [logrus](https://github.com/sirupsen/logrus).
TLDR implements **structured** logging, which means that you can pass structured contexts into the library and evaluate them using a LMS lateron.

## Usage Example

The example below is intended to be run in node, if you'd like to run it in the browser change `NodeConsoleBackend` to `BrowserConsoleBackend`.

```ts
/**
 * First of all, import all required classes and variables.
 * You need to import the logger as well as at least one backend.
 */
import { NodeConsoleBackend, Logger } from '@deinstapel/tldr';

/**
 * ConfigureInstance should be called **exactly** once.
 * Without configureInstance, all log messages will be dropped.
 * You might add global metadata here, for example your apps version
 * or a unique session ID for a specific app startup
 */
Logger.configureInstance({
  globalContext: { session: Math.round(Math.random() * 10000000) },
  backends: [new NodeConsoleBackend({
    color: true,
    formatting: 'human', // Can also be JSON
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
```

