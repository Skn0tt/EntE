import * as React from "react";
import withMobileDialog, {
  InjectedProps,
} from "@material-ui/core/withMobileDialog";
import StudentReport from "./StudentReport/StudentReport";
import { Dialog } from "@material-ui/core";
import { useSelector } from "react-redux";
import { getStudentsOfClass, getOneSelvesClass } from "../redux";
import { useRouter } from "next/router";

const ClassAllStudentsReportRoute = (props: InjectedProps) => {
  const ownClass = useSelector(getOneSelvesClass);
  const studentsOfClass = useSelector(getStudentsOfClass(ownClass.orSome("")));
  const { fullScreen } = props;

  const router = useRouter();

  const handleOnClose = router.back;

  return (
    <Dialog
      open
      fullScreen={fullScreen}
      onClose={handleOnClose}
      scroll="body"
      maxWidth="md"
    >
      <StudentReport
        studentIds={studentsOfClass.map((s) => s.get("id"))}
        onClose={handleOnClose}
      />
    </Dialog>
  );
};

export default withMobileDialog()(ClassAllStudentsReportRoute);
