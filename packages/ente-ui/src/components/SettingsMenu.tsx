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
import { Languages, DEFAULT_DEFAULT_LANGUAGE } from "ente-types";
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
  setColorScheme
} from "../redux";
import { LanguagePicker } from "./LanguagePicker";

const useTranslation = makeTranslationHook({
  en: {
    about: "About",
    language: "Language",
    darkMode: "Dark Mode (beta)"
  },
  de: {
    about: "Über",
    language: "Sprache",
    darkMode: "Dark Mode (beta)"
  }
});

interface SettingsMenuOwnProps {}

interface SettingsMenuStateProps {
  language: Languages;
  isDarkModeEnabled: boolean;
}
const mapStateToProps: MapStateToPropsParam<
  SettingsMenuStateProps,
  SettingsMenuOwnProps,
  AppState
> = state => ({
  language: getLanguage(state).orSome(DEFAULT_DEFAULT_LANGUAGE),
  isDarkModeEnabled: getColorScheme(state) === "dark"
});

interface SettingsMenuDispatchProps {
  setLanguage: (lang: Languages) => void;
  setDarkMode: (on: boolean) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SettingsMenuDispatchProps,
  SettingsMenuOwnProps
> = dispatch => ({
  setLanguage: lang => dispatch(setLanguage(lang)),
  setDarkMode: on => dispatch(setColorScheme(on ? "dark" : "light"))
});

type SettingsMenuProps = SettingsMenuOwnProps &
  SettingsMenuDispatchProps &
  SettingsMenuStateProps;

export const SettingsMenu: React.SFC<SettingsMenuProps> = React.memo(props => {
  const { language, setLanguage, isDarkModeEnabled, setDarkMode } = props;

  const [anchorEl, setAnchorEl] = React.useState<Maybe<HTMLElement>>(None());
  const [languagePickerIsOpen, setLanguagePickerIsOpen] = React.useState<
    boolean
  >(false);
  const open = anchorEl.isSome();
  const translation = useTranslation();

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

          <MenuItem>
            <ListItemText>{translation.darkMode}</ListItemText>
            <ListItemSecondaryAction>
              <Switch
                onChange={(_, c) => setDarkMode(c)}
                checked={isDarkModeEnabled}
              />
            </ListItemSecondaryAction>
          </MenuItem>

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
