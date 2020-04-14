import React, { useEffect } from "react";
import { getRole } from "../ui/redux";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Roles } from "@@types";

function Home() {
  const ownRole = useSelector(getRole);
  const router = useRouter();

  useEffect(() => {
    ownRole.cata(
      () => {
        router.replace("/login");
      },
      (role) => {
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
      }
    );
  }, [ownRole.orUndefined(), router]);

  return null;
}

export default Home;
