import { withAdminGuard } from "../../ui/withRouteGuard";
import Drawer from "../../ui/components/Drawer";
import UsersRoute from "../../ui/routes/Users";
import SpecificUserRoute from "../../ui/routes/SpecificUser";

function SpecificUser() {
  return (
    <Drawer>
      <SpecificUserRoute />
      <UsersRoute />
    </Drawer>
  );
}

export default withAdminGuard(SpecificUser);
