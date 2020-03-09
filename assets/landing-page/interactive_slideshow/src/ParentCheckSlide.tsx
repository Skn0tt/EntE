import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import { EntryRecord } from "./EntryRecord";
import parentsImg from "./assets/parents.svg";
import { Typography } from "@material-ui/core";

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
          tooltip="Signieren"
        />
      }
      people={
        <img
          src={parentsImg}
          height="80%"
          style={{ position: "absolute", bottom: 0, left: "22%" }}
        />
      }
      text={
        <Typography
          variant="body1"
          style={{
            margin: "5%"
          }}
        >
          Nachdem die Eltern den Eintrag signiert haben, ...
        </Typography>
      }
    />
  );
}
