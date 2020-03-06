import * as React from "react";
import { EntryCreationSlide } from "./EntryCreationSlide";
import { Entry } from "./EntryCreationForm";
import { ParentCheckSlide } from "./ParentCheckSlide";
import { ManagerCheckSlide } from "./ManagerCheckSlide";

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
    case "parent":
      return (
        <ParentCheckSlide entry={entry} onDone={() => setStage("manager")} />
      );
    case "manager":
      return (
        <ManagerCheckSlide entry={entry} onDone={() => setStage("teacher")} />
      );
    case "teacher":
      return "Teachers";
    default:
      return <div />;
  }
}
