import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import { EntryRecord } from "./EntryRecord";
import managerImg from "./assets/herr_droste.svg";

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
      people={<img src={managerImg} style={{ margin: "auto" }} width="60%" />}
      text={<p>Nun genehmigt die Stufenleitung den Eintrag.</p>}
    />
  );
}
