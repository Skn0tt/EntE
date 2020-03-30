import * as React from "react";
import { EntryStage, EntryCreationForm, Entry } from "./EntryCreationForm";
import { Slide } from "./Slide";
import studentImg from "./assets/student.svg";
import { Typography } from "@material-ui/core";

interface EntryCreationSlideProps {
  onDone: (e: Entry) => void;
}

const titles: Record<EntryStage, string> = {
  date: "Zu einem Fehlstundeneintrag gehört das Datum, ...",
  reason: "..., der Grund des Fehlens, ...",
  slots: "..., sowie die verpassten Unterrichtsstunden.",
  send: "Nun kann der Eintrag erstellt werden."
};

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
          src={studentImg}
          height="75%"
          style={{ position: "absolute", bottom: 0, left: "30%" }}
        />
      }
      text={
        <Typography
          variant="body1"
          style={{
            margin: "5%"
          }}
        >
          {titles[stage]}
        </Typography>
      }
    />
  );
}
