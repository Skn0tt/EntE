import * as React from "react";
import { Slide } from "./Slide";
import { OrientationProvider, Orientation } from "./Orientation";
import { Entry } from "./Entry";

interface AppProps {
  orientation: Orientation;
}

export function App(props: AppProps) {
  const { orientation } = props;
  return (
    <OrientationProvider value={orientation}>
      <Slide
        explanation={
          <Entry
            stage="date"
            onDateEntered={console.log}
            onReasonEntered={console.log}
            onSlotAdded={console.log}
            onSent={console.log}
          />
        }
        people={<p>Peeps</p>}
        text={<p>TITLE</p>}
      />
    </OrientationProvider>
  );
}
