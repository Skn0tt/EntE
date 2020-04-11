import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ChildrenInput from "../elements/ChildrenInput";
import { UserN, getStudents, getToken, getSlotsRequest } from "../redux";
import { useSelector, useDispatch } from "react-redux";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import {
  CreatePrefiledSlotsDto,
  CreatePrefiledSlotDtoValidator,
} from "@@types";
import { DateInput } from "../elements/DateInput";
import { HourFromToInput } from "../elements/HourFromToInput";
import Axios from "axios";
import { apiBaseUrl } from "../";
import { useLoadingFlag } from "../useLoadingFlag";

const useTranslation = makeTranslationHook({
  en: {
    title: "Prefile missed classes",
    description:
      "This form allows you to file missed classes. Students will be notified and can attach them to their entries.",
    date: "Date",
    hour_from: "Begin of class",
    hour_to: "End of class",
    childrenInput: {
      title: "Missing students",
      addChildren: "Add missing student",
      child: "Student",
    },
    cancel: "Cancel",
    ok: "OK",
  },
  de: {
    title: "Fehlstundenvoranmeldung",
    description:
      "Hier können Sie die Fehlzeit ihrer Schüler*innen notieren. Die Schüler*innen werden über eingetragene Fehlzeiten informiert und können diese dann in ihre Entschuldigungsanträge aufnehmen.",
    date: "Datum",
    hour_from: "Unterrichtsbeginn",
    hour_to: "Unterrichtsende",
    childrenInput: {
      title: "Fehlende Schüler*innen",
      addChildren: "Schüler*in hinzufügen",
      child: "Schüler*in",
    },
    cancel: "Abbrechen",
    ok: "OK",
  },
});

const { useCallback, useState, useMemo } = React;

function usePrefiledSlotsCreator() {
  const token = useSelector(getToken);
  const dispatch = useDispatch();

  return useCallback(
    async (slot: CreatePrefiledSlotsDto) => {
      await Axios.post(`${apiBaseUrl}/slots/prefiled`, slot, {
        headers: {
          Authorization: `Bearer ${token.orSome("")}`,
        },
      });

      dispatch(getSlotsRequest());
    },
    [token, dispatch]
  );
}

const today = () => new Date().toISOString().split("T")[0];

const CreatePrefiledSlots = () => {
  const [date, setDate] = useState<string>(today());
  const [{ from: hour_from, to: hour_to }, setHourFromTo] = useState<{
    from?: number;
    to?: number;
  }>({});

  const allStudents = useSelector(getStudents);
  const [missingStudents, setMissingStudents] = useState<UserN[]>([]);

  const translation = useTranslation();
  const history = useHistory();

  const createPrefiledSlotDto: CreatePrefiledSlotsDto = useMemo(
    () => ({
      date,
      hour_from: hour_from || -1,
      hour_to: hour_to || -1,
      studentIds: missingStudents.map((s) => s.get("id")),
    }),
    [missingStudents, date, hour_from, hour_to]
  );

  const isValidInput = CreatePrefiledSlotDtoValidator.validate(
    createPrefiledSlotDto
  );

  const [isLoading, whileLoading] = useLoadingFlag();

  const handleCreate = usePrefiledSlotsCreator();

  return (
    <Dialog onClose={history.goBack} open>
      <DialogTitle>{translation.title}</DialogTitle>

      <DialogContent>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Typography>{translation.description}</Typography>
          </Grid>

          <Grid item xs={12}>
            <DateInput
              label={translation.date}
              value={date}
              onChange={setDate}
            />
          </Grid>

          <Grid item xs={12}>
            <HourFromToInput onChange={setHourFromTo} />
          </Grid>

          <Grid item xs={12}>
            <ChildrenInput
              children={missingStudents}
              students={allStudents}
              onChange={setMissingStudents}
              text={translation.childrenInput}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={history.goBack} color="secondary">
          {translation.cancel}
        </Button>
        <Button
          onClick={async () => {
            await whileLoading(() => handleCreate(createPrefiledSlotDto));
            history.goBack();
          }}
          disabled={!isValidInput || isLoading}
          color="primary"
        >
          {translation.ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePrefiledSlots;
