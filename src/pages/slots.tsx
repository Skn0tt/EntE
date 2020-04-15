import SlotsRoute from "../ui/routes/Slots";
import Drawer from "../ui/components/Drawer";
import { withRoleGuard } from "../ui/withRouteGuard";
import { Roles } from "@@types";

function Slots() {
  return (
    <Drawer>
      <SlotsRoute />
    </Drawer>
  );
}

export default withRoleGuard(Roles.MANAGER, Roles.TEACHER)(Slots);
