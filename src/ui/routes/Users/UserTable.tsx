import * as React from "react";
import Table from "../../components/Table";
import { UserN } from "../../redux";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { useTheme } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { UserTableSmallCard } from "./UserTableSmallCard";
import { RoleChip } from "./RoleChip";
import { useRoleTranslation } from "../../roles.translation";

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      username: "Username",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      class: "Class",
      role: "Role",
    },
  },
  de: {
    headers: {
      username: "Nutzername",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "Email",
      class: "Klasse / Stufe",
      role: "Rolle",
    },
  },
});

interface UserTableOwnProps {
  users: UserN[];
  onClick?: (id: string) => void;
}

export const UserTable: React.FunctionComponent<UserTableOwnProps> = (
  props
) => {
  const { users, onClick = () => {} } = props;
  const lang = useTranslation();
  const roleLang = useRoleTranslation();
  const theme = useTheme<Theme>();
  const isNarrow = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Table<UserN>
      columns={[
        {
          name: lang.headers.username,
          extract: (user) => user.get("username"),
          options: {
            filter: false,
          },
        },
        {
          name: lang.headers.firstName,
          extract: (user) => user.get("firstName"),
          options: {
            filter: false,
          },
        },
        {
          name: lang.headers.lastName,
          extract: (user) => user.get("lastName"),
          options: {
            filter: false,
          },
        },
        {
          name: lang.headers.email,
          extract: (user) => user.get("email"),
          options: {
            filter: false,
          },
        },
        {
          name: lang.headers.class,
          extract: (user) => user.get("class"),
          options: {
            filter: true,
          },
        },
        {
          name: lang.headers.role,
          extract: (user) => roleLang[user.get("role")],
          options: {
            filter: true,
            customBodyRender: (role) => <RoleChip translatedRole={role} />,
          },
        },
      ]}
      items={users}
      extractId={(user) => user.get("id")}
      onClick={onClick}
      customRowRender={
        isNarrow
          ? (item) => (
              <UserTableSmallCard
                user={item}
                onClick={(u) => onClick(u.get("id"))}
              />
            )
          : undefined
      }
      persistenceKey="users-table"
    />
  );
};
