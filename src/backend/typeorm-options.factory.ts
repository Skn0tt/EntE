import {
  TypeOrmOptionsFactory as _TypeOrmOptionsFactory,
  TypeOrmModuleOptions,
} from "@nestjs/typeorm";
import { getConnectionManager } from "typeorm";
import { Config } from "./helpers/config";
import { migrations } from "./db/migrations";
import { CustomTypeOrmLogger } from "./custom-typeorm-logger";

const {
  database,
  host,
  password,
  port,
  username,
  timezone,
} = Config.getMysqlConfig();

export class TypeOrmOptionsFactory implements _TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const connectionManager = getConnectionManager();
    let options: TypeOrmModuleOptions;

    if (connectionManager.has("default")) {
      const connection = connectionManager.get("default");
      options = connection.options;
      await connection.close();
    } else {
      options = {
        type: "mysql",
        username,
        migrations,
        port,
        password,
        host,
        database,
        timezone,
        dateStrings: ["DATE"],
        autoLoadEntities: true,
        synchronize: false,
        logger: new CustomTypeOrmLogger(),
        logging: "all",
        migrationsRun: true,
      };
    }

    return options;
  }
}
