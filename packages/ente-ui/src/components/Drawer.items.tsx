/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import {
  WatchLater,
  InsertDriveFile,
  Person,
  Settings
} from "@material-ui/icons";
import { Route } from "react-router-dom";
import { createTranslation } from "../helpers/createTranslation";

const lang = createTranslation({
  en: {
    slots: "Slots",
    users: "Users",
    entries: "Entries",
    admin: "Admin"
  },
  de: {
    slots: "Stunden",
    users: "Nutzer",
    entries: "Einträge",
    admin: "Admin"
  }
});

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
        <ListItemText primary={lang.slots} />
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
        <ListItemText primary={lang.users} />
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
        <ListItemText primary={lang.entries} />
      </ListItem>
    )}
  />
);

const Admin: React.SFC = () => (
  <Route
    render={({ history }) => (
      <ListItem button onClick={() => history.push("/admin")}>
        <ListItemIcon>
          <Settings />
        </ListItemIcon>
        <ListItemText primary={lang.admin} />
      </ListItem>
    )}
  />
);

/**
 * # Composed
 */
export const AdminItems: React.SFC = () => (
  <>
    <Entries />
    <Slots />
    <Users />
    <Admin />
  </>
);

export const TeacherItems: React.SFC = () => (
  <>
    <Slots />
  </>
);

export const StudentItems: React.SFC = () => (
  <>
    <Entries />
  </>
);

export const ParentItems: React.SFC = () => (
  <>
    <Entries />
  </>
);

export const ManagerItems: React.SFC = () => (
  <>
    <Entries />
    <Slots />
  </>
);
