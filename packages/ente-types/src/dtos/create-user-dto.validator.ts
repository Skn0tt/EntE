import { makeDtoValidator } from "../validators/make-validator";
import { CreateUserDto } from ".";
import { Roles } from "../roles";

export const CreateUserDtoValidator = makeDtoValidator(
  CreateUserDto,
  (dto, errors) => {
    const isParent = dto.role === Roles.PARENT;
    if (!isParent) {
      const hasChildren = dto.children.length !== 0;
      if (hasChildren) {
        errors.push("only user of role `parent` can have children");
      }
    }

    const isStudent = dto.role === Roles.STUDENT;
    if (isStudent) {
      const hasBirthday = !!dto.birthday;
      if (!hasBirthday) {
        errors.push("user of role `student` must have birthday set");
      }
    }

    const needsToHaveGraduationYear = [Roles.STUDENT, Roles.MANAGER].includes(
      dto.role
    );
    if (needsToHaveGraduationYear) {
      const hasGraduationYearSet = !!dto.graduationYear;
      if (!hasGraduationYearSet) {
        errors.push(
          "users of role `student` or `manager` need to have `graduationYear` set"
        );
      }
    }
  }
);
