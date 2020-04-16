import PrefileSlotsRoute from "../../ui/routes/CreatePrefiledSlots";
import SlotsRoute from "../../ui/routes/Slots";
import Drawer from "../../ui/components/Drawer";
import { withRoleGuard } from "../../ui/withRouteGuard";
import { Roles } from "@@types";

function NewPrefiledSlot() {
  return (
    <Drawer>
      <PrefileSlotsRoute />
      <SlotsRoute />
    </Drawer>
  );
}

export default withRoleGuard(Roles.TEACHER, Roles.MANAGER)(NewPrefiledSlot);
