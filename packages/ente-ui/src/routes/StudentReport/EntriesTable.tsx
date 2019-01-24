import * as React from "react";
import {
  EntryN,
  UserN,
  AppState,
  getUser,
  getSlotsById,
  SlotN
} from "../../redux";
import { Maybe } from "monet";
import { MapStateToPropsParam, connect } from "react-redux";
import Table from "../../components/Table";
import { Route } from "react-router";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import SignedAvatar from "../../elements/SignedAvatar";
import { format } from "date-fns";
import * as deLocale from "date-fns/locale/de";
import * as enLocale from "date-fns/locale/en-GB";
import { hoursOfSlot, getLengthOfSlot } from "../../reporting/reporting";
import * as _ from "lodash";

const useTranslation = makeTranslationHook({
  en: {
    date: "Date",
    educational: "Educational",
    signed: "Signed",
    yes: "Yes",
    no: "No",
    signedParent: "Signed by parent",
    signedManager: "Signed by manager",
    locale: enLocale,
    length: "Length",
    lengthF: (n: number) => n + " hours"
  },
  de: {
    date: "Datum",
    educational: "Schulisch",
    signed: "Signed",
    yes: "Ja",
    no: "Nein",
    signedParent: "Von Eltern unterschrieben",
    signedManager: "Von Stufenleiter unterschrieben",
    locale: deLocale,
    length: "Dauer",
    lengthF: (n: number) => n + " Stunden"
  }
});

interface EntriesTableOwnProps {
  entries: EntryN[];
}

interface EntriesTableStateProps {
  getUser: (id: string) => Maybe<UserN>;
  getSlots: (id: string[]) => SlotN[];
}
const mapStateToProps: MapStateToPropsParam<
  EntriesTableStateProps,
  EntriesTableOwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state),
  getSlots: ids => getSlotsById(ids)(state)
});

const customBodyRender = (v: string) => <SignedAvatar signed={v === "true"} />;

type EntriesTableProps = EntriesTableOwnProps & EntriesTableStateProps;

const EntriesTable: React.FC<EntriesTableProps> = props => {
  const translation = useTranslation();
  const { entries, getSlots } = props;
  return (
    <Route
      render={f => (
        <Table<EntryN>
          items={entries}
          headers={[
            translation.date,
            translation.educational,
            translation.length,
            {
              name: translation.signedManager,
              options: { customBodyRender }
            },
            {
              name: translation.signedParent,
              options: { customBodyRender }
            }
          ]}
          extract={e => [
            format(e.get("date"), "PP", { locale: translation.locale }),
            e.get("forSchool") ? translation.yes : translation.no,
            translation.lengthF(
              _.sum(getSlots(e.get("slotIds")).map(getLengthOfSlot))
            ),
            e.get("signedManager") ? "true" : "false",
            e.get("signedParent") ? "true" : "false"
          ]}
          extractId={e => e.get("id")}
          onClick={e => {
            f.history.push(`/entries/${e}`);
          }}
        />
      )}
    />
  );
};

export default connect(mapStateToProps)(EntriesTable);
