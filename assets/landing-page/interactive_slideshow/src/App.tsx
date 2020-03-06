import * as React from "react";
import { Slide } from "./Slide";
import { OrientationProvider, Orientation } from "./Orientation";
import { Entry } from "./Entry";
import { FullScreen } from "./FullScreen";

interface AppProps {
  orientation: Orientation;
}

export function App(props: AppProps) {
  const { orientation } = props;
  return (
    <OrientationProvider value={orientation}>
      <FullScreen>
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
      </FullScreen>
    </OrientationProvider>
  );
}
