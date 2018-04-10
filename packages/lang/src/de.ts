import { Translation } from ".";

const de: Translation = {
  app: {
    name: "EntE"
  },
  message: {
    sign: {
      error: "Unterschrift fehlgeschlagen."
    },
    request: {
      error: "Anfrage fehlgeschlagen."
    },
    setPassword: {
      success: "Passwort Erfolgreich zurückgesetzt.",
      error: "Passwort konnte nicht zurückgesetzt werden."
    },
    resetPassword: {
      success: "Sie erhalten in kürze eine Email."
    }
  },
  ui: {
    common: {
      close: "Schließen",
      submit: "OK"
    },
    table: {
      search: "Suchen",
      sortTooltip: field => `Nach ${field} sortieren`
    },
    specificUser: {
      id: "ID",
      email: "Email",
      role: "Rolle",
      addChildren: "Kinder Hinzufügen",
      adult: "Erwachsen",
      notAdult: "Nicht Erwachsen",
      child: "Kind",
      childrenTitle: "Kinder",
      displaynameTitle: "Displayname",
      emailTitle: "Email",
      refresh: "Aktualisieren",
      refreshChildren: "Kinder Aktualisieren",
      refreshDisplayname: "Displayname Aktualisieren",
      refreshEmail: "Email Aktualisieren",
      adultTitle: "Erwachsen"
    },
    specificEntry: {
      sign: "Unterschreiben",
      unsign: "Signatur Zurücknehmen"
    },
    createUser: {
      import: "Importieren",
      displaynameTitle: "Displayname",
      emailTitle: "Email",
      passwordTitle: "Passwort",
      usernameTitle: "Nutzername"
    },
    importUsers: {
      dropzone: "Legen sie hier eine .csv-Datei ab."
    }
  }
};

export default de;
