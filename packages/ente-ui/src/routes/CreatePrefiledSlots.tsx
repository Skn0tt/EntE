import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { ChildrenInput } from "../elements/ChildrenInput";
import { UserN, getStudents } from "../redux";
import { useSelector } from "react-redux";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import {
  CreatePrefiledSlotsDto,
  CreatePrefiledSlotDtoValidator
} from "ente-types";
import { DateInput } from "../elements/DateInput";
import { NumberInput } from "../elements/NumberInput";

const useTranslation = makeTranslationHook({
  en: {
    title: "Prefile missed classes",
    date: "Date",
    hour_from: "Begin of class",
    hour_to: "End of class",
    childrenInput: {
      title: "Missing students",
      addChildren: "Add missing student",
      child: "Student"
    },
    cancel: "Cancel",
    ok: "OK"
  },
  de: {
    title: "Fehlstundenvoranmeldung",
    date: "Datum",
    hour_from: "Unterrichtsbeginn",
    hour_to: "Unterrichtsende",
    childrenInput: {
      title: "Fehlende Schüler*innen",
      addChildren: "Schüler*in hinzufügen",
      child: "Schüler*in"
    },
    cancel: "Abbrechen",
    ok: "OK"
  }
});

const { useCallback, useState, useMemo } = React;

const CreatePrefiledSlots = () => {
  const [date, setDate] = useState<string>(new Date().toISOString());
  const [hour_from, setHourFrom] = useState<number | undefined>(1);
  const [hour_to, setHourTo] = useState<number | undefined>(2);

  const allStudents = useSelector(getStudents);
  const [missingStudents, setMissingStudents] = useState<UserN[]>([]);

  const translation = useTranslation();
  const history = useHistory();

  const createPrefiledSlotDto: CreatePrefiledSlotsDto = useMemo(
    () => ({
      date,
      hour_from: hour_from || -1,
      hour_to: hour_to || -1,
      studentIds: missingStudents.map(s => s.get("id"))
    }),
    [missingStudents, date, hour_from, hour_to]
  );

  const isValidInput = CreatePrefiledSlotDtoValidator.validate(
    createPrefiledSlotDto
  );

  const handleCreate = useCallback(
    () => {
      // TODO: create
    },
    [createPrefiledSlotDto]
  );

  return (
    <Dialog onClose={history.goBack} open>
      <DialogTitle>{translation.title}</DialogTitle>

      <DialogContent>
        <DateInput label={translation.date} value={date} onChange={setDate} />

        <NumberInput
          onChange={setHourFrom}
          value={hour_from}
          label={translation.hour_from}
        />

        <NumberInput
          onChange={setHourTo}
          value={hour_to}
          label={translation.hour_to}
        />

        <ChildrenInput
          children={missingStudents}
          students={allStudents}
          onChange={setMissingStudents}
          text={translation.childrenInput}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={history.goBack} color="secondary">
          {translation.cancel}
        </Button>
        <Button
          onClick={() => {
            handleCreate();
            history.goBack();
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

export default CreatePrefiledSlots;
