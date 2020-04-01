import * as React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { None, Some, Maybe } from "monet";
import { Route } from "react-router";
import { History } from "history";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import {
  Languages,
  DEFAULT_DEFAULT_LANGUAGE,
  Roles,
  TEACHING_ROLES
} from "ente-types";
import {
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  connect
} from "react-redux";
import {
  AppState,
  getLanguage,
  setLanguage,
  getColorScheme,
  setColorScheme,
  getUsername,
  getRole,
  isSubscribedToWeeklySummary,
  updateUserRequest,
  getOneSelf
} from "../redux";
import { LanguagePicker } from "./LanguagePicker";
import Axios from "axios";
import { apiBaseUrl } from "../";
import { invokeReset } from "../passwordReset";
import { useMessages } from "../context/Messages";

const useTranslation = makeTranslationHook({
  en: {
    about: "About",
    language: "Language",
    weeklySummarySubscription: "Weekly summary mail",
    darkMode: "Dark Mode",
    resetPassword: "Reset / Change Password"
  },
  de: {
    about: "Über",
    language: "Sprache",
    weeklySummarySubscription: "Wöchentliche Zusammenfassungs-Mail",
    darkMode: "Dark Mode",
    resetPassword: "Passwort ändern / zurücksetzen"
  }
});

interface SettingsMenuOwnProps {}

interface SettingsMenuStateProps {
  language: Languages;
  isDarkModeEnabled: boolean;
  username: string;
  role: Maybe<Roles>;
  ownId: string;
  isSubscribedToWeeklySummary: boolean;
}
const mapStateToProps: MapStateToPropsParam<
  SettingsMenuStateProps,
  SettingsMenuOwnProps,
  AppState
> = state => ({
  language: getLanguage(state).orSome(DEFAULT_DEFAULT_LANGUAGE),
  role: getRole(state),
  ownId: getOneSelf(state)
    .map(u => u.get("id"))
    .orSome(""),
  isSubscribedToWeeklySummary: isSubscribedToWeeklySummary(state).orSome(true),
  isDarkModeEnabled: getColorScheme(state) === "dark",
  username: getUsername(state).orSome("default_username")
});

interface SettingsMenuDispatchProps {
  setLanguage: (lang: Languages) => void;
  setDarkMode: (on: boolean) => void;
  setWeeklySummary(v: boolean, id: string): void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SettingsMenuDispatchProps,
  SettingsMenuOwnProps
> = dispatch => ({
  setLanguage: lang => dispatch(setLanguage(lang)),
  setDarkMode: on => dispatch(setColorScheme(on ? "dark" : "light")),
  setWeeklySummary: (v, id) =>
    dispatch(updateUserRequest([id, { subscribedToWeeklySummary: v }]))
});

type SettingsMenuProps = SettingsMenuOwnProps &
  SettingsMenuDispatchProps &
  SettingsMenuStateProps;

export const SettingsMenu: React.SFC<SettingsMenuProps> = React.memo(props => {
  const {
    language,
    setLanguage,
    isDarkModeEnabled,
    setDarkMode,
    username,
    isSubscribedToWeeklySummary,
    role,
    ownId,
    setWeeklySummary
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<Maybe<HTMLElement>>(None());
  const [languagePickerIsOpen, setLanguagePickerIsOpen] = React.useState<
    boolean
  >(false);
  const open = anchorEl.isSome();
  const translation = useTranslation();
  const { addMessages } = useMessages();

  const openMenu: React.MouseEventHandler = React.useCallback(
    event => {
      setAnchorEl(Some(event.currentTarget as HTMLElement));
    },
    [setAnchorEl]
  );

  const closeMenu = React.useCallback(
    () => {
      setAnchorEl(None());
    },
    [setAnchorEl]
  );

  const openLanguagePicker = React.useCallback(
    () => {
      setLanguagePickerIsOpen(true);
    },
    [setLanguagePickerIsOpen, closeMenu]
  );

  const closeLanguagePicker = React.useCallback(
    () => {
      setLanguagePickerIsOpen(false);
      closeMenu();
    },
    [setLanguagePickerIsOpen]
  );

  const navigateToPathFactory = (path: string, history: History) => () => {
    closeMenu();
    history.push(path);
  };

  const handleClickResetPassword = React.useCallback(
    () => {
      invokeReset(username, msgs => addMessages(msgs[language]));
      closeMenu();
    },
    [username, closeMenu, addMessages]
  );

  return (
    <>
      <LanguagePicker
        show={languagePickerIsOpen}
        onChange={setLanguage}
        onClose={closeLanguagePicker}
        value={language}
      />
      <div>
        <IconButton
          onClick={openMenu}
          color="primary"
          style={{ color: "white" }}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          open={open}
          anchorEl={anchorEl.orSome(null as any)}
          onClose={closeMenu}
        >
          <MenuItem onClick={openLanguagePicker}>
            {translation.language}
          </MenuItem>

          <MenuItem onClick={handleClickResetPassword}>
            {translation.resetPassword}
          </MenuItem>

          <MenuItem>
            <ListItemText>{translation.darkMode}</ListItemText>
            <ListItemSecondaryAction>
              <Switch
                onChange={(_, c) => setDarkMode(c)}
                checked={isDarkModeEnabled}
              />
            </ListItemSecondaryAction>
          </MenuItem>

          {TEACHING_ROLES.includes(role.orSome(Roles.STUDENT)) && (
            <MenuItem>
              <ListItemText style={{ whiteSpace: "initial", width: "100px" }}>
                {translation.weeklySummarySubscription}
              </ListItemText>
              <ListItemSecondaryAction>
                <Switch
                  onChange={(_, c) => setWeeklySummary(c, ownId)}
                  checked={isSubscribedToWeeklySummary}
                />
              </ListItemSecondaryAction>
            </MenuItem>
          )}

          <Route
            render={({ history }) => (
              <MenuItem onClick={navigateToPathFactory("/about", history)}>
                {translation.about}
              </MenuItem>
            )}
          />
        </Menu>
      </div>
    </>
  );
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsMenu);
