import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { Connection } from "typeorm";

const promiseTimeout = function (
  ms: number,
  promise: Promise<unknown>
): Promise<unknown> {
  let timeout = new Promise((_, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error("Timed out in " + ms + "ms."));
    }, ms);
  });

  return Promise.race([promise, timeout]);
};

@Injectable()
export class DbHealthIndicator {
  constructor(
    @InjectConnection()
    private readonly connection: Connection
  ) {}

  public async isHealthy(): Promise<boolean> {
    try {
      await this.pingDb(this.connection, 1000);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async pingDb(connection: Connection, timeout: number) {
    return await promiseTimeout(timeout, connection.query("SELECT 1"));
  }
}
