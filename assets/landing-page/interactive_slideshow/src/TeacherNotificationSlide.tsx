import * as React from "react";
import { Grid, Typography, Fab } from "@material-ui/core";
import { Slot } from "./SlotInput";
import ReplayIcon from "@material-ui/icons/Replay";
import { TeacherPortrait } from "./TeacherPortrait";

interface TeacherNotificationSlideProps {
  slots: Slot[];
  onRestart(): void;
}

export function TeacherNotificationSlide(props: TeacherNotificationSlideProps) {
  const { slots, onRestart } = props;
  return (
    <div style={{ height: "100%" }}>
      <Typography style={{ height: "20%" }}>
        Nun können auch die Lehrer die Fehlstunde einsehen.
      </Typography>

      <Grid
        container
        direction="row"
        justify="space-around"
        style={{ height: "80%" }}
      >
        {slots.map(s => (
          <Grid key={s.teacher} item style={{ height: "100%" }}>
            <TeacherPortrait name={s.teacher} />
          </Grid>
        ))}
      </Grid>

      <Fab
        variant="extended"
        size="medium"
        onClick={onRestart}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px"
        }}
      >
        <ReplayIcon /> Neustarten
      </Fab>
    </div>
  );
}
