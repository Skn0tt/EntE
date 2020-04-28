import { AuthState, APIResponse, UserN, BasicCredentials } from "./redux";
import Axios, { AxiosResponse } from "axios";
import { LoginDto } from "@@types";
import {
  getAuthState,
  mergeAPIResponses,
  normalizeUsers,
  normalizeEntries,
  normalizeSlots,
} from "./redux/api";
import { Set } from "immutable";
import { Validation, Fail, Success } from "monet";

type LoginFailedReason = "totp_missing" | "auth_invalid";

export module LoginAPI {
  export interface LoginInfo {
    authState: AuthState;
    apiResponse: APIResponse;
    oneSelf: UserN;
    reviewedRecords: Set<string>;
  }

  export async function login(
    auth: BasicCredentials,
    totpToken: string | undefined
  ): Promise<Validation<LoginFailedReason, LoginInfo>> {
    const headers = !!totpToken ? { "X-TOTP-Token": totpToken } : undefined;
    const response = await Axios.get<LoginDto | { message?: "totp_missing" }>(
      "/api/login",
      {
        auth,
        headers,
        validateStatus: (s) => [200, 401].includes(s),
      }
    );

    if (response.status === 401) {
      const { message } = response.data as { message?: "totp_missing" };
      if (message === "totp_missing") {
        return Fail("totp_missing");
      } else {
        return Fail("auth_invalid");
      }
    }

    const {
      token,
      oneSelf,
      neededUsers,
      onesEntries,
      reviewedRecords = [],
      prefiledSlots,
    } = response.data as LoginDto;
    const authState = getAuthState(token);

    const apiResponse = mergeAPIResponses(
      normalizeUsers(...neededUsers, oneSelf),
      normalizeEntries(...onesEntries),
      normalizeSlots(...prefiledSlots)
    );

    return Success({
      authState,
      apiResponse,
      oneSelf: UserN({
        ...oneSelf,
        children: [],
        childrenIds: oneSelf.children.map((c) => c.id),
      }),
      reviewedRecords: Set(reviewedRecords),
    });
  }
}
