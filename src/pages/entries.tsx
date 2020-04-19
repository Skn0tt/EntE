import EntriesRoute from "../ui/routes/Entries";
import Drawer from "../ui/components/Drawer";
import { withRoleGuard } from "../ui/withRouteGuard";
import { Roles } from "@@types";

function Entries() {
  return (
    <Drawer>
      <EntriesRoute />
    </Drawer>
  );
}

export default withRoleGuard(
  Roles.MANAGER,
  Roles.PARENT,
  Roles.STUDENT
)(Entries);
