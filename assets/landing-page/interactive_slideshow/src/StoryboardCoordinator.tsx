import * as React from "react";
import { Entry, EntryStage } from "./Entry";
import { Slide } from "./Slide";

export function StoryboardCoordinator() {
  const [stage, setStage] = React.useState<EntryStage>("date");

  return (
    <Slide
      explanation={
        <Entry
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
          onSent={console.log}
        />
      }
      people={<p>Peeps</p>}
      text={<p>TITLE</p>}
    />
  );
}
