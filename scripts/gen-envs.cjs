#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const envName = (name = '') => name.match(/.env.[\w\-]+/)[0];

(async function run (copy) {
  console.time('Finished');
  const fileArgs = process.argv.slice(2);
  const envs = {
    dev: path.join(__dirname, '../.env.development'),
    prod: path.join(__dirname, '../.env.production'),
    test: path.join(__dirname, '../.env.test'),
  };
  const example = path.join(__dirname, '../.env.example');
  const copyOrSkip = (file) => (promiseCopy) => {
    if (fs.existsSync(file)) {
      return console.log(`${envName(file)} - already exists. Skipping.`);
    }
    console.log(`${envName(file)} - copying...`);
    return promiseCopy();
  };

  if (fileArgs.length > 0) {
    return fileArgs.forEach((env) => {
      if (envs[env]) return copyOrSkip(envs[env])(copy(example, envs[env]));
      console.log(`${env} - not found.`);
    });
  }

  console.log('No arguments provided. Creating for:');
  console.log('  development, production, test');
  const promises = Object.keys(envs).map((env) => copyOrSkip(envs[env])(copy(example, envs[env])));
  return Promise.all(promises).then(() => console.timeEnd('Finished'));
})(function copy(src, dest) {
  return () =>
    new Promise(function (resolve, reject) {
      fs.copyFile(src, dest, (err) => {
        if (err) return reject(err);
        console.log(`${envName(src)} -> ${envName(dest)} - ${chalk.green('CREATED')}.`);
        resolve();
      });
    });
})
  .catch(console.error)
  .finally(() => process.exit(0));
