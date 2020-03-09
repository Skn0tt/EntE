import * as React from "react";
import { TeacherNames } from "./TeacherNames";
import herrDrosteImg from "./assets/herr_droste.svg";
import herrDöllingImg from "./assets/herr_dölling.svg";
import frauHumboldtImg from "./assets/frau_humboldt.svg";
import frauHansenImg from "./assets/frau_hansen.svg";
import { Typography } from "@material-ui/core";

interface TeacherPortraitProps {
  name: TeacherNames;
}

export function TeacherPortrait(props: TeacherPortraitProps) {
  const { name } = props;

  const teacherImg = {
    [TeacherNames.Dölling]: herrDöllingImg,
    [TeacherNames.Humboldt]: frauHumboldtImg,
    [TeacherNames.Hansen]: frauHansenImg,
    [TeacherNames.Droste]: herrDrosteImg
  }[name];

  return (
    <>
      <Typography style={{ height: "20%" }}>{name}</Typography>
      <img src={teacherImg} height="80%" style={{ marginLeft: "25%" }} />
    </>
  );
}
