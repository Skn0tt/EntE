import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, Entry, User, Roles, Slot, MongoId } from '../../interfaces/index';
import { Action } from 'redux';
import { DatePicker } from 'material-ui-pickers';

import { RouteComponentProps, withRouter } from 'react-router';
import {
  Dialog,
  Button,
  FormControl,
  Switch,
  List as MUIList,
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
import SlotEntry from './components/SlotEntry';

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

  handleKeyPress: React.KeyboardEventHandler<{}> = (event) => {
    if (event.key === 'Enter' && this.inputValid()) {
      this.handleSubmit();
    }
  }

  /**
   * ## Input Handlers
   */
  handleChangeDate = (date: Date) => this.setState({ date });
  handleChangeDateEnd = (dateEnd: Date) => this.setState({ dateEnd });
  handleChangeForSchool = (event: ChangeEvent<{}>, checked: boolean) => this.setState({ forSchool: checked });

  handleChangeIsRange = (event: ChangeEvent<{}>, checked: boolean) => this.setState({ isRange: checked });

  handleAddSlot = (slot: Slot) => {
    if (this.state.slots.contains(slot)) {
      return;
    }

    this.setState({ slots: this.state.slots.push(slot) });
  }

  handleRemoveSlot = (index: number) => this.setState({ slots: this.state.slots.delete(index) });

  handleChangeStudent = (event: ChangeEvent<HTMLInputElement>) => this.setState({ student: event.target.value });

  // TODO: Implement
  inputValid = () => true;

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
          <form className={classes.container} onKeyPress={this.handleKeyPress} >
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
          <SlotEntry onAdd={(slot) => this.handleAddSlot(slot)}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="accent">
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
})));

export default CreateEntry;
