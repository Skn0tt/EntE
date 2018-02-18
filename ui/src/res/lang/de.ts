import { Translation } from '.';

const de: Translation = {
  message: {
    sign: {
      error: 'Unterschrift fehlgeschlagen.',
    },
    request: {
      error: 'Anfrage fehlgeschlagen.',
    },
    setPassword: {
      success: 'Passwort Erfolgreich zurückgesetzt.',
      error: 'Passwort konnte nicht zurückgesetzt werden.',
    },
    resetPassword: {
      success: 'Sie erhalten in kürze eine Email.',
    },
  },
  ui: {
    common: {
      close: 'Schließen',
    },
    table: {
      search: 'Suchen',
      sortTooltip: field => `Nach ${field} sortieren`,
    },
    specificUser: {
      id: 'ID',
      email: 'Email',
      role: 'Rolle',
      addChildren: 'Kinder Hinzufügen',
      adult: 'Erwachsen',
      notAdult: 'Nicht Erwachsen',
      child: 'Kind',
      childrenTitle: 'Kinder',
      displaynameTitle: 'Displayname',
      emailTitle: 'Email',
      refresh: 'Aktualisieren',
      refreshChildren: 'Kinder Aktualisieren',
      refreshDisplayname: 'Displayname Aktualisieren',
      refreshEmail: 'Email Aktualisieren',
      adultTitle: 'Erwachsen',
    },
    specificEntry: {
      sign: 'Unterschreiben',
    },
  },
};

export default de;
