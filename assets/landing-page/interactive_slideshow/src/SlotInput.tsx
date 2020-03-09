import * as React from "react";
import { Avatar, Chip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { TeacherNames } from "./TeacherNames";

export function SlotRow(props: { slot: SlotWithSlug; onAdd?: () => void }) {
  const { slot, onAdd } = props;

  return (
    <Chip
      style={{
        margin: "1%"
      }}
      size="small"
      avatar={<Avatar>{formatTime(slot)}</Avatar>}
      key={JSON.stringify(slot)}
      label={slot.slug}
      onDelete={onAdd}
      deleteIcon={<AddIcon />}
      color={onAdd ? "secondary" : "primary"}
      variant="outlined"
    />
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

type SlotWithSlug = Slot & { slug?: string };

const exampleSlots: SlotWithSlug[] = [
  {
    from: 1,
    to: 2,
    teacher: TeacherNames.Humboldt,
    slug: "Humboldt"
  },
  {
    from: 3,
    to: 4,
    teacher: TeacherNames.Droste,
    slug: "Droste"
  },
  {
    from: 5,
    to: 5,
    teacher: TeacherNames.Hansen,
    slug: "Hansen"
  },
  {
    from: 6,
    to: 6,
    teacher: TeacherNames.Dölling,
    slug: "Dölling"
  }
];

function formatTime(slot: Slot) {
  if (slot.from === slot.to) {
    return `${slot.from}.`;
  }

  return `${slot.from}/${slot.to}`;
}

export const SlotInput = React.forwardRef<any, SlotInputProps>((props, ref) => {
  const { onSlotAdded } = props;

  const [addedSlots, setAddedSlots] = React.useState([]);

  const nonAddedSlots = exampleSlots.filter(s => !addedSlots.includes(s));

  return (
    <div ref={ref}>
      {addedSlots.map(slot => (
        <SlotRow slot={slot} />
      ))}
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
    </div>
  );
});
