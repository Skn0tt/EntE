import { Backend } from "../../backend";
import type { IncomingMessage, ServerResponse } from "http";

export default (req: IncomingMessage, res: ServerResponse) =>
  new Promise(async (resolve) => {
    const listener = await Backend.getListener();
    listener(req, res);
    res.on("finish", resolve);
  });
