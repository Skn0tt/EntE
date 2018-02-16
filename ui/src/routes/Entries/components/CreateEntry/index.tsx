import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../../../redux/selectors';
import {
  AppState,
  User,
  MongoId,
  ISlotCreate,
  IEntryCreate,
} from '../../../../interfaces/index';
import { Action } from 'redux';
import { DatePicker } from 'material-ui-pickers';

import { withRouter, RouteComponentProps } from 'react-router';
import {
  Dialog,
  Button,
  List as MUIList,
  TextField,
  Grid,
  Checkbox,
  Icon,
} from 'material-ui';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import { createEntryRequest } from '../../../../redux/actions';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import SlotListItem from './elements/SlotListItem';
import SlotEntry from './components/SlotEntry';

import * as moment from 'moment';
import 'moment/locale/de';
import MenuItem from 'material-ui/Menu/MenuItem';
import withMobileDialog from 'material-ui/Dialog/withMobileDialog';
import Typography from 'material-ui/Typography/Typography';

/**
 * ## Moment Setup
 * Change Language to German
 */
moment.locale('de');

/**
 * Thanks to [Vincent Billey](https://vincent.billey.me/pure-javascript-immutable-array#delete)!
 */
const immutableDelete = (arr: any[], index: number) =>
  arr.slice(0, index).concat(arr.slice(index + 1));

const oneDay: number = 24 * 60 * 60 * 1000;

interface OwnProps {
  onClose(): void;
  show: boolean;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface State {
  isRange: boolean;
  date: Date;
  dateEnd: Date;
  reason?: string;
  student?: MongoId;
  slots: ISlotCreate[];
  forSchool: boolean;
}

interface StateProps {
  isParent: boolean;
  children: User[];
  teachers: User[];
  getUser(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  children: select.getChildren(state),
  isParent: select.isParent(state),
  teachers: select.getTeachers(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

interface DispatchProps {
  createEntry(entry: IEntryCreate): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  createEntry: (entry: IEntryCreate) => dispatch(createEntryRequest(entry)),
});

type Props =
  OwnProps & 
  DispatchProps &
  StateProps &
  RouteComponentProps<{}> &
  WithStyles<string> &
  InjectedProps;

const CreateEntry =
  connect(mapStateToProps, mapDispatchToProps)(
  withMobileDialog<OwnProps & DispatchProps & StateProps>()(
  withRouter(
  withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    student: this.props.children.length > 0
      ? this.props.children[0].get('_id')
      : undefined,
    isRange: false,
    date: new Date(),
    dateEnd: new Date(),
    reason: '',
    slots: [],
    forSchool: false,
  };

  /**
   * ## Action Handlers
   */
  handleGoBack = () => this.props.history.goBack();
  
  handleClose = () => this.handleGoBack();

  handleSubmit = () => this.props.createEntry({
    date: this.state.date,
    dateEnd: this.state.isRange ? this.state.dateEnd : undefined,
    slots: this.state.isRange ? [] : this.state.slots,
    reason: this.state.reason,
    forSchool: this.state.forSchool,
    student: this.state.student,
  })

  handleKeyPress: React.KeyboardEventHandler<{}> = (event) => {
    if (event.key === 'Enter' && this.inputValid()) {
      this.handleSubmit();
    }
  }

  /**
   * ## Input Handlers
   */
  handleChangeDate = (date: Date) => {
    const dateEnd = this.state.dateEnd <= date
      ? new Date(+date + oneDay)
      : this.state.dateEnd;
    
    this.setState({ date, dateEnd });
  }
  handleChangeDateEnd = (dateEnd: Date) => this.setState({ dateEnd });
  handleChangeForSchool = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ forSchool: event.target.checked })

  handleChangeIsRange = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ isRange: event.target.checked })

  handleAddSlot = (slot: ISlotCreate) => {
    if (this.state.slots.indexOf(slot) !== -1) return;

    this.setState({ slots: [...this.state.slots, slot] });
  }

  handleChangeReason = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ reason: event.target.value })

  handleRemoveSlot = (index: number) =>
    this.setState({ slots: immutableDelete(this.state.slots, index) })

  handleChangeStudent = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ student: event.target.value })

  /**
   * ## Validation
   */
  dateValid = (): boolean => (
    // Less than 14 Days ago
    +this.state.date > +this.minDate
  )
  dateEndValid = (): boolean => (
    !this.state.isRange ||
    +this.state.dateEnd > +this.state.date
  )
  studentValid = (): boolean => (
    this.props.isParent ||
    !!this.state.student
  )
  slotsValid = (): boolean => (
    this.state.isRange ||
    this.state.slots.length > 0
  )
  reasonValid = (): boolean => (
    !this.state.reason ||
    this.state.reason.length < 300
  )

  inputValid = () => (
    this.dateValid() &&
    this.dateEndValid() &&
    this.reasonValid() &&
    this.studentValid() &&
    this.slotsValid()
  )

  /**
   * ## Data
   */
  minDate: Date = new Date(+new Date - 14 * 24 * 60 * 60 * 1000);

  render() {
    const { isParent } = this.props;

    return (
      <Dialog
        fullScreen={this.props.fullScreen}
        onClose={this.handleGoBack}
        open={this.props.show}
      >
        <DialogTitle>Neuer Eintrag</DialogTitle>
        <DialogContent>
          <Grid container direction="column" spacing={40}>
            <Grid item container direction="column">
              <Grid item container direction="row">
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={this.state.isRange}
                        onChange={this.handleChangeIsRange}
                      />
                    }
                    label="Mehrtägig"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.forSchool}
                          onChange={this.handleChangeForSchool}
                        />
                      }
                      label="Schulisch"
                    />
                </Grid>
              </Grid>
              {isParent && (
                <Grid item >
                  <TextField
                    fullWidth
                    select
                    label="Kind"
                    value={this.state.student}
                    onChange={this.handleChangeStudent}
                    helperText="Wählen sie das betroffene Kind aus."
                  >
                    {this.props.children.map(child => (
                      <MenuItem
                        key={child.get('_id')}
                        value={child.get('_id')}
                      >
                        {child.get('displayname')}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}
              <Grid item={true} >
                <Grid container={true} direction="row" >
                  <Grid item={true} xs={this.state.isRange ? 6 : 12} >
                    <DatePicker
                      helperText="Von"
                      leftArrowIcon={<Icon> keyboard_arrow_left </Icon>}
                      rightArrowIcon={<Icon> keyboard_arrow_right </Icon>}
                      labelFunc={
                        (date: moment.Moment, invalidLabel: string) => !!date
                          ? date.toDate().toLocaleDateString()
                          : invalidLabel
                      }
                      error={!this.dateValid()}
                      value={this.state.date}
                      autoOk
                      onChange={this.handleChangeDate}
                      minDate={this.minDate}
                      fullWidth
                    />
                  </Grid>
                  {this.state.isRange && (
                    <Grid item={true} xs={6} >
                      <DatePicker
                        helperText="Bis"
                        error={!this.dateValid()}
                        value={this.state.dateEnd}
                        labelFunc={
                          (date: moment.Moment, invalidLabel: string) => !!date
                          ? date.toDate().toLocaleDateString()
                            : invalidLabel
                        }
                        autoOk
                        onChange={this.handleChangeDateEnd}
                        minDate={this.state.date}
                        fullWidth
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                helperText="Wieso haben sie gefehlt? Maximal 300 Zeichen"
                placeholder="Bemerkung (Optional, z.B. Grund)"
                onChange={this.handleChangeReason}
                error={!this.reasonValid()}
                multiline
                fullWidth
              />
            </Grid>
            {!this.state.isRange && (
              <Grid item xs={12}>
                <Typography variant="title">
                  Stunden
                </Typography>
                <Typography variant="caption">
                  Fügen sie die Stunden hinzu, die sie entschuldigen möchten.
                  Erstellen sie dafür für jede Stunde einen Eintrag.
                </Typography>
                <MUIList>
                  {this.state.slots.map((slot, index) => (
                    <SlotListItem 
                      slot={slot}
                      delete={() => this.handleRemoveSlot(index)}
                    />
                  ))}
                </MUIList>
                <SlotEntry onAdd={slot => this.handleAddSlot(slot)}/>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              this.handleSubmit();
              this.handleClose();
            }}
            disabled={!this.inputValid()}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}))));

export default CreateEntry;
