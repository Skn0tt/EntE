import * as pack from '../package.json';
import * as program from 'commander';

program
  .version(pack.version)
  .option('-h, --host', 'hostname of API')
  .option('-p, --port', 'port of API')

// import-users
import importUsers from './routes/import-users';
program
  .command('import-users <file>')
  .action(importUsers)

program.parse(process.argv);
