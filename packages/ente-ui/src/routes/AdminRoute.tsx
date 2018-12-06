import * as React from "react";
import { connect, MapDispatchToPropsParam } from "react-redux";
import { Button, WithStyles, withStyles, Theme, Grid } from "@material-ui/core";
import Attachment from "@material-ui/icons/Attachment";
import { downloadExcelExportRequest } from "../redux";
import { createTranslation } from "../helpers/createTranslation";

const lang = createTranslation({
  en: {
    downloadExcel: "Download Excel Export"
  },
  de: {
    downloadExcel: "Excel Export downloaden"
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

const AdminRoute: React.SFC<AdminRouteProps> = props => {
  const { downloadExcelExport, classes } = props;

  return (
    <Grid container spacing={24} className={classes.container}>
      <Grid item>
        <Button variant="outlined" onClick={downloadExcelExport}>
          <AttachmentIcon className={classes.iconLeft} />
          {lang.downloadExcel}
        </Button>
      </Grid>
    </Grid>
  );
};

export default connect(undefined, mapDispatchToProps)(
  withStyles(styles)(AdminRoute)
);
