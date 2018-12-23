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
import {
  CreateEntryDto,
  CreateSlotDto,
  isValidCreateEntryDto
} from "ente-types";
import { DateInput } from "../../elements/DateInput";
import { Maybe } from "monet";
import {
  WithTranslation,
  withTranslation
} from "../../helpers/with-translation";

const lang = {
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
};

/**
 * Thanks to [Vincent Billey](https://vincent.billey.me/pure-javascript-immutable-array#delete)!
 */
const immutableDelete = (arr: any[], index: number) =>
  arr.slice(0, index).concat(arr.slice(index + 1));

const stripTime = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

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
  WithTranslation<typeof lang.en> &
  InjectedProps;

interface State {
  isRange: boolean;
  date: Date;
  dateEnd?: Date;
  student?: string;
  slots: CreateSlotDto[];
  forSchool: boolean;
}

class CreateEntry extends React.Component<CreateEntryProps, State> {
  state: State = {
    student:
      this.props.children.some().length > 0
        ? this.props.children.some()[0].get("id")
        : undefined,
    isRange: false,
    date: stripTime(new Date()),
    dateEnd: undefined,
    slots: [],
    forSchool: false
  };

  /**
   * ## Action Handlers
   */
  handleSubmit = () =>
    this.props.createEntry({
      date: this.state.date,
      dateEnd: this.state.dateEnd,
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
  handleChangeBeginDate = (date: Date) => {
    const { slots, isRange, dateEnd } = this.state;
    const slotsWithoutSlotsThatAreTooEarly = isRange
      ? slots.filter(s => s.date! >= date)
      : slots;
    const dateEndIsBeforeDate = +dateEnd! <= +date + oneDay;
    if (dateEndIsBeforeDate) {
      this.setState({
        date,
        dateEnd: nextDay(date),
        slots: slotsWithoutSlotsThatAreTooEarly
      });
    } else {
      this.setState({
        date,
        slots: slotsWithoutSlotsThatAreTooEarly
      });
    }
  };

  handleChangeDateEnd = (dateEnd: Date) => {
    const { slots, isRange } = this.state;
    const slotsWithoutSlotsThatAreTooLate = isRange
      ? slots.filter(s => s.date! <= dateEnd)
      : slots;
    this.setState({ dateEnd, slots: slotsWithoutSlotsThatAreTooLate });
  };

  handleChangeForSchool = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ forSchool: event.target.checked });

  handleChangeIsRange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ isRange: event.target.checked });
    if (event.target.checked === false) {
      const withoutDate = this.state.slots.map(s => ({
        ...s,
        date: undefined
      }));
      this.setState({ slots: withoutDate, dateEnd: undefined });
    } else {
      const withDate = this.state.slots.map(s => ({
        ...s,
        date: this.state.date
      }));
      this.setState({ slots: withDate, dateEnd: this.state.date });
    }
  };

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

  dateEndValid = (): boolean => {
    const { isRange, dateEnd, date } = this.state;
    if (!isRange) {
      return true;
    }

    return !!dateEnd && dateEnd > date;
  };

  studentValid = (): boolean => {
    const { isParent } = this.props;
    const { student } = this.state;
    if (!isParent.some()) {
      return true;
    }

    return !!student;
  };

  inputValid = () => {
    const { student, forSchool, date, dateEnd, slots } = this.state;

    return (
      isValidCreateEntryDto({
        date,
        dateEnd,
        forSchool,
        slots,
        studentId: student
      }) && this.studentValid()
    );
  };

  /**
   * ## Data
   */
  minDate: Date = twoWeeksBefore(new Date());

  render() {
    const {
      isParent,
      fullScreen,
      onClose,
      show,
      children,
      translation
    } = this.props;
    const { isRange, student, forSchool, date, dateEnd, slots } = this.state;

    return (
      <Dialog fullScreen={fullScreen} onClose={onClose} open={show}>
        <DialogTitle>{translation.newEntry}</DialogTitle>
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
                    label={translation.multiday}
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
                    label={translation.forSchool}
                  />
                </Grid>
              </Grid>
              {isParent.some() && (
                <Grid item>
                  <TextField
                    fullWidth
                    select
                    label={translation.child}
                    value={student}
                    onChange={this.handleChangeStudent}
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
                      isValid={this.dateValid}
                      onChange={this.handleChangeBeginDate}
                      minDate={this.minDate}
                      value={date}
                    />
                  </Grid>
                  {isRange && (
                    <Grid item xs={6}>
                      <DateInput
                        label={translation.toLabel}
                        isValid={this.dateEndValid}
                        onChange={this.handleChangeDateEnd}
                        minDate={nextDay(date)}
                        value={dateEnd!}
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
            {translation.cancel}
          </Button>
          <Button
            onClick={() => {
              this.handleSubmit();
              onClose();
            }}
            disabled={!this.inputValid()}
            color="primary"
          >
            {translation.ok}
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
>(
  mapStateToProps,
  mapDispatchToProps
)(
  withRouter(
    withTranslation(lang)(withMobileDialog<CreateEntryProps>()(CreateEntry))
  )
);
