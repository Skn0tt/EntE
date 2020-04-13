import "reflect-metadata";
import type * as http from "http";
import type { RequestListener } from "http";
import { bootstrap } from "./main";

export module Backend {
  let listener: RequestListener | null = null;

  export async function getListener() {
    if (!listener) {
      const app = await bootstrap();

      const server: http.Server = app.getHttpServer();
      [listener] = server.listeners("request") as RequestListener[];
    }

    return listener;
  }
}
