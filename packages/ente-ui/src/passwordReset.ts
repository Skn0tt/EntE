import { apiBaseUrl } from "./";
import Axios from "axios";
import { ByLanguage } from "ente-types";

export async function invokeReset(
  username: string,
  addMessage: (msg: ByLanguage<string>) => void
) {
  await Axios.post(`${apiBaseUrl}/passwordReset/${username}`);

  addMessage({
    de:
      "Passwort-Zurücksetzung erfolgreich beantragt. Sie erhalten in Kürze eine Email.",
    en:
      "Successfully requested password reset. You will receive an email shortly."
  });
}

export async function setPassword(
  newPassword: string,
  token: string,
  addMessage: (msg: ByLanguage<string>) => void
) {
  try {
    await Axios.put(`${apiBaseUrl}/passwordReset/${token}`, newPassword, {
      headers: {
        "Content-Type": "text/plain"
      }
    });

    addMessage({
      de: "Das Passwort wurde erfolgreich gesetzt.",
      en: "Password was changed successfully."
    });

    return true;
  } catch (e) {
    addMessage({
      de: "Dieser Zurücksetzungs-Link ist abgelaufen.",
      en: "This reset-link expired."
    });

    return false;
  }
}
