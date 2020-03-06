import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import { EntryRecord } from "./EntryRecord";

interface ManagerCheckSlideProps {
  entry: Entry;
  onDone(): void;
}

export function ManagerCheckSlide(props: ManagerCheckSlideProps) {
  const { entry, onDone } = props;

  return (
    <Slide
      explanation={
        <EntryRecord
          entry={entry}
          managerCheck={false}
          parentCheck={true}
          onCheck={onDone}
        />
      }
      people={<p>Stufenleitung</p>}
      text={<p>Nun genehmigt die Stufenleitung den Eintrag.</p>}
    />
  );
}
