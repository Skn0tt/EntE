import * as React from "react";
import { IconButton, Menu, MenuItem } from "@material-ui/core";
import { MoreVert as MoreVertIcon } from "@material-ui/icons";
import * as config from "../config";
import { None, Some, Maybe } from "monet";
import { createTranslation } from "../helpers/createTranslation";
import { Route } from "react-router";

const lang = createTranslation({
  en: {
    about: "About"
  },
  de: {
    about: "Über"
  }
});

export const SettingsMenu = React.memo(() => {
  const [anchorEl, setAnchorEl] = React.useState<Maybe<HTMLElement>>(None());
  const open = anchorEl.isSome();

  const openMenu: React.MouseEventHandler = event => {
    setAnchorEl(Some(event.currentTarget as HTMLElement));
  };

  const closeMenu = () => {
    setAnchorEl(None());
  };

  return (
    <div>
      <IconButton onClick={openMenu} color="primary" style={{ color: "white" }}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl.orSome(null)} onClose={closeMenu}>
        <Route
          render={({ history }) => (
            <MenuItem dense onClick={() => history.push("/about")}>
              {lang.about}
            </MenuItem>
          )}
        />
      </Menu>
    </div>
  );
});
