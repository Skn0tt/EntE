import * as React from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  List,
  Divider
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { TeacherNames } from "./TeacherNames";

export function SlotRow(props: { slot: Slot; onAdd?: () => void }) {
  const {
    slot: { from, teacher, to },
    onAdd
  } = props;

  const primary = (() => {
    if (from === to) {
      return `${teacher} ${from}.`;
    } else {
      return `${teacher} ${from}. - ${to}.`;
    }
  })();

  return (
    <ListItem dense>
      <ListItemText primary={primary} />
      {onAdd && (
        <ListItemSecondaryAction>
          <IconButton edge="end" onClick={onAdd}>
            <AddIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

export interface Slot {
  teacher: TeacherNames;
  from: number;
  to: number;
}

interface SlotInputProps {
  onSlotAdded: (slots: Slot[]) => void;
}

const exampleSlots: Slot[] = [
  {
    from: 1,
    to: 2,
    teacher: TeacherNames.Humboldt
  },
  {
    from: 3,
    to: 4,
    teacher: TeacherNames.Droste
  },
  {
    from: 5,
    to: 5,
    teacher: TeacherNames.Hansen
  },
  {
    from: 6,
    to: 6,
    teacher: TeacherNames.Dölling
  }
];

export const SlotInput = React.forwardRef<any, SlotInputProps>((props, ref) => {
  const { onSlotAdded } = props;

  const [addedSlots, setAddedSlots] = React.useState([]);

  const nonAddedSlots = exampleSlots.filter(s => !addedSlots.includes(s));

  return (
    <List ref={ref} style={{ height: "10%" }}>
      {addedSlots.map(slot => (
        <SlotRow slot={slot} />
      ))}
      {nonAddedSlots && <Divider />}
      {nonAddedSlots.map(slot => (
        <SlotRow
          slot={slot}
          onAdd={() => {
            const newSlots = [...addedSlots, slot];
            setAddedSlots(newSlots);
            onSlotAdded(newSlots);
          }}
        />
      ))}
    </List>
  );
});
