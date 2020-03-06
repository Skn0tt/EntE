import * as React from "react";
import { TeacherNames } from "./TeacherNames";
import teacherA from "./assets/teacher_a.png";
import teacherB from "./assets/teacher_b.png";
import teacherC from "./assets/teacher_c.png";
import { Typography } from "@material-ui/core";

interface TeacherPortraitProps {
  name: TeacherNames;
}

export function TeacherPortrait(props: TeacherPortraitProps) {
  const { name } = props;

  const teacherImg = {
    [TeacherNames.Dölling]: teacherA,
    [TeacherNames.Humboldt]: teacherB,
    [TeacherNames.Hansen]: teacherC,
    [TeacherNames.Droste]: teacherA
  }[name];

  return (
    <>
      <Typography style={{ height: "20%" }}>{name}</Typography>
      <img src={teacherImg} height="80%" style={{ marginLeft: "25%" }} />
    </>
  );
}
