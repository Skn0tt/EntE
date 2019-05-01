import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { Dialog, withMobileDialog } from "@material-ui/core";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import StudentReport from "./StudentReport";

interface StudentReportOwnProps {}

interface StudentReportRouteParams {
  studentId: string;
}

type StudentReportProps = StudentReportOwnProps &
  RouteComponentProps<StudentReportRouteParams> &
  InjectedProps;

const StudentReportRoute: React.FC<StudentReportProps> = props => {
  const { match, fullScreen, history } = props;
  const { studentId } = match.params;

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
      <StudentReport studentIds={[studentId]} onClose={handleOnClose} />
    </Dialog>
  );
};

export default withMobileDialog()(withRouter(StudentReportRoute));
