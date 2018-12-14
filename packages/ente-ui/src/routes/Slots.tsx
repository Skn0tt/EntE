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
import { createTranslation } from "../helpers/createTranslation";
import { Maybe } from "monet";

const lang = createTranslation({
  en: {
    headers: {
      name: "Name",
      date: "Date",
      from: "From",
      to: "To",
      signed: "Signed",
      teacher: "Teacher"
    },
    deleted: "Deleted",
    yes: "Yes",
    no: "No"
  },
  de: {
    headers: {
      name: "Name",
      date: "Datum",
      from: "Von",
      to: "Bis",
      signed: "Unterschrieben",
      teacher: "Lehrer"
    },
    deleted: "Gelöscht",
    yes: "Ja",
    no: "Nein"
  }
});

class SlotsTable extends Table<SlotN> {}

interface SlotsStateProps {
  slots: SlotN[];
  getUser(id: string): Maybe<UserN>;
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
          lang.headers.name,
          lang.headers.date,
          lang.headers.from,
          lang.headers.to,
          {
            name: lang.headers.signed,
            options: {
              customBodyRender: v => <SignedAvatar signed={v === lang.yes} />
            }
          },
          lang.headers.teacher
        ]}
        items={slots}
        extractId={user => user.get("id")}
        extract={slot => [
          getUser(slot.get("studentId"))
            .some()
            .get("displayname"),
          slot.get("date").toLocaleDateString(),
          "" + slot.get("from"),
          "" + slot.get("to"),
          slot.get("signed") ? lang.yes : lang.no,
          Maybe.fromNull(slot.get("teacherId")).cata(
            () => lang.deleted,
            id =>
              getUser(id)
                .some()
                .get("displayname")
          )
        ]}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(
  withErrorBoundary()(Slots)
);
