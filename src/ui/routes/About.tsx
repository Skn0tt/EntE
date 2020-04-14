import * as React from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Dialog,
  Typography,
} from "@material-ui/core";
import { withErrorBoundary } from "../hocs/withErrorBoundary";
import * as config from "../config";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { useRouter } from "next/router";

const { VERSION } = config.get();

const useTranslation = makeTranslationHook({
  en: {
    back: "Close",
    title: "About",
    version: (v: string) => `Version: ${v}`,
  },
  de: {
    back: "Zurück",
    title: "Über",
    version: (v: string) => `Version: ${v}`,
  },
});

export const About = (props: {}) => {
  const lang = useTranslation();

  const router = useRouter();

  const onClose = router.back;

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

export default withErrorBoundary()(About);
