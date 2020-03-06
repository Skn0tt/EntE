import * as React from "react";
import { Slide } from "./Slide";
import { OrientationProvider, Orientation } from "./Orientation";

interface AppProps {
  orientation: Orientation;
}

export function App(props: AppProps) {
  const { orientation } = props;
  return (
    <OrientationProvider value={orientation}>
      <Slide
        explanation={<p>Explanation</p>}
        people={<p>Peeps</p>}
        text={<p>TITLE</p>}
      />
    </OrientationProvider>
  );
}
