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

const ClassAllStudentsReportRoute = () => (
  <Route path="/class/:class/report" component={_ClassAllStudentsReportRoute} />
);

const AdminRoutes: React.SFC = () => (
  <>
    <Route path="/slots" component={Slots} />
    <Route path="/users" component={Users} />
    <Route path="/admin" component={AdminRoute} />
  </>
);

const ParentRoutes: React.SFC = props => (
  <>
    <Switch>
      <Redirect exact from="/" to="/entries" />
      <Route path="/entries" component={Entries} />
      <Route path="/about" component={AboutRoute} />
      {props.children}
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </>
);
const StudentRoutes = ParentRoutes;

const TeacherRoutes: React.SFC = props => (
  <Switch>
    <Redirect exact from="/" to="/slots" />
    <Route path="/slots" component={Slots} />
    <Route path="/about" component={AboutRoute} />
    {props.children}
    <Route component={NotFound} />
  </Switch>
);

const ManagerRoutes: React.SFC = props => (
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
      {props.children}
      <Route component={NotFound} />
    </Switch>
    <Switch>
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
  const children = props.isAdmin ? <AdminRoutes /> : undefined;

  switch (props.role) {
    case Roles.STUDENT:
      return <StudentRoutes children={children} />;
    case Roles.TEACHER:
      return <TeacherRoutes children={children} />;
    case Roles.PARENT:
      return <ParentRoutes children={children} />;
    case Roles.MANAGER:
      return <ManagerRoutes children={children} />;
    default:
      return null;
  }
};

export default Routes;
