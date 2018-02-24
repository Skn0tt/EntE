import { Router, Request } from 'express';
import { getManager } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';

const login = Router();

login.get('/', async (r, w) => {
  const userRepo = getManager().getRepository(User);

  const users = await userRepo.find();

  w.send(users);
})

login.get('/new', async (r, w) => {
  const userRepo = getManager().getRepository(User);

  const newUser = userRepo.create({ username: 'skn0tt', password: 'test'});

  await userRepo.save(newUser);

  return w.json(newUser).end();
})

login.post('/', async (r, w) => {
  const { username, password } = r.body;

  const userRepo = getManager().getRepository(User);

  const user = await userRepo.findOneById(username);
  if (!user) {
    return w.status(401).end();
  }
  const result = user.comparePassword(password);
  if (!result) {
    return w.status(401).end();
  }

  const token = jwt.sign({ username: user.username }, 'supersecret');

  return w.status(200).json(token).end();
})

export default login;
