import * as React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "material-ui";
import { WatchLater, InsertDriveFile, Person } from "material-ui-icons";
import { Route } from "react-router-dom";

/**
 * # Items
 */
const Slots: React.SFC = () => (
  <Route
    render={({ history }) => (
      <ListItem button onClick={() => history.push("/slots")}>
        <ListItemIcon>
          <WatchLater />
        </ListItemIcon>
        <ListItemText primary="Stunden" />
      </ListItem>
    )}
  />
);

const Users: React.SFC = () => (
  <Route
    render={({ history }) => (
      <ListItem button onClick={() => history.push("/users")}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText primary="Nutzer" />
      </ListItem>
    )}
  />
);

const Entries: React.SFC = () => (
  <Route
    render={({ history }) => (
      <ListItem button onClick={() => history.push("/entries")}>
        <ListItemIcon>
          <InsertDriveFile />
        </ListItemIcon>
        <ListItemText primary="Einträge" />
      </ListItem>
    )}
  />
);

/**
 * # Composed
 */
export const AdminItems: React.SFC = () => (
  <List>
    <Entries />
    <Slots />
    <Users />
  </List>
);

export const TeacherItems: React.SFC = () => (
  <List>
    <Slots />
  </List>
);

export const StudentItems: React.SFC = () => (
  <List>
    <Entries />
  </List>
);

export const ParentItems: React.SFC = () => (
  <List>
    <Entries />
  </List>
);

export const ManagerItems: React.SFC = () => (
  <List>
    <Entries />
    <Slots />
  </List>
);
