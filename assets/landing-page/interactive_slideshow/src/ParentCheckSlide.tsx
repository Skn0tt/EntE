import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import { EntryRecord } from "./EntryRecord";
import parentsImg from "./assets/parents.svg";

interface ParentCheckSlideProps {
  entry: Entry;
  onDone(): void;
}

export function ParentCheckSlide(props: ParentCheckSlideProps) {
  const { entry, onDone } = props;

  return (
    <Slide
      explanation={
        <EntryRecord
          entry={entry}
          managerCheck={false}
          parentCheck={false}
          onCheck={onDone}
          tooltip="Hier Klicken"
        />
      }
      people={
        <img
          src={parentsImg}
          width="50%"
          style={{ position: "absolute", bottom: 0, left: "22%" }}
        />
      }
      text={<p>Nun genehmigen die Eltern diesen Eintrag.</p>}
    />
  );
}
