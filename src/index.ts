import { MockProviderA } from "./Providers/MockProviderA";
import { MockProviderB } from "./Providers/MockProviderB";
import { EmailService } from "./EmailService";
import { EmailQueue } from "./EmailQueue";

const service = new EmailService([new MockProviderA(), new MockProviderB()]);
const queue = new EmailQueue(service);

queue.enqueue({
  to: "demo@example.com",
  subject: "Hello from queue",
  body: "Queued email body",
  idempotencyKey: "msg-001"
});
