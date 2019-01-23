import * as React from "react";
import { Languages } from "ente-types";
import { TextField, Grid, Button, Typography } from "@material-ui/core";
import * as _ from "lodash";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import {
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  connect
} from "react-redux";
import {
  AppState,
  getLoginBannerForLanguage,
  setLoginBannerRequest
} from "../../redux";
import { Maybe } from "monet";

const useTranslation = makeTranslationHook({
  en: {
    submit: "Submit",
    title: {
      [Languages.ENGLISH]: "English",
      [Languages.GERMAN]: "German"
    }
  },
  de: {
    submit: "Aktualisieren",
    title: {
      [Languages.ENGLISH]: "Englisch",
      [Languages.GERMAN]: "Deutsch"
    }
  }
});

interface LoginBannerEditorOwnProps {
  language: Languages;
}

interface LoginBannerEditorStateProps {
  loginBanner: Maybe<string>;
}
const mapStateToProps: MapStateToPropsParam<
  LoginBannerEditorStateProps,
  LoginBannerEditorOwnProps,
  AppState
> = (state, props) => {
  const { language } = props;
  return {
    loginBanner: getLoginBannerForLanguage(language)(state)
  };
};

interface LoginBannerEditorDispatchProps {
  changeBanner: (text: string | null) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  LoginBannerEditorDispatchProps,
  LoginBannerEditorOwnProps
> = (dispatch, ownProps) => {
  const { language } = ownProps;
  return {
    changeBanner: text => dispatch(setLoginBannerRequest({ language, text }))
  };
};

type LoginBannerEditorProps = LoginBannerEditorStateProps &
  LoginBannerEditorDispatchProps &
  LoginBannerEditorOwnProps;

const LoginBannerEditor: React.FC<LoginBannerEditorProps> = props => {
  const { changeBanner, loginBanner, language } = props;
  const [edit, setEdit] = React.useState<string | null>(null);

  const translation = useTranslation();

  const handleChange = React.useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >(evt => setEdit(evt.target.value), [setEdit]);

  const handleSubmit = React.useCallback(
    () => {
      changeBanner(edit);
    },
    [changeBanner, edit]
  );

  const enableSubmit = !_.isNull(edit) && edit !== loginBanner.orSome("");

  return (
    <Grid container direction="column">
      <Grid item>
        <TextField
          label={translation.title[language]}
          multiline
          rows="4"
          defaultValue="Default Value"
          margin="normal"
          variant="outlined"
          value={_.isNull(edit) ? loginBanner.orSome("") : edit}
          onChange={handleChange}
          fullWidth
        />
      </Grid>
      <Grid item>
        <Button onClick={handleSubmit} disabled={!enableSubmit}>
          {translation.submit}
        </Button>
      </Grid>
    </Grid>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginBannerEditor);
