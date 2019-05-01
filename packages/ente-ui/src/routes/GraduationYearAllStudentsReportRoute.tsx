import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import StudentReport from "./StudentReport/StudentReport";
import { Dialog } from "@material-ui/core";
import { connect, MapStateToPropsParam } from "react-redux";
import { AppState, getStudentsOfGradYear } from "../redux";

interface GraduationYearAllStudentsReportRouteParams {
  graduationYear: string;
}

type GraduationYearAllStudentsReportRouteOwnProps = RouteComponentProps<
  GraduationYearAllStudentsReportRouteParams
> &
  InjectedProps;

interface GraduationYearAllStudentsReportRouteStateProps {
  studentIdsOfGradYear: string[];
}
const mapStateToProps: MapStateToPropsParam<
  GraduationYearAllStudentsReportRouteStateProps,
  GraduationYearAllStudentsReportRouteOwnProps,
  AppState
> = (state, props) => {
  const { graduationYear } = props.match.params;

  return {
    studentIdsOfGradYear: getStudentsOfGradYear(+graduationYear)(state).map(s =>
      s.get("id")
    )
  };
};

type GraduationYearAllStudentsReportRouteConnectedProps = GraduationYearAllStudentsReportRouteOwnProps &
  GraduationYearAllStudentsReportRouteStateProps;

const GraduationYearAllStudentsReportRoute: React.FC<
  GraduationYearAllStudentsReportRouteConnectedProps
> = props => {
  const { studentIdsOfGradYear } = props;
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
      <StudentReport
        studentIds={studentIdsOfGradYear}
        onClose={handleOnClose}
      />
    </Dialog>
  );
};

export default withMobileDialog()(
  withRouter(connect(mapStateToProps)(GraduationYearAllStudentsReportRoute))
);
