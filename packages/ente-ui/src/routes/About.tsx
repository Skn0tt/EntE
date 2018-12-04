import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  Typography,
  Typography
} from "@material-ui/core";
import { withErrorBoundary } from "../hocs/withErrorBoundary";
import { createTranslation } from "../helpers/createTranslation";
import * as config from "../config";

const { VERSION } = config.get();

const lang = createTranslation({
  en: {
    back: "Close",
    title: "About",
    version: v => `Version: ${v}`
  },
  de: {
    back: "Zurück",
    title: "Über",
    version: v => `Version: ${v}`
  }
});

interface AboutOwnProps {}

type AboutProps = AboutOwnProps & RouteComponentProps;

export const About: React.SFC<AboutProps> = props => {
  const { history } = props;

  const onClose = history.goBack;

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{lang.title}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">{lang.version(VERSION)}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{lang.back}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default withRouter(withErrorBoundary()(About));
