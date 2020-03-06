import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import { EntryRecord } from "./EntryRecord";
import parentPng from "./assets/parents.png";

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
      people={<img src={parentPng} width="60%" style={{ margin: "auto" }} />}
      text={<p>Nun genehmigen die Eltern diesen Eintrag.</p>}
    />
  );
}
