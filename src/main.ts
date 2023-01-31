#!/usr/bin/env node

import cli from './cli';
cli.run();

import { LoggerUtils } from './common/setup/logger';
import { bootstrap } from './common/bootstrap';
import { Logger } from '@nestjs/common';
import cluster from 'cluster';
import * as R from 'ramda';
import * as os from 'os';

(async () => {
  const threads = os.cpus().length;
  const target = parseInt(process.env.THREADS, 10);
  if (target <= 1) return bootstrap();
  if (cluster.isWorker) return bootstrap();

  // It won't run in multi-threaded mode
  // unless param is passed from cli as -t/--threads <number> or as env THREADS
  // If param is not passed, it will run in single-threaded mode.

  // Take no more than available threads
  const maxThreads = Math.min(target, threads);
  R.range(1, maxThreads).forEach(() => cluster.fork());

  Logger.log(`Primary process:${process.pid} is running`, 'Master');
  Logger.log(`Total cluster instances: ${maxThreads - 1}`, 'Master');

  cluster.on('exit', (worker, code, signal) => {
    Logger.log(
      `worker ${worker.process.pid} died. ${LoggerUtils.stringify({
        code,
        signal,
      })}`,
      'Master',
    );
  });
})();
