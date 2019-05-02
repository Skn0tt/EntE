import * as React from "react";
import { CourseFilter } from "../helpers/course-filter";
import { Maybe, None, Some } from "monet";
import { Button, IconButton } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import { useWeekdayTranslations } from "../helpers/use-weekday-translations";
import CourseFilterModal from "./CourseFilterModal";

const useTranslation = makeTranslationHook({
  en: {
    filterByClass: "Filter by class"
  },
  de: {
    filterByClass: "Kursfilter"
  }
});

interface CourseFilterButtonOwnProps {
  onChange: (course: Maybe<CourseFilter>) => void;
}

export const CourseFilterButton: React.FC<
  CourseFilterButtonOwnProps
> = props => {
  const { onChange } = props;
  const translation = useTranslation();
  const weekdayTranslations = useWeekdayTranslations().twoCharacter;

  const [value, setValue] = React.useState<Maybe<CourseFilter>>(None());
  const [showCourseFilterModal, setShowCourseFilterModal] = React.useState(
    false
  );

  React.useEffect(
    () => {
      onChange(value);
    },
    [onChange, value]
  );

  return (
    <>
      <CourseFilterModal
        show={showCourseFilterModal}
        onClose={() => setShowCourseFilterModal(false)}
        onChange={c => setValue(Some(c).filter(c => c.length !== 0))}
        value={value.orSome([])}
      />

      <Button
        variant="outlined"
        size="medium"
        onClick={() => setShowCourseFilterModal(true)}
      >
        {value.cata(
          () => translation.filterByClass,
          course =>
            course
              .map(c => weekdayTranslations[c.day] + ", " + c.hour)
              .join("; ")
        )}
      </Button>

      {value.isSome() && (
        <IconButton onClick={() => setValue(None())}>
          <CancelIcon />
        </IconButton>
      )}
    </>
  );
};
