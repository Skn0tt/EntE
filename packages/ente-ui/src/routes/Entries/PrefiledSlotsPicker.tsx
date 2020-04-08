import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getSlots,
  SlotN,
  getSlotsRequest,
  getTeachingUsers
} from "../../redux";
import { isBetweenDates } from "ente-types";
import {
  FormControl,
  InputLabel,
  Select,
  Chip,
  MenuItem,
  Checkbox,
  ListItemText
} from "@material-ui/core";
import { useEffectOnce } from "react-use";
import * as _ from "lodash";
import { format, Locale, parseISO } from "date-fns";
import { useLocalization } from "../../helpers/use-localized-date-format";
const { useState, useEffect, useCallback, useMemo } = React;

function formatLabel(slot: SlotN, locale: Locale, isRange: boolean) {
  const date = slot.get("date");
  const from = slot.get("from");
  const to = slot.get("to");

  if (!isRange) {
    return `${from}.-${to}.`;
  }

  const formattedDate = format(parseISO(date), "E do", { locale });

  if (from === to) {
    return `${formattedDate}, ${from}.-${to}.`;
  }

  return `${formattedDate}, ${from}.-${to}.`;
}

function usePrefiledSlots() {
  const dispatch = useDispatch();
  useEffectOnce(() => {
    dispatch(getSlotsRequest());
  });

  const slotsFromStore = useSelector(getSlots);
  const prefiledSlotsFromStore = useMemo(
    () => slotsFromStore.filter(s => s.get("isPrefiled")),
    [slotsFromStore]
  );
  return prefiledSlotsFromStore;
}

interface PrefiledSlotsPickerProps {
  range: {
    start: string;
    end: string;
  };

  onChange: (slotIds: string[]) => void;
}

export const PrefiledSlotsPicker = (props: PrefiledSlotsPickerProps) => {
  const { range, onChange } = props;
  const locale = useLocalization();

  const prefiledSlots = usePrefiledSlots();
  const prefiledSlotsInRange = useMemo(
    () =>
      prefiledSlots.filter(slot =>
        isBetweenDates(range.start, range.end)(slot.get("date"))
      ),
    [range.start, range.end, prefiledSlots]
  );

  const slotsById = _.keyBy(prefiledSlots, s => s.get("id"));

  const [selectedSlots, setSelectedSlots] = useState(prefiledSlotsInRange);
  const selectedIds = selectedSlots.map(s => s.get("id"));

  const teachers = useSelector(getTeachingUsers);
  const teachersById = _.keyBy(teachers, t => t.get("id"));

  const updateSelectedSlots = useCallback(
    (slots: SlotN[]) => {
      setSelectedSlots(slots);
      onChange(slots.map(s => s.get("id")));
    },
    [onChange, setSelectedSlots]
  );

  useEffect(
    () => {
      updateSelectedSlots(prefiledSlotsInRange);
    },
    [prefiledSlotsInRange, updateSelectedSlots]
  );

  const handleChange = useCallback(
    (newSlot: SlotN) => {
      setSelectedSlots(oldSlots => {
        const oldSlotIds = oldSlots.map(s => s.get("id"));

        if (oldSlotIds.includes(newSlot.get("id"))) {
          return oldSlots.filter(s => s.get("id") !== newSlot.get("id"));
        }

        return [newSlot, ...oldSlots];
      });
    },
    [setSelectedSlots]
  );

  const isRange = range.start === range.end;

  return (
    <FormControl>
      <InputLabel />
      <Select
        fullWidth
        value={selectedSlots}
        onChange={evt => handleChange(slotsById[evt.target.value])}
        renderValue={_slots => {
          const slots = _slots as SlotN[];
          return (
            <div>
              {slots.map(slot => (
                <Chip
                  key={slot.get("id")}
                  label={formatLabel(slot, locale, isRange)}
                />
              ))}
            </div>
          );
        }}
      >
        {prefiledSlotsInRange.map(slot => (
          <MenuItem key={slot.get("id")} value={slot.get("id")}>
            <Checkbox checked={selectedIds.includes(slot.get("id"))} />
            <ListItemText
              primary={formatLabel(slot, locale, isRange)}
              secondary={
                !!slot.get("teacherId")
                  ? teachersById[slot.get("teacherId")!].get("displayname")
                  : "Gelöscht"
              }
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
