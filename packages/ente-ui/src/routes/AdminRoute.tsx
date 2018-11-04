import * as React from "react";
import { connect, MapDispatchToPropsParam } from "react-redux";
import { Button, WithStyles, withStyles, Theme, Grid } from "@material-ui/core";
import { Attachment as AttachmentIcon } from "@material-ui/icons";
import { downloadExcelExportRequest } from "ente-redux";

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

const AdminRoute: React.SFC<AdminRouteProps> = props => {
  const { downloadExcelExport, classes } = props;

  return (
    <Grid container spacing={24} className={classes.container}>
      <Grid item>
        <Button variant="outlined" onClick={downloadExcelExport}>
          <AttachmentIcon className={classes.iconLeft} />
          Excel Export downloaden
        </Button>
      </Grid>
    </Grid>
  );
};

export default connect(undefined, mapDispatchToProps)(
  withStyles(styles)(AdminRoute)
);
