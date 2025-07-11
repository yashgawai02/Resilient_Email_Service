export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";

  constructor(
    private threshold = 3,
    private resetTimeout = 10000
  ) {}

  isAvailable(): boolean {
    if (this.state === "OPEN" && Date.now() - this.lastFailureTime > this.resetTimeout) {
      this.state = "HALF_OPEN";
      return true;
    }
    return this.state !== "OPEN";
  }

  success() {
    this.failures = 0;
    this.state = "CLOSED";
  }

  failure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = "OPEN";
    }
  }
}
