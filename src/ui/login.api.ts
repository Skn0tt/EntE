import { AuthState, APIResponse, UserN, BasicCredentials } from "./redux";
import Axios from "axios";
import { LoginDto } from "@@types";
import {
  getAuthState,
  mergeAPIResponses,
  normalizeUsers,
  normalizeEntries,
  normalizeSlots,
} from "./redux/api";
import { Set } from "immutable";
import { None, Some, Maybe } from "monet";

export module LoginAPI {
  export interface LoginInfo {
    authState: AuthState;
    apiResponse: APIResponse;
    oneSelf: UserN;
    reviewedRecords: Set<string>;
  }

  async function _login(auth: BasicCredentials): Promise<LoginInfo> {
    const response = await Axios.get<LoginDto>("/api/login", {
      auth,
    });

    const {
      token,
      oneSelf,
      neededUsers,
      onesEntries,
      reviewedRecords = [],
      prefiledSlots,
    } = response.data;
    const authState = getAuthState(token);

    const apiResponse = mergeAPIResponses(
      normalizeUsers(...neededUsers, oneSelf),
      normalizeEntries(...onesEntries),
      normalizeSlots(...prefiledSlots)
    );

    return {
      authState,
      apiResponse,
      oneSelf: UserN({
        ...oneSelf,
        children: [],
        childrenIds: oneSelf.children.map((c) => c.id),
      }),
      reviewedRecords: Set(reviewedRecords),
    };
  }

  export async function login(
    auth: BasicCredentials
  ): Promise<Maybe<LoginInfo>> {
    try {
      const response = await _login(auth);
      return Some(response);
    } catch (error) {
      return None();
    }
  }
}
