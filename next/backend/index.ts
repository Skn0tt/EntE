import "reflect-metadata";
import type * as http from "http";
import type { NextApiHandler } from "next";
import { bootstrap } from "./main";

export module Backend {
  let listener: NextApiHandler | null = null;

  export async function getListener() {
    if (!listener) {
      const app = await bootstrap();

      const server: http.Server = app.getHttpServer();
      [listener] = server.listeners("request") as NextApiHandler[];
    }

    return listener;
  }
}
