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
import { format, parseISO } from "date-fns";
import * as deLocale from "date-fns/locale/de";
import * as enLocale from "date-fns/locale/en-GB";
import { Reporting } from "../../reporting/reporting";
import * as _ from "lodash";
import { EntryReasonCategoriesTranslation } from "../../entryReasonCategories.translation";
import { EntryReasonCategory } from "@@types";

const useTranslation = makeTranslationHook({
  en: {
    date: "Date",
    signed: "Signed",
    yes: "Yes",
    no: "No",
    reason: "Reason",
    signedParent: "Signed by parent",
    categories: EntryReasonCategoriesTranslation.en,
    signedManager: "Signed by manager",
    locale: enLocale,
    length: "Length",
    lengthF: (n: number) => n + " hours"
  },
  de: {
    categories: EntryReasonCategoriesTranslation.de,
    date: "Datum",
    reason: "Grund",
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

const customBodyRender = (v: "true" | "false") => (
  <SignedAvatar signed={v === "true"} />
);

type EntriesTableProps = EntriesTableOwnProps & EntriesTableStateProps;

const EntriesTable: React.FC<EntriesTableProps> = props => {
  const translation = useTranslation();
  const { entries, getSlots } = props;
  return (
    <Route
      render={f => (
        <Table<EntryN>
          items={entries}
          columns={[
            {
              name: translation.date,
              extract: entry => entry.get("date"),
              options: {
                filter: false,
                customBodyRender: (isoTime: string) =>
                  format(parseISO(isoTime), "PP", {
                    locale: translation.locale
                  })
              }
            },
            {
              name: translation.reason,
              extract: e => e.get("reason").category,
              options: {
                filter: true,
                customBodyRender: (category: EntryReasonCategory) =>
                  translation.categories[category]
              }
            },
            {
              name: translation.length,
              extract: entry =>
                _.sum(
                  getSlots(entry.get("slotIds")).map(Reporting.getLengthOfSlot)
                ),
              options: {
                filter: false,
                customBodyRender: length => translation.lengthF(length)
              }
            },
            {
              name: translation.signedManager,
              extract: e => "" + e.get("signedManager"),
              options: { customBodyRender, filter: true }
            },
            {
              name: translation.signedParent,
              extract: e => "" + e.get("signedParent"),
              options: { customBodyRender, filter: true }
            }
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
