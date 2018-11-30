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
import { getTeachers, getUser, AppState, UserN } from "../../redux";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import { CreateSlotDto } from "ente-types";
import { DateInput } from "../../elements/DateInput";
import { createTranslation } from "ente-ui/src/helpers/createTranslation";

const lang = createTranslation({
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
  multiDay: boolean;
  datePickerConfig?: {
    min: Date;
    max: Date;
  };
  date: Date;
}

interface SlotEntryStateProps {
  teachers: UserN[];
  getUser(id: string): UserN;
}
const mapStateToProps: MapStateToPropsParam<
  SlotEntryStateProps,
  SlotEntryOwnProps,
  AppState
> = state => ({
  teachers: getTeachers(state),
  getUser: id => getUser(id)(state)
});

type SlotEntryProps = SlotEntryStateProps & SlotEntryOwnProps;

interface State {
  from: string;
  to: string;
  date?: Date;
  teacher?: string;
}

class SearchableDropdownUser extends SearchableDropdown<UserN> {}

class SlotEntry extends React.Component<SlotEntryProps, State> {
  state: State = {
    from: "1",
    to: "2"
  };

  /**
   * Handlers
   */

  handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) =>
    (event.target.value === "" ||
      (Number(event.target.value) > 0 && Number(event.target.value) < 12)) &&
    this.setState({
      from: event.target.value
    });

  handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) =>
    (event.target.value === "" ||
      (Number(event.target.value) > 0 && Number(event.target.value) < 12)) &&
    this.setState({
      to: event.target.value
    });

  handleChangeTeacher = (teacher: UserN) =>
    this.setState({ teacher: teacher.get("id") });

  /**
   * ## Form Validation Logic
   */
  /**
   * ### Slot
   */
  fromValid = (): boolean => {
    const { from } = this.state;
    const nmbFrom = parseInt(from, 10);

    return !isNaN(nmbFrom) && nmbFrom > 0 && nmbFrom < 12;
  };

  toValid = (): boolean => {
    const { from, to } = this.state;
    const nmbTo = parseInt(to, 10);
    const nmbFrom = parseInt(from, 10);

    return !isNaN(nmbTo) && nmbTo >= nmbFrom && nmbTo > 0 && nmbTo < 12;
  };

  teacherValid = (): boolean => {
    const { teacher } = this.state;
    return !!teacher;
  };

  slotInputValid = () =>
    this.fromValid() && this.toValid() && this.teacherValid();

  handleAddSlot = () =>
    this.props.onAdd({
      from: Number(this.state.from),
      to: Number(this.state.to),
      teacherId: this.state.teacher,
      date: this.props.multiDay ? this.state.date : undefined
    });

  render() {
    const { teachers, multiDay, datePickerConfig } = this.props;
    const { date } = this.state;

    return (
      <Grid container direction="row" spacing={16}>
        {/* Teacher */}
        <Grid item xs={12} md={4}>
          <SearchableDropdownUser
            label={lang.titles.teacher}
            helperText={lang.helpers.teacher}
            items={teachers}
            onChange={this.handleChangeTeacher}
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
        {multiDay && (
          <Grid item xs={3}>
            <DateInput
              onChange={date => this.setState({ date })}
              minDate={datePickerConfig.min}
              maxDate={datePickerConfig.max}
              isValid={d =>
                +datePickerConfig.min <= +d && +datePickerConfig.max >= +d
              }
              label={lang.titles.day}
              value={date}
            />
          </Grid>
        )}

        {/* From */}
        <Grid item xs={1}>
          <TextField
            label={lang.titles.from}
            fullWidth
            value={this.state.from}
            onChange={this.handleChangeFrom}
            type="number"
            error={!this.fromValid()}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        {/* To */}
        <Grid item xs={1}>
          <TextField
            label={lang.titles.to}
            fullWidth
            value={this.state.to}
            onChange={this.handleChangeTo}
            error={!this.toValid()}
            type="number"
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        {/* Add */}
        <Grid item xs={2}>
          <Tooltip title={lang.add}>
            <Button
              variant="raised"
              disabled={!this.slotInputValid()}
              onClick={() => this.handleAddSlot()}
            >
              {lang.add}
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
}

export default connect<SlotEntryStateProps, {}, SlotEntryOwnProps, AppState>(
  mapStateToProps
)(SlotEntry);
