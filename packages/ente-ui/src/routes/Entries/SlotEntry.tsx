/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, MapStateToPropsParam } from "react-redux";
import { Grid, Button } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import { AppState, UserN, getTeachingUsers } from "../../redux";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import { CreateSlotDto } from "ente-types";
import { DateInput } from "../../elements/DateInput";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import * as _ from "lodash";
import { useFromToInput } from "../../helpers/use-from-to-input";
import { HourFromToInput } from "../../elements/HourFromToInput";

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
      teacher: "Wählen Sie den Lehrer aus."
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

interface SlotEntryStateProps {
  teachingUsers: UserN[];
}
const mapStateToProps: MapStateToPropsParam<
  SlotEntryStateProps,
  SlotEntryOwnProps,
  AppState
> = state => ({
  teachingUsers: getTeachingUsers(state)
});

type SlotEntryProps = SlotEntryStateProps & SlotEntryOwnProps;

const SlotEntry: React.FC<SlotEntryProps> = props => {
  const {
    defaultDate,
    datePickerConfig,
    onAdd,
    isMultiDay,
    teachingUsers: teachers
  } = props;
  const translation = useTranslation();

  const { from, to, setFrom, setTo } = useFromToInput(1, 2);
  const [date, setDate] = React.useState<string>(defaultDate);
  const [teacherId, setTeacherId] = React.useState<string | undefined>(
    undefined
  );

  const isTeacherValid = !!teacherId;

  const isValid = isTeacherValid;

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
      <Grid item xs={12} md={isMultiDay ? 4 : 7}>
        <SearchableDropdown<UserN>
          label={translation.titles.teacher}
          helperText={translation.helpers.teacher}
          items={teachers}
          onChange={t => setTeacherId(!!t ? t.get("id") : undefined)}
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

export default connect<SlotEntryStateProps, {}, SlotEntryOwnProps, AppState>(
  mapStateToProps
)(SlotEntry);
