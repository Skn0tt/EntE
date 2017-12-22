import * as express from "express";
import { Request, Response } from "express";
import * as logger from 'morgan'

const app = express();

app.set("port", process.env.PORT || 3000);

app.use(logger('dev'))

app.get("/", (req: Request, res: Response) => {
  res.send("Hallo!").end();
});

app.listen(app.get("port"), () => {
  console.log(("  App is running at http://localhost:%d in %s mode"), app.get("port"), app.get("env"));
  console.log("  Press CTRL-C to stop\n");
});