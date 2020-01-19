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
  createStyles,
  Menu,
  MenuItem
} from "@material-ui/core";
import withMobileDialog, {
  InjectedProps
} from "@material-ui/core/withMobileDialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
  roleHasGradYear,
  getToken,
  demoteManagerRequest,
  promoteTeacherRequest
} from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import {
  PatchUserDto,
  isValidDisplayname,
  isValidEmail,
  roleHasBirthday,
  PatchUserDtoValidator,
  isValidUsername,
  Roles
} from "ente-types";
import { DeleteModal } from "../components/DeleteModal";
import { YearPicker } from "../elements/YearPicker";
import { Maybe } from "monet";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { DateInput } from "../elements/DateInput";
import { Link } from "react-router-dom";
import { useMessages } from "../context/Messages";
import { invokeInvitationRoutine } from "../redux/invokeInvitationRoutine";
import { useRoleTranslation } from "../roles.translation";

const currentYear = new Date().getFullYear();

const useTranslation = makeTranslationHook({
  en: {
    submit: "OK",
    close: "Close",
    deleteUser: "Delete User",
    resendInvitationEmail: "Resend invitation email",
    titles: {
      email: "Email",
      displayname: "Displayname",
      birthday: "Birthday",
      username: "Username",
      role: "Role",
      gradYear: "Graduation Year",
      areYouSureYouWannaDelete: (username: string) =>
        `Are you sure you want to delete user "${username}"?`
    },
    ariaLabels: {
      openMenu: "Open Menu"
    },
    promote: "Promote to manager",
    demote: "Demote to teacher",
    openReport: "Open Report",
    invitationRoutine: {
      error: "An error occured.",
      success: "Invitation has been dispatched successfully."
    }
  },
  de: {
    submit: "OK",
    close: "Schließen",
    deleteUser: "Benutzer löschen",
    resendInvitationEmail: "Einladungs-Email erneut verschicken",
    titles: {
      email: "Email",
      displayname: "Displayname",
      birthday: "Geburtstag",
      username: "Benutzername",
      role: "Rolle",
      gradYear: "Abschluss-Jahrgang",
      areYouSureYouWannaDelete: (username: string) =>
        `Sind Sie sicher, dass Sie den Nutzer "${username}" löschen möchten?`
    },
    ariaLabels: {
      openMenu: "Menü öffnen"
    },
    promote: "Zu Stufenleiter befördern",
    demote: "Zu Lehrer degradieren",
    openReport: "Bericht öffnen",
    invitationRoutine: {
      error: "Es ist ein Fehler aufgetreten.",
      success: "Einladung wurde erfolgreich versandt."
    }
  }
});

const styles = createStyles<"menuButton">({
  menuButton: {
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
  token: string;
}
const mapStateToProps: MapStateToPropsParam<
  SpecificUserStateProps,
  SpecificUserOwnProps,
  AppState
> = state => ({
  getUser: id => getUser(id)(state),
  loading: isLoading(state),
  students: getStudents(state),
  token: getToken(state).some()
});

interface SpecificUserDispatchProps {
  requestUser(id: string): void;
  updateUser(id: string, u: PatchUserDto): void;
  deleteUser(id: string): void;
  promote(id: string, gradYear: number): void;
  demote(id: string): void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SpecificUserDispatchProps,
  SpecificUserOwnProps
> = dispatch => ({
  requestUser: id => dispatch(getUserRequest(id)),
  updateUser: (id, user) => dispatch(updateUserRequest([id, user])),
  deleteUser: id => dispatch(deleteUserRequest(id)),
  promote: (id, gradYear) => dispatch(promoteTeacherRequest({ id, gradYear })),
  demote: id => dispatch(demoteManagerRequest(id))
});

interface SpecificUserOwnProps {}

type SpecificUserProps = SpecificUserStateProps &
  SpecificUserOwnProps &
  RouteComponentProps<RouteMatch> &
  SpecificUserDispatchProps &
  WithStyles<"menuButton"> &
  InjectedProps;

/**
 * # Component
 */
export const SpecificUser: React.FunctionComponent<
  SpecificUserProps
> = props => {
  const lang = useTranslation();
  const roleTranslation = useRoleTranslation();
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
    requestUser,
    token,
    promote,
    demote
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

  const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
    null
  );
  const showMenu = !!menuAnchorEl;

  const { addMessages } = useMessages();

  const handleInvokeInvitationRoutine = React.useCallback(
    () => {
      async function doIt() {
        const result = await invokeInvitationRoutine(userId, token);
        result.forEachFail(console.error);
        addMessages(
          result.cata(
            () => lang.invitationRoutine.error,
            () => lang.invitationRoutine.success
          )
        );
      }

      doIt();
    },
    [token, addMessages, userId, lang]
  );

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
        <Dialog open onClose={onGoBack} fullScreen={fullScreen} scroll="body">
          {!!user ? (
            <>
              <DialogTitle>
                {user.get("displayname")}
                <IconButton
                  aria-label={lang.ariaLabels.openMenu}
                  className={classes.menuButton}
                  onClick={evt => setMenuAnchorEl(evt.currentTarget)}
                >
                  <MoreVertIcon fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  keepMounted
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left"
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right"
                  }}
                  open={showMenu}
                  onClose={() => setMenuAnchorEl(null)}
                >
                  <MenuItem onClick={() => setShowDelete(true)}>
                    {lang.deleteUser}
                  </MenuItem>

                  {user.get("role") === Roles.TEACHER && (
                    <MenuItem
                      onClick={() => promote(user.get("id"), currentYear)}
                    >
                      {lang.promote}
                    </MenuItem>
                  )}

                  {user.get("role") === Roles.MANAGER && (
                    <MenuItem onClick={() => demote(user.get("id"))}>
                      {lang.demote}
                    </MenuItem>
                  )}

                  <MenuItem onClick={handleInvokeInvitationRoutine}>
                    {lang.resendInvitationEmail}
                  </MenuItem>
                </Menu>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={24} alignItems="stretch">
                  <Grid item xs={12}>
                    <DialogContentText>
                      {lang.titles.role}: {roleTranslation[user.get("role")]}{" "}
                      <br />
                    </DialogContentText>
                  </Grid>

                  {/* Displayname */}
                  <Grid item xs={12}>
                    <TextInput
                      title={lang.titles.username}
                      value={patch.username || user.get("username")}
                      onChange={updatePatch("username")}
                      validator={isValidUsername}
                    />
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
            {user.get("role") === "student" && (
              <Button
                size="small"
                color="default"
                {...{
                  to: `${userId}/report`,
                  component: Link
                } as any}
              >
                {lang.openReport}
              </Button>
            )}

            <Button size="small" color="secondary" onClick={onClose}>
              {lang.close}
            </Button>

            <Button
              size="small"
              color="primary"
              onClick={onSubmit}
              disabled={!PatchUserDtoValidator.validate(patch)}
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
