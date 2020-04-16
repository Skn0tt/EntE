import StudentReportRoute from "../../../ui/routes/StudentReport/StudentReportRoute";
import UsersRoute from "../../../ui/routes/Users/Users";
import Drawer from "../../../ui/components/Drawer";
import { withRoleGuard } from "../../../ui/withRouteGuard";
import { Roles } from "@@types";

function StudentReport() {
  return (
    <Drawer>
      <StudentReportRoute />
      <UsersRoute />
    </Drawer>
  );
}

export default withRoleGuard(Roles.MANAGER)(StudentReport);
