import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const messageString =
      typeof message === 'string' ? message : JSON.stringify(message);

    const optional =
      optionalParams.length > 0
        ? `optional=${JSON.stringify(optionalParams)}`
        : '';

    return [
      `level=${level}`,
      `message=${messageString.replace(/\t/g, '')}`,
      optional,
    ]
      .filter((data) => data)
      .join('\t');
  }

  private logWithLevel(
    level: 'log' | 'error' | 'warn',
    message: unknown,
    ...optionalParams: unknown[]
  ) {
    const formattedMessage = this.formatMessage(
      level,
      message,
      ...optionalParams,
    );

    const consoleMethods = {
      log: console.log,
      error: console.error,
      warn: console.warn,
    };

    const output = consoleMethods[level];
    output(formattedMessage);
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('log', message, ...optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('error', message, ...optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    this.logWithLevel('warn', message, ...optionalParams);
  }
}
