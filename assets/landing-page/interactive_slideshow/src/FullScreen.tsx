import * as React from "react";
import RCTFullScreen from "react-full-screen";
import { IconButton } from "@material-ui/core";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";

export function FullScreen(props: React.PropsWithChildren<{}>) {
  const { children } = props;
  const [isFull, setIsFull] = React.useState(false);

  return (
    <RCTFullScreen enabled={isFull} onChange={setIsFull}>
      <div
        style={{
          height: "100%",
          position: "relative",
          backgroundColor: "white",
          borderRadius: isFull ? undefined : "10px"
        }}
      >
        {children}
        <IconButton
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px"
          }}
          onClick={() => setIsFull(!isFull)}
        >
          {isFull ? (
            <FullscreenExitIcon fontSize="large" />
          ) : (
            <FullscreenIcon fontSize="large" />
          )}
        </IconButton>
      </div>
    </RCTFullScreen>
  );
}
