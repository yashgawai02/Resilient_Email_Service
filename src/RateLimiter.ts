export class RateLimiter {
  private timestamps: number[] = [];

  constructor(private max: number, private intervalMs: number) {}

  isAllowed(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < this.intervalMs);

    if (this.timestamps.length >= this.max) return false;

    this.timestamps.push(now);
    return true;
  }
}
