/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";

import { Action } from "redux";

import { withRouter, RouteComponentProps } from "react-router";
import {
  Dialog,
  Button,
  List as MUIList,
  TextField,
  Grid
} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import SlotListItem from "./SlotListItem";
import SlotEntry from "./SlotEntry";
import MenuItem from "@material-ui/core/MenuItem";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import Typography from "@material-ui/core/Typography/Typography";
import {
  createEntryRequest,
  AppState,
  getChildren,
  isParent,
  getTeachers,
  getUser,
  UserN
} from "../../redux";
import {
  CreateEntryDto,
  CreateSlotDto,
  isValidCreateEntryDto,
  dateToIsoString,
  daysBeforeNow
} from "ente-types";
import { DateInput } from "../../elements/DateInput";
import { Maybe } from "monet";
import { isBefore, subDays, addDays, isAfter } from "date-fns";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { CheckboxInput } from "../../elements/CheckboxInput";
import * as _ from "lodash";

const useTranslation = makeTranslationHook({
  en: {
    multiday: "Multiday",
    forSchool: "Educational",
    selectChild: "Select the affected child.",
    addSlotsCaption: "Add the missed classes. Create one row per class.",
    titles: {
      slots: "Slots"
    },
    newEntry: "New Entry",
    child: "Child",
    ok: "OK",
    cancel: "Cancel",
    fromLabel: "From",
    toLabel: "To",
    dateMustBeBiggerThanFrom: `Must be after 'From'`
  },
  de: {
    multiday: "Mehrtägig",
    forSchool: "Schulisch",
    selectChild: "Wählen sie das betroffene Kind aus.",
    addSlotsCaption: `Fügen sie die Stunden hinzu, die sie entschuldigen möchten.
    Erstellen sie dafür für jede Stunde eine Zeile.`,
    titles: {
      slots: "Stunden"
    },
    newEntry: "Neuer Eintrag",
    child: "Kind",
    ok: "OK",
    cancel: "Zurück",
    fromLabel: "Von",
    toLabel: "Bis",
    dateMustBeBiggerThanFrom: `Muss nach 'Von' sein`
  }
});

const getToday = (): string => dateToIsoString(Date.now());

const nextDay = (d: string | string | number) => dateToIsoString(addDays(d, 1));
const twoWeeksBefore = (d: Date | string | number) => subDays(d, 14);

interface CreateEntryOwnProps {
  onClose(): void;
  show: boolean;
}

interface CreateEntryStateProps {
  isParent: boolean;
  children: Maybe<UserN[]>;
  teachers: UserN[];
  getUser(id: string): Maybe<UserN>;
}
const mapStateToProps: MapStateToPropsParam<
  CreateEntryStateProps,
  CreateEntryOwnProps,
  AppState
> = state => ({
  children: getChildren(state),
  isParent: isParent(state).some(),
  teachers: getTeachers(state),
  getUser: id => getUser(id)(state)
});

interface CreateEntryDispatchProps {
  createEntry(entry: CreateEntryDto): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  CreateEntryDispatchProps,
  CreateEntryOwnProps
> = dispatch => ({
  createEntry: entry => dispatch(createEntryRequest(entry))
});

type CreateEntryProps = CreateEntryOwnProps &
  CreateEntryDispatchProps &
  CreateEntryStateProps &
  RouteComponentProps<{}> &
  InjectedProps;

interface State {
  isRange: boolean;
  date: string;
  dateEnd?: string;
  student?: string;
  slots: CreateSlotDto[];
  forSchool: boolean;
}

const CreateEntry: React.SFC<CreateEntryProps> = props => {
  const { fullScreen, onClose, show, isParent, children, createEntry } = props;
  const translation = useTranslation();

  const [isRange, setIsRange] = React.useState(false);
  const [forSchool, setForSchool] = React.useState(false);
  const [beginDate, setBeginDate] = React.useState<string>(
    dateToIsoString(Date.now())
  );
  const [endDate, setEndDate] = React.useState<string | undefined>(undefined);
  const [slots, setSlots] = React.useState<CreateSlotDto[]>([]);

  const firstChildOfParent: string | undefined = children
    .flatMap(c => Maybe.fromUndefined(c[0]))
    .map(c => c.get("id"))
    .orSome((undefined as unknown) as any);

  const [studentId, setStudent] = React.useState<string | undefined>(
    firstChildOfParent
  );

  const handleChangeIsRange = React.useCallback(
    (v: boolean) => {
      setSlots(slots =>
        slots.map(s => ({
          ...s,
          date: v ? beginDate : undefined
        }))
      );

      setIsRange(v);
      setEndDate(endDate => {
        if (!v) {
          return undefined;
        }
        return _.isUndefined(endDate)
          ? dateToIsoString(addDays(beginDate, 1))
          : endDate;
      });
    },
    [setIsRange, setEndDate, beginDate, setSlots]
  );

  const handleChangeBeginDate = React.useCallback(
    (d: string) => {
      if (!isRange) {
        setBeginDate(d);
        return;
      }

      const slotsWithoutSlotsThatAreTooEarly = slots.filter(
        s => !isBefore(s.date!, d)
      );
      setSlots(slotsWithoutSlotsThatAreTooEarly);

      const endDateIsBeforeDate = isBefore(endDate!, addDays(d, 1));
      if (endDateIsBeforeDate || _.isUndefined(endDate)) {
        setEndDate(dateToIsoString(addDays(d, 1)));
      }

      setBeginDate(d);
    },
    [setBeginDate, slots, setSlots, setEndDate, endDate, isRange]
  );

  const handleChangeEndDate = React.useCallback(
    (d: string) => {
      setSlots(slots => {
        const slotsWithoutSlotsThatAreTooLate = slots.filter(
          s => !isAfter(s.date!, d)
        );
        return slotsWithoutSlotsThatAreTooLate;
      });

      const endDateIsBeforeBeginDate = isBefore(d, beginDate);
      if (endDateIsBeforeBeginDate) {
        setBeginDate(dateToIsoString(subDays(d, 1)));
      }

      setEndDate(d);
    },
    [setEndDate, setSlots, beginDate, setBeginDate]
  );

  const handleRemoveSlot = React.useCallback(
    (indexToRemove: number) => {
      setSlots(s => s.filter((_, i) => i !== indexToRemove));
    },
    [setSlots]
  );

  const handleAddSlot = React.useCallback(
    (v: CreateSlotDto) => {
      setSlots(s => [...s, v]);
    },
    [setSlots]
  );

  const isEndDateValid = isRange
    ? isAfter(endDate!, beginDate)
    : _.isUndefined(endDate);

  const isValidInput = isValidCreateEntryDto({
    forSchool,
    slots,
    studentId,
    date: beginDate,
    dateEnd: endDate
  });

  const handleSubmit = React.useCallback(
    () => {
      createEntry({
        forSchool,
        slots,
        studentId,
        date: beginDate,
        dateEnd: endDate
      });
    },
    [createEntry, forSchool, slots, studentId, beginDate, endDate]
  );

  return (
    <Dialog fullScreen={fullScreen} onClose={onClose} open={show}>
      <DialogTitle>{translation.newEntry}</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={40}>
          <Grid item container direction="column">
            <Grid item container direction="row">
              <Grid item xs={6}>
                <CheckboxInput
                  value={isRange}
                  onChange={handleChangeIsRange}
                  label={translation.multiday}
                />
              </Grid>
              <Grid item xs={6}>
                <CheckboxInput
                  value={forSchool}
                  onChange={setForSchool}
                  label={translation.forSchool}
                />
              </Grid>
            </Grid>
            {isParent && (
              <Grid item>
                <TextField
                  fullWidth
                  select
                  label={translation.child}
                  value={studentId}
                  onChange={evt => setStudent(evt.target.value)}
                  helperText={translation.selectChild}
                >
                  {children.some().map(child => (
                    <MenuItem key={child.get("id")} value={child.get("id")}>
                      {child.get("displayname")}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}
            <Grid item>
              <Grid container direction="row" spacing={24}>
                <Grid item xs={6}>
                  <DateInput
                    label={translation.fromLabel}
                    onChange={handleChangeBeginDate}
                    minDate={daysBeforeNow(14)}
                    value={beginDate}
                  />
                </Grid>
                {isRange && (
                  <Grid item xs={6}>
                    <DateInput
                      label={translation.toLabel}
                      isValid={() => isEndDateValid}
                      onChange={handleChangeEndDate}
                      minDate={addDays(beginDate, 1)}
                      value={endDate!}
                      minDateMessage={translation.dateMustBeBiggerThanFrom}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{translation.titles.slots}</Typography>
            <Typography variant="caption">
              {translation.addSlotsCaption}
            </Typography>
            <MUIList>
              {slots.map((slot, index) => (
                <SlotListItem
                  key={index}
                  slot={slot}
                  delete={() => handleRemoveSlot(index)}
                />
              ))}
            </MUIList>
            <SlotEntry
              onAdd={handleAddSlot}
              isMultiDay={isRange}
              datePickerConfig={{
                min: beginDate,
                max: endDate
              }}
              defaultDate={beginDate}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {translation.cancel}
        </Button>
        <Button
          onClick={() => {
            handleSubmit();
            onClose();
          }}
          disabled={!isValidInput}
          color="primary"
        >
          {translation.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default connect<
  CreateEntryStateProps,
  CreateEntryDispatchProps,
  CreateEntryOwnProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withMobileDialog<CreateEntryProps>()(CreateEntry)));
