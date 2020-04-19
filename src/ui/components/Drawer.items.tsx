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
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import Link from "next/link";

const useTranslation = makeTranslationHook({
  en: {
    slots: "Slots",
    users: "Users",
    entries: "Entries",
    admin: "Admin",
    class: "Class",
    classes: "Classes",
  },
  de: {
    slots: "Stunden",
    users: "Nutzer",
    entries: "Einträge",
    admin: "Admin",
    class: "Klasse / Jahrgangsstufe",
    classes: "Klassen / Jahrgangsstufen",
  },
});

interface ListItemLinkProps {
  href: string;
  icon: JSX.Element;
  text: string;
}

function ListItemLink(props: ListItemLinkProps) {
  const { href, icon, text } = props;
  return (
    <Link href={href}>
      <ListItem button>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    </Link>
  );
}

/**
 * # Items
 */
const Slots: React.FunctionComponent = () => {
  const lang = useTranslation();
  return <ListItemLink href="/slots" icon={<WatchLater />} text={lang.slots} />;
};

const Users: React.FunctionComponent = () => {
  const lang = useTranslation();
  return <ListItemLink href="/users" icon={<Person />} text={lang.users} />;
};

const Entries: React.SFC = () => {
  const lang = useTranslation();
  return (
    <ListItemLink
      href="/entries"
      icon={<InsertDriveFile />}
      text={lang.entries}
    />
  );
};

const Admin: React.SFC = () => {
  const lang = useTranslation();
  return <ListItemLink href="/admin" icon={<Settings />} text={lang.admin} />;
};

const Class: React.SFC<{ plural?: boolean }> = ({ plural }) => {
  const lang = useTranslation();
  return (
    <ListItemLink
      href="/class"
      icon={<School />}
      text={plural ? lang.classes : lang.class}
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
