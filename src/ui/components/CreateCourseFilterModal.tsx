import * as React from "react";
import { CourseFilter, CourseFilterSlot } from "../helpers/course-filter";
import {
  DialogActions,
  Button,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Grid,
  Tooltip,
  DialogContentText,
} from "@material-ui/core";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import _ from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import { useWeekdayTranslations } from "../helpers/use-weekday-translations";
import { DropdownInput } from "../elements/DropdownInput";
import { Weekday } from "../reporting/reporting";
import { NumberInput } from "../elements/NumberInput";
import { ResponsiveFullscreenDialog } from "./ResponsiveFullscreenDialog";
import TextInput from "ui/elements/TextInput";

const useTranslation = makeTranslationHook({
  en: {
    ok: "OK",
    cancel: "Cancel",
    title: "Filter by class",
    hour: (h: number) => `Class ${h}`,
    weekdayDropdown: {
      title: "Weekday",
    },
    class: "Name of class",
    numberInput: "Hour",
    add: "Add",
    description:
      "Filtering by class allows you to only see slots of a specific class. Specify all hours that your class takes place (e.g. Monday 1st, Monday 2nd, Thursday 5th).",
  },
  de: {
    ok: "OK",
    cancel: "Zurück",
    title: "Kursfilter",
    hour: (h: number) => `${h}. Stunde`,
    class: "Name des Kurses",
    weekdayDropdown: {
      title: "Wochentag",
    },
    numberInput: "Stunde",
    add: "Hinzufügen",
    description:
      "Der Kursfilter ermöglicht es, nur die Stunden eines bestimmten Kurses anzuzeigen. Geben sie die Stunden an, in denen ihr Kurs stattfindet (z.B. Montag 1., Montag 2., Donnerstag 5.).",
  },
});

interface CourseFilterModalOwnProps {
  show: boolean;
  onClose: () => void;
  onCreate: (c: CourseFilter) => void;
}

const CreateCourseFilterModal: React.FC<CourseFilterModalOwnProps> = (
  props
) => {
  const { show, onClose, onCreate } = props;
  const translation = useTranslation();
  const weekdays = useWeekdayTranslations().full;

  const [weekday, setWeekday] = React.useState(Weekday.MONDAY);
  const [hour, setHour] = React.useState(1);

  const [slots, setSlots] = React.useState<CourseFilterSlot[]>([]);

  const sortedSlots = React.useMemo(
    () => _.sortBy(slots, (c) => c.day + ";" + c.hour),
    [slots]
  );

  const handleAdd = React.useCallback(() => {
    setSlots((oldSlots) => {
      return [
        ...oldSlots,
        {
          day: weekday,
          hour,
        },
      ];
    });
  }, [weekday, hour, setSlots]);

  const handleDelete = React.useCallback(
    (c: CourseFilterSlot) => {
      setSlots((oldSlots) => _.without(oldSlots, c));
    },
    [setSlots]
  );

  const [name, setName] = React.useState<string>();

  return (
    <ResponsiveFullscreenDialog onClose={onClose} open={show}>
      <DialogTitle>{translation.title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{translation.description}</DialogContentText>

        <Grid container direction="column" spacing={24}>
          <Grid item xs={12}>
            <TextInput
              value={name}
              onChange={setName}
              label={translation.class}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <List>
              {sortedSlots.map((c) => (
                <ListItem>
                  <ListItemText>
                    {weekdays[c.day]}, {translation.hour(c.hour)}
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleDelete(c)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12}>
            <Grid container direction="row" spacing={16}>
              <Grid item xs={5}>
                <DropdownInput<Weekday>
                  options={[
                    Weekday.MONDAY,
                    Weekday.TUESDAY,
                    Weekday.WEDNESDAY,
                    Weekday.THURSDAY,
                    Weekday.FRIDAY,
                    Weekday.SATURDAY,
                    Weekday.SUNDAY,
                  ]}
                  value={weekday}
                  onChange={setWeekday}
                  getOptionLabel={(w) => weekdays[w]}
                  label={translation.weekdayDropdown.title}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <NumberInput
                  onChange={(h) => {
                    if (_.isUndefined(h)) {
                      return;
                    }

                    if (1 <= h && h <= 12) {
                      setHour(h);
                    }
                  }}
                  value={hour}
                  label={translation.numberInput}
                />
              </Grid>
              <Grid item xs={2}>
                <Tooltip title={translation.add}>
                  <Button variant="raised" onClick={handleAdd}>
                    {translation.add}
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {translation.cancel}
        </Button>
        <Button
          onClick={() => {
            onCreate({ name: name!, slots });
          }}
          disabled={!name || slots.length === 0}
          color="primary"
        >
          {translation.ok}
        </Button>
      </DialogActions>
    </ResponsiveFullscreenDialog>
  );
};

export default CreateCourseFilterModal;
