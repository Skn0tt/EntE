import { Validation } from "monet";

export interface Envelope {
  subject: string;
  recipients: string[];
  body: {
    text?: string;
    html?: string;
  };
}

export interface EmailTransportService {
  sendMail(envelope: Envelope): Promise<Validation<string, void>>;
}
