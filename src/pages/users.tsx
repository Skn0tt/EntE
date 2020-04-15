import UsersRoute from "../ui/routes/Users";
import Drawer from "../ui/components/Drawer";
import { withAdminGuard } from "../ui/withRouteGuard";

function Users() {
  return (
    <Drawer>
      <UsersRoute />
    </Drawer>
  );
}

export default withAdminGuard(Users);
