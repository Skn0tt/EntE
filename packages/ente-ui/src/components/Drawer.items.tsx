/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import WatchLater from "@material-ui/icons/WatchLater";
import InsertDriveFile from "@material-ui/icons/InsertDriveFile";
import Person from "@material-ui/icons/Person";
import Settings from "@material-ui/icons/Settings";
import School from "@material-ui/icons/School";
import { Route } from "react-router-dom";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

const useTranslation = makeTranslationHook({
  en: {
    slots: "Slots",
    users: "Users",
    entries: "Entries",
    admin: "Admin",
    class: "Class",
    classes: "Classes"
  },
  de: {
    slots: "Stunden",
    users: "Nutzer",
    entries: "Einträge",
    admin: "Admin",
    class: "Klasse / Jahrgangsstufe",
    classes: "Klassen / Jahrgangsstufen"
  }
});

/**
 * # Items
 */
const Slots: React.FunctionComponent = () => {
  const lang = useTranslation();
  return (
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
};

const Users: React.FunctionComponent = () => {
  const lang = useTranslation();
  return (
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
};

const Entries: React.SFC = () => {
  const lang = useTranslation();
  return (
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
};

const Admin: React.SFC = () => {
  const lang = useTranslation();
  return (
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
};

const Class: React.SFC<{ plural?: boolean }> = ({ plural }) => {
  const lang = useTranslation();
  return (
    <Route
      render={({ history }) => (
        <ListItem button onClick={() => history.push("/class")}>
          <ListItemIcon>
            <School />
          </ListItemIcon>
          <ListItemText primary={plural ? lang.classes : lang.class} />
        </ListItem>
      )}
    />
  );
};

/**
 * # Composed
 */
export const AdminItems = () => (
  <>
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
    <Class />
    <Slots />
  </>
);
