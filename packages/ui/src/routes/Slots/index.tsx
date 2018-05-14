/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, Dispatch, MapStateToPropsParam } from "react-redux";

import SignedAvatar from "../SpecificEntry/elements/SignedAvatar";
import UnsignedAvatar from "../SpecificEntry/elements/UnsignedAvatar";
import { Action } from "redux";
import Table from "../../components/Table";
import {
  getSlotsRequest,
  getUser,
  getSlots,
  AppState,
  User,
  Slot
} from "ente-redux";
import { UserId } from "ente-types";

interface StateProps {
  slots: Slot[];
  getUser(id: UserId): User;
}
const mapStateToProps: MapStateToPropsParam<
  StateProps,
  OwnProps,
  AppState
> = state => ({
  slots: getSlots(state),
  getUser: id => getUser(id)(state)
});

interface DispatchProps {
  requestSlots(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestSlots: () => dispatch(getSlotsRequest())
});

interface OwnProps {}

type Props = StateProps & DispatchProps;

export class Slots extends React.Component<Props> {
  componentDidMount() {
    this.props.requestSlots();
  }

  render() {
    const { getUser, slots } = this.props;

    return (
      <Table
        headers={["Name", "Datum", "Von", "Bis", "Signiert", "Lehrer"]}
        items={slots}
        keyExtractor={(slot: Slot) => slot.get("_id")}
        trueElement={<SignedAvatar />}
        falseElement={<UnsignedAvatar />}
        cellExtractor={(slot: Slot) => [
          getUser(slot.get("student")).get("displayname"),
          slot.get("date").toLocaleDateString(),
          slot.get("hour_from"),
          slot.get("hour_to"),
          slot.get("signed"),
          getUser(slot.get("teacher")).get("displayname")
        ]}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Slots);
