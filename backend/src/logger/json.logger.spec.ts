import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let jsonLogger: JsonLogger;
  let logMock: jest.SpyInstance;
  let errorMock: jest.SpyInstance;
  let warnMock: jest.SpyInstance;

  beforeEach(() => {
    jsonLogger = new JsonLogger();

    logMock = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    warnMock = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const testLogMethod = (
    level: 'log' | 'error' | 'warn',
    message: unknown,
    optionalParams: unknown[],
  ) => {
    const method =
      level === 'log'
        ? () => jsonLogger.log(message, ...optionalParams)
        : level === 'error'
          ? () => jsonLogger.error(message, ...optionalParams)
          : () => jsonLogger.warn(message, ...optionalParams);

    method();

    const expectedOutput = JSON.stringify({
      level,
      message,
      optionalParams,
    });

    const mockMethod = { log: logMock, error: errorMock, warn: warnMock }[
      level
    ];
    expect(mockMethod).toHaveBeenCalledWith(expectedOutput);
  };

  test.each([
    ['log', 'Log message', ['param1', 2, true]],
    ['error', 'Error message', ['param1', 2, true]],
    ['warn', 'Warn message', ['param1', 2, true]],
    ['log', '', []],
    ['log', 'Test message', []],
    ['log', { key: 'value' }, [42, true]],
    ['error', { error: 'Something went wrong' }, []],
    ['warn', 12345, []],
  ])(
    'should log messages with level "%s" and correct message and parameters',
    (level, message, optionalParams) => {
      testLogMethod(level as 'log' | 'error' | 'warn', message, optionalParams);
    },
  );
});
