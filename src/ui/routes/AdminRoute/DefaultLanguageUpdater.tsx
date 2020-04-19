import * as React from "react";
import { Languages, languagesArr } from "@@types";
import { DropdownInput } from "../../elements/DropdownInput";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import {
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  connect,
} from "react-redux";
import {
  getDefaultLanguage,
  setDefaultLanguageRequest,
  AppState,
} from "../../redux";

const useTranslation = makeTranslationHook({
  en: {
    [Languages.ENGLISH]: "English",
    [Languages.GERMAN]: "German",
  },
  de: {
    [Languages.ENGLISH]: "Englisch",
    [Languages.GERMAN]: "Deutsch",
  },
});

interface DefaultLanguageUpdaterOwnProps {}

interface DefaultLanguageUpdaterStateProps {
  currentDefaultLanguage: Languages;
}
const mapStateToProps: MapStateToPropsParam<
  DefaultLanguageUpdaterStateProps,
  DefaultLanguageUpdaterOwnProps,
  AppState
> = (state) => ({
  currentDefaultLanguage: getDefaultLanguage(state).some(),
});

interface DefaultLanguageUpdaterDispatchProps {
  setDefaultLanguage: (l: Languages) => void;
}
const mapDispatchToProps: MapDispatchToPropsParam<
  DefaultLanguageUpdaterDispatchProps,
  DefaultLanguageUpdaterOwnProps
> = (dispatch) => ({
  setDefaultLanguage: (l) => dispatch(setDefaultLanguageRequest(l)),
});

type DefaultLanguageUpdaterConnectedProps = DefaultLanguageUpdaterDispatchProps &
  DefaultLanguageUpdaterStateProps;

const DefaultLanguageUpdater: React.FC<DefaultLanguageUpdaterConnectedProps> = (
  props
) => {
  const translation = useTranslation();

  const { currentDefaultLanguage, setDefaultLanguage } = props;

  const handleChangeDefaultLanguage = React.useCallback(
    (language: Languages) => {
      if (language !== currentDefaultLanguage) {
        setDefaultLanguage(language);
      }
    },
    [currentDefaultLanguage, setDefaultLanguage]
  );

  return (
    <DropdownInput
      options={languagesArr}
      onChange={handleChangeDefaultLanguage}
      value={currentDefaultLanguage}
      getOptionLabel={(l) => translation[l]}
      fullWidth
      variant="outlined"
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultLanguageUpdater);
