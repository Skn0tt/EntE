import ClassReportRoute from "../ui/routes/ClassReportRoute";
import Drawer from "../ui/components/Drawer";
import { withRoleGuard } from "../ui/withRouteGuard";
import { Roles } from "@@types";

function Class() {
  return (
    <Drawer>
      <ClassReportRoute />
    </Drawer>
  );
}

export default withRoleGuard(Roles.MANAGER)(Class);
