import { Roles } from "@@types";
import { withRoleGuard } from "../../ui/withRouteGuard";
import Drawer from "../../ui/components/Drawer";
import ClassReportRoute from "../../ui/routes/ClassReportRoute";
import ClassAllStudentsReportRoute from "../../ui/routes/ClassAllStudentsReportRoute";

function Report() {
  return (
    <Drawer>
      <ClassAllStudentsReportRoute />
      <ClassReportRoute />
    </Drawer>
  );
}

export default withRoleGuard(Roles.MANAGER)(Report);
