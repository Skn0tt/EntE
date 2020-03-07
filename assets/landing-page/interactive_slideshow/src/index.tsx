import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";
import { Orientation } from "./Orientation";

function createInteractiveSlideshow(
  element: HTMLElement,
  orientation: Orientation = "landscape"
) {
  ReactDOM.render(<App orientation={orientation} />, element);
}

(window as any).InteractiveSlideshow = createInteractiveSlideshow;
