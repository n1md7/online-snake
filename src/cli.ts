import { Logger } from '@nestjs/common';
import { Command } from 'commander';
import dotenv from 'dotenv';
import fs from 'fs';

const program = new Command();
export default {
  run: () =>
    program
      .description('My service CLI')
      .option('-p, --port <number>', 'Port to listen')
      .option('-t, --threads <number>', 'Max threads to use', 1)
      .option('-f, --env-file <file>', 'Environment file. e.g. .env, .env.development')
      .action(() => {
        if (!isNaN(+program.threads)) process.env.THREADS = program.threads;
        if (!isNaN(+program.port)) process.env.PORT = program.port;

        if (program.envFile) {
          if (fs.existsSync(program.envFile)) dotenv.config({ path: program.envFile });
          else {
            Logger.error(`Environment file [${program.envFile}] not found!`, 'Bootstrap');
            process.exit(1);
          }
        }
      })
      .parse(process.argv),
};
