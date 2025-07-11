import { EmailPayload, EmailProvider } from "../types";

export class MockProviderB implements EmailProvider {
  async sendEmail(payload: EmailPayload): Promise<void> {
    if (Math.random() < 0.5) throw new Error("MockProviderB failure");
    console.log("✅ Provider B sent:", payload.subject);
  }
}
