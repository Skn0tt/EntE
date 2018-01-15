import * as React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from 'material-ui';
import { WatchLater, InsertDriveFile, Person, Home as HomeIcon } from 'material-ui-icons';
import { Route } from 'react-router-dom';

const Slots = () => (
  <Route
    render={({ history }) => (
      <ListItem button onClick={() => history.push('/slots')}>
        <ListItemIcon>
          <WatchLater />
        </ListItemIcon>
        <ListItemText primary="Stunden" />
      </ListItem>
    )}
  />
);

const Users = () => (
  <Route
    render={({ history }) => (
      <ListItem button onClick={() => history.push('/users')}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText primary="Nutzer" />
      </ListItem>
    )}
  />
);

const Entries = () => (
  <Route
    render={({ history }) => (
      <ListItem button onClick={() => history.push('/entries')}>
        <ListItemIcon>
          <InsertDriveFile />
        </ListItemIcon>
        <ListItemText primary="Einträge" />
      </ListItem>
    )}
  />
);

const Home = () => (
  <Route
    render={({ history }) => (
      <ListItem button onClick={() => history.push('/')}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
    )}
  />
);

export const StandardItems = () => (
  <List>
    <Home />
  </List>
);

export const AdminItems = () => (
  <List>
    <Entries />
    <Slots />
    <Users />
  </List>
);

export const TeacherItems = () => (
  <List>
    <Slots />
  </List>
);

export const StudentItems = () => (
  <List>
    <Entries />
  </List>
);

export const ParentItems = () => (
  <List>
    <Entries />
  </List>
);
