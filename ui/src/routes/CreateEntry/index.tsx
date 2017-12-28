import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, Entry, User, Roles, Slot, createSlot, MongoId } from '../../interfaces/index';
import { Action } from 'redux';
import { DatePicker } from 'material-ui-pickers';

import { RouteComponentProps, withRouter } from 'react-router';
import {
  Dialog,
  Button,
  FormControl,
  Switch,
  List as MUIList,
  Grid,
  TextField,
} from 'material-ui';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import { createEntryRequest } from '../../redux/actions';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import { ChangeEvent } from 'react';
import { List } from 'immutable';
import SlotListItem from './elements/SlotListItem';
import { Add as AddIcon } from 'material-ui-icons';

import * as moment from 'moment';
import 'moment/locale/de';

/**
 * ## Moment Setup
 * Change Language to German
 */
moment.locale('de');

interface Props extends WithStyles, RouteComponentProps<{}> {
  getRole(): Roles;
  getChildren(): User[];
  getTeachers(): User[];
  getUser(id: MongoId): User;
  createEntry(entry: Entry): Action;
}

interface State {
  isRange: boolean;
  date: Date;
  dateEnd: Date;
  student: MongoId;
  slots: List<Slot>;
  forSchool: boolean;
  slotInput: {
    hour_from: string;
    hour_to: string;
    teacher: {
      _id: string;
      username: string;
    }
  };
}

const mapStateToProps = (state: AppState) => ({
  getChildren: () => select.getChildren(state),
  getRole: () => select.getRole(state),
  getTeachers: () => select.getTeachers(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  createEntry: (entry: Entry) => dispatch(createEntryRequest(entry)),
});

const CreateEntry = withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      isRange: false,
      date: new Date(),
      dateEnd: new Date(),
      slots: List(),
      student: this.props.getRole() === 'parent' ? this.props.getChildren()[0].get('_id') : '',
      forSchool: false,
      slotInput: {
        hour_from: '1',
        hour_to: '1',
        teacher: {
          _id: '',
          username: '',
        }
      }
    };
  }

  /**
   * ## Action Handlers
   */
  handleGoBack = () => this.props.history.goBack();
  
  handleClose = () => this.handleGoBack();

  handleSubmit = () => this.props.createEntry(new Entry({
    date: this.state.date,
    slots: this.state.slots.toArray(),
    forSchool: this.state.forSchool,
  }))

  /**
   * ## Input Handlers
   */
  handleChangeDate = (date: Date) => this.setState({ date });
  handleChangeDateEnd = (dateEnd: Date) => this.setState({ dateEnd });

  handleChangeForSchool = (event: ChangeEvent<{}>, checked: boolean) => this.setState({ forSchool: checked });

  handleChangeIsRange = (event: ChangeEvent<{}>, checked: boolean) => this.setState({ isRange: checked });

  handleAddSlot = () => this.setState({
    slots: this.state.slots.push(createSlot({
      hour_from: Number(this.state.slotInput.hour_from),
      hour_to: Number(this.state.slotInput.hour_to),
      teacher: this.state.slotInput.teacher,
    })),
  })

  handleRemoveSlot = (index: number) => this.setState({ slots: this.state.slots.delete(index) });

  handleChangeFrom = (event: ChangeEvent<HTMLInputElement>) => (
    (
      event.target.value === '' || (
      Number(event.target.value) > 0 &&
      Number(event.target.value) < 12
    )) &&
    this.setState({
      slotInput: {
        hour_from: event.target.value,
        hour_to: this.state.slotInput.hour_to,
        teacher: this.state.slotInput.teacher,
      }
    }))

  handleChangeTo = (event: ChangeEvent<HTMLInputElement>) => (
    (
      event.target.value === '' || (
      Number(event.target.value) > 0 &&
      Number(event.target.value) < 12
    )) &&
    this.setState({
      slotInput: {
        hour_to: event.target.value,
        hour_from: this.state.slotInput.hour_from,
        teacher: this.state.slotInput.teacher,
      }
    }))

  handleChangeStudent = (event: ChangeEvent<HTMLInputElement>) => this.setState({ student: event.target.value });

  handleChangeTeacher = (event: ChangeEvent<HTMLInputElement>) => this.setState({
    slotInput: {
      hour_to: this.state.slotInput.hour_to,
      hour_from: this.state.slotInput.hour_from,
      teacher: {
        _id: event.target.value,
        username: this.props.getUser(event.target.value).get('username')
      }
    }
  })

  /**
   * ## Form Validation Logic
   */
  /**
   * ### Slot
   */
  fromValid = (): boolean => {
    const { hour_from, hour_to } = this.state.slotInput;

    return (
      !isNaN(parseInt(hour_from, 10)) &&
      Number(hour_from) ! > 0 &&
      hour_from! <= hour_to!
    );
  }

  toValid = (): boolean => {
    const { hour_to } = this.state.slotInput;
    return (
      !isNaN(parseInt(hour_to, 10)) &&
      Number(hour_to)! <= 12
    );
  }

  teacherValid = (): boolean => {
    const { teacher } = this.state.slotInput;
    return (
      !!teacher &&
      !!teacher._id &&
      !!teacher.username
    );
  }
  
  slotInputValid = () => (
    this.fromValid() &&
    this.toValid() &&
    this.teacherValid()
  )

  /**
   * ### Form
   */
  inputValid = () => (
    this.slotInputValid()
  )

  /**
   * ## Data
   */
  minDate = (): Date => new Date(+new Date - 14 * 24 * 60 * 60 * 1000);

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        onClose={this.handleGoBack}
        open={true}
      >
        <DialogTitle>Neuer Eintrag</DialogTitle>
        <DialogContent>
          <form className={classes.container}>
            <FormControl>
              <FormControlLabel
                onChange={this.handleChangeForSchool}
                control={<Switch />}
                label="Schulisch"
              />
              <FormControlLabel
                onChange={this.handleChangeIsRange}
                control={<Switch />}
                label="Mehrtägig"
              />
            </FormControl>
            {this.props.getRole() === 'parent' && (
              <TextField
                select={true}
                label="Kind"
                value={this.props.getUser(this.state.student).get('username')}
                onChange={this.handleChangeStudent}
                SelectProps={{
                  native: true,
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                helperText="Wählen sie das betroffene Kind aus."
              >
                {this.props.getChildren().map(child => (
                  <option
                    key={child.get('_id')}
                    value={child.get('_id')}
                  >
                    {child.get('username')}
                  </option>
                ))}
              </TextField>
            )}
            <DatePicker
              value={this.state.date}
              onChange={this.handleChangeDate}
              minDate={this.minDate()}
            />
            {this.state.isRange && (
              <DatePicker
                value={this.state.dateEnd}
                onChange={this.handleChangeDateEnd}
                minDate={this.minDate()}
              />
            )}
          </form>
          <MUIList>
            {this.state.slots.toArray().map((slot, index) => (
              <SlotListItem 
                slot={slot}
                delete={() => this.handleRemoveSlot(index)}
              />
            ))}
          </MUIList>
          <Grid
            container={true}
            direction="row"
          >
            <Grid
              item={true}
            >
              <TextField
                select={true}
                label="Lehrer"
                value={this.state.slotInput.teacher ? this.state.slotInput.teacher.username : ''}
                onChange={this.handleChangeTeacher}
                error={this.teacherValid()}
                SelectProps={{
                  native: true,
                }}
                helperText="Wählen sie den Lehrer aus."
              >
                {this.props.getTeachers().map(teacher => (
                  <option
                    key={teacher.get('_id')}
                    value={teacher.get('_id')}
                  >
                    {teacher.get('username')}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item={true}
            >
              <TextField
                label="Von"
                value={this.state.slotInput.hour_from}
                onChange={this.handleChangeFrom}
                type="number"
                error={this.fromValid()}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid
              item={true}
            >
              <TextField
                label="Bis"
                value={this.state.slotInput.hour_to}
                onChange={this.handleChangeTo}
                error={this.toValid()}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid
              item={true}
            >
              <Button
                fab={true}
                mini={true}
                disabled={!this.slotInputValid()}
                onClick={() => this.handleAddSlot()}
              >
                <AddIcon />
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="accent">
            Cancel
          </Button>
          <Button
            onClick={this.handleSubmit}
            disabled={!this.inputValid()}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
})));

export default CreateEntry;
