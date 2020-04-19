import React, { useEffect } from "react";
import { getRole, isAuthValid } from "../ui/redux";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Roles } from "@@types";

function Home() {
  const authValid = useSelector(isAuthValid);
  const ownRole = useSelector(getRole);
  const router = useRouter();

  useEffect(() => {
    if (!authValid) {
      router.replace("/login");
      return;
    }
    ownRole.forEach((role) => {
      switch (role) {
        case Roles.MANAGER:
        case Roles.PARENT:
        case Roles.STUDENT:
          router.replace("/entries");
          break;

        case Roles.TEACHER:
          router.replace("/slots");
          break;
      }
    });
  }, [ownRole.orUndefined(), router, authValid]);

  return null;
}

export default Home;
