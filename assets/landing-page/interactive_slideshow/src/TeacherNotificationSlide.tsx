import * as React from "react";
import { Grid, Typography, Fab } from "@material-ui/core";
import { Slot } from "./SlotInput";
import ReplayIcon from "@material-ui/icons/Replay";

interface TeacherNotificationSlideProps {
  slots: Slot[];
  onRestart(): void;
}

export function TeacherNotificationSlide(props: TeacherNotificationSlideProps) {
  const { slots, onRestart } = props;
  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      style={{ height: "100%" }}
    >
      <Grid item>Nun können auch die Lehrer die Fehlstunde einsehen.</Grid>
      <Grid item style={{ position: "relative" }}>
        <Grid container direction="row" justify="space-around">
          {slots.map(s => (
            <Grid
              key={s.teacher}
              item
              xs={Math.floor(12 / slots.length) as any}
            >
              <Typography>{s.teacher}</Typography>
            </Grid>
          ))}
        </Grid>
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
    </Grid>
  );
}
