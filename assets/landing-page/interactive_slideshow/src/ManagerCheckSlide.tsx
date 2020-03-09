import * as React from "react";
import { Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import { EntryRecord } from "./EntryRecord";
import managerImg from "./assets/herr_droste.svg";
import { Typography } from "@material-ui/core";

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
          tooltip="Signieren"
        />
      }
      people={
        <img
          src={managerImg}
          style={{ position: "absolute", bottom: 0, left: "35%" }}
          height="80%"
        />
      }
      text={
        <Typography
          variant="body1"
          style={{
            margin: "5%"
          }}
        >
          ... signiert auch die verantwortliche Lehrperson den Eintrag.
        </Typography>
      }
    />
  );
}
