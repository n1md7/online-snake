import { LogLabel, LogType } from './logger.enum';
import { RequestId } from './logger.type';
import { Env } from '../../env';
import * as chalk from 'chalk';

export class LoggerUtils {
  public static informationLetter([firstLetter]: string): string {
    return firstLetter.toUpperCase();
  }

  public static format(
    level: LogType,
    context: LogLabel | RequestId | string,
    message: unknown,
  ): string {
    const I = LoggerUtils.informationLetter(level);
    const T = new Date().toISOString();
    const P = process.pid;
    const L = level.toUpperCase();

    const IC = Env.isDev ? chalk.cyan(I) : I;
    const TC = Env.isDev ? chalk.gray(T) : T;
    const PC = Env.isDev ? chalk.magenta(P) : P;
    const CC = Env.isDev ? chalk.blue(context) : context;

    const LC = { V: L };
    const MC = { V: message };
    if (!Env.isProd) {
      switch (level) {
        case LogType.DEBUG:
          LC.V = chalk.cyan(L);
          MC.V = chalk.white(message);
          break;
        case LogType.LOG:
        case LogType.INFO:
          LC.V = chalk.cyan(L);
          MC.V = chalk.whiteBright(message);
          break;
        case LogType.WARN:
          LC.V = chalk.yellow(L);
          MC.V = chalk.yellow(message);
          break;
        case LogType.ERROR:
        case LogType.FATAL:
          LC.V = chalk.red(L);
          MC.V = chalk.red(message);
          break;
        default:
          LC.V = chalk.cyan(L);
          MC.V = chalk.gray(message);
          break;
      }
    }

    return `${IC}, [${TC} #${PC}] ${LC.V} -- : [${CC}] ${MC.V}`;
  }

  /** Leave unmasked for development */
  public static mask(value: string): string {
    if (Env.isDev) return value;

    return '[FILTERED]';
  }

  public static stringify(value: unknown): string {
    if (typeof value === 'string') return value;
    if (Env.isDev) return JSON.stringify(value, null, 2);
    const stringValue = JSON.stringify(value);

    return LoggerUtils.removeBearerToken(stringValue);
  }

  public static removeBearerToken(value: string): string {
    if (Env.isDev) return value;

    return value?.replace(
      /Bearer [A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*/,
      'Bearer [FILTERED]',
    );
  }
}

export const m = LoggerUtils.mask;
