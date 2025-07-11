import { EmailService } from "./EmailService";
import { EmailPayload } from "./types";
import { Logger } from "./Logger";

export class EmailQueue {
  private queue: EmailPayload[] = [];
  private running = false;

  constructor(private emailService: EmailService) {}

  public enqueue(email: EmailPayload) {
    this.queue.push(email);
    this.process();
  }

  private async process() {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const next = this.queue.shift()!;
      try {
        await this.emailService.sendEmail(next);
      } catch (err: any) {
        Logger.error(`Queue send failed for ${next.idempotencyKey}: ${err.message}`);
      }
    }

    this.running = false;
  }
}
