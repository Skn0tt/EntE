/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, MapStateToPropsParam } from "react-redux";
import { Grid, TextField, Button } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { getTeachers, AppState, UserN } from "../../redux";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import { CreateSlotDto } from "ente-types";
import { DateInput } from "../../elements/DateInput";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import * as _ from "lodash";
import { isBefore, isAfter } from "date-fns";

const useTranslation = makeTranslationHook({
  en: {
    titles: {
      teacher: "Teacher",
      day: "Day",
      from: "Start",
      to: "End"
    },
    helpers: {
      teacher: "Select the teacher."
    },
    add: "Add"
  },
  de: {
    titles: {
      teacher: "Lehrer",
      day: "Tag",
      from: "Beginn",
      to: "Ende"
    },
    helpers: {
      teacher: "Wählen sie den Lehrer aus."
    },
    add: "Hinzufügen"
  }
});

interface SlotEntryOwnProps {
  onAdd(slot: CreateSlotDto): void;
  isMultiDay: boolean;
  datePickerConfig?: {
    min?: string;
    max?: string;
  };
  defaultDate: string;
}

interface SlotEntryStateProps {
  teachers: UserN[];
}
const mapStateToProps: MapStateToPropsParam<
  SlotEntryStateProps,
  SlotEntryOwnProps,
  AppState
> = state => ({
  teachers: getTeachers(state)
});

type SlotEntryProps = SlotEntryStateProps & SlotEntryOwnProps;

class SearchableDropdownUser extends SearchableDropdown<UserN> {}

const SlotEntry: React.FC<SlotEntryProps> = props => {
  const { defaultDate, datePickerConfig, onAdd, isMultiDay, teachers } = props;
  const translation = useTranslation();

  const [from, setFrom] = React.useState(1);
  const [to, setTo] = React.useState(2);
  const [date, setDate] = React.useState<string>(defaultDate);
  const [teacherId, setTeacherId] = React.useState<string | undefined>(
    undefined
  );

  const isFromValid = from > 0 && from <= to;
  const isToValid = to > 0 && to <= 12 && to >= from;
  const isTeacherValid = !!teacherId;

  const isValid = isFromValid && isToValid && isTeacherValid;

  const handleSubmit = React.useCallback(
    () => {
      onAdd({
        from,
        to,
        date: isMultiDay ? date : undefined,
        teacherId: teacherId!
      });
    },
    [from, to, date, isMultiDay, teacherId]
  );

  return (
    <Grid container direction="row" spacing={16}>
      {/* Teacher */}
      <Grid item xs={12} md={4}>
        <SearchableDropdownUser
          label={translation.titles.teacher}
          helperText={translation.helpers.teacher}
          items={teachers}
          onChange={t => setTeacherId(t.get("id"))}
          includeItem={(item, searchTerm) =>
            item
              .get("displayname")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          }
          itemToString={i => i.get("displayname")}
        />
      </Grid>

      {/* Date */}
      {isMultiDay && (
        <Grid item xs={3}>
          <DateInput
            onChange={setDate}
            minDate={!!datePickerConfig ? datePickerConfig.min : undefined}
            maxDate={!!datePickerConfig ? datePickerConfig.max : undefined}
            label={translation.titles.day}
            isValid={v => {
              if (!!datePickerConfig) {
                if (!!datePickerConfig.min) {
                  if (isBefore(v, datePickerConfig.min)) {
                    return false;
                  }
                }
                if (!!datePickerConfig.max) {
                  if (isAfter(v, datePickerConfig.max)) {
                    return false;
                  }
                }
              }
              return true;
            }}
            value={date!}
          />
        </Grid>
      )}

      {/* From */}
      <Grid item xs={1}>
        <TextField
          label={translation.titles.from}
          fullWidth
          value={from}
          onChange={evt => setFrom(+evt.target.value)}
          type="number"
          error={!isFromValid}
          InputLabelProps={{
            shrink: true
          }}
        />
      </Grid>

      {/* To */}
      <Grid item xs={1}>
        <TextField
          label={translation.titles.to}
          fullWidth
          value={to}
          onChange={evt => setTo(+evt.target.value)}
          error={!isToValid}
          type="number"
          InputLabelProps={{
            shrink: true
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

export default connect<SlotEntryStateProps, {}, SlotEntryOwnProps, AppState>(
  mapStateToProps
)(SlotEntry);
