import AdminRoute from "../ui/routes/AdminRoute";
import Drawer from "../ui/components/Drawer";
import { withAdminGuard } from "../ui/withRouteGuard";

function Admin() {
  return (
    <Drawer>
      <AdminRoute />
    </Drawer>
  );
}

export default withAdminGuard(Admin);
