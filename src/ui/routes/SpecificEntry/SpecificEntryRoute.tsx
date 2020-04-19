import * as React from "react";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import SpecificEntry from "./SpecificEntry";
import { useRouter } from "next/router";
import { ResponsiveFullscreenDialog } from "../../components/ResponsiveFullscreenDialog";

const SpecificEntryRoute: React.FC<{}> = (props) => {
  const router = useRouter();
  const entryId = router.query.entryId as string;

  const handleClose = React.useCallback(() => {
    router.push("/entries");
  }, [history]);

  return (
    <ResponsiveFullscreenDialog
      open
      onClose={handleClose}
      fullWidth
      scroll="body"
    >
      <SpecificEntry entryId={entryId} onClose={handleClose} />
    </ResponsiveFullscreenDialog>
  );
};

export default SpecificEntryRoute;
