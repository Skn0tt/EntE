import * as React from "react";
import { Dialog, withMobileDialog } from "@material-ui/core";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import StudentReport from "./StudentReport";
import { useRouter } from "next/router";

const StudentReportRoute = (props: InjectedProps) => {
  const { fullScreen } = props;

  const router = useRouter();

  const studentId = router.query.userId as string;

  const handleOnClose = router.back;

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
