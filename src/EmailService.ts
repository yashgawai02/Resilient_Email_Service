import { EmailPayload, EmailProvider } from "./types";
import { RateLimiter } from "./RateLimiter";
import { CircuitBreaker } from "./CircuitBreaker";
import { Logger } from "./Logger";

export class EmailService {
  private sentCache = new Set<string>();
  private statusMap = new Map<string, string>();
  private rateLimiter = new RateLimiter(5, 10000);
  private circuitBreakers: CircuitBreaker[];

  constructor(private providers: EmailProvider[]) {
    this.circuitBreakers = providers.map(() => new CircuitBreaker());
  }

  public async sendEmail(payload: EmailPayload): Promise<void> {
    const key = payload.idempotencyKey;

    if (this.sentCache.has(key)) {
      Logger.warn(`Duplicate email: ${key}`);
      this.statusMap.set(key, "duplicate");
      return;
    }

    if (!this.rateLimiter.isAllowed()) {
      Logger.warn(`Rate limit hit: ${key}`);
      this.statusMap.set(key, "rate_limited");
      throw new Error("Rate limit exceeded");
    }

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const breaker = this.circuitBreakers[i];

      if (!breaker.isAvailable()) {
        Logger.warn(`Provider ${i + 1} skipped due to open circuit`);
        continue;
      }

      try {
        await this.retryWithBackoff(() => provider.sendEmail(payload), 3);
        breaker.success();
        this.sentCache.add(key);
        this.statusMap.set(key, `sent_via_provider_${i + 1}`);
        Logger.info(`Email ${key} sent via provider ${i + 1}`);
        return;
      } catch (err: any) {
        breaker.failure();
        Logger.error(`Provider ${i + 1} failed: ${err.message}`);
      }
    }

    this.statusMap.set(key, "failed");
    throw new Error("All providers failed");
  }

  private async retryWithBackoff(fn: () => Promise<void>, attempts: number): Promise<void> {
    let delay = 100;
    for (let i = 0; i < attempts; i++) {
      try {
        await fn();
        return;
      } catch {
        if (i === attempts - 1) throw new Error("Retries exhausted");
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
    }
  }

  public getStatus(key: string): string {
    return this.statusMap.get(key) ?? "unknown";
  }
}
