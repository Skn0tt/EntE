/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Grid, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton/IconButton";
import { Add as AddIcon, Delete as DeleteIcon } from "@material-ui/icons";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography/Typography";
import * as _ from "lodash";
import { SearchableDropdown } from "../components/SearchableDropdown";
import { UserN } from "../redux";
import { createTranslation } from "../helpers/createTranslation";
import { Maybe } from "monet";

const lang = createTranslation({
  en: {
    title: "Children",
    addChildren: "Add children",
    child: "Child"
  },
  de: {
    title: "Kinder",
    addChildren: "Kinder hinzufügen",
    child: "Kind"
  }
});

/**
 * # Helpers
 */
const without = (arr: any[], ind: number) => {
  arr.splice(ind, 1);
  return arr;
};
export const includes = (exclude: UserN[]) => {
  const excludedIds = exclude.map(u => u.get("id"));
  return (u: UserN) => _.includes(excludedIds, u.get("id"));
};

/**
 * # Component Types
 */
interface ChildrenInputOwnProps {
  children: UserN[];
  students: UserN[];
  onChange: (children: UserN[]) => void;
}

type ChildrenInputProps = ChildrenInputOwnProps;

interface State {
  selected: UserN | null;
}

class SearchableDropdownUser extends SearchableDropdown<UserN> {}

/**
 * # Component
 */
export class ChildrenInput extends React.Component<ChildrenInputProps, State> {
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

  handleSelectChild = (u: Maybe<UserN>) =>
    this.setState({
      selected: u.orSome(null)
    });

  handleAdd = () =>
    this.props.onChange([
      ...(this.props.children as UserN[]),
      this.state.selected
    ]);

  handleDelete = (index: number) =>
    this.props.onChange(without(this.props.children, index));

  render() {
    const { students, children } = this.props;
    const { selected } = this.state;

    return (
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h6">{lang.title}</Typography>
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
            <SearchableDropdownUser
              items={students.filter(u => !includes(children)(u))}
              onChange={this.handleSelectChild}
              itemToString={i => i.get("displayname")}
              includeItem={(u, searchTerm) =>
                u
                  .get("displayname")
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              }
              helperText={lang.addChildren}
              label={lang.child}
            />
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

export default ChildrenInput;
