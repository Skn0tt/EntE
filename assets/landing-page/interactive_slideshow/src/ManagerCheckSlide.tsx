import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import { EntryRecord } from "./EntryRecord";
import managerPng from "./assets/teacher_c.png";

interface ManagerCheckSlideProps {
  entry: Entry;
  onDone(): void;
}

export function ManagerCheckSlide(props: ManagerCheckSlideProps) {
  const { entry, onDone } = props;

  const [managerCheck, setManagerCheck] = React.useState(false);

  return (
    <Slide
      explanation={
        <EntryRecord
          entry={entry}
          managerCheck={managerCheck}
          parentCheck={true}
          onCheck={() => {
            setManagerCheck(true);
            setTimeout(onDone, 1000);
          }}
          tooltip="Hier Klicken"
        />
      }
      people={<img src={managerPng} style={{ margin: "auto" }} width="60%" />}
      text={<p>Nun genehmigt die Stufenleitung den Eintrag.</p>}
    />
  );
}
