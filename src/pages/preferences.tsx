import { withAuthenticatedGuard } from "ui/withRouteGuard";
import Drawer from "ui/components/Drawer";
import { Preferences as PreferencesRoute } from "ui/routes/Preferences";

function Preferences() {
  return (
    <Drawer>
      <PreferencesRoute />
    </Drawer>
  );
}

export default withAuthenticatedGuard()(Preferences);
