import * as React from "react";
import { useHistory } from "react-router";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import StudentReport from "./StudentReport/StudentReport";
import { Dialog } from "@material-ui/core";
import { MapStateToPropsParam, useSelector } from "react-redux";
import { getStudentsOfClass, getOneSelvesClass } from "../redux";

const ClassAllStudentsReportRoute = (props: InjectedProps) => {
  const ownClass = useSelector(getOneSelvesClass);
  const studentsOfClass = useSelector(getStudentsOfClass(ownClass.orSome("")));
  const { fullScreen } = props;

  const history = useHistory();

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
        studentIds={studentsOfClass.map(s => s.get("id"))}
        onClose={handleOnClose}
      />
    </Dialog>
  );
};

export default withMobileDialog()(ClassAllStudentsReportRoute);
