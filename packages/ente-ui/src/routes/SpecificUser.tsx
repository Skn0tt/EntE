/**
 * EntE
 * (c) 2017-present, Simon Knott <info@simonknott.de>
 *
 * This source code is licensed under the GNU Affero General Public License
 * found in the LICENSE file in the root directory of this source tree.
 */

import * as React from "react";
import {
  connect,
  MapDispatchToPropsParam,
  MapStateToPropsParam
} from "react-redux";
import ChildrenInput from "../elements/ChildrenInput";
import TextInput from "../elements/TextInput";
import { withRouter, RouteComponentProps } from "react-router";
import {
  Button,
  Dialog,
  Grid,
  IconButton,
  withStyles,
  WithStyles,
  createStyles
} from "@material-ui/core";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import DeleteIcon from "@material-ui/icons/Delete";
import LoadingIndicator from "../elements/LoadingIndicator";
import * as _ from "lodash";
import {
  AppState,
  getUser,
  isLoading,
  getUserRequest,
  getStudents,
  userHasChildren,
  updateUserRequest,
  UserN,
  deleteUserRequest,
  roleHasGradYear
} from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import {
  PatchUserDto,
  isValidDisplayname,
  isValidEmail,
  isValidPatchUserDto,
  roleHasBirthday,
  isValidPatchUserDtoWithErrors
} from "ente-types";
import { DeleteModal } from "../components/DeleteModal";
import { YearPicker } from "../elements/YearPicker";
import { Maybe } from "monet";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { DateInput } from "../elements/DateInput";

const useTranslation = makeTranslationHook({
  en: {
    submit: "OK",
    close: "Close",
    titles: {
      email: "Email",
      displayname: "Displayname",
      birthday: "Birthday",
      id: "ID",
      role: "Role",
      gradYear: "Graduation Year",
      areYouSureYouWannaDelete: (username: string) =>
        `Are you sure you want to delete user "${username}"?`
    },
    ariaLabels: {
      delete: "Delete"
    }
  },
  de: {
    submit: "OK",
    close: "Schließen",
    titles: {
      email: "Email",
      displayname: "Displayname",
      birthday: "Geburtstag",
      id: "ID",
      role: "Rolle",
      gradYear: "Abschluss-Jahrgang",
      areYouSureYouWannaDelete: (username: string) =>
        `Sind sie sicher, dass sie den Nutzer "${username}" löschen möchten?`
    },
    ariaLabels: {
      delete: "Löschen"
    }
  }
});

const styles = createStyles<"deleteButton">({
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0
  }
});

/**
 * # Component Types
 */
interface RouteMatch {
  userId: string;
}
interface SpecificUserStateProps {
  getUser(id: string): Maybe<UserN>;
  loading: boolean;
  students: UserN[];
}
const mapStateToProps: MapStateToPropsParam<
  SpecificUserStateProps,
  SpecificUserOwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state),
  loading: isLoading(state),
  students: getStudents(state)
});

interface SpecificUserDispatchProps {
  requestUser(id: string): void;
  updateUser(id: string, u: PatchUserDto): void;
  deleteUser(id: string): void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SpecificUserDispatchProps,
  SpecificUserOwnProps
> = dispatch => ({
  requestUser: id => dispatch(getUserRequest(id)),
  updateUser: (id, user) => dispatch(updateUserRequest([id, user])),
  deleteUser: id => dispatch(deleteUserRequest(id))
});

interface SpecificUserOwnProps {}

type SpecificUserProps = SpecificUserStateProps &
  SpecificUserOwnProps &
  RouteComponentProps<RouteMatch> &
  SpecificUserDispatchProps &
  WithStyles<"deleteButton"> &
  InjectedProps;

/**
 * # Component
 */
export const SpecificUser: React.FunctionComponent<
  SpecificUserProps
> = props => {
  const lang = useTranslation();
  const [showDelete, setShowDelete] = React.useState(false);
  const [patch, setPatch] = React.useState(new PatchUserDto());
  const {
    fullScreen,
    loading,
    getUser,
    students,
    deleteUser,
    classes,
    updateUser,
    history,
    match,
    requestUser
  } = props;

  const userId = match.params.userId;
  const user = getUser(userId);

  React.useEffect(
    () => {
      const user = getUser(userId);

      if (user.isNone()) {
        requestUser(userId);
      }
    },
    [userId]
  );

  const updatePatch = (key: keyof PatchUserDto) => (value: any) => {
    const clone = Object.assign({}, patch);
    clone[key] = value;
    setPatch(clone);
  };

  const onClose = history.goBack;
  const onGoBack = onClose;
  const onSubmit = () => {
    updateUser(userId, patch);
    onClose();
  };

  return user.cata(
    () => <LoadingIndicator />,
    user => (
      <>
        <DeleteModal
          show={showDelete}
          onClose={() => setShowDelete(false)}
          onDelete={() => {
            setShowDelete(false);
            deleteUser(userId);
            onClose();
          }}
          text={lang.titles.areYouSureYouWannaDelete(user.get("username"))}
        />
        <Dialog open onClose={onGoBack} fullScreen={fullScreen}>
          {!!user ? (
            <>
              <DialogTitle>
                {user.get("displayname")}
                <IconButton
                  aria-label={lang.ariaLabels.delete}
                  onClick={() => setShowDelete(true)}
                  className={classes.deleteButton}
                >
                  <DeleteIcon fontSize="large" />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={24} alignItems="stretch">
                  <Grid item xs={12}>
                    <DialogContentText>
                      {lang.titles.id}: {user.get("id")} <br />
                      {lang.titles.role}: {user.get("role")} <br />
                    </DialogContentText>
                  </Grid>

                  {/* Displayname */}
                  <Grid item xs={12}>
                    <TextInput
                      title={lang.titles.displayname}
                      value={patch.displayname || user.get("displayname")}
                      onChange={updatePatch("displayname")}
                      validator={isValidDisplayname}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12}>
                    <TextInput
                      title={lang.titles.email}
                      value={patch.email || user.get("email")}
                      onChange={updatePatch("email")}
                      validator={isValidEmail}
                    />
                  </Grid>

                  {/* Birthday */}
                  {roleHasBirthday(user.get("role")) && (
                    <Grid item xs={6}>
                      <DateInput
                        value={patch.birthday || user.get("birthday")!}
                        label={lang.titles.birthday}
                        onChange={updatePatch("birthday")}
                      />
                    </Grid>
                  )}

                  {/* Graduation Year */}
                  {roleHasGradYear(user.get("role")) && (
                    <Grid item xs={6}>
                      <YearPicker
                        label={lang.titles.gradYear}
                        onChange={updatePatch("graduationYear")}
                        amount={5}
                        value={
                          patch.graduationYear! || user.get("graduationYear")!
                        }
                      />
                    </Grid>
                  )}

                  {/* Children */}
                  {userHasChildren(user) && (
                    <Grid item xs={12}>
                      <ChildrenInput
                        children={
                          !!patch.children
                            ? patch.children.map(getUser).map(c => c.some())
                            : user
                                .get("childrenIds")
                                .map(getUser)
                                .map(c => c.some())
                        }
                        students={students}
                        onChange={c =>
                          updatePatch("children")(c.map(v => v.get("id")))
                        }
                      />
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
            </>
          ) : (
            loading && <LoadingIndicator />
          )}
          <DialogActions>
            <Button size="small" color="secondary" onClick={onClose}>
              {lang.close}
            </Button>
            <Button
              size="small"
              color="primary"
              onClick={onSubmit}
              disabled={!isValidPatchUserDto(patch)}
            >
              {lang.submit}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  );
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(
    withStyles(styles)(
      withErrorBoundary()(withMobileDialog<SpecificUserProps>()(SpecificUser))
    )
  )
);
