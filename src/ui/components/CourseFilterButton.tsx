import * as React from "react";
import { CourseFilter } from "../helpers/course-filter";
import { Maybe, None, Some } from "monet";
import { Button, IconButton, Menu, MenuItem, Divider } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeTranslationHook } from "../helpers/makeTranslationHook";
import CreateCourseFilterModal from "./CreateCourseFilterModal";
import TrashIcon from "@material-ui/icons/Delete";
import _ from "lodash";
import { useUserMeta } from "ui/useUserMeta";

const useTranslation = makeTranslationHook({
  en: {
    filterByClass: "Filter by class",
    add: "Add class",
  },
  de: {
    filterByClass: "Kursfilter",
    add: "Kurs hinzufügen",
  },
});

interface CourseFilterButtonOwnProps {
  onChange: (course: Maybe<CourseFilter>) => void;
}

export const CourseFilterButton: React.FC<CourseFilterButtonOwnProps> = (
  props
) => {
  const translation = useTranslation();
  const { onChange } = props;

  const [existingCourseFilters, setExistingCourseFilters] = useUserMeta<
    CourseFilter[]
  >("course-filters", []);

  const [selectedCourse, setSelectedCourse] = React.useState<CourseFilter>();

  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement>();

  const [
    createCourseFilterModalIsShown,
    showCreateCourseFilterModal,
  ] = React.useState(false);

  return (
    <>
      <CreateCourseFilterModal
        show={createCourseFilterModalIsShown}
        onClose={() => showCreateCourseFilterModal(false)}
        onCreate={(c) => {
          setExistingCourseFilters((old) => [...old, c]);
          onChange(Some(c));
          setSelectedCourse(c);
          setMenuAnchor(undefined);
          showCreateCourseFilterModal(false);
        }}
      />

      <Button
        variant="outlined"
        size="medium"
        onClick={(evt) => {
          if (existingCourseFilters.length === 0) {
            showCreateCourseFilterModal(true);
          } else {
            setMenuAnchor(evt.currentTarget);
          }
        }}
      >
        {selectedCourse?.name ?? translation.filterByClass}
      </Button>

      {selectedCourse && (
        <IconButton
          onClick={() => {
            setSelectedCourse(undefined);
            onChange(None());
          }}
        >
          <CancelIcon />
        </IconButton>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={() => setMenuAnchor(undefined)}
      >
        {existingCourseFilters.map((courseFilter) => (
          <MenuItem
            key={courseFilter.name}
            onClick={() => {
              setSelectedCourse(courseFilter);
              onChange(Some(courseFilter));
              setMenuAnchor(undefined);
            }}
          >
            {courseFilter.name}

            <IconButton
              onClick={(evt) => {
                evt.stopPropagation();
                // this won't work
                setExistingCourseFilters((old) => _.without(old, courseFilter));

                setSelectedCourse((old) => {
                  if (old?.name === courseFilter.name) {
                    return undefined;
                  }

                  return old;
                });
              }}
              style={{
                float: "right",
              }}
            >
              <TrashIcon />
            </IconButton>
          </MenuItem>
        ))}

        <Divider />

        <MenuItem onClick={() => showCreateCourseFilterModal(true)}>
          {translation.add}
        </MenuItem>
      </Menu>
    </>
  );
};
