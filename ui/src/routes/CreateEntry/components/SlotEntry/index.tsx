import * as React from 'react';
import { AppState, User, MongoId, ISlotCreate } from '../../../../interfaces/index';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { withStyles, Grid, TextField, Button } from 'material-ui';
import * as select from '../../../../redux/selectors';
import { Add as AddIcon } from 'material-ui-icons';

import styles from './styles';
import { WithStyles } from 'material-ui/styles/withStyles';

interface Props {
  teachers: User[];
  onAdd(slot: ISlotCreate): void;
  getUser(id: MongoId): User;
}
interface State {
  hour_from: string;
  hour_to: string;
  teacher: MongoId;
}

const mapStateToProps = (state: AppState) => ({
  teachers: select.getTeachers(state),
  getUser: (id: MongoId) => select.getUser(id)(state),
});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({});

type SlotEntryProps = Props & WithStyles;
const SlotEntry = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
  class extends React.Component<SlotEntryProps, State> {
    constructor(props: SlotEntryProps) {
      super(props);
      
      this.state = {
        hour_from: '1',
        hour_to: '2',
        teacher: this.props.teachers[0].get('_id'),
      };
    }
    /**
     * Handlers
     */

    handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) => (
      (
        event.target.value === '' || (
        Number(event.target.value) > 0 &&
        Number(event.target.value) < 12
      )) &&
      this.setState({
        hour_from: event.target.value,
      })
    )

    handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) => (
      (
        event.target.value === '' || (
        Number(event.target.value) > 0 &&
        Number(event.target.value) < 12
      )) &&
      this.setState({
        hour_to: event.target.value,
      })
    )
    handleChangeTeacher = (event: React.ChangeEvent<HTMLInputElement>) => this.setState({
      teacher: event.target.value,
    })
    /**
     * ## Form Validation Logic
     */
    /**
     * ### Slot
     */
    fromValid = (): boolean => {
      const { hour_from } = this.state;
      const nmbFrom = parseInt(hour_from, 10);
      
      return (
        !isNaN(nmbFrom) &&
        nmbFrom > 0 && nmbFrom < 12
      );
    }

    toValid = (): boolean => {
      const { hour_from, hour_to } = this.state;
      const nmbTo = parseInt(hour_to, 10);
      const nmbFrom = parseInt(hour_from, 10);
      
      return (
        !isNaN(nmbTo) &&
        nmbTo >= nmbFrom &&
        nmbTo > 0 && nmbTo < 12
      );
    }

    teacherValid = (): boolean => {
      const { teacher } = this.state;
      return (!!teacher);
    }
    
    slotInputValid = () => (
      this.fromValid() &&
      this.toValid() &&
      this.teacherValid()
    )

    handleAddSlot = () => this.props.onAdd({
      hour_from: Number(this.state.hour_from),
      hour_to: Number(this.state.hour_to),
      teacher: this.state.teacher,
    })

    render() {
      return (
        <Grid
          container={true}
          direction="row"
        >

          {/* Teacher */}
          <Grid
            item={true}
            xs={12}
            md={4}
          >
            <TextField
              select={true}
              label="Lehrer"
              value={this.state.teacher || ''}
              onChange={this.handleChangeTeacher}
              fullWidth={true}
              error={!this.teacherValid()}
              SelectProps={{ native: true }}
              helperText="Wählen sie den Lehrer aus."
            >
              {this.props.teachers.map(teacher => (
                <option
                  key={teacher.get('_id')}
                  value={teacher.get('_id')}
                >
                  {teacher.get('displayname')}
                </option>
              ))}
            </TextField>
          </Grid>
          
          {/* From */}
          <Grid
            item={true}
            xs={5}
            md={3}
          >
            <TextField
              label="Von"
              fullWidth={true}
              value={this.state.hour_from}
              onChange={this.handleChangeFrom}
              type="number"
              error={!this.fromValid()}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* To */}
          <Grid
            item={true}
            xs={5}
            md={3}
          >
            <TextField
              label="Bis"
              fullWidth={true}
              value={this.state.hour_to}
              onChange={this.handleChangeTo}
              error={!this.toValid()}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Add */}
          <Grid
            item={true}
            xs={2}
            md={2}
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
      );
    }

  }
));

export default SlotEntry;
