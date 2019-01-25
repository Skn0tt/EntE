import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { withMobileDialog, Dialog } from "@material-ui/core";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import SpecificEntry from "./SpecificEntry";

interface SpecificEntryRouteMatch {
  entryId: string;
}

type SpecificEntryRouteProps = RouteComponentProps<SpecificEntryRouteMatch> &
  InjectedProps;

const SpecificEntryRoute: React.FC<SpecificEntryRouteProps> = props => {
  const { fullScreen, match, history } = props;
  const { entryId } = match.params;

  const handleClose = React.useCallback(
    () => {
      history.push("/entries");
    },
    [history]
  );

  return (
    <Dialog
      open
      fullScreen={fullScreen}
      onClose={handleClose}
      fullWidth
      scroll="body"
    >
      <SpecificEntry entryId={entryId} onClose={handleClose} />
    </Dialog>
  );
};

export default withMobileDialog()(withRouter(SpecificEntryRoute));
