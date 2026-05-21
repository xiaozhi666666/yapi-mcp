import type { FlattenedInterface, NormalizedYapiInterface, YapiMenuCategory } from "./types.js";

interface YapiInterfaceLike {
  id?: string | number;
  _id?: string | number;
  title?: string;
  desc?: string;
  markdown?: string;
  method?: string;
  path?: string;
  project_id?: string | number;
  catid?: string | number;
  req_headers?: unknown[];
  req_query?: unknown[];
  req_params?: unknown[];
  req_body_form?: unknown[];
  req_body_type?: string;
  req_body_other?: unknown;
  res_body_type?: string;
  res_body?: unknown;
}

export function normalizeInterface(item: YapiInterfaceLike): NormalizedYapiInterface {
  return {
    id: item._id || item.id,
    title: item.title || "",
    description: item.desc || item.markdown || "",
    method: item.method || "GET",
    path: item.path || "",
    projectId: item.project_id,
    categoryId: item.catid,
    headers: item.req_headers || [],
    query: item.req_query || [],
    pathParams: item.req_params || [],
    bodyForm: item.req_body_form || [],
    bodyType: item.req_body_type || "",
    bodySchema: parseJsonLike(item.req_body_other),
    responseBodyType: item.res_body_type || "",
    responseSchema: parseJsonLike(item.res_body),
  };
}

export function flattenInterfaceMenu(menu: unknown): FlattenedInterface[] {
  if (!Array.isArray(menu)) {
    return [];
  }

  return (menu as YapiMenuCategory[]).flatMap((category) => {
    const list = Array.isArray(category.list) ? category.list : [];

    return list.map((item) => ({
      id: item._id || item.id,
      title: item.title || "",
      method: item.method || "",
      path: item.path || "",
      categoryId: category._id || category.id,
      categoryName: category.name || "",
    }));
  });
}

export function parseJsonLike(value: unknown): unknown {
  if (!value || typeof value !== "string") {
    return value || null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
