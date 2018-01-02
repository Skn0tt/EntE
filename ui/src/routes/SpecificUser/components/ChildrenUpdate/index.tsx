import * as React from 'react';
import { connect } from 'react-redux';
import { AppState, User, MongoId, IUser } from '../../../../interfaces/index';
import { Dispatch, Action } from 'redux';
import { Grid } from 'material-ui';
import * as select from '../../../../redux/selectors';
import IconButton from 'material-ui/IconButton/IconButton';
import { Add as AddIcon, Delete as DeleteIcon } from 'material-ui-icons';
import TextField from 'material-ui/TextField/TextField';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import ListItemSecondaryAction from 'material-ui/List/ListItemSecondaryAction';
import { updateUserRequest } from '../../../../redux/actions';

interface InjectedProps {
  students: User[];
  getUser(id: MongoId): User;
  updateUser(user: Partial<IUser>): Action;
}
interface IProps {
  user: User;
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
type Props = IProps & InjectedProps;
const ChildrenUpdate = connect(mapStateToProps, mapDispatchToProps)(
class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const selected = this.props.students.length > 0 ?
      this.props.students[0].get('_id') : '';
  
    this.state = {
      selected,
      children: this.props.user.get('children'),
    };
  }

  handleSubmit = () => this.props.updateUser({
    _id: this.props.user.get('_id'),
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
        <Grid container={true}>
          <Grid item={true} xs={10}>
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
          <Grid item={true} xs={2}>
            <IconButton onClick={() => this.handleSubmit()}>
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    );
  }
});

export default ChildrenUpdate;
