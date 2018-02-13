import * as React from 'react';
import { Roles } from './interfaces/index';
import { Switch, Route } from 'react-router';

import Entries from './routes/Entries';
import Users from './routes/Users';
import SpecificEntry from './routes/SpecificEntry';
import SpecificUser from './routes/SpecificUser';
import Home from './routes/Home';
import Slots from './routes/Slots';
import CreateEntry from './routes/CreateEntry';
import CreateUser from './routes/CreateUser';
import ImportUsers from './routes/ImportUsers';
import NotFound from './routes/NotFound';

const AdminRoutes = () => (
  <React.Fragment>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/entries" component={Entries} />
      <Route path="/users" component={Users} />
      <Route path="/slots" component={Slots} />
      <Route path="/createUser" component={CreateUser} />
      <Route path="/importUsers" component={ImportUsers} />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/users/:userId" component={SpecificUser} />
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </React.Fragment>
);

const ParentRoutes = () => (
  <React.Fragment>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/entries" component={Entries} />
      <Route path="/createEntry" component={CreateEntry} />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </React.Fragment>
);
const StudentRoutes = () => <ParentRoutes />;

const TeacherRoutes = () => (
  <React.Fragment>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/slots" component={Slots} />
      <Route component={NotFound} />
    </Switch>
  </React.Fragment>
);

const ManagerRoutes = () => (
  <React.Fragment>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/entries" component={Entries} />
      <Route path="/slots" component={Slots} />
      <Route component={NotFound} />
    </Switch>
    <Switch>
      <Route path="/entries/:entryId" component={SpecificEntry} />
    </Switch>
  </React.Fragment>
);

interface Props {
  role: Roles;
}

const Routes: React.SFC<Props> = (props) => {
  if (props.role === Roles.ADMIN) return <AdminRoutes />;
  if (props.role === Roles.STUDENT) return <StudentRoutes />;
  if (props.role === Roles.TEACHER) return <TeacherRoutes />;
  if (props.role === Roles.PARENT) return <ParentRoutes />;
  if (props.role === Roles.MANAGER) return <ManagerRoutes />;
  return null;
};

export default Routes;
