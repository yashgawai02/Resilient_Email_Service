# Resilient Email Service API

## Features
- Retry, fallback, idempotency, rate-limiting, circuit breaker, logging, queueing.
- Exposed REST API: `/send-email` and `/status/:key`.

## Setup
```bash
git clone ... && cd resilient-email-service
npm install typescript ts-node express cors @types/express @types/node
