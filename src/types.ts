export interface Env {
  // OpenTelemetry configuration
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT?: string;
  OTEL_EXPORTER_OTLP_TRACES_HEADERS?: string;
  OTEL_SERVICE_NAME?: string;
  OTEL_SERVICE_VERSION?: string;

  // Secrets: `wrangler secrets put {key_name}`
  DD_API_KEY?: string;
}

export interface AuthRequest {
  firstName: string;
  lastName: string;
  userId: string;
}

export interface AuthResponse {
  authenticated: boolean;
  message?: string;
}