import * as React from 'react';
import { Roles } from './interfaces/index';
import { Switch, Route, Redirect } from 'react-router';
import * as Loadable from 'react-loadable';
import { CircularProgress } from 'material-ui';

const Loading = () => <CircularProgress />;

const LoadableEntries = Loadable({
  loader: () => import('./routes/Entries'),
  loading: Loading,
});

const LoadableUsers = Loadable({
  loader: () => import('./routes/Users'),
  loading: Loading,
});

const LoadableSlots = Loadable({
  loader: () => import('./routes/Slots'),
  loading: Loading,
});

const LoadableSpecificUser = Loadable({
  loader: () => import('./routes/SpecificUser'),
  loading: Loading,
});

const LoadableSpecificEntry = Loadable({
  loader: () => import('./routes/SpecificEntry'),
  loading: Loading,
});

const LoadableNotFound = Loadable({
  loader: () => import('./routes/NotFound'),
  loading: Loading,
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
  <React.Fragment>
    <Switch>
      <Redirect exact from="/" to="/slots" />
      <Route path="/slots" component={LoadableSlots} />
      <Route component={LoadableNotFound} />
    </Switch>
  </React.Fragment>
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
