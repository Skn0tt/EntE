import { makeDtoValidator } from "../validators/make-validator";
import { CreateUserDto } from ".";
import { Roles } from "../roles";

export const CreateUserDtoValidator = makeDtoValidator(
  CreateUserDto,
  (dto, errors) => {
    const isParent = dto.role === Roles.PARENT;
    const needsToHaveChildrenSet = isParent;
    const hasChildrenSet = dto.children.length !== 0;
    if (needsToHaveChildrenSet && !hasChildrenSet) {
      errors.push(`user of role '${dto.role}' must have children`);
    }
    if (!needsToHaveChildrenSet && hasChildrenSet) {
      errors.push(`only user of role '${dto.role}' may have children`);
    }

    const isStudent = dto.role === Roles.STUDENT;
    const needsToHaveBirthdaySet = isStudent;
    const hasBirthdaySet = !!dto.birthday;
    if (needsToHaveBirthdaySet && !hasBirthdaySet) {
      errors.push("user of role `student` must have birthday set");
    }
    if (!needsToHaveBirthdaySet && hasBirthdaySet) {
      errors.push(`users of role '${dto.role}' must not have 'birthday' set`);
    }

    const needsToHaveClass = [Roles.STUDENT, Roles.MANAGER].includes(dto.role);
    const hasClassSet = !!dto.class;
    if (needsToHaveClass && !hasClassSet) {
      errors.push(
        "users of role `student` or `manager` need to have `class` set"
      );
    }
    if (!needsToHaveClass && hasClassSet) {
      errors.push(`users of role '${dto.role}' must not have 'class' set`);
    }
  }
);
