import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let tskvLogger: TskvLogger;
  let logMock: jest.SpyInstance;
  let errorMock: jest.SpyInstance;
  let warnMock: jest.SpyInstance;
  let verboseMock: jest.SpyInstance;
  let debugMock: jest.SpyInstance;

  beforeEach(() => {
    tskvLogger = new TskvLogger();

    logMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
    verboseMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    debugMock = jest.spyOn(console, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const testLogMethod = (
    level: 'log' | 'error' | 'warn' | 'verbose' | 'debug',
    message: unknown,
    optionalParams: unknown[],
  ) => {
    const method =
      level === 'log'
        ? () => tskvLogger.log(message, ...optionalParams)
        : level === 'error'
          ? () => tskvLogger.error(message, ...optionalParams)
          : level === 'warn'
            ? () => tskvLogger.warn(message, ...optionalParams)
            : level === 'verbose'
              ? () => tskvLogger.verbose?.(message, ...optionalParams)
              : () => tskvLogger.debug?.(message, ...optionalParams);

    method();

    const messageString =
      typeof message === 'string' ? message : JSON.stringify(message);
    const optional =
      optionalParams.length > 0
        ? `optional=${JSON.stringify(optionalParams)}`
        : '';
    const expectedOutput = [
      `level=${level}`,
      `message=${messageString.replace(/\t/g, '')}`,
      optional,
    ]
      .filter((data) => data)
      .join('\t');

    const mockMethod = {
      log: logMock,
      error: errorMock,
      warn: warnMock,
      verbose: verboseMock,
      debug: debugMock,
    }[level];
    expect(mockMethod).toHaveBeenCalledWith(expectedOutput);
  };

  test.each([
    {
      description: 'log with parameters',
      level: 'log',
      message: 'Log message',
      optionalParams: ['param1', 2, true],
    },
    {
      description: 'error with parameters',
      level: 'error',
      message: 'Error message',
      optionalParams: ['param1', 2, true],
    },
    {
      description: 'warn with parameters',
      level: 'warn',
      message: 'Warn message',
      optionalParams: ['param1', 2, true],
    },
    {
      description: 'log with empty message and no parameters',
      level: 'log',
      message: '',
      optionalParams: [],
    },
    {
      description: 'log with message and no parameters',
      level: 'log',
      message: 'Test message',
      optionalParams: [],
    },
    {
      description: 'log with object message and parameters',
      level: 'log',
      message: { key: 'value' },
      optionalParams: [42, true],
    },
    {
      description: 'error with object message and no parameters',
      level: 'error',
      message: { error: 'Something went wrong' },
      optionalParams: [],
    },
    {
      description: 'warn with number message and no parameters',
      level: 'warn',
      message: 12345,
      optionalParams: [],
    },
    {
      description: 'verbose with string message and parameters',
      level: 'verbose',
      message: 'Verbose message',
      optionalParams: ['param1', 2, true],
    },
    {
      description: 'debug with object message and no parameters',
      level: 'debug',
      message: { debug: 'Debugging info' },
      optionalParams: [],
    },
  ])(
    'should log messages with level "$level" and correct message and parameters: $description',
    ({ level, message, optionalParams }) => {
      testLogMethod(
        level as 'log' | 'error' | 'warn' | 'verbose' | 'debug',
        message,
        optionalParams,
      );
    },
  );
});
