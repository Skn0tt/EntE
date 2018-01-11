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

const AdminRoutes = () => (
  <React.Fragment>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/entries" component={Entries} />
      <Route path="/users" component={Users} />
      <Route path="/slots" component={Slots} />
    </Switch>
    <Switch>
      <Route path="/users/:userId" component={SpecificUser} />
      <Route path="/entries/:entryId" component={SpecificEntry} />
      <Route path="/createEntry" component={CreateEntry} />
      <Route path="/createUser" component={CreateUser} />
    </Switch>
  </React.Fragment>
);

const ParentRoutes = () => (
  <React.Fragment>
    <Switch>
      <Route exact={true} path="/" component={Home} />
      <Route path="/entries" component={Entries} />
    </Switch>
    <Switch>
      <Route path="/entries/:entryId" component={SpecificEntry} />
      <Route path="/createEntry" component={CreateEntry} />
    </Switch>
  </React.Fragment>
);
const StudentRoutes = () => <ParentRoutes />;

const TeacherRoutes = () => (
  <React.Fragment>
  <Switch>
    <Route exact={true} path="/" component={Home} />
    <Route path="/slots" component={Slots} />
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
  return null;
};

export default Routes;
