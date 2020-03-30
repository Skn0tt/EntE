import * as React from "react";
import { Tooltip as MUITooltip, TooltipProps } from "@material-ui/core";
import { useFullscreenContainer } from "./FullScreen";

export function Tooltip(props: TooltipProps) {
  const container = useFullscreenContainer();
  return <MUITooltip PopperProps={{ container }} {...props} />;
}
