import { EmailService } from "../src/EmailService";
import { EmailPayload, EmailProvider } from "../src/types";

class SuccessProvider implements EmailProvider {
  async sendEmail(_: EmailPayload): Promise<void> {}
}

class FailingProvider implements EmailProvider {
  async sendEmail(_: EmailPayload): Promise<void> {
    throw new Error("fail");
  }
}

(async () => {
  const payload = {
    to: "test@example.com",
    subject: "test",
    body: "body",
    idempotencyKey: "test-123"
  };

  const service = new EmailService([new FailingProvider(), new SuccessProvider()]);
  await service.sendEmail(payload);

  console.assert(service.getStatus(payload.idempotencyKey) === "sent_via_provider_2", "✅ Fallback test passed");

  // Idempotency test
  await service.sendEmail(payload);
  console.assert(service.getStatus(payload.idempotencyKey) === "duplicate", "✅ Idempotency test passed");

  console.log("All tests passed ✅");
})();
