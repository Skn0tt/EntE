import * as React from "react";
import { InjectedProps } from "@material-ui/core/withMobileDialog";
import StudentReport from "./StudentReport/StudentReport";
import { useSelector } from "react-redux";
import { getStudentsOfClass, getOneSelvesClass } from "../redux";
import { useRouter } from "next/router";
import { ResponsiveFullscreenDialog } from "../components/ResponsiveFullscreenDialog";

const ClassAllStudentsReportRoute = (props: InjectedProps) => {
  const ownClass = useSelector(getOneSelvesClass);
  const studentsOfClass = useSelector(getStudentsOfClass(ownClass.orSome("")));

  const router = useRouter();

  const handleOnClose = router.back;

  return (
    <ResponsiveFullscreenDialog
      open
      onClose={handleOnClose}
      scroll="body"
      maxWidth="md"
    >
      <StudentReport
        studentIds={studentsOfClass.map((s) => s.get("id"))}
        onClose={handleOnClose}
      />
    </ResponsiveFullscreenDialog>
  );
};

export default ClassAllStudentsReportRoute;
