import "reflect-metadata";
import { createConnection, ConnectionOptions } from "typeorm";
import { User } from "./logic";
export * from "./logic";

const defaultConfig: ConnectionOptions = {
  type: "mysql",
  host: "localhost",
  username: "admin",
  password: "root",
  database: "ente",
  entities: [__dirname + "/entity/*.ts"],
  synchronize: true
};

interface Config {
  username: string;
  password: string;
  database: string;
  port: number;
  host: string;
}

const setup = async (config: Partial<Config>) => {
  await createConnection({ ...defaultConfig, ...config });

  await User.createAdmin();
};

export default setup;
