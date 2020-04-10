import { NextApiRequest, NextApiResponse } from "next";
import { Backend } from "../../backend";

export default (req: NextApiRequest, res: NextApiResponse) =>
  new Promise(async resolve => {
    const listener = await Backend.getListener();
    listener(req, res);
    res.on("finish", resolve);
  });
