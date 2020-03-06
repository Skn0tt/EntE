import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

ReactDOM.render(
  <App orientation="landscape" />,
  document.getElementById("interactive_slideshow_root")
);

ReactDOM.render(
  <App orientation="portrait" />,
  document.getElementById("interactive_slideshow_root_phone")
);
