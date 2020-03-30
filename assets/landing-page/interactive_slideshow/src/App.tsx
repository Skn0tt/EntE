import * as React from "react";
import { OrientationProvider, Orientation } from "./Orientation";
import { FullScreen } from "./FullScreen";
import { StoryboardCoordinator } from "./StoryboardCoordinator";

interface AppProps {
  orientation: Orientation;
}

export function App(props: AppProps) {
  const { orientation } = props;
  return (
    <OrientationProvider value={orientation}>
      <FullScreen>
        <StoryboardCoordinator />
      </FullScreen>
    </OrientationProvider>
  );
}
