import { Provider } from "react-redux";
import { createStore } from "redux";
import { initialState } from "ui/redux/reducer";
import { useMemo } from "react";
import { UserN } from "ui/redux";
import { Roles } from "@@types";

const users: UserN[] = [
  new UserN({
    username: "simon",
    displayname: "Simon",
    email: "email@emai.com",
    birthday: "2100-01-01",
    role: Roles.STUDENT,
    id: "mystupidid",
  }),
];
const getUsers = jest.fn();

export function TestWrapper(props: React.PropsWithChildren<{}>) {
  const { children } = props;
  const store = useMemo(() => createStore(() => initialState), []);

  return <Provider store={store}>{children}</Provider>;
}
