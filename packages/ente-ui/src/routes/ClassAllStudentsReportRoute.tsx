import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import StudentReport from "./StudentReport/StudentReport";
import { Dialog } from "@material-ui/core";
import { connect, MapStateToPropsParam } from "react-redux";
import { AppState, getStudentsOfClass } from "../redux";

interface ClassAllStudentsReportRouteParams {
  class: string;
}

type ClassAllStudentsReportRouteOwnProps = RouteComponentProps<
  ClassAllStudentsReportRouteParams
> &
  InjectedProps;

interface ClassAllStudentsReportRouteStateProps {
  studentIdsOfClass: string[];
}
const mapStateToProps: MapStateToPropsParam<
  ClassAllStudentsReportRouteStateProps,
  ClassAllStudentsReportRouteOwnProps,
  AppState
> = (state, props) => {
  const { class: _class } = props.match.params;

  return {
    studentIdsOfClass: getStudentsOfClass(_class)(state).map(s => s.get("id"))
  };
};

type ClassAllStudentsReportRouteConnectedProps = ClassAllStudentsReportRouteOwnProps &
  ClassAllStudentsReportRouteStateProps;

const ClassAllStudentsReportRoute: React.FC<
  ClassAllStudentsReportRouteConnectedProps
> = props => {
  const { studentIdsOfClass } = props;
  const { fullScreen, history } = props;

  const handleOnClose = React.useCallback(
    () => {
      history.goBack();
    },
    [history]
  );

  return (
    <Dialog
      open
      fullScreen={fullScreen}
      onClose={handleOnClose}
      scroll="body"
      maxWidth="md"
    >
      <StudentReport studentIds={studentIdsOfClass} onClose={handleOnClose} />
    </Dialog>
  );
};

export default withMobileDialog()(
  withRouter(connect(mapStateToProps)(ClassAllStudentsReportRoute))
);
