/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam
} from "react-redux";

import SignedAvatar from "../elements/SignedAvatar";
import { Action } from "redux";
import { Table } from "../components/Table";
import {
  getSlotsRequest,
  getUser,
  getSlots,
  AppState,
  SlotN,
  UserN,
  getTimeScope
} from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import { Maybe } from "monet";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { format, parseISO } from "date-fns";
import * as enLocale from "date-fns/locale/en-GB";
import * as deLocale from "date-fns/locale/de";
import { getTimeScopeValidator, TimeScope } from "../time-scope";

const useTranslation = makeTranslationHook({
  en: {
    headers: {
      name: "Name",
      date: "Date",
      from: "From",
      to: "To",
      forSchool: "For School",
      signed: "Signed",
      teacher: "Teacher"
    },
    deleted: "Deleted",
    yes: "Yes",
    no: "No",
    locale: enLocale
  },
  de: {
    headers: {
      name: "Name",
      date: "Datum",
      from: "Von",
      to: "Bis",
      forSchool: "Schulisch",
      signed: "Unterschrieben",
      teacher: "Lehrer"
    },
    deleted: "Gelöscht",
    yes: "Ja",
    no: "Nein",
    locale: deLocale
  }
});

class SlotsTable extends Table<SlotN> {}

interface SlotsStateProps {
  slots: SlotN[];
  getUser(id: string): Maybe<UserN>;
  timeScope: TimeScope;
}
const mapStateToProps: MapStateToPropsParam<
  SlotsStateProps,
  SlotsOwnProps,
  AppState
> = state => ({
  slots: getSlots(state),
  getUser: id => getUser(id)(state),
  timeScope: getTimeScope(state)
});

interface SlotsDispatchProps {
  requestSlots(): Action;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SlotsDispatchProps,
  SlotsOwnProps
> = dispatch => ({
  requestSlots: () => dispatch(getSlotsRequest())
});

interface SlotsOwnProps {}

type SlotsProps = SlotsStateProps & SlotsDispatchProps;

const Slots: React.FunctionComponent<SlotsProps> = props => {
  const lang = useTranslation();
  const { getUser, slots, requestSlots, timeScope } = props;

  const slotsInScope = React.useMemo(
    () => {
      const validator = getTimeScopeValidator(timeScope);
      return slots.filter(s => validator(parseISO(s.get("date"))));
    },
    [slots, timeScope]
  );

  React.useEffect(() => {
    requestSlots();
  }, []);

  return (
    <SlotsTable
      headers={[
        lang.headers.name,
        lang.headers.date,
        lang.headers.from,
        lang.headers.to,
        lang.headers.forSchool,
        {
          name: lang.headers.signed,
          options: {
            customBodyRender: v => <SignedAvatar signed={v === lang.yes} />
          }
        },
        lang.headers.teacher
      ]}
      items={slotsInScope}
      extractId={user => user.get("id")}
      extract={slot => [
        getUser(slot.get("studentId"))
          .some()
          .get("displayname"),
        format(parseISO(slot.get("date")), "PP", { locale: lang.locale }),
        "" + slot.get("from"),
        "" + slot.get("to"),
        slot.get("forSchool") ? lang.yes : lang.no,
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorBoundary()(Slots));
