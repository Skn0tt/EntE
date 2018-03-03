import { createClient } from 'redis';
import chalk, { Chalk } from 'chalk';
import * as crypto from 'crypto';

const client = createClient('redis://redis');

const JWT_SECRETS = 'jwt_secrets';

function generateSecret() {
  return crypto.randomBytes(48).toString('hex');
}

const oldSecret = client.get(JWT_SECRETS, (err, reply) => {
  if (err) {
    throw err;
  }
  const arr: string[] = JSON.parse(reply);
  const newArr: string[] = !!arr
    ? [generateSecret(), arr[0]]
    : [generateSecret(), generateSecret()]

  client.set(JWT_SECRETS, JSON.stringify(newArr), (err, reply) => {
    if (err) {
      throw err;
    }
    if (reply === 'OK') {
      console.log(chalk.blue('Rotated JWT keys.'));
      return process.exit(0);
    } else {
      throw new Error('Error encountered rotating JWT keys.');
    }
  });
});
