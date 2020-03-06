import * as React from "react";
import { EntryStage, EntryCreationForm, Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";

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
      people={<p>Peeps</p>}
      text={<p>TITLE</p>}
    />
  );
}
