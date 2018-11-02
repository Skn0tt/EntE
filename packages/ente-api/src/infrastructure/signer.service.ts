import { Injectable } from "@nestjs/common";
import Axios from "axios";
import { Maybe, Some, None } from "monet";
import { Config } from "../helpers/config";

@Injectable()
export class SignerService {
  private readonly client = Axios.create({
    baseURL: Config.getSignerBaseUrl()
  });

  async createToken(payload: any): Promise<string> {
    const result = await this.client.post<string>("/tokens", payload);
    return result.data;
  }

  async validateToken(token: string): Promise<boolean> {
    const result = await this.client.head(`/tokens/${token}`, {
      validateStatus: status => [200, 404].includes(status)
    });
    if (result.status === 200) {
      return true;
    }
    if (result.status === 404) {
      return false;
    }
  }

  async decryptToken<T>(token: string): Promise<Maybe<T>> {
    const result = await this.client.get(`/tokens/${token}`, {
      validateStatus: status => [200, 404].includes(status)
    });
    if (result.status === 200) {
      return Some(result.data);
    }
    if (result.status === 404) {
      return None();
    }
  }

  async blockToken(token: string) {
    await this.client.delete(`/tokens/${token}`);
  }

  async isHealthy(): Promise<boolean> {
    return true;
    throw new Error("Not Implemented");
  }
}
