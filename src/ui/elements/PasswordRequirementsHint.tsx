import * as React from "react";

const en: React.SFC = () => {
  return (
    <>
      <p>Requirements:</p>
      <ul>
        <li>8 to 100 characters</li>
        <li>at least 1 number</li>
        <li>{`at least 1 special character ([!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?])`}</li>
      </ul>
    </>
  );
};

const de: React.SFC = () => {
  return (
    <>
      Vorraussetzungen:
      <ul>
        <li>8 bis 100 Zeichen</li>
        <li>Mindestens 1 Zahl</li>
        <li>{`Mindestens 1 Sonderzeichen ([!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?])`}</li>
      </ul>
    </>
  );
};
export const PasswordRequirementsHint = {
  en,
  de,
};
