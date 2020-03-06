import * as React from "react";
import { EntryCreationSlide } from "./EntryCreationSlide";
import { Entry } from "./EntryCreationForm";

type Stage = "student" | "parent" | "manager" | "teacher";

export function StoryboardCoordinator() {
  const [stage, setStage] = React.useState<Stage>("student");
  const [entry, setEntry] = React.useState<Entry>();

  switch (stage) {
    case "student":
      return (
        <EntryCreationSlide
          onDone={e => {
            setEntry(e);
            setStage("parent");
          }}
        />
      );
    default:
      return <div />;
  }
}
