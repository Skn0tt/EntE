/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Switch, Route, Redirect } from "react-router";
import { Roles } from "ente-types";
import Entries from "./routes/Entries";
import Slots from "./routes/Slots";
import Users from "./routes/Users";
import SpecificUser from "./routes/SpecificUser";
import SpecificEntry from "./routes/SpecificEntry";
import NotFound from "./routes/NotFound";
import AdminRoute from "./routes/AdminRoute";
import AboutRoute from "./routes/About";
import StudentReport from "./routes/StudentReport/StudentReport";

const AdminRoutes: React.SFC = () => (
  <>
    <Switch>
      <Redirect exact from="/" to="/entries" />
      <Route path="/entries" component={Entries} />
      <Route path="/users" component={Users} />
      <Route path="/slots" component={Slots} />
      <Route path="/admin" component={AdminRoute} />
      <Route path="/about" component={AboutRoute} />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/users/:studentId/report" component={StudentReport} />
      <Route path="/users/:userId" component={SpecificUser} />
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </>
);

const ParentRoutes: React.SFC = () => (
  <>
    <Switch>
      <Redirect exact from="/" to="/entries" />
      <Route path="/entries" component={Entries} />
      <Route path="/about" component={AboutRoute} />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </>
);
const StudentRoutes = ParentRoutes;

const TeacherRoutes: React.SFC = () => (
  <Switch>
    <Redirect exact from="/" to="/slots" />
    <Route path="/slots" component={Slots} />
    <Route path="/about" component={AboutRoute} />
    <Route component={NotFound} />
  </Switch>
);

const ManagerRoutes: React.SFC = () => (
  <>
    <Switch>
      <Redirect exact from="/" to="/entries" />
      <Route path="/entries" component={Entries} />
      <Route path="/slots" component={Slots} />
      <Route path="/about" component={AboutRoute} />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/users/:studentId/report" component={StudentReport} />
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </>
);

interface Props {
  role: Roles;
}
const Routes: React.FunctionComponent<Props> = props => {
  switch (props.role) {
    case Roles.ADMIN:
      return <AdminRoutes />;
    case Roles.STUDENT:
      return <StudentRoutes />;
    case Roles.TEACHER:
      return <TeacherRoutes />;
    case Roles.PARENT:
      return <ParentRoutes />;
    case Roles.MANAGER:
      return <ManagerRoutes />;
    default:
      return null;
  }
};

export default Routes;
