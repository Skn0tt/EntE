import { Roles } from "@@types";
import { withRoleGuard } from "../../ui/withRouteGuard";
import Drawer from "../../ui/components/Drawer";
import EntriesRoute from "../../ui/routes/Entries";
import CreateEntryRoute from "../../ui/routes/Entries/CreateEntry";

function NewEntry() {
  return (
    <Drawer>
      <CreateEntryRoute />
      <EntriesRoute />
    </Drawer>
  );
}

export default withRoleGuard(Roles.STUDENT, Roles.PARENT)(NewEntry);
