import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import { EntryRecord } from "./EntryRecord";

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
        />
      }
      people={<p>Eltern</p>}
      text={<p>Nun genehmigen die Eltern diesen Eintrag.</p>}
    />
  );
}
