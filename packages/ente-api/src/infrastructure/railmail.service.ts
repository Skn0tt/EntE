import { Injectable } from "@nestjs/common";
import Axios, { AxiosInstance } from "axios";
import { Config } from "../helpers/config";

interface Envelope {
  subject: string;
  recipients: string[];
  body:
    | {
        text: string;
        html: string;
      }
    | {
        text: string;
      }
    | {
        html: string;
      };
}

@Injectable()
export class RailmailService {
  private readonly railmail: AxiosInstance;

  constructor() {
    const railMailUrl = Config.getRailmailHost();
    this.railmail = Axios.create({
      baseURL: railMailUrl
    });
  }

  async sendMail(envelope: Envelope) {
    await this.railmail.post("/mail", envelope);
  }

  async isHealthy(): Promise<boolean> {
    return true;
    throw new Error("Not Implemented");
  }
}
