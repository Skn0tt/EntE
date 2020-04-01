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
import SpecificEntry from "./routes/SpecificEntry/SpecificEntryRoute";
import NotFound from "./routes/NotFound";
import AdminRoute from "./routes/AdminRoute";
import AboutRoute from "./routes/About";
import StudentReportRoute from "./routes/StudentReport/StudentReportRoute";
import ClassReportRoute from "./routes/ClassReportRoute";
import _ClassAllStudentsReportRoute from "./routes/ClassAllStudentsReportRoute";
import SpecificUser from "./routes/SpecificUser";

const ClassAllStudentsReportRoute = () => (
  <Route path="/class/:class/report" component={_ClassAllStudentsReportRoute} />
);

interface BaseRoutesProps {
  isAdmin: boolean;
  initial: string;
  general: React.ReactChild[];
  specific: React.ReactChild[];
}

const BaseRoutes = (props: BaseRoutesProps) => (
  <>
    <Switch>
      <Redirect exact from="/" to={props.initial} />
      {props.general}
      {props.isAdmin && (
        <>
          <Route path="/users" component={Users} />
          <Route path="/admin" component={AdminRoute} />
        </>
      )}
      <Route path="/about" component={AboutRoute} />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      {props.specific}
      {props.isAdmin && (
        <Route path="/users/:userId" component={SpecificUser} />
      )}
    </Switch>
  </>
);

const ParentRoutes = ({ isAdmin }: { isAdmin: boolean }) => (
  <BaseRoutes
    isAdmin={isAdmin}
    initial="/entries"
    general={[<Route path="/entries" component={Entries} />]}
    specific={[<Route path="/entries/:entryId" component={SpecificEntry} />]}
  />
);

const StudentRoutes = ParentRoutes;

const TeacherRoutes = ({ isAdmin }: { isAdmin: boolean }) => (
  <BaseRoutes
    isAdmin={isAdmin}
    initial="/slots"
    general={[<Route path="/slots" component={Slots} />]}
    specific={[<Route path="/entries/:entryId" component={SpecificEntry} />]}
  />
);

const ManagerRoutes = ({ isAdmin }: { isAdmin: boolean }) => (
  <BaseRoutes
    isAdmin={isAdmin}
    initial="/entries"
    general={[
      <Route path="/entries" component={Entries} />,
      <Route path="/slots" component={Slots} />,
      <Route
        exact
        path={["/classes", "/classes/:class"]}
        component={ClassReportRoute}
      />
    ]}
    specific={[
      <ClassAllStudentsReportRoute />,
      <Route path="/users/:studentId/report" component={StudentReportRoute} />,
      <Route path="/entries/:entryId" component={SpecificEntry} />
    ]}
  />
);

interface Props {
  role: Roles;
  isAdmin: boolean;
}
const Routes: React.FunctionComponent<Props> = props => {
  switch (props.role) {
    case Roles.STUDENT:
      return <StudentRoutes isAdmin={props.isAdmin} />;
    case Roles.TEACHER:
      return <TeacherRoutes isAdmin={props.isAdmin} />;
    case Roles.PARENT:
      return <ParentRoutes isAdmin={props.isAdmin} />;
    case Roles.MANAGER:
      return <ManagerRoutes isAdmin={props.isAdmin} />;
    default:
      return null;
  }
};

export default Routes;
