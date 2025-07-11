export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  idempotencyKey: string;
}

export interface EmailProvider {
  sendEmail(payload: EmailPayload): Promise<void>;
}
