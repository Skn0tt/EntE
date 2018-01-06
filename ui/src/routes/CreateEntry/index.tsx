import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, User, Roles, MongoId, ISlotCreate, IEntryCreate } from '../../interfaces/index';
import { Action } from 'redux';
import { DatePicker } from 'material-ui-pickers';

import { withRouter, RouteComponentProps } from 'react-router';
import {
  Dialog,
  Button,
  FormControl,
  Switch,
  List as MUIList,
  TextField,
  Grid,
} from 'material-ui';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import { createEntryRequest } from '../../redux/actions';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import SlotListItem from './elements/SlotListItem';
import SlotEntry from './components/SlotEntry';

import * as moment from 'moment';
import 'moment/locale/de';
import MenuItem from 'material-ui/Menu/MenuItem';
import withMobileDialog from 'material-ui/Dialog/withMobileDialog';

/**
 * ## Moment Setup
 * Change Language to German
 */
moment.locale('de');

interface IProps {
  getRole(): Roles;
  children: User[];
  getTeachers(): User[];
  getUser(id: MongoId): User;
  createEntry(entry: IEntryCreate): Action;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface State {
  isRange: boolean;
  date: Date;
  dateEnd: Date;
  student?: MongoId;
  slots: ISlotCreate[];
  forSchool: boolean;
}

const mapStateToProps = (state: AppState) => ({
  children: select.getChildren(state),
  getRole: () => select.getRole(state),
  getTeachers: () => select.getTeachers(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  createEntry: (entry: IEntryCreate) => dispatch(createEntryRequest(entry)),
});

type Props = IProps & RouteComponentProps<{}> & WithStyles<string> & InjectedProps;

const CreateEntry = connect(mapStateToProps, mapDispatchToProps)(
  withMobileDialog<IProps>()(withRouter(withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    student: this.props.children.length > 0
      ? this.props.children[0].get('_id')
      : undefined,
    isRange: false,
    date: new Date(),
    dateEnd: new Date(),
    slots: [],
    forSchool: false,
  };

  /**
   * ## Action Handlers
   */
  handleGoBack = () => this.props.history.push('/');
  
  handleClose = () => this.handleGoBack();

  handleSubmit = () => this.props.createEntry({
    date: this.state.date,
    dateEnd: this.state.dateEnd,
    slots: this.state.slots,
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
  handleChangeDate = (date: Date) => this.setState({ date });
  handleChangeDateEnd = (dateEnd: Date) => this.setState({ dateEnd });
  handleChangeForSchool = (event: React.ChangeEvent<{}>, checked: boolean) =>
    this.setState({ forSchool: checked })

  handleChangeIsRange = (event: React.ChangeEvent<{}>, checked: boolean) =>
    this.setState({ isRange: checked })

  handleAddSlot = (slot: ISlotCreate) => {
    if (this.state.slots.indexOf(slot) !== -1) return;

    this.setState({ slots: [...this.state.slots, slot] });
  }

  handleRemoveSlot = (index: number) =>
    this.setState({ slots: this.state.slots.slice(index, index) })

  handleChangeStudent = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ student: event.target.value })

  /**
   * ## Validation
   */
  dateValid = (): boolean => (
    // Less than 14 Days ago
    this.state.date > this.minDate
  )
  dateEndValid = (): boolean => (
    this.state.isRange ||
    this.state.dateEnd > this.state.date
  )
  studentValid = (): boolean => (
    this.props.getRole() !== Roles.PARENT ||
    !!this.state.student
  )

  inputValid = () => (
    this.dateValid &&
    this.dateEndValid &&
    this.studentValid
  )

  /**
   * ## Data
   */
  minDate: Date = new Date(+new Date - 14 * 24 * 60 * 60 * 1000);

  render() {
    const { classes } = this.props;
    const isParent = this.props.getRole() === Roles.PARENT;

    return (
      <Dialog
        fullScreen={this.props.fullScreen}
        onClose={this.handleGoBack}
        open={true}
      >
        <DialogTitle>Neuer Eintrag</DialogTitle>
        <DialogContent>
          <form className={classes.container} onKeyPress={this.handleKeyPress} >
            <Grid container={true} direction="column" >
              <Grid item={true} >
                <FormControl>
                  <FormControlLabel
                    onChange={this.handleChangeForSchool}
                    control={<Switch />}
                    label="Schulisch"
                  />
                </FormControl>
              </Grid>
              {isParent && (
                <Grid item={true} >
                  <TextField
                    fullWidth={true}
                    select={true}
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
                  <Grid item={true} xs={8} >
                    <DatePicker
                      helperText="Von"
                      error={!this.dateValid()}
                      value={this.state.date}
                      onChange={this.handleChangeDate}
                      minDate={this.minDate}
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item={true} xs={4} > 
                    <FormControlLabel
                      onChange={this.handleChangeIsRange}
                      control={<Switch />}
                      label="Mehrtägig"
                    /> 
                  </Grid>
                  {this.state.isRange && (
                    <Grid item={true} xs={8} >
                      <DatePicker
                        helperText="Bis"
                        error={!this.dateValid()}
                        value={this.state.dateEnd}
                        onChange={this.handleChangeDateEnd}
                        minDate={this.minDate}
                        fullWidth={true}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </form>
          <MUIList>
            {this.state.slots.map((slot, index) => (
              <SlotListItem 
                slot={slot}
                delete={() => this.handleRemoveSlot(index)}
              />
            ))}
          </MUIList>
          <SlotEntry onAdd={slot => this.handleAddSlot(slot)}/>
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
}))));

export default CreateEntry;
