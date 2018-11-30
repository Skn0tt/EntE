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
  Grid,
  Checkbox
} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
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
import { CreateEntryDto, CreateSlotDto } from "ente-types";
import { DateInput } from "../../elements/DateInput";
import { createTranslation } from "ente-ui/src/helpers/createTranslation";
import { Maybe } from "monet";

const lang = createTranslation({
  en: {
    multiday: "Multiday",
    forSchool: "Educational",
    selectChild: "Select the affected child.",
    addSlotsCaption: "Add the missed classes. Create one row per class.",
    titles: {
      slots: "Slots"
    },
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
    ok: "OK",
    cancel: "Zurück",
    fromLabel: "Von",
    toLabel: "Bis",
    dateMustBeBiggerThanFrom: `Muss nach 'Von' sein`
  }
});

/**
 * Thanks to [Vincent Billey](https://vincent.billey.me/pure-javascript-immutable-array#delete)!
 */
const immutableDelete = (arr: any[], index: number) =>
  arr.slice(0, index).concat(arr.slice(index + 1));

const oneDay: number = 24 * 60 * 60 * 1000;

const nextDay = (d: Date) => new Date(+d + oneDay);
const twoWeeksBefore = (d: Date) => new Date(+d - 14 * oneDay);

interface CreateEntryOwnProps {
  onClose(): void;
  show: boolean;
}

interface CreateEntryStateProps {
  isParent: Maybe<boolean>;
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
  isParent: isParent(state),
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
  date: Date;
  dateEnd: Date;
  student?: string;
  slots: CreateSlotDto[];
  forSchool: boolean;
}

class CreateEntry extends React.Component<CreateEntryProps, State> {
  state: State = {
    student:
      this.props.children.some().length > 0
        ? this.props.children[0].get("id")
        : undefined,
    isRange: false,
    date: new Date(),
    dateEnd: new Date(),
    slots: [],
    forSchool: false
  };

  /**
   * ## Action Handlers
   */
  handleSubmit = () =>
    this.props.createEntry({
      date: this.state.date,
      dateEnd: this.state.isRange ? this.state.dateEnd : undefined,
      slots: this.state.slots,
      forSchool: this.state.forSchool,
      studentId: this.state.student
    });

  handleKeyPress: React.KeyboardEventHandler<{}> = event => {
    if (event.key === "Enter" && this.inputValid()) {
      this.handleSubmit();
    }
  };

  /**
   * ## Input Handlers
   */
  handleChangeDate = (date: Date) => {
    const dateEndIsBeforeDate = +this.state.dateEnd <= +date + oneDay;
    if (dateEndIsBeforeDate) {
      this.setState({
        date,
        dateEnd: nextDay(date)
      });
    } else {
      this.setState({ date });
    }
  };
  handleChangeDateEnd = (dateEnd: Date) => this.setState({ dateEnd });
  handleChangeForSchool = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ forSchool: event.target.checked });

  handleChangeIsRange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ isRange: event.target.checked });

  handleAddSlot = (slot: CreateSlotDto) => {
    if (this.state.slots.indexOf(slot) !== -1) return;

    this.setState({ slots: [...this.state.slots, slot] });
  };

  handleRemoveSlot = (index: number) =>
    this.setState({ slots: immutableDelete(this.state.slots, index) });

  handleChangeStudent = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ student: event.target.value });

  /**
   * ## Validation
   */
  dateValid = (): boolean =>
    // Less than 14 Days ago
    +this.state.date > +this.minDate;
  dateEndValid = (): boolean =>
    !this.state.isRange || +this.state.dateEnd > +this.state.date;
  studentValid = (): boolean => !this.props.isParent || !!this.state.student;
  slotsValid = (): boolean => this.state.slots.length > 0;

  inputValid = () =>
    this.dateValid() &&
    this.dateEndValid() &&
    this.studentValid() &&
    this.slotsValid();

  /**
   * ## Data
   */
  minDate: Date = twoWeeksBefore(new Date());

  render() {
    const { isParent, fullScreen, onClose, show, children } = this.props;
    const { isRange, student, forSchool, date, dateEnd, slots } = this.state;

    return (
      <Dialog fullScreen={fullScreen} onClose={onClose} open={show}>
        <DialogTitle>Neuer Eintrag</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={40}>
            <Grid item container direction="column">
              <Grid item container direction="row">
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isRange}
                        onChange={this.handleChangeIsRange}
                      />
                    }
                    label={lang.multiday}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={forSchool}
                        onChange={this.handleChangeForSchool}
                      />
                    }
                    label={lang.forSchool}
                  />
                </Grid>
              </Grid>
              {isParent.some() && (
                <Grid item>
                  <TextField
                    fullWidth
                    select
                    label="Kind"
                    value={student}
                    onChange={this.handleChangeStudent}
                    helperText={lang.selectChild}
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
                      label="Von"
                      isValid={() => this.dateValid()}
                      onChange={this.handleChangeDate}
                      minDate={this.minDate}
                      value={date}
                    />
                  </Grid>
                  {isRange && (
                    <Grid item xs={6}>
                      <DateInput
                        label="Bis"
                        isValid={() => this.dateEndValid()}
                        onChange={this.handleChangeDateEnd}
                        minDate={nextDay(date)}
                        value={dateEnd}
                        minDateMessage={lang.dateMustBeBiggerThanFrom}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">{lang.titles.slots}</Typography>
              <Typography variant="caption">{lang.addSlotsCaption}</Typography>
              <MUIList>
                {slots.map((slot, index) => (
                  <SlotListItem
                    key={index}
                    slot={slot}
                    delete={() => this.handleRemoveSlot(index)}
                  />
                ))}
              </MUIList>
              <SlotEntry
                onAdd={slot => this.handleAddSlot(slot)}
                multiDay={isRange}
                datePickerConfig={{
                  min: date,
                  max: dateEnd
                }}
                date={date}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            {lang.cancel}
          </Button>
          <Button
            onClick={() => {
              this.handleSubmit();
              onClose();
            }}
            disabled={!this.inputValid()}
            color="primary"
          >
            {lang.ok}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect<
  CreateEntryStateProps,
  CreateEntryDispatchProps,
  CreateEntryOwnProps,
  AppState
>(mapStateToProps, mapDispatchToProps)(
  withRouter(withMobileDialog<CreateEntryProps>()(CreateEntry))
);
