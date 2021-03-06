import * as React from "react";
import { Grid } from "@material-ui/core";
import { useOrientation } from "./Orientation";
import { motion } from "framer-motion";

interface SlideProps {
  text: React.ReactElement;
  people: React.ReactElement;
  explanation: React.ReactElement;
}

export function Slide(props: SlideProps) {
  const { explanation, people, text } = props;

  const orientation = useOrientation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      style={{ height: "100%" }}
    >
      <Grid
        style={{ height: "100%", width: "100%" }}
        container
        direction="row"
        justify="space-between"
      >
        <Grid
          item
          xs={orientation === "landscape" ? 6 : 12}
          style={{
            order: orientation === "landscape" ? undefined : 1,
            height: "100%"
          }}
        >
          <Grid
            style={{
              height: orientation === "landscape" ? "100%" : "50%"
            }}
            container
            direction="column"
            justify="space-between"
          >
            <Grid item style={{ height: "20%" }}>
              {text}
            </Grid>
            <Grid item style={{ height: "80%", position: "relative" }}>
              {people}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          style={{
            width: orientation === "landscape" ? "50%" : "100%",
            height: orientation === "landscape" ? "100%" : "50%",
            position: "relative"
          }}
        >
          {explanation}
        </Grid>
      </Grid>
    </motion.div>
  );
}
