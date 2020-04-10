/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Grid, Button } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { CreateSlotDto } from "@@types";
import { DateInput } from "../../elements/DateInput";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import * as _ from "lodash";
import { useFromToInput } from "../../helpers/use-from-to-input";
import { HourFromToInput } from "../../elements/HourFromToInput";
import TeacherInput from "./TeacherInput";
import { Maybe } from "monet";

const useTranslation = makeTranslationHook({
  en: {
    titles: {
      day: "Day",
      from: "Start",
      to: "End"
    },
    add: "Add"
  },
  de: {
    titles: {
      day: "Tag",
      from: "Beginn",
      to: "Ende"
    },
    add: "Hinzufügen"
  }
});

interface SlotEntryOwnProps {
  onAdd(slot: CreateSlotDto): void;
  isMultiDay: boolean;
  datePickerConfig?: {
    min: string;
    max: string;
  };
  defaultDate: string;
}

type SlotEntryProps = SlotEntryOwnProps;

const SlotEntry: React.FC<SlotEntryProps> = props => {
  const { defaultDate, datePickerConfig, onAdd, isMultiDay } = props;
  const translation = useTranslation();

  const { from, to, setFrom, setTo } = useFromToInput(1, 2);
  const [date, setDate] = React.useState<string>(defaultDate);
  const [teacherId, setTeacherId] = React.useState<string | undefined>(
    undefined
  );

  const isTeacherValid = !!teacherId;
  const timeIsValid = !_.isUndefined(from) && !_.isUndefined(to);

  const isValid = isTeacherValid && timeIsValid;

  const handleSubmit = React.useCallback(
    () => {
      onAdd({
        from: from!,
        to: to!,
        date: isMultiDay ? date : undefined,
        teacherId: teacherId!
      });
    },
    [from, to, date, isMultiDay, teacherId]
  );

  const handleChangeTeacher = React.useCallback(
    (teacher: Maybe<string>) => {
      setTeacherId(teacher.orUndefined());
    },
    [setTeacherId]
  );

  return (
    <Grid container direction="row" spacing={16}>
      {/* Teacher */}
      <Grid item xs={12} md={isMultiDay ? 4 : 7}>
        <TeacherInput onChange={handleChangeTeacher} />
      </Grid>

      {/* Date */}
      {isMultiDay && (
        <Grid item xs={3}>
          <DateInput
            onChange={setDate}
            minDate={!!datePickerConfig ? datePickerConfig.min : undefined}
            maxDate={!!datePickerConfig ? datePickerConfig.max : undefined}
            label={translation.titles.day}
            value={date!}
          />
        </Grid>
      )}

      <Grid item xs={2}>
        <HourFromToInput
          onChange={({ from, to }) => {
            setFrom(from);
            setTo(to);
          }}
        />
      </Grid>

      {/* Add */}
      <Grid item xs={2}>
        <Tooltip title={translation.add}>
          <Button variant="raised" disabled={!isValid} onClick={handleSubmit}>
            {translation.add}
          </Button>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

export default SlotEntry;
