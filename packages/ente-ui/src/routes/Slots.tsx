/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { connect, Dispatch, MapStateToPropsParam } from "react-redux";

import SignedAvatar from "../elements/SignedAvatar";
import { Action } from "redux";
import { Table } from "../components/Table";
import {
  getSlotsRequest,
  getUser,
  getSlots,
  AppState,
  SlotN,
  UserN
} from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";

class SlotsTable extends Table<SlotN> {}

interface SlotsStateProps {
  slots: SlotN[];
  getUser(id: string): UserN;
}
const mapStateToProps: MapStateToPropsParam<
  SlotsStateProps,
  SlotsOwnProps,
  AppState
> = state => ({
  slots: getSlots(state),
  getUser: id => getUser(id)(state)
});

interface SlotsDispatchProps {
  requestSlots(): Action;
}
const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  requestSlots: () => dispatch(getSlotsRequest())
});

interface SlotsOwnProps {}

type SlotsProps = SlotsStateProps & SlotsDispatchProps;

export class Slots extends React.Component<SlotsProps> {
  componentDidMount() {
    this.props.requestSlots();
  }

  render() {
    const { getUser, slots } = this.props;

    return (
      <SlotsTable
        headers={[
          "Name",
          "Datum",
          "Von",
          "Bis",
          {
            name: "Signiert",
            options: {
              customBodyRender: v => <SignedAvatar signed={v === "true"} />
            }
          },
          "Lehrer"
        ]}
        items={slots}
        extractId={user => user.get("id")}
        extract={slot => [
          getUser(slot.get("studentId")).get("displayname"),
          slot.get("date").toLocaleDateString(),
          "" + slot.get("from"),
          "" + slot.get("to"),
          "" + slot.get("signed"),
          slot
            .get("teacherId")
            .cata(() => "Gelöscht", id => getUser(id).get("displayname"))
        ]}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withErrorBoundary()(Slots)
);
