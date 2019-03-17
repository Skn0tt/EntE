import * as React from "react";
import Table from "../../components/Table";
import { UserN } from "../../redux";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";

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
  const { users, onClick } = props;
  const lang = useTranslation();

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
            filter: true
          }
        }
      ]}
      items={users}
      extractId={user => user.get("id")}
      onClick={onClick}
    />
  );
};
