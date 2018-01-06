import * as React from 'react';
import { connect } from 'react-redux';
import { AppState, User, MongoId, IUser } from '../../../../interfaces/index';
import { Dispatch, Action } from 'redux';
import { Grid, Button, withStyles } from 'material-ui';
import * as select from '../../../../redux/selectors';
import IconButton from 'material-ui/IconButton/IconButton';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon,
} from 'material-ui-icons';
import TextField from 'material-ui/TextField/TextField';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import ListItemSecondaryAction from 'material-ui/List/ListItemSecondaryAction';
import { updateUserRequest } from '../../../../redux/actions';
import Typography from 'material-ui/Typography/Typography';

import styles from './styles';
import { WithStyles } from 'material-ui/styles/withStyles';

interface InjectedProps {
  students: User[];
  getUser(id: MongoId): User;
  updateUser(user: Partial<IUser>): Action;
}
interface IProps {
  userId: MongoId;
}
interface State {
  children: MongoId[];
  selected: MongoId;
}

const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => select.getUser(id)(state),
  students: select.getStudents(state),
});
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  updateUser: (user: Partial<IUser>) => dispatch(updateUserRequest(user)),
});
type Props = IProps & InjectedProps & WithStyles;
const ChildrenUpdate = connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(
class extends React.Component<Props, State> {
  state: State = {
    selected: this.props.students.length > 0
      ? this.props.students[0].get('_id')
      : '',
    children: this.props.getUser(this.props.userId).get('children'),
  };
    

  handleSubmit = () => this.props.updateUser({
    _id: this.props.userId,
    children: this.state.children,
  })

  handleSelectChild = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ selected: event.target.value })
  handleAdd = () => this.setState({ children: [...this.state.children, this.state.selected] });
  handleDelete = (index: number) =>
    this.setState({ children: this.state.children.splice(index, index) })

  render() {
    return (
      <Grid container={true} direction="column">
        <Grid item={true}>
          <Typography type="title">
            Kinder
          </Typography>
        </Grid>
        {/* List Children */}
        <Grid item={true}>
          <List>
            {this.state.children.map((id, index) => (
              <ListItem>
                <ListItemText primary={this.props.getUser(id).get('displayname')} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => this.handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
        {/* Add Children */}
        <Grid item={true} container={true}>
          <Grid item={true} xs={11}>
            <TextField
              select={true}
              label="Kind"
              value={this.state.selected}
              onChange={this.handleSelectChild}
              fullWidth={true}
              SelectProps={{ native: true }}
              helperText="Fügen sie Kinder hinzu."
            >
              {this.props.students.map(student => (
                <option
                  key={student.get('_id')}
                  value={student.get('_id')}
                >
                  {student.get('displayname')}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item={true} xs={1}>
            <Button fab={true} mini={true} onClick={() => this.handleAdd()}>
              <AddIcon />
            </Button>
          </Grid>
          <Grid item={true} xs={12}>
            <Button raised={true} color="primary" onClick={() => this.handleSubmit()}>
              Kinder aktualisieren
              <UpdateIcon />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}));

export default ChildrenUpdate;
