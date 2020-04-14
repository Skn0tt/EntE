import * as React from "react";
import { withMobileDialog, Dialog } from "@material-ui/core";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import SpecificEntry from "./SpecificEntry";
import { useRouter } from "next/router";

type SpecificEntryRouteProps = InjectedProps;

const SpecificEntryRoute: React.FC<SpecificEntryRouteProps> = (props) => {
  const { fullScreen } = props;
  const router = useRouter();
  const entryId = router.query.entryId as string;

  const handleClose = React.useCallback(() => {
    router.push("/entries");
  }, [history]);

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

export default withMobileDialog()(SpecificEntryRoute);
