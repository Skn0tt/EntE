import * as React from "react";
import { CourseFilter, CourseFilterSlot } from "../helpers/course-filter";
import {
  Dialog,
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
  DialogContentText
} from "@material-ui/core";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import * as _ from "lodash";
import DeleteIcon from "@material-ui/icons/Delete";
import { useWeekdayTranslations } from "../helpers/use-weekday-translations";
import { DropdownInput } from "../elements/DropdownInput";
import { Weekday } from "../reporting/reporting";
import { NumberInput } from "../elements/NumberInput";

const useTranslation = makeTranslationHook({
  en: {
    ok: "OK",
    title: "Filter by class",
    hour: (h: number) => `Class ${h}`,
    weekdayDropdown: {
      title: "Weekday"
    },
    numberInput: "Hour",
    add: "Add",
    description:
      "Filtering by class allows you to only see slots of a specific class. Specify all hours that your class takes place (e.g. Monday 1st, Monday 2nd, Thursday 5th)."
  },
  de: {
    ok: "OK",
    title: "Kursfilter",
    hour: (h: number) => `${h}. Stunde`,
    weekdayDropdown: {
      title: "Wochentag"
    },
    numberInput: "Stunde",
    add: "Hinzufügen",
    description:
      "Der Kursfilter ermöglicht es, nur die Stunden eines bestimmten Kurses anzuzeigen. Geben sie die Stunden an, in denen ihr Kurs stattfindet (z.B. Montag 1., Montag 2., Donnerstag 5.)."
  }
});

interface CourseFilterModalOwnProps {
  show: boolean;
  onClose: () => void;
  onChange: (c: CourseFilter) => void;
  value: CourseFilter;
}

const CourseFilterModal: React.FC<
  CourseFilterModalOwnProps & InjectedProps
> = props => {
  const { show, onChange, onClose, fullScreen, value } = props;
  const translation = useTranslation();
  const weekdays = useWeekdayTranslations().full;

  const deduplicatedValue = React.useMemo(
    () => _.uniqBy(value, c => c.day + ";" + c.hour),
    [value]
  );
  const sortedValue = React.useMemo(
    () => _.sortBy(deduplicatedValue, c => c.day + ";" + c.hour),
    [deduplicatedValue]
  );

  const handleDelete = React.useCallback(
    (c: CourseFilterSlot) => {
      onChange(_.without(sortedValue, c));
    },
    [sortedValue, onChange]
  );

  const [weekday, setWeekday] = React.useState(Weekday.MONDAY);
  const [hour, setHour] = React.useState(1);

  const handleAdd = React.useCallback(
    () => {
      const newItems = [...sortedValue, { hour, day: weekday }];
      onChange(_.uniqBy(newItems, c => c.day + ";" + c.hour));
    },
    [sortedValue, onChange, weekday, hour]
  );

  return (
    <Dialog fullScreen={fullScreen} onClose={onClose} open={show}>
      <DialogTitle>{translation.title}</DialogTitle>

      <DialogContent>
        <DialogContentText>{translation.description}</DialogContentText>

        <Grid container direction="column" spacing={24}>
          <Grid item xs={12}>
            <List>
              {sortedValue.map(c => (
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
                <DropdownInput
                  options={[
                    Weekday.MONDAY,
                    Weekday.TUESDAY,
                    Weekday.WEDNESDAY,
                    Weekday.THURSDAY,
                    Weekday.FRIDAY,
                    Weekday.SATURDAY,
                    Weekday.SUNDAY
                  ]}
                  value={weekday}
                  onChange={setWeekday}
                  getOptionLabel={w => weekdays[w]}
                  label={translation.weekdayDropdown.title}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <NumberInput
                  onChange={h => {
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
        <Button onClick={onClose} color="primary">
          {translation.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withMobileDialog<CourseFilterModalOwnProps>()(CourseFilterModal);
