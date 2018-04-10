import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, Action } from "redux";
import { Grid, Button, withStyles } from "material-ui";
import IconButton from "material-ui/IconButton/IconButton";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon
} from "material-ui-icons";
import TextField from "material-ui/TextField/TextField";
import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import ListItemText from "material-ui/List/ListItemText";
import ListItemSecondaryAction from "material-ui/List/ListItemSecondaryAction";
import Typography from "material-ui/Typography/Typography";

import styles from "./styles";
import { WithStyles } from "material-ui/styles/withStyles";
import { IUser, MongoId } from "ente-types";
import {
  User,
  AppState,
  getUser,
  getStudents,
  updateUserRequest
} from "ente-redux";
import lang from "ente-lang";
import * as _ from "lodash";

/**
 * # Helpers
 */
const without = (arr: any[], ind: number) => {
  arr.splice(ind, 1);
  return arr;
};
export const includes = (exclude: User[]) => {
  const excludedIds = exclude.map(u => u.get("_id"));
  return (u: User) => _.includes(excludedIds, u.get("_id"));
};

/**
 * # Component Types
 */
interface OwnProps {
  children: User[];
  students: User[];
  onChange: (children: User[]) => void;
}

type Props = OwnProps & WithStyles;

interface State {
  selected: User;
}

/**
 * # Component
 */
export class ChildrenInput extends React.Component<Props, State> {
  state: State = {
    selected: this.props.students.filter(
      u => !includes(this.props.children)(u)
    )[0]
  };

  componentWillUpdate() {
    if (_.isUndefined(this.state.selected)) {
      const selected = this.props.students.filter(
        u => !includes(this.props.children)(u)
      )[0];
      if (!!selected) {
        this.setState({ selected });
      }
    }
  }

  handleSelectChild = (event: React.ChangeEvent<HTMLInputElement>) =>
    this.setState({
      selected: this.props.students.find(
        s => s.get("_id") === event.target.value
      )
    });
  handleAdd = () =>
    this.props.onChange([...this.props.children, this.state.selected]);

  handleDelete = (index: number) =>
    this.props.onChange(without(this.props.children, index));

  render() {
    const { students, children } = this.props;
    const { selected } = this.state;

    return (
      <Grid container direction="column">
        <Grid item>
          <Typography variant="title">
            {lang().ui.specificUser.childrenTitle}
          </Typography>
        </Grid>
        {/* List Children */}
        <Grid item>
          <List>
            {children.map((user, index) => (
              <ListItem key={index}>
                <ListItemText primary={user.get("displayname")} />
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
              value={selected && selected.get("_id")}
              onChange={this.handleSelectChild}
              fullWidth
              SelectProps={{ native: true }}
              helperText={lang().ui.specificUser.addChildren}
            >
              {students.filter(u => !includes(children)(u)).map(student => (
                <option key={student.get("_id")} value={student.get("_id")}>
                  {student.get("displayname")}
                </option>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={1}>
            <Button
              variant="fab"
              mini
              onClick={this.handleAdd}
              className="add"
              disabled={!selected}
            >
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ChildrenInput);
