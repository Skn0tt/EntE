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
import SpecificEntry from "./routes/SpecificEntry/SpecificEntryRoute";
import NotFound from "./routes/NotFound";
import AdminRoute from "./routes/AdminRoute";
import AboutRoute from "./routes/About";
import StudentReportRoute from "./routes/StudentReport/StudentReportRoute";
import ClassReportRoute from "./routes/ClassReportRoute";
import _ClassAllStudentsReportRoute from "./routes/ClassAllStudentsReportRoute";
import CreateEntry from "./routes/Entries/CreateEntry";
import ImportUsersDialog from "./routes/AdminRoute/ImportUsersDialog";
import CreatePrefiledSlots from "./routes/CreatePrefiledSlots";

const ClassAllStudentsReportRoute = () => (
  <Route path="/class/:class/report" component={_ClassAllStudentsReportRoute} />
);

const AdminRoutes: React.SFC = () => (
  <>
    <Switch>
      <Redirect exact from="/" to="/admin" />
      <Route path="/entries" component={Entries} />
      <Route path="/users" component={Users} />
      <Route path="/slots" component={Slots} />
      <Route path="/admin" component={AdminRoute} />
      <Route path="/about" component={AboutRoute} />
      <Route
        exact
        path={["/classes", "/classes/:class"]}
        component={ClassReportRoute}
      />
      <ClassAllStudentsReportRoute />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/slots/prefile" component={CreatePrefiledSlots} />
      <Route path="/admin/import" component={ImportUsersDialog} />
      <Route path="/users/:studentId/report" component={StudentReportRoute} />
      <Route path="/users/:userId" component={SpecificUser} />
      <Route path="/entries/create" component={CreateEntry} />
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
      <Route path="/entries/new" component={CreateEntry} />
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </>
);
const StudentRoutes = ParentRoutes;

const TeacherRoutes: React.SFC = () => (
  <>
    <Switch>
      <Redirect exact from="/" to="/slots" />
      <Route path="/slots" component={Slots} />
      <Route path="/about" component={AboutRoute} />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/slots/prefile" component={CreatePrefiledSlots} />
    </Switch>
  </>
);

const ManagerRoutes: React.SFC = () => (
  <>
    <Switch>
      <Redirect exact from="/" to="/entries" />
      <Route path="/entries" component={Entries} />
      <Route path="/slots" component={Slots} />
      <Route path="/about" component={AboutRoute} />
      <Route
        exact
        path={["/classes", "/classes/:class"]}
        component={ClassReportRoute}
      />
      <ClassAllStudentsReportRoute />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/slots/prefile" component={CreatePrefiledSlots} />
      <Route path="/users/:studentId/report" component={StudentReportRoute} />
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </>
);

interface Props {
  role: Roles;
  isAdmin: boolean;
}
const Routes: React.FunctionComponent<Props> = props => {
  if (props.isAdmin) {
    return <AdminRoutes />;
  }

  switch (props.role) {
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
