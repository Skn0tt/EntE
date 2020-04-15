import { useSelector } from "react-redux";
import { getOneSelf, UserN } from "./redux";
import { Maybe } from "monet";
import { useRouter } from "next/router";
import { Roles } from "@@types";

export function withRouteGuard(allow: (user: Maybe<UserN>) => boolean) {
  return function <T>(
    Component: React.ComponentType<T>
  ): React.ComponentType<T> {
    return function WithRouteGuard(props: T) {
      const router = useRouter();

      const oneSelf = useSelector(getOneSelf);
      const isAllowed = allow(oneSelf);

      if (!isAllowed) {
        router.replace("/");
        return null;
      }

      return <Component {...props} />;
    };
  };
}

export function withAuthenticatedGuard(
  allow: (user: UserN) => boolean = () => true
) {
  return withRouteGuard((u) => u.map(allow).orSome(false));
}

export const withAdminGuard = withAuthenticatedGuard((u) => u.get("isAdmin"));

export function withRoleGuard(...roles: Roles[]) {
  return withAuthenticatedGuard((u) => roles.includes(u.get("role")));
}
