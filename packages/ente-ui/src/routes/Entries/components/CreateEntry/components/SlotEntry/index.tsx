/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, MapStateToPropsParam } from "react-redux";
import { withStyles, Grid, TextField, Button } from "material-ui";

import styles from "./styles";
import { WithStyles } from "material-ui/styles/withStyles";
import Tooltip from "material-ui/Tooltip/Tooltip";
import { ISlotCreate, UserId } from "ente-types";
import { User, getTeachers, getUser, AppState } from "ente-redux";
import { SearchableDropdown } from "../../../../../../components/SearchableDropdown";

interface OwnProps {
  onAdd(slot: ISlotCreate): void;
}

interface StateProps {
  teachers: User[];
  getUser(id: UserId): User;
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
  hour_from: string;
  hour_to: string;
  teacher?: UserId;
}

class SearchableDropdownUser extends SearchableDropdown<User> {}

const SlotEntry = connect(mapStateToProps)(
  withStyles(styles)(
    class extends React.Component<Props, State> {
      state: State = {
        hour_from: "1",
        hour_to: "2"
      };

      /**
       * Handlers
       */

      handleChangeFrom = (event: React.ChangeEvent<HTMLInputElement>) =>
        (event.target.value === "" ||
          (Number(event.target.value) > 0 &&
            Number(event.target.value) < 12)) &&
        this.setState({
          hour_from: event.target.value
        });

      handleChangeTo = (event: React.ChangeEvent<HTMLInputElement>) =>
        (event.target.value === "" ||
          (Number(event.target.value) > 0 &&
            Number(event.target.value) < 12)) &&
        this.setState({
          hour_to: event.target.value
        });

      handleChangeTeacher = (teacher: User) =>
        this.setState({ teacher: teacher.get("_id") });

      /**
       * ## Form Validation Logic
       */
      /**
       * ### Slot
       */
      fromValid = (): boolean => {
        const { hour_from } = this.state;
        const nmbFrom = parseInt(hour_from, 10);

        return !isNaN(nmbFrom) && nmbFrom > 0 && nmbFrom < 12;
      };

      toValid = (): boolean => {
        const { hour_from, hour_to } = this.state;
        const nmbTo = parseInt(hour_to, 10);
        const nmbFrom = parseInt(hour_from, 10);

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
          hour_from: Number(this.state.hour_from),
          hour_to: Number(this.state.hour_to),
          teacher: this.state.teacher
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
                value={this.state.hour_from}
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
                value={this.state.hour_to}
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
  )
);

export default SlotEntry;
