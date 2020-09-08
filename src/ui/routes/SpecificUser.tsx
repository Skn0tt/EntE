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
  MapStateToPropsParam,
} from "react-redux";
import ChildrenInput from "../elements/ChildrenInput";
import TextInput from "../elements/TextInput";
import {
  Button,
  Grid,
  IconButton,
  withStyles,
  WithStyles,
  createStyles,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core";
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
  roleHasClass,
  getToken,
  demoteManagerRequest,
  promoteTeacherRequest,
  getUsers,
} from "../redux";
import withErrorBoundary from "../hocs/withErrorBoundary";
import {
  PatchUserDto,
  isValidName,
  isValidEmail,
  roleHasBirthday,
  PatchUserDtoValidator,
  isValidUsername,
  Roles,
} from "@@types";
import { DeleteModal } from "../components/DeleteModal";
import { Maybe } from "monet";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { DateInput } from "../elements/DateInput";
import { useMessages } from "../context/Messages";
import { invokeInvitationRoutine } from "../redux/invokeInvitationRoutine";
import { useRoleTranslation } from "../roles.translation";
import { ClassPicker } from "../elements/ClassPicker";
import { useRouter } from "next/router";
import Link from "next/link";
import { ResponsiveFullscreenDialog } from "../components/ResponsiveFullscreenDialog";

const useTranslation = makeTranslationHook({
  en: {
    submit: "OK",
    close: "Close",
    deleteUser: "Delete User",
    resendInvitationEmail: "Resend invitation email",
    titles: {
      email: "Email",
      firstName: "First Name",
      lastName: "Last Name",
      birthday: "Birthday",
      username: "Username",
      role: "Role",
      class: "Class",
      isAdmin: "Administrator",
      areYouSureYouWannaDelete: (username: string) =>
        `Are you sure you want to delete user "${username}"?`,
    },
    ariaLabels: {
      openMenu: "Open Menu",
    },
    promote: "Promote to manager",
    demote: "Demote to teacher",
    openReport: "Open Report",
    invitationRoutine: {
      error: "An error occured.",
      success: "Invitation has been dispatched successfully.",
    },
  },
  de: {
    submit: "OK",
    close: "Schließen",
    deleteUser: "Benutzer löschen",
    resendInvitationEmail: "Einladungs-Email erneut verschicken",
    titles: {
      email: "Email",
      firstName: "Vorname",
      lastName: "Nachname",
      birthday: "Geburtstag",
      username: "Benutzername",
      role: "Rolle",
      class: "Klasse / Abschluss-Jahrgang",
      isAdmin: "Administrator",
      areYouSureYouWannaDelete: (username: string) =>
        `Sind Sie sicher, dass Sie den Nutzer "${username}" löschen möchten?`,
    },
    ariaLabels: {
      openMenu: "Menü öffnen",
    },
    promote: "Zu Stufenleiter befördern",
    demote: "Zu Lehrer degradieren",
    openReport: "Bericht öffnen",
    invitationRoutine: {
      error: "Es ist ein Fehler aufgetreten.",
      success: "Einladung wurde erfolgreich versandt.",
    },
  },
});

const styles = createStyles<"menuButton">({
  menuButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

/**
 * # Component Types
 */
interface RouteMatch {
  userId: string;
}
interface SpecificUserStateProps {
  getUser(id: string): Maybe<UserN>;
  availableClasses: string[];
  loading: boolean;
  students: UserN[];
  token: string;
}
const mapStateToProps: MapStateToPropsParam<
  SpecificUserStateProps,
  SpecificUserOwnProps,
  AppState
> = (state) => ({
  getUser: (id) => getUser(id)(state),
  availableClasses: _.uniq(
    getUsers(state)
      .map((u) => u.get("class"))
      .filter(_.isString)
  ),
  loading: isLoading(state),
  students: getStudents(state),
  token: getToken(state).some(),
});

interface SpecificUserDispatchProps {
  requestUser(id: string): void;
  updateUser(id: string, u: PatchUserDto): void;
  deleteUser(id: string): void;
  promote(id: string, _class: string): void;
  demote(id: string): void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  SpecificUserDispatchProps,
  SpecificUserOwnProps
> = (dispatch) => ({
  requestUser: (id) => dispatch(getUserRequest(id)),
  updateUser: (id, user) => dispatch(updateUserRequest([id, user])),
  deleteUser: (id) => dispatch(deleteUserRequest(id)),
  promote: (id, _class) =>
    dispatch(promoteTeacherRequest({ id, class: _class })),
  demote: (id) => dispatch(demoteManagerRequest(id)),
});

interface SpecificUserOwnProps {}

type SpecificUserProps = SpecificUserStateProps &
  SpecificUserOwnProps &
  SpecificUserDispatchProps &
  WithStyles<"menuButton">;

/**
 * # Component
 */
export const SpecificUser: React.FunctionComponent<SpecificUserProps> = (
  props
) => {
  const lang = useTranslation();
  const roleTranslation = useRoleTranslation();
  const [showDelete, setShowDelete] = React.useState(false);
  const [patch, setPatch] = React.useState(new PatchUserDto());
  const {
    loading,
    getUser,
    students,
    deleteUser,
    classes,
    updateUser,
    requestUser,
    token,
    promote,
    demote,
    availableClasses,
  } = props;

  const router = useRouter();

  const userId = router.query.userId as string;
  const user = getUser(userId);

  React.useEffect(() => {
    const user = getUser(userId);

    if (user.isNone()) {
      requestUser(userId);
    }
  }, [userId]);

  const updatePatch = <K extends keyof PatchUserDto>(key: K) => (
    value: PatchUserDto[K]
  ) => {
    setPatch((old) => ({
      ...old,
      [key]: value,
    }));
  };

  const onClose = router.back;
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

  const handleInvokeInvitationRoutine = React.useCallback(() => {
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
  }, [token, addMessages, userId, lang]);

  return user.cata(
    () => <LoadingIndicator />,
    (user) => (
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
        <ResponsiveFullscreenDialog open onClose={onGoBack} scroll="body">
          {!!user ? (
            <>
              <DialogTitle>
                {user.get("displayname")}
                <IconButton
                  aria-label={lang.ariaLabels.openMenu}
                  className={classes.menuButton}
                  onClick={(evt) => setMenuAnchorEl(evt.currentTarget)}
                >
                  <MoreVertIcon fontSize="large" />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  keepMounted
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={showMenu}
                  onClose={() => setMenuAnchorEl(null)}
                >
                  <MenuItem onClick={() => setShowDelete(true)}>
                    {lang.deleteUser}
                  </MenuItem>

                  {user.get("role") === Roles.TEACHER && (
                    <MenuItem
                      onClick={() =>
                        promote(
                          user.get("id"),
                          availableClasses[0] || "default"
                        )
                      }
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

                  {/* Username */}
                  <Grid item xs={12}>
                    <TextInput
                      title={lang.titles.username}
                      value={patch.username || user.get("username")}
                      onChange={updatePatch("username")}
                      validator={isValidUsername}
                    />
                  </Grid>

                  {/* firstName */}
                  <Grid item xs={12}>
                    <TextInput
                      title={lang.titles.firstName}
                      value={patch.firstName || user.get("firstName")}
                      onChange={updatePatch("firstName")}
                      validator={isValidName}
                    />
                  </Grid>

                  {/* lastName */}
                  <Grid item xs={12}>
                    <TextInput
                      title={lang.titles.lastName}
                      value={patch.lastName || user.get("lastName")}
                      onChange={updatePatch("lastName")}
                      validator={isValidName}
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

                  {/* IsAdmin */}
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={_.defaultTo(
                            patch.isAdmin,
                            user.get("isAdmin")
                          )}
                          onChange={(evt) =>
                            updatePatch("isAdmin")(evt.target.checked)
                          }
                          name="isAdmin"
                          color="primary"
                        />
                      }
                      label={lang.titles.isAdmin}
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
                  {roleHasClass(user.get("role")) && (
                    <Grid item xs={6}>
                      <ClassPicker
                        label={lang.titles.class}
                        onChange={updatePatch("class")}
                        availableClasses={availableClasses}
                        value={
                          _.isUndefined(patch.class)
                            ? user.get("class")!
                            : patch.class
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
                            ? patch.children.map(getUser).map((c) => c.some())
                            : user
                                .get("childrenIds")
                                .map(getUser)
                                .map((c) => c.some())
                        }
                        students={students}
                        onChange={(c) =>
                          updatePatch("children")(c.map((v) => v.get("id")))
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
              <Link
                href="/users/[userId]/report"
                as={`/users/${userId}/report`}
              >
                <Button size="small" color="default">
                  {lang.openReport}
                </Button>
              </Link>
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
        </ResponsiveFullscreenDialog>
      </>
    )
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withErrorBoundary()(SpecificUser)));
