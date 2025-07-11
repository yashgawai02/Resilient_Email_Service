import express from "express";
import cors from "cors";
import { EmailService } from "./EmailService";
import { EmailQueue } from "./EmailQueue";
import { MockProviderA } from "./Providers/MockProviderA";
import { MockProviderB } from "./Providers/MockProviderB";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const emailService = new EmailService([new MockProviderA(), new MockProviderB()]);
const emailQueue = new EmailQueue(emailService);

app.post("/send-email", async (req, res) => {
  const { to, subject, body, idempotencyKey } = req.body;

  if (!to || !subject || !body || !idempotencyKey) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    emailQueue.enqueue({ to, subject, body, idempotencyKey });
    res.status(202).json({ message: "Email enqueued" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/status/:key", (req, res) => {
  const status = emailService.getStatus(req.params.key);
  res.json({ status });
});

app.listen(port, () => {
  console.log(`📡 Email API listening on port ${port}`);
});
