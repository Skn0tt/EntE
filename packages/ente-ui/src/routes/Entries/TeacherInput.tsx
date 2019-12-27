import * as React from "react";
import { Maybe, None, Some } from "monet";
import { UserN, AppState, getTeachingUsers } from "../../redux";
import { MapStateToPropsParam, connect } from "react-redux";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { SearchableDropdown } from "../../components/SearchableDropdown";

const useTranslation = makeTranslationHook({
  en: {
    titles: {
      teacher: "Teacher"
    },
    helpers: {
      teacher: "Select the teacher."
    }
  },
  de: {
    titles: {
      teacher: "Lehrer"
    },
    helpers: {
      teacher: "Wählen Sie den Lehrer aus."
    }
  }
});

interface TeacherInputOwnProps {
  onChange: (id: Maybe<string>) => void;
}

interface TeacherInputStateProps {
  teachingUsers: UserN[];
}
const mapStateToProps: MapStateToPropsParam<
  TeacherInputStateProps,
  TeacherInputOwnProps,
  AppState
> = state => ({
  teachingUsers: getTeachingUsers(state)
});

type TeacherInputProps = TeacherInputOwnProps & TeacherInputStateProps;

const TeacherInput: React.FC<TeacherInputProps> = props => {
  const { onChange, teachingUsers } = props;

  const sortedTeachingUsers = React.useMemo(
    () =>
      teachingUsers.sort((a, b) => {
        return a.get("username").localeCompare(b.get("username"));
      }),
    [teachingUsers]
  );

  const translation = useTranslation();

  const handleChange = React.useCallback(
    (teacher?: UserN) => {
      if (!!teacher) {
        onChange(Some(teacher.get("id")));
      } else {
        onChange(None());
      }
    },
    [onChange]
  );

  return (
    <SearchableDropdown<UserN>
      label={translation.titles.teacher}
      helperText={translation.helpers.teacher}
      items={sortedTeachingUsers}
      onChange={handleChange}
      includeItem={(item, searchTerm) =>
        item
          .get("displayname")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      }
      itemToString={i => i.get("displayname")}
    />
  );
};

export default connect(mapStateToProps)(TeacherInput);
