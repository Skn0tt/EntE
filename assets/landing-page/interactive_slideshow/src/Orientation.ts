import * as React from "react";

export type Orientation = "landscape" | "portrait";

const o = React.createContext<Orientation>("landscape");

export const OrientationProvider = o.Provider;

export function useOrientation() {
  return React.useContext(o);
}
