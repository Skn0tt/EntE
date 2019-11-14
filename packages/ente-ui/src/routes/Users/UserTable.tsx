import * as React from "react";
import Table from "../../components/Table";
import { UserN } from "../../redux";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { useTheme } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import { UserTableSmallCard } from "./UserTableSmallCard";
import { RoleChip } from "./RoleChip";

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      username: "Username",
      displayname: "Displayname",
      email: "Email",
      role: "Role"
    }
  },
  de: {
    headers: {
      username: "Nutzername",
      displayname: "Displayname",
      email: "Email",
      role: "Rolle"
    }
  }
});

interface UserTableOwnProps {
  users: UserN[];
  onClick?: (id: string) => void;
}

export const UserTable: React.FunctionComponent<UserTableOwnProps> = props => {
  const { users, onClick = () => {} } = props;
  const lang = useTranslation();
  const theme = useTheme<Theme>();
  const isNarrow = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Table<UserN>
      columns={[
        {
          name: lang.headers.username,
          extract: user => user.get("username"),
          options: {
            filter: false
          }
        },
        {
          name: lang.headers.displayname,
          extract: user => user.get("displayname"),
          options: {
            filter: false
          }
        },
        {
          name: lang.headers.email,
          extract: user => user.get("email"),
          options: {
            filter: false
          }
        },
        {
          name: lang.headers.role,
          extract: user => user.get("role"),
          options: {
            filter: true,
            customBodyRender: role => <RoleChip role={role} />
          }
        }
      ]}
      items={users}
      extractId={user => user.get("id")}
      onClick={onClick}
      customRowRender={
        isNarrow
          ? item => (
              <UserTableSmallCard
                user={item}
                onClick={u => onClick(u.get("id"))}
              />
            )
          : undefined
      }
      persistenceKey="users-table"
    />
  );
};
