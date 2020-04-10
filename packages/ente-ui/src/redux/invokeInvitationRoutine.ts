import { getConfig } from "./config";
import { post } from "./api";
import { Success, Fail } from "monet";
import { ErrorReporting } from "../ErrorReporting";

const { baseUrl } = getConfig();

export async function invokeInvitationRoutine(userId: string, token: string) {
  try {
    await post(`${baseUrl}/api/users/${userId}/invokeInvitationRoutine`, token);
    return Success<Error, void>(undefined);
  } catch (error) {
    await ErrorReporting.report(error);
    return Fail<Error, void>(error);
  }
}
