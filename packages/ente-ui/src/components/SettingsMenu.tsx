import * as React from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  ListSubheader
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TimelapseIcon from "@material-ui/icons/Timelapse";
import { None, Some, Maybe } from "monet";
import { Route } from "react-router";
import { History } from "history";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { Languages, DEFAULT_LANGUAGE } from "ente-types";
import {
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  connect
} from "react-redux";
import { AppState, getLanguage, setLanguage } from "../redux";
import { LanguagePicker } from "./LanguagePicker";
import TimeScopeSelectionView from "./TimeScopeSelectionView";

const useTranslation = makeTranslationHook({
  en: {
    about: "About",
    language: "Language",
    subHeaders: {
      filters: "Filters",
      preferences: "Preferences"
    }
  },
  de: {
    about: "Über",
    language: "Sprache",
    subHeaders: {
      filters: "Filter",
      preferences: "Einstellungen"
    }
  }
});

interface SettingsMenuOwnProps {}

interface SettingsMenuStateProps {
  language: Languages;
}
const mapStateToProps: MapStateToPropsParam<
  SettingsMenuStateProps,
  SettingsMenuOwnProps,
  AppState
> = state => ({
  language: getLanguage(state).orSome(DEFAULT_LANGUAGE)
});

interface SettingsMenuDispatchProps {
  setLanguage: (lang: Languages) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SettingsMenuDispatchProps,
  SettingsMenuOwnProps
> = dispatch => ({
  setLanguage: lang => dispatch(setLanguage(lang))
});

type SettingsMenuProps = SettingsMenuOwnProps &
  SettingsMenuDispatchProps &
  SettingsMenuStateProps;

export const SettingsMenu: React.SFC<SettingsMenuProps> = React.memo(props => {
  const { language, setLanguage } = props;

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
          <ListSubheader>{translation.subHeaders.filters}</ListSubheader>

          <MenuItem>
            <ListItemIcon>
              <TimelapseIcon />
            </ListItemIcon>
            <ListItemText>
              <TimeScopeSelectionView />
            </ListItemText>
          </MenuItem>

          <ListSubheader>{translation.subHeaders.preferences}</ListSubheader>

          <MenuItem onClick={openLanguagePicker}>
            {translation.language}
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
