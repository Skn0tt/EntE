import React, { useState, useCallback } from "react";
import { ResponsiveFullscreenDialog } from "../../components/ResponsiveFullscreenDialog";
import OtpInput from "otp-input-react";
import { DialogContent, DialogTitle } from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

const useLang = makeTranslationHook({
  de: "Bitte geben Sie ihr 2-Faktor-Token ein.",
  en: "Please enter your 2nd factor.",
});

interface TOTPModalProps {
  open: boolean;
  onDone: (token: string) => void;
}

export function TOTPModal(props: TOTPModalProps) {
  const { onDone, open } = props;

  const title = useLang();

  const [token, setToken] = useState("");

  const handleChange = useCallback(
    (token: string) => {
      console.log(token);
      setToken(token);
      if (token.length === 6) {
        onDone(token);
      }
    },
    [setToken]
  );

  return (
    <ResponsiveFullscreenDialog open={open} style={{ zIndex: 1500 }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <OtpInput
          value={token}
          onChange={handleChange}
          otpType="number"
          autoFocus
          OTPLength={6}
        />
      </DialogContent>
    </ResponsiveFullscreenDialog>
  );
}
