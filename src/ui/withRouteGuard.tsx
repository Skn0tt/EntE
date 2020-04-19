import { useSelector } from "react-redux";
import { getOneSelf, UserN, isAuthValid } from "./redux";
import { Maybe } from "monet";
import { useRouter } from "next/router";
import { Roles } from "@@types";

export function withRouteGuard(
  allow: (user: Maybe<UserN>, authValid: boolean) => boolean
) {
  return function <T>(
    Component: React.ComponentType<T>
  ): React.ComponentType<T> {
    return function WithRouteGuard(props: T) {
      const router = useRouter();

      const authValid = useSelector(isAuthValid);
      const oneSelf = useSelector(getOneSelf);
      const isAllowed = allow(oneSelf, authValid);

      if (!isAllowed) {
        router.push("/");
        return null;
      }

      return <Component {...props} />;
    };
  };
}

export function withAuthenticatedGuard(
  allow: (user: UserN) => boolean = () => true
) {
  return withRouteGuard(
    (u, authValid) => authValid && u.map(allow).orSome(false)
  );
}

export const withAdminGuard = withAuthenticatedGuard((u) => u.get("isAdmin"));

export function withRoleGuard(...roles: Roles[]) {
  return withAuthenticatedGuard((u) => roles.includes(u.get("role")));
}
