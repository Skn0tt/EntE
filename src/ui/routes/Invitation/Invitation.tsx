import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  withMobileDialog,
  Button,
  Typography,
} from "@material-ui/core";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import SetPasswordPhase from "./SetPasswordPhase";
import * as querystring from "query-string";
import withErrorBoundary from "../../hocs/withErrorBoundary";
import { useRouter } from "next/router";
import Link from "next/link";

const useTranslation = makeTranslationHook({
  en: {
    title: "Welcome to EntE.",
    done: "OK",
    body: ({ username }: { username: string }) => (
      <>
        EntE is a digital system for managing scholar absence. For further
        information about EntE, see the{" "}
        <a href="https://docs.ente.app/en" target="_blank">
          documentation
        </a>
        .
        <br />
        Your username is <i>{username}</i>. To start using EntE, click the{" "}
        <i>OK</i>-Button. You can log in using the password you just set.
      </>
    ),
  },
  de: {
    title: "Willkommen bei EntE.",
    done: "OK",
    body: ({ username }: { username: string }) => (
      <>
        EntE ist ein digitales System zur Verwaltung von Fehlzeiten in der
        Schule. Weitere Informationen zur Benutzung finden Sie in der{" "}
        <a href="https://docs.ente.app/de" target="_blank">
          EntE-Dokumentation
        </a>
        .
        <br />
        Ihr Benutzername ist <i>{username}</i>. Um EntE zu benutzen, klicken Sie
        den <i>OK</i>-Button an. Sie können sich dann mit dem Passwort, das Sie
        gerade gesetzt haben, anmelden.
      </>
    ),
  },
});

type InvitationProps = InjectedProps;

enum InvitationPhase {
  SetPassword,
  Introduction,
}

const Invitation = (props: InvitationProps) => {
  const { fullScreen } = props;
  const router = useRouter();
  const token = router.query.token as string;

  const translation = useTranslation();
  const [phase, setPhase] = React.useState<InvitationPhase>(
    InvitationPhase.SetPassword
  );
  const { username: _username = "" } = querystring.parse(location.search);
  const username = _username as string;

  return (
    <Dialog fullScreen={fullScreen} open>
      {phase === InvitationPhase.SetPassword ? (
        <SetPasswordPhase
          token={token}
          onDone={() => setPhase(InvitationPhase.Introduction)}
        />
      ) : (
        <>
          <DialogTitle>{translation.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              <translation.body username={username} />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Link
              href="/login"
              as={`/login?username=${encodeURIComponent(username)}`}
            >
              <Button variant="raised">{translation.done}</Button>
            </Link>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default withErrorBoundary()(
  withMobileDialog<InvitationProps>()(Invitation)
);
