import * as React from "react";
import Table from "../../components/Table";
import { UserN } from "../../redux";
import { createTranslation } from "../../helpers/createTranslation";

const lang = createTranslation({
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

class _UserTable extends Table<UserN> {}

export const UserTable: React.SFC<UserTableOwnProps> = props => {
  const { users, onClick } = props;

  return (
    <_UserTable
      headers={[
        {
          name: lang.headers.username,
          options: {
            filter: false
          }
        },
        {
          name: lang.headers.displayname,
          options: {
            filter: false
          }
        },
        {
          name: lang.headers.email,
          options: {
            filter: false
          }
        },
        {
          name: lang.headers.role
        }
      ]}
      items={users}
      extract={user => [
        user.get("username")!,
        user.get("displayname")!,
        user.get("email")!,
        user.get("role")!
      ]}
      extractId={user => user.get("id")}
      onClick={onClick}
    />
  );
};
