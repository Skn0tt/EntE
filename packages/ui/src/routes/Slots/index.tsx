import * as React from "react";
import { connect, Dispatch } from "react-redux";

import SignedAvatar from "../SpecificEntry/elements/SignedAvatar";
import UnsignedAvatar from "../SpecificEntry/elements/UnsignedAvatar";
import { Action } from "redux";
import Table from "../../components/Table";
import { MongoId } from "ente-types";
import {
  getSlotsRequest,
  getUser,
  getSlots,
  AppState,
  User,
  Slot
} from "ente-redux";

interface StateProps {
  slots: Slot[];
  getUser(id: MongoId): User;
}
const mapStateToProps = (state: AppState) => ({
  slots: getSlots(state),
  getUser: (id: MongoId) => getUser(id)(state)
});

interface DispatchProps {
  requestSlots(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestSlots: () => dispatch(getSlotsRequest())
});

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
