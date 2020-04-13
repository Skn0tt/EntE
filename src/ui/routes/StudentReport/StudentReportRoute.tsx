import * as React from "react";
import { useRouteMatch, useHistory } from "react-router";
import { Dialog, withMobileDialog } from "@material-ui/core";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import StudentReport from "./StudentReport";

interface StudentReportRouteParams {
  studentId: string;
}

const StudentReportRoute = (props: InjectedProps) => {
  const { fullScreen } = props;
  const {
    params: { studentId },
  } = useRouteMatch<StudentReportRouteParams>();
  const history = useHistory();

  const handleOnClose = history.goBack;

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

export default withMobileDialog()(StudentReportRoute);
