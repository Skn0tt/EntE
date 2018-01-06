import * as React from 'react';
import withStyles, { WithStyles } from 'material-ui/styles/withStyles';
import { connect, Dispatch } from 'react-redux';
import styles from './styles';

import * as select from '../../redux/selectors';
import { AppState, User, Roles, IUserCreate, MongoId } from '../../interfaces/index';

import { withRouter, RouteComponentProps } from 'react-router';
import {
  Dialog,
  Button,
  Grid,
  TextField,
  IconButton,
} from 'material-ui';
import DialogTitle from 'material-ui/Dialog/DialogTitle';
import DialogContent from 'material-ui/Dialog/DialogContent';
import DialogActions from 'material-ui/Dialog/DialogActions';
import withMobileDialog from 'material-ui/Dialog/withMobileDialog';
import { Action } from 'redux';
import { createUserRequest } from '../../redux/actions';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemText from 'material-ui/List/ListItemText';
import ListItemSecondaryAction from 'material-ui/List/ListItemSecondaryAction';
import { Delete as DeleteIcon, Add as AddIcon } from 'material-ui-icons';
import validateEmail from '../../services/validateEmail';

interface IProps {
  students: User[];
  getUser(id: MongoId): User;
  createUser(user: IUserCreate): Action;
}

interface InjectedProps {
  fullScreen: boolean;
}

interface State extends IUserCreate {
  selectedChild: MongoId;
}

const mapStateToProps = (state: AppState) => ({
  getUser: (id: MongoId) => select.getUser(id)(state),
  students: select.getStudents(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  createUser: (user: IUserCreate) => dispatch(createUserRequest(user)),
});

type Props = IProps & RouteComponentProps<{}> & WithStyles<string> & InjectedProps;

const CreateUser = connect(mapStateToProps, mapDispatchToProps)(
  withMobileDialog<IProps>()(withRouter(withStyles(styles)(
class extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    const selectedChild = this.props.students.length > 0 ? 
      this.props.students[0].get('_id') :
        '';

    this.state = {
      selectedChild,
      children: [],
      displayname: '',
      email: '',
      password: '',
      role: Roles.STUDENT,
      username: '',
    };
  }

  /**
   * ## Action Handlers
   */
  handleGoBack = () => this.props.history.push('/');
  
  handleClose = () => this.handleGoBack();

  handleSubmit = () => {
    return this.props.createUser({
      children: this.isParent() ? this.state.children : [],
      displayname: this.state.displayname,
      email: this.state.email,
      password: this.state.password,
      role: this.state.role,
      username: this.state.username,
    });
  }

  handleKeyPress: React.KeyboardEventHandler<{}> = (event) => {
    if (event.key === 'Enter' && this.inputValid()) {
      this.handleSubmit();
    }
  }

  /**
   * ## Input Handlers
   */
  handleChangeUsername = (event: React.ChangeEvent<HTMLInputElement>) => 
    this.setState({ username: event.target.value })
  handleChangeDisplayname = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ displayname: event.target.value })
  handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ password: event.target.value })
  handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ email: event.target.value })
  handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ role: event.target.value as Roles })
  handleSelectChild = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({ selectedChild: event.target.value })
  handleAddChild = () =>
    this.setState({ children: [...this.state.children, this.state.selectedChild] })
  handleRemoveChildren = (index: number) =>
    this.setState({ children: this.state.children.slice(index, index) })
  
  isParent = (): boolean => this.state.role === Roles.PARENT;

  /**
   * ## Validation
   */
  usernameValid = (): boolean => (
    !!this.state.username
  )
  displaynameValid = (): boolean => (
    !!this.state.displayname
  )
  emailValid = (): boolean => (
    !!this.state.email &&
    validateEmail(this.state.email)
  )
  childrenValid = (): boolean => (
    !this.isParent() ||
    this.state.children.length > 0
  )
  inputValid = (): boolean => (
    this.usernameValid() &&
    this.childrenValid() &&
    this.displaynameValid() &&
    this.emailValid()
  )

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        fullScreen={this.props.fullScreen}
        onClose={this.handleGoBack}
        open={true}
      >
        <DialogTitle>Neuer Nutzer</DialogTitle>
        <DialogContent>
          <form className={classes.container} onKeyPress={this.handleKeyPress} >
            <Grid container={true} direction="column">
              <Grid container={true} xs={12} direction="row">
                <Grid item={true} xs={12} lg={6}>
                  <TextField
                    fullWidth={true}
                    error={!this.usernameValid()}
                    id="username"
                    label="Username"
                    value={this.state.username}
                    onChange={this.handleChangeUsername}
                    margin="normal"
                  />
                </Grid>
                <Grid item={true} xs={12} lg={6}>
                  <TextField
                    error={!this.displaynameValid()}
                    fullWidth={true}
                    id="displayname"
                    label="Displayname"
                    value={this.state.displayname}
                    onChange={this.handleChangeDisplayname}
                    margin="normal"
                  />
                </Grid>
                <Grid item={true} xs={12} lg={6}>
                  <TextField
                    fullWidth={true}
                    error={!this.emailValid()}
                    id="email"
                    label="Email"
                    type="email"
                    value={this.state.email}
                    onChange={this.handleChangeEmail}
                    margin="normal"
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <TextField
                    fullWidth={true}
                    id="password"
                    label="Passwort"
                    type="password"
                    value={this.state.password}
                    onChange={this.handleChangePassword}
                    margin="normal"
                  />
                </Grid>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  select={true}
                  label="Rolle"
                  value={this.state.role}
                  onChange={this.handleChangeRole}
                  fullWidth={true}
                  SelectProps={{ native: true }}
                  helperText="Wählen sie die Rolle des Nutzers aus."
                >
                  {Object.keys(Roles).map(role => (
                    <option
                      key={Roles[role]}
                      value={Roles[role]}
                    >
                      {Roles[role]}
                    </option>
                  ))}
                </TextField>
              </Grid>
              {this.isParent() && (
                <Grid item container={true} direction="column">
                  <Grid item={true}>
                    <List>
                      {this.state.children.map((child, index) => (
                        <ListItem>
                          <ListItemText primary={this.props.getUser(child).get('displayname')}/>
                          <ListItemSecondaryAction>
                            <IconButton
                              aria-label="Delete"
                              onClick={() => this.handleRemoveChildren(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid container={true} direction="row">
                    <Grid item={true} xs={10}>
                      <TextField
                        select={true}
                        label="Kind"
                        value={this.state.selectedChild}
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
                      <IconButton onClick={() => this.handleAddChild()}>
                        <AddIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </form>
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

export default CreateUser;
