import * as React from "react";
import { connect, MapDispatchToPropsParam } from "react-redux";
import { Button, WithStyles, withStyles, Theme, Grid } from "@material-ui/core";
import AttachmentIcon from "@material-ui/icons/Attachment";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import { downloadExcelExportRequest } from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import ImportUsers from "./ImportUsers";

const useTranslation = makeTranslationHook({
  en: {
    downloadExcel: "Download Excel Export",
    importUsers: "Import Users"
  },
  de: {
    downloadExcel: "Excel Export downloaden",
    importUsers: "Nutzer importieren"
  }
});

const styles = (theme: Theme) => ({
  iconLeft: {
    marginRight: theme.spacing.unit
  },
  container: {
    margin: theme.spacing.unit
  }
});

interface AdminRouteOwnProps {}

interface AdminRouteStateProps {}

interface AdminRouteDispatchProps {
  downloadExcelExport: () => void;
}

const mapDispatchToProps: MapDispatchToPropsParam<
  AdminRouteDispatchProps,
  AdminRouteOwnProps
> = dispatch => ({
  downloadExcelExport: () => dispatch(downloadExcelExportRequest())
});

type AdminRouteProps = AdminRouteOwnProps &
  AdminRouteStateProps &
  AdminRouteDispatchProps &
  WithStyles;

const AdminRoute: React.SFC<AdminRouteProps> = React.memo(props => {
  const { downloadExcelExport, classes } = props;
  const lang = useTranslation();
  const [showImportUsers, setShowImportUsers] = React.useState(false);

  const handleOnShowImportUsers = React.useCallback(
    () => setShowImportUsers(true),
    [setShowImportUsers]
  );

  const handleOnCloseImportUsers = React.useCallback(
    () => setShowImportUsers(false),
    [setShowImportUsers]
  );

  return (
    <>
      <ImportUsers show={showImportUsers} onClose={handleOnCloseImportUsers} />
      <Grid
        container
        direction="column"
        spacing={24}
        className={classes.container}
      >
        <Grid item>
          <Button variant="outlined" onClick={downloadExcelExport}>
            <AttachmentIcon className={classes.iconLeft} />
            {lang.downloadExcel}
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={handleOnShowImportUsers}>
            <ImportExportIcon className={classes.iconLeft} />
            {lang.importUsers}
          </Button>
        </Grid>
      </Grid>
    </>
  );
});

export default connect(
  undefined,
  mapDispatchToProps
)(withStyles(styles)(withErrorBoundary()(AdminRoute)));
