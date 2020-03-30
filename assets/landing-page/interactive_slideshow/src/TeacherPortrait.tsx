import * as React from "react";
import { TeacherNames } from "./TeacherNames";
import herrDrosteImg from "./assets/herr_droste.svg";
import herrDöllingImg from "./assets/herr_dölling.svg";
import frauHumboldtImg from "./assets/frau_humboldt.svg";
import frauHansenImg from "./assets/frau_hansen.svg";
import { Slot, SlotRow } from "./SlotInput";

interface TeacherPortraitProps {
  name: TeacherNames;
  slot: Slot;
}

export function TeacherPortrait(props: TeacherPortraitProps) {
  const { name, slot } = props;

  const teacherImg = {
    [TeacherNames.Dölling]: herrDöllingImg,
    [TeacherNames.Humboldt]: frauHumboldtImg,
    [TeacherNames.Hansen]: frauHansenImg,
    [TeacherNames.Droste]: herrDrosteImg
  }[name];

  return (
    <>
      <SlotRow slot={slot} />
      <img
        src={teacherImg}
        height="83%"
        style={{ marginTop: "5%", marginLeft: "10%" }}
      />
    </>
  );
}
