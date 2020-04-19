import { Roles } from "@@types";
import { withRoleGuard } from "../../ui/withRouteGuard";
import Drawer from "../../ui/components/Drawer";
import EntriesRoute from "../../ui/routes/Entries";
import SpecificEntryRoute from "../../ui/routes/SpecificEntry/SpecificEntryRoute";

function SpecificEntry() {
  return (
    <Drawer>
      <SpecificEntryRoute />
      <EntriesRoute />
    </Drawer>
  );
}

export default withRoleGuard(
  Roles.STUDENT,
  Roles.PARENT,
  Roles.MANAGER
)(SpecificEntry);
