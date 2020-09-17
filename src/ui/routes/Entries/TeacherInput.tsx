import * as React from "react";
import { Maybe, None, Some } from "monet";
import { UserN, getTeachingUsers, getUserMap } from "../../redux";
import { makeTranslationHook } from "../../helpers/makeTranslationHook";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";

const useTranslation = makeTranslationHook({
  en: {
    titles: {
      teacher: "Teacher",
    },
    helpers: {
      teacher: "Select the teacher.",
    },
  },
  de: {
    titles: {
      teacher: "Lehrer",
    },
    helpers: {
      teacher: "Wählen Sie den Lehrer aus.",
    },
  },
});

interface TeacherInputOwnProps {
  onChange: (id: Maybe<string>) => void;
  value: Maybe<string>;
}

function TeacherInput(props: TeacherInputOwnProps) {
  const { onChange, value } = props;

  const users = useSelector(getUserMap);
  const teachingUsers = useSelector(getTeachingUsers);

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

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value.isNone()) {
      setInputValue("");
    } else {
      setInputValue(users.get(value.some())!.get("displayname"));
    }
  }, [value.orUndefined(), setInputValue]);

  return (
    <SearchableDropdown<UserN>
      label={translation.titles.teacher}
      helperText={translation.helpers.teacher}
      items={sortedTeachingUsers}
      onSelect={handleChange}
      onChange={setInputValue}
      value={inputValue}
      includeItem={(item, searchTerm) =>
        item.get("displayname").toLowerCase().includes(searchTerm.toLowerCase())
      }
      itemToString={(i) => i.get("displayname")}
    />
  );
}

export default TeacherInput;
