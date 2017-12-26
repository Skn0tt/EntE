import * as React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from 'material-ui';
import { InsertDriveFile, Person } from 'material-ui-icons';
import { Route } from 'react-router-dom';

export const AdminItems = () => (
  <List>
    <Route
      render={({ history }) => (
        <ListItem button={true} onClick={() => history.push('/entries')}>
          <ListItemIcon>
            <InsertDriveFile />
          </ListItemIcon>
          <ListItemText primary="Entries" />
        </ListItem>
      )}
    />
    <Route
      render={({ history }) => (
        <ListItem button={true} onClick={() => history.push('/users')}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
      )}
    />
  </List>
);
