import AboutRoute from "../ui/routes/About";
import Drawer from "../ui/components/Drawer";
import { withAuthenticatedGuard } from "../ui/withRouteGuard";

function About() {
  return (
    <Drawer>
      <AboutRoute />
    </Drawer>
  );
}

export default withAuthenticatedGuard()(About);
