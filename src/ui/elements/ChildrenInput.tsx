/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import { Grid, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography/Typography";
import * as _ from "lodash";
import { SearchableDropdown } from "../components/SearchableDropdown";
import { UserN } from "../redux";
import { useState } from "react";
import { makeTranslationHook } from "../helpers/makeTranslationHook";

export const translation = {
  en: {
    title: "Children",
    addChildren: "Add children",
    child: "Child",
  },
  de: {
    title: "Kinder",
    addChildren: "Kinder hinzufügen",
    child: "Kind",
  },
};

const useTranslation = makeTranslationHook(translation);

export const includes = (exclude: UserN[]) => {
  const excludedIds = exclude.map((u) => u.get("id"));
  return (u: UserN) => _.includes(excludedIds, u.get("id"));
};

function getInitiallySelectedStudent(props: ChildrenInputProps) {
  return _.differenceBy(props.students, props.children, (u) => u.get("id"))[0];
}

interface ChildrenInputProps {
  children: UserN[];
  students: UserN[];
  onChange: (children: UserN[]) => void;
  text?: {
    title: string;
    addChildren: string;
    child: string;
  };
}

function ChildrenInput(props: ChildrenInputProps) {
  const { children, text, students } = props;
  const [selected, setSelected] = useState<UserN | undefined>(
    getInitiallySelectedStudent(props)
  );

  const [input, setInput] = useState("");

  const translation = useTranslation();

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h6">{text?.title ?? translation.title}</Typography>
      </Grid>
      {/* List Children */}
      <Grid item>
        <List>
          {children.map((user) => (
            <ListItem key={user.get("id")}>
              <ListItemText primary={user.get("displayname")} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => props.onChange(_.without(children, user))}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Grid>
      {/* Add Children */}
      <Grid item container>
        <Grid item xs={11}>
          <SearchableDropdown<UserN>
            value={input}
            onChange={setInput}
            items={students.filter((u) => !includes(children)(u))}
            onSelect={setSelected}
            itemToString={(i) => i.get("displayname")}
            includeItem={(u, searchTerm) =>
              u
                .get("displayname")
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            }
            helperText={!!text ? text.addChildren : translation.addChildren}
            label={!!text ? text.child : translation.child}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            variant="fab"
            mini
            onClick={() => {
              if (!selected) {
                return;
              }

              props.onChange([...children, selected]);
            }}
            className="add"
            disabled={!selected}
          >
            <AddIcon />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ChildrenInput;
