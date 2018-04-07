import * as React from "react";
import { Switch, Route, Redirect } from "react-router";
import Loadable from "react-loadable";
import LoadingIndicator from "./elements/LoadingIndicator";
import { Roles } from "ente-types";

const loading = <LoadingIndicator />;

const LoadableEntries = Loadable({
  loading,
  loader: () => import("./routes/Entries")
});

const LoadableUsers = Loadable({
  loading,
  loader: () => import("./routes/Users")
});

const LoadableSlots = Loadable({
  loading,
  loader: () => import("./routes/Slots")
});

const LoadableSpecificUser = Loadable({
  loading,
  loader: () => import("./routes/SpecificUser")
});

const LoadableSpecificEntry = Loadable({
  loading,
  loader: () => import("./routes/SpecificEntry")
});

const LoadableNotFound = Loadable({
  loading,
  loader: () => import("./routes/NotFound")
});

const AdminRoutes = () => (
  <React.Fragment>
    <Switch>
      <Redirect exact from="/" to="/entries" />
      <Route path="/entries" component={LoadableEntries} />
      <Route path="/users" component={LoadableUsers} />
      <Route path="/slots" component={LoadableSlots} />
      <Route component={LoadableNotFound} />
    </Switch>
    <Switch>
      <Route path="/users/:userId" component={LoadableSpecificUser} />
      <Route path="/entries/:entryId" component={LoadableSpecificEntry} />
    </Switch>
  </React.Fragment>
);

const ParentRoutes = () => (
  <React.Fragment>
    <Switch>
      <Redirect exact from="/" to="/entries" />
      <Route path="/entries" component={LoadableEntries} />
      <Route component={LoadableNotFound} />
    </Switch>
    <Switch>
      <Route path="/entries/:entryId" component={LoadableSpecificEntry} />
    </Switch>
  </React.Fragment>
);
const StudentRoutes = () => <ParentRoutes />;

const TeacherRoutes = () => (
  <Switch>
    <Redirect exact from="/" to="/slots" />
    <Route path="/slots" component={LoadableSlots} />
    <Route component={LoadableNotFound} />
  </Switch>
);

const ManagerRoutes = () => (
  <React.Fragment>
    <Switch>
      <Redirect exact from="/" to="/entries" />
      <Route path="/entries" component={LoadableEntries} />
      <Route path="/slots" component={LoadableSlots} />
      <Route component={LoadableNotFound} />
    </Switch>
    <Switch>
      <Route path="/entries/:entryId" component={LoadableSpecificEntry} />
    </Switch>
  </React.Fragment>
);

interface Props {
  role: Roles;
}

const Routes: React.SFC<Props> = props => {
  if (props.role === Roles.ADMIN) return <AdminRoutes />;
  if (props.role === Roles.STUDENT) return <StudentRoutes />;
  if (props.role === Roles.TEACHER) return <TeacherRoutes />;
  if (props.role === Roles.PARENT) return <ParentRoutes />;
  if (props.role === Roles.MANAGER) return <ManagerRoutes />;
  return null;
};

export default Routes;
