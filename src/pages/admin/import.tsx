import { withAdminGuard } from "ui/withRouteGuard";
import Drawer from "../../ui/components/Drawer";
import AdminRoute from "../../ui/routes/AdminRoute";
import ImportUsersDialog from "../../ui/routes/AdminRoute/ImportUsersDialog";

function ImportUsers() {
  return (
    <Drawer>
      <ImportUsersDialog />
      <AdminRoute />
    </Drawer>
  );
}

export default withAdminGuard(ImportUsers);
