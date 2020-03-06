import * as React from "react";
import { EntryCreationSlide } from "./EntryCreationSlide";
import { Entry } from "./EntryCreationForm";
import { ParentCheckSlide } from "./ParentCheckSlide";
import { ManagerCheckSlide } from "./ManagerCheckSlide";

type Stage = "student" | "parent" | "manager" | "teacher";

export function StoryboardCoordinator() {
  const [stage, setStage] = React.useState<Stage>("student");
  const [entry, setEntry] = React.useState<Entry>({
    date: new Date(),
    reason: "Krankheit",
    slots: [
      {
        from: 1,
        to: 2,
        teacher: "Frau Strahlkamp"
      },
      {
        from: 3,
        to: 3,
        teacher: "Herr Ärmelt"
      }
    ]
  });

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
      return <div>"Teachers"</div>;
    default:
      return <div />;
  }
}
