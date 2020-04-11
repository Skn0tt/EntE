import { Languages, getByLanguage } from "@@types";
import { SagaListeners } from "./redux";
import { addMessages } from "./context/Messages";
import * as _ from "lodash";

const translation = getByLanguage({
  en: {
    anErrorOccured: "An error occured.",
    successfullyDeletedEntry: (id: string) => `Successfully deleted entry.`,
    successfullyDeletedUser: (id: string) => `Successfully deleted user.`,
    invalidCredentials: "Login failed: Invalid credentials",
    successfullyCreatedEntry: `Successfully created entry.`,
    successfullyCreatedUsers: `Successfully created users.`,
    successfullyUpdatedUser: `Successfully updated users.`,
    importSuccessful: `Import was successful.`,
    subscriptionChanged: (subscribed: boolean) =>
      subscribed
        ? "Successfully subscribed to weekly summary"
        : "Successfully unsubscribed from weekly summary",
  },
  de: {
    anErrorOccured: "Ein Fehler ist aufgetreten.",
    successfullyDeletedEntry: (id: string) => `Eintrag erfolgreich entfernt.`,
    successfullyDeletedUser: (id: string) => `Nutzer*in erfolgreich entfernt.`,
    invalidCredentials: "Anmeldung fehlgeschlagen: Falsche Anmeldedaten",
    successfullyCreatedEntry: `Eintrag wurde erfolgreich erstellt.`,
    successfullyCreatedUsers: `Benutzer*in wurden erfolgreich erstellt.`,
    successfullyUpdatedUser: `Benutzer*in wurde erfolgreich aktualisiert.`,
    importSuccessful: `Der Import wurde erfolgreich durchgeführt.`,
    subscriptionChanged: (subscribed: boolean) =>
      subscribed
        ? "Anmeldung für den wöchentlichen Newsletter erfolgreich."
        : "Abmeldung vom wöchentlichen Newsletter erfolgreich.",
  },
});

export const getSagaListeners = (
  getLanguage: () => Languages
): Partial<SagaListeners> => {
  const t = () => translation(getLanguage());

  return {
    onEntryDeleted: (id) => {
      addMessages(t().successfullyDeletedEntry(id));
    },
    onLoginFailedInvalidCredentials: () => {
      addMessages(t().invalidCredentials);
    },
    onEntryCreated: () => {
      addMessages(t().successfullyCreatedEntry);
    },
    onUserDeleted: (id) => {
      addMessages(t().successfullyDeletedUser(id));
    },
    onImportSuccessful: () => {
      addMessages(t().importSuccessful);
    },
    onRequestError: () => {
      addMessages(t().anErrorOccured);
    },
    onUsersCreated: () => {
      addMessages(t().successfullyCreatedUsers);
    },
    onUserUpdated: ({ subscribedToWeeklySummary }) => {
      if (!_.isUndefined(subscribedToWeeklySummary)) {
        addMessages(t().subscriptionChanged(subscribedToWeeklySummary));
        return;
      }

      addMessages(t().successfullyUpdatedUser);
    },
    onSigningError: () => {
      addMessages(t().anErrorOccured);
    },
    onSagaError: () => {
      addMessages(t().anErrorOccured);
    },
    onUnsigningError: () => {
      addMessages(t().anErrorOccured);
    },
  };
};
