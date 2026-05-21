import http from "node:http";
import https from "node:https";
import type { YapiAuth } from "./types.js";

type QueryValue = string | number | boolean | undefined | null;

interface YapiResponse<T> {
  errcode?: number;
  errmsg?: string;
  data?: T;
}

export async function requestYapi<T>(auth: YapiAuth, apiPath: string, params: Record<string, QueryValue>): Promise<T> {
  const url = new URL(apiPath, auth.host);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  if (auth.token) {
    url.searchParams.set("token", auth.token);
  }

  const payload = await requestJson<YapiResponse<T> | T>(url, auth.cookie);

  if (isYapiEnvelope(payload)) {
    if (payload.errcode !== 0) {
      throw new Error(`YApi error ${payload.errcode}: ${payload.errmsg || "Unknown error"}`);
    }

    return payload.data as T;
  }

  return payload as T;
}

function requestJson<T>(url: URL, cookie?: string): Promise<T> {
  const client = url.protocol === "http:" ? http : https;

  return new Promise((resolve, reject) => {
    const req = client.request(
      url,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(cookie ? { Cookie: cookie } : {}),
        },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error(`YApi HTTP ${res.statusCode || "unknown"}: ${body.slice(0, 300)}`));
            return;
          }

          try {
            resolve(JSON.parse(body) as T);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            reject(new Error(`YApi did not return JSON: ${message}`));
          }
        });
      },
    );

    req.on("error", reject);
    req.end();
  });
}

function isYapiEnvelope<T>(payload: T | YapiResponse<T>): payload is YapiResponse<T> {
  return typeof payload === "object" && payload !== null && "errcode" in payload;
}
