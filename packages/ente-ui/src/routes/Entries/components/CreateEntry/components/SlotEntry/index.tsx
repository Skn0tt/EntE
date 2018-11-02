/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, MapStateToPropsParam } from "react-redux";
import { withStyles, Grid, TextField, Button } from "@material-ui/core";

import styles from "./styles";
import { WithStyles } from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import { getTeachers, getUser, AppState, UserN } from "ente-redux";
import { SearchableDropdown } from "../../../../../../components/SearchableDropdown";
import { CreateSlotDto } from "ente-types";

interface OwnProps {
  onAdd(slot: CreateSlotDto): void;
}

interface StateProps {
  teachers: UserN[];
  getUser(id: string): UserN;
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  OwnProps,
  AppState
> = state => ({
  teachers: getTeachers(state),
  getUser: id => getUser(id)(state)
});

type Props = StateProps & OwnProps & WithStyles;

interface State {
  from: string;
  to: string;
  teacher?: string;
}

class SearchableDropdownUser extends SearchableDropdown<UserN> {}

class SlotEntry extends React.Component<Props, State> {
  state: State = {
    from: "1",
    to: "2"
  };

  /**
   * Handlers
   */

  handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) =>
    (event.target.value === "" ||
      (Number(event.target.value) > 0 && Number(event.target.value) < 12)) &&
    this.setState({
      from: event.target.value
    });

  handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) =>
    (event.target.value === "" ||
      (Number(event.target.value) > 0 && Number(event.target.value) < 12)) &&
    this.setState({
      to: event.target.value
    });

  handleChangeTeacher = (teacher: UserN) =>
    this.setState({ teacher: teacher.get("id") });

  /**
   * ## Form Validation Logic
   */
  /**
   * ### Slot
   */
  fromValid = (): boolean => {
    const { from } = this.state;
    const nmbFrom = parseInt(from, 10);

    return !isNaN(nmbFrom) && nmbFrom > 0 && nmbFrom < 12;
  };

  toValid = (): boolean => {
    const { from, to } = this.state;
    const nmbTo = parseInt(to, 10);
    const nmbFrom = parseInt(from, 10);

    return !isNaN(nmbTo) && nmbTo >= nmbFrom && nmbTo > 0 && nmbTo < 12;
  };

  teacherValid = (): boolean => {
    const { teacher } = this.state;
    return !!teacher;
  };

  slotInputValid = () =>
    this.fromValid() && this.toValid() && this.teacherValid();

  handleAddSlot = () =>
    this.props.onAdd({
      from: Number(this.state.from),
      to: Number(this.state.to),
      teacherId: this.state.teacher
    });

  render() {
    const { teachers } = this.props;
    return (
      <Grid container direction="row">
        {/* Teacher */}
        <Grid item xs={12} md={3}>
          <SearchableDropdownUser
            label="Lehrer"
            helperText="Wählen sie den Lehrer aus."
            items={teachers}
            onChange={this.handleChangeTeacher}
            includeItem={(item, searchTerm) =>
              item
                .get("displayname")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            }
            itemToString={i => i.get("displayname")}
          />
        </Grid>

        {/* From */}
        <Grid item xs={3}>
          <TextField
            label="Von"
            fullWidth
            value={this.state.from}
            onChange={this.handleChangeFrom}
            type="number"
            error={!this.fromValid()}
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        {/* To */}
        <Grid item xs={3}>
          <TextField
            label="Bis"
            fullWidth
            value={this.state.to}
            onChange={this.handleChangeTo}
            error={!this.toValid()}
            type="number"
            InputLabelProps={{
              shrink: true
            }}
          />
        </Grid>

        {/* Add */}
        <Grid item xs={3}>
          <Tooltip title="Hinzufügen">
            <Button
              variant="raised"
              disabled={!this.slotInputValid()}
              onClick={() => this.handleAddSlot()}
            >
              Hinzufügen
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(connect(mapStateToProps)(SlotEntry));
