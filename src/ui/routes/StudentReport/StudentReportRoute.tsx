import * as React from "react";
import StudentReport from "./StudentReport";
import { useRouter } from "next/router";
import { ResponsiveFullscreenDialog } from "../../components/ResponsiveFullscreenDialog";

const StudentReportRoute = (props: {}) => {
  const router = useRouter();

  const studentId = router.query.userId as string;

  const handleOnClose = router.back;

  return (
    <ResponsiveFullscreenDialog
      open
      onClose={handleOnClose}
      scroll="body"
      maxWidth="md"
    >
      <StudentReport studentIds={[studentId]} onClose={handleOnClose} />
    </ResponsiveFullscreenDialog>
  );
};

export default StudentReportRoute;
