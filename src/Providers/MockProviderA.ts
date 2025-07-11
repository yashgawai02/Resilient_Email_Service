import { EmailPayload, EmailProvider } from "../types";

export class MockProviderA implements EmailProvider {
  async sendEmail(payload: EmailPayload): Promise<void> {
    if (Math.random() < 0.5) throw new Error("MockProviderA failure");
    console.log("✅ Provider A sent:", payload.subject);
  }
}
