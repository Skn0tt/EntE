import { post } from "./api";
import { Success, Fail } from "monet";
import { ErrorReporting } from "../ErrorReporting";

export async function invokeInvitationRoutine(userId: string, token: string) {
  try {
    await post(`/api/users/${userId}/invokeInvitationRoutine`, token);
    return Success<Error, void>(undefined);
  } catch (error) {
    await ErrorReporting.report(error);
    return Fail<Error, void>(error);
  }
}
