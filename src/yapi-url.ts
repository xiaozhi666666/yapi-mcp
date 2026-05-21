import type { ParsedYapiUrl } from "./types.js";

export function parseYapiUrl(value: string): ParsedYapiUrl {
  const url = new URL(value);
  const projectMatch = url.pathname.match(/\/project\/(\d+)/);
  const interfaceMatch = url.pathname.match(/\/interface\/api\/(\d+)/);

  return {
    host: `${url.protocol}//${url.host}`,
    projectId: projectMatch?.[1] || url.searchParams.get("project_id") || "",
    interfaceId: interfaceMatch?.[1] || url.searchParams.get("id") || "",
  };
}

export function trimTrailingSlash(value: string | undefined): string {
  return value ? value.replace(/\/+$/, "") : "";
}
