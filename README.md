# Cloudflare Worker with Datadog OpenTelemetry Traces

A TypeScript-based Cloudflare Worker for testing Cloudflare --> Datadog OTLP traces. 


### Example cURL

```bash
curl -X POST https://dd-otel-traces.nfr-account-datadog.workers.dev/ \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "userId": "123"
  }'
```

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set Datadog API key** (required):
   ```bash
   npx wrangler secret put DD_API_KEY
   ```

3. **Configure environment** (optional):
   Edit `wrangler.toml` to customize:
   - `OTEL_SERVICE_NAME` - Service name in traces
   - `OTEL_SERVICE_VERSION` - Service version
   - `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` - Datadog endpoint


## Development

```bash
# Start local development server
npm run dev

# Build TypeScript
npm run build

# Deploy to Cloudflare
npm run deploy

# Tail logs
npx wrangler tail
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DD_API_KEY` | Datadog API key (secret) | ✅ |
| `OTEL_SERVICE_NAME` | Service name | ❌ |
| `OTEL_SERVICE_VERSION` | Service version | ❌ |
| `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` | Datadog traces endpoint | ✅ |
| `OTEL_EXPORTER_OTLP_TRACES_HEADERS` | OTLP headers config | ✅ |
