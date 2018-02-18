import * as React from 'react';
import { connect } from 'react-redux';
import { AppState, User, MongoId, IUser } from '../../../../interfaces/index';
import { Dispatch, Action } from 'redux';
import { Grid, Button, withStyles } from 'material-ui';
import * as select from '../../../../redux/selectors';
import IconButton from 'material-ui/IconButton/IconButton';
import { Add as AddIcon, Delete as DeleteIcon, Update as UpdateIcon } from 'material-ui-icons';
import TextField from 'material-ui/TextField/TextField';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import ListItemSecondaryAction from 'material-ui/List/ListItemSecondaryAction';
import { updateUserRequest } from '../../../../redux/actions';
import Typography from 'material-ui/Typography/Typography';

import styles from './styles';
import { WithStyles } from 'material-ui/styles/withStyles';
import lang from '../../../../res/lang';

interface OwnProps {
  userId: MongoId;
}

interface StateProps {
  students: User[];
  getUser(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => select.getUser(id)(state),
  students: select.getStudents(state),
});

interface DispatchProps {
  updateUser(user: Partial<IUser>): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  updateUser: (user: Partial<IUser>) => dispatch(updateUserRequest(user)),
});

type Props = StateProps & DispatchProps & OwnProps & WithStyles;

interface State {
  children: MongoId[];
  selected: MongoId;
}

const ChildrenUpdate = connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(
    class extends React.Component<Props, State> {
      state: State = {
        selected: this.props.students.length > 0 ? this.props.students[0].get('_id') : '',
        children:
          this.props.getUser(this.props.userId) &&
          this.props.getUser(this.props.userId).get('children'),
      };

      handleSubmit = () =>
        this.props.updateUser({
          _id: this.props.userId,
          children: this.state.children,
        });

      handleSelectChild = (event: React.ChangeEvent<HTMLInputElement>) =>
        this.setState({ selected: event.target.value });
      handleAdd = () => this.setState({ children: [...this.state.children, this.state.selected] });
      handleDelete = (index: number) =>
        this.setState({ children: this.state.children.splice(index, index) });

      render() {
        return (
          <Grid container direction="column">
            <Grid item>
              <Typography variant="title">{lang().ui.specificUser.childrenTitle}</Typography>
            </Grid>
            {/* List Children */}
            <Grid item>
              <List>
                {this.state.children &&
                  this.state.children.map((id, index) => (
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
            <Grid item container>
              <Grid item xs={11}>
                <TextField
                  select
                  label={lang().ui.specificUser.child}
                  value={this.state.selected}
                  onChange={this.handleSelectChild}
                  fullWidth
                  SelectProps={{ native: true }}
                  helperText={lang().ui.specificUser.addChildren}
                >
                  {this.props.students.map(student => (
                    <option key={student.get('_id')} value={student.get('_id')}>
                      {student.get('displayname')}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={1}>
                <Button variant="fab" mini onClick={() => this.handleAdd()}>
                  <AddIcon />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="raised" color="primary" onClick={() => this.handleSubmit()}>
                  {lang().ui.specificUser.refreshChildren}
                  <UpdateIcon />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      }
    },
  ),
);

export default ChildrenUpdate;
