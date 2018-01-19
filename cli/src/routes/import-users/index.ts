import * as path from 'path';
import * as fs from 'fs';
import * as program from 'commander';
import { promisify } from 'util';
import * as parse from 'csv-parse/lib/sync';
import { Command } from 'commander';

const readFileAsync = promisify(fs.readFile);

interface Options {
  port: number;
  host: string;
}

const defaultOptions: Options = {
  port: 80,
  host: 'localhost'
}

enum Roles {
  PARENT = 'parent',
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

interface User {
  username: string;
  displayname: string;
  email: string;
  role: Roles;
}

const columns: string[] = [
  'username',
  'displayname',
  'email',
  'role',
]

const importUsers = async (file: string, cmd: Command): Promise<void> => {
  /**
   * # Reading
   */
  console.info('Parsing data...')
  const buffer: Buffer = await readFileAsync(path.resolve(file));
  const cols: User[] = parse(buffer.toString(), { columns });
  const users = cols.slice(1);

  /**
   * # Validate
   */
  console.info('<Validating...>')

  /**
   * # Send
   */
  console.info('<Sending...>')
  // console.log(cmd)
  const url = `http://${cmd.host}:80/api/users`
  // console.log(url)
  console.log(program);
  for (const user of users) {
    // console.log(user);
  }
}

export default importUsers;