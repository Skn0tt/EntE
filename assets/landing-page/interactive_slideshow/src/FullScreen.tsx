import * as React from "react";
import RCTFullScreen from "react-full-screen";
import { IconButton } from "@material-ui/core";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";

const FullScreenContext = React.createContext<HTMLDivElement | undefined>(
  undefined
);

export function useFullscreenContainer() {
  return React.useContext(FullScreenContext);
}

export function FullScreen(props: React.PropsWithChildren<{}>) {
  const { children } = props;
  const [isFull, setIsFull] = React.useState(false);

  const fullscreenRef = React.useRef<HTMLDivElement>();

  return (
    <FullScreenContext.Provider value={fullscreenRef.current}>
      <RCTFullScreen enabled={isFull} onChange={setIsFull}>
        <div
          ref={fullscreenRef}
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
    </FullScreenContext.Provider>
  );
}
