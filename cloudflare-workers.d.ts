declare module "cloudflare:workers" {
  // The concrete binding shape is injected by the hosting runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const env: any;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

// Hosting provides the complete D1 surface at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type D1Database = any;
