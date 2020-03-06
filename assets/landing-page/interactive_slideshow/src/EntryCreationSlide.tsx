import * as React from "react";
import { EntryStage, EntryCreationForm, Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import studentPng from "./assets/student.png";

interface EntryCreationSlideProps {
  onDone: (e: Entry) => void;
}

export function EntryCreationSlide(props: EntryCreationSlideProps) {
  const { onDone } = props;
  const [stage, setStage] = React.useState<EntryStage>("date");

  return (
    <Slide
      explanation={
        <EntryCreationForm
          stage={stage}
          onDateEntered={() => {
            setStage("reason");
          }}
          onReasonEntered={() => {
            setStage("slots");
          }}
          onSlotAdded={() => {
            setStage("send");
          }}
          onSent={onDone}
        />
      }
      people={
        <img
          src={studentPng}
          height="80%"
          style={{ position: "absolute", bottom: 0, left: "30%" }}
        />
      }
      text={<p>TITLE</p>}
    />
  );
}
