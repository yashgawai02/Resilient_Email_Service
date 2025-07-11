import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// ✅ This is the route you are trying to call
app.post("/send-email", async (req, res) => {
  const { to, subject, body, idempotencyKey } = req.body;
  if (!to || !subject || !body || !idempotencyKey) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // (your email sending logic goes here)
  res.status(200).json({ message: "Email sent (mock)", status: "success" });
});

// ✅ Optional: Add a homepage
app.get("/", (req, res) => {
  res.send("✅ Resilient Email Service is running.");
});

app.listen(port, () => {
  console.log(`📡 Email API listening on port ${port}`);
});
