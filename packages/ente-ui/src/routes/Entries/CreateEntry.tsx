/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Dialog, Button, TextField, Grid } from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
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
  UserN,
  getEntryCreationDeadline
} from "../../redux";
import {
  CreateEntryDto,
  CreateSlotDto,
  dateToIsoString,
  EntryReasonDto,
  CreateEntryDtoValidator,
  EntryReasonCategory
} from "ente-types";
import { DateInput } from "../../elements/DateInput";
import { Maybe } from "monet";
import { isBefore, subDays, addDays, isAfter, parseISO } from "date-fns";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { CheckboxInput } from "../../elements/CheckboxInput";
import * as _ from "lodash";
import { EntryReasonInput } from "./EntryReasonInput";
import { CreateSlotList } from "./CreateSlotList";
import { ErrorBox } from "../../elements/ErrorBox";
import { PrefiledSlotsPicker } from "./PrefiledSlotsPicker";

function days(n: number) {
  return n * 24 * 60 * 60 * 1000;
}

export function isAfterDeadline(v: Date, creationDate: Date, deadline: number) {
  const spentTime = +creationDate - +v;
  return spentTime > days(deadline + 1);
}

const useTranslation = makeTranslationHook({
  en: {
    multiday: "Multiday",
    forSchool: "Educational",
    selectChild: "Select the affected child.",
    deadline: "Beware: You surpassed the entry creation deadline.",
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
    selectChild: "Wählen Sie das betroffene Kind aus.",
    deadline: "Achtung: Die Erstellungs-Frist wurde überschritten.",
    addSlotsCaption: `Fügen Sie die Stunden hinzu, die Sie entschuldigen möchten.
    Erstellen Sie dafür für jede Stunde eine Zeile.`,
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

type CreateEntryProps = InjectedProps;

const CreateEntry = (props: CreateEntryProps) => {
  const { fullScreen } = props;

  const dispatch = useDispatch();

  const userIsParent = useSelector<AppState, boolean>(s => isParent(s).some());
  const children = useSelector<AppState, Maybe<UserN[]>>(getChildren);
  const createEntryDeadline = useSelector<AppState, number>(s =>
    getEntryCreationDeadline(s).some()
  );

  const { goBack } = useHistory();
  const translation = useTranslation();

  const [isRange, setIsRange] = React.useState(false);
  const [beginDate, setBeginDate] = React.useState<string>(
    dateToIsoString(Date.now())
  );
  const [endDate, setEndDate] = React.useState<string | undefined>(undefined);
  const [slots, setSlots] = React.useState<CreateSlotDto[]>([]);
  const [reason, setReason] = React.useState<EntryReasonDto>({
    category: EntryReasonCategory.ILLNESS,
    payload: {}
  });
  const [prefiledSlots, setPrefiledSlots] = React.useState<string[]>([]);

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
          ? dateToIsoString(addDays(parseISO(beginDate), 1))
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
        s => !isBefore(parseISO(s.date!), parseISO(d))
      );
      setSlots(slotsWithoutSlotsThatAreTooEarly);

      const endDateIsBeforeDate = isBefore(
        parseISO(endDate!),
        addDays(parseISO(d), 1)
      );
      if (endDateIsBeforeDate || _.isUndefined(endDate)) {
        setEndDate(dateToIsoString(addDays(parseISO(d), 1)));
      }

      setBeginDate(d);
    },
    [setBeginDate, slots, setSlots, setEndDate, endDate, isRange]
  );

  const handleChangeEndDate = React.useCallback(
    (d: string) => {
      setSlots(slots => {
        const slotsWithoutSlotsThatAreTooLate = slots.filter(
          s => !isAfter(parseISO(s.date!), parseISO(d))
        );
        return slotsWithoutSlotsThatAreTooLate;
      });

      const endDateIsBeforeBeginDate = isBefore(
        parseISO(d),
        parseISO(beginDate)
      );
      if (endDateIsBeforeBeginDate) {
        setBeginDate(dateToIsoString(subDays(parseISO(d), 1)));
      }

      setEndDate(d);
    },
    [setEndDate, setSlots, beginDate, setBeginDate]
  );

  const handleRemoveSlot = React.useCallback(
    (slot: CreateSlotDto) => {
      setSlots(s => s.filter(v => v !== slot));
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
    ? isAfter(parseISO(endDate!), parseISO(beginDate))
    : _.isUndefined(endDate);

  const result = React.useMemo(
    () => ({
      prefiledSlots,
      slots,
      studentId,
      reason,
      date: beginDate,
      dateEnd: endDate
    }),
    [slots, studentId, reason, beginDate, endDate, prefiledSlots]
  );

  const isValidInput = CreateEntryDtoValidator.validate(result as any);

  const handleSubmit = React.useCallback(
    () => {
      dispatch(createEntryRequest(result as CreateEntryDto));
    },
    [dispatch, result]
  );

  const showIsNotInDeadlineWarning = isAfterDeadline(
    parseISO(isRange ? result.dateEnd! : result.date),
    new Date(),
    createEntryDeadline
  );

  return (
    <Dialog fullScreen={fullScreen} onClose={goBack} open>
      <DialogTitle>{translation.newEntry}</DialogTitle>
      <DialogContent>
        <Grid container direction="column" spacing={32}>
          <Grid item>
            <Grid container direction="row">
              <Grid item xs={6}>
                <CheckboxInput
                  value={isRange}
                  onChange={handleChangeIsRange}
                  label={translation.multiday}
                />
              </Grid>
            </Grid>
          </Grid>
          {userIsParent && (
            <Grid item xs={12}>
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
          <Grid item xs={12}>
            <Grid container direction="row" spacing={24}>
              <Grid item xs={6}>
                <DateInput
                  label={translation.fromLabel}
                  onChange={handleChangeBeginDate}
                  value={beginDate}
                />
              </Grid>
              {isRange && (
                <Grid item xs={6}>
                  <DateInput
                    label={translation.toLabel}
                    isValid={() => isEndDateValid}
                    onChange={handleChangeEndDate}
                    value={endDate!}
                    minDateMessage={translation.dateMustBeBiggerThanFrom}
                  />
                </Grid>
              )}
            </Grid>
          </Grid>
          {showIsNotInDeadlineWarning && (
            <Grid item xs={12}>
              <ErrorBox>{translation.deadline}</ErrorBox>
            </Grid>
          )}
          <Grid item xs={12}>
            <EntryReasonInput onChange={setReason as any} isRange={isRange} />
          </Grid>
          <Grid item xs={12}>
            <PrefiledSlotsPicker
              range={{ start: beginDate, end: isRange ? endDate! : beginDate }}
              onChange={setPrefiledSlots}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="column" spacing={8}>
              <Typography variant="h6">{translation.titles.slots}</Typography>
              <Typography variant="caption">
                {translation.addSlotsCaption}
              </Typography>
              <CreateSlotList slots={slots} onRemove={handleRemoveSlot} />
              <SlotEntry
                onAdd={handleAddSlot}
                isMultiDay={isRange}
                datePickerConfig={{
                  min: beginDate!,
                  max: endDate!
                }}
                defaultDate={beginDate}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={goBack} color="secondary">
          {translation.cancel}
        </Button>
        <Button
          onClick={() => {
            handleSubmit();
            goBack();
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

export default withMobileDialog<CreateEntryProps>()(CreateEntry);
