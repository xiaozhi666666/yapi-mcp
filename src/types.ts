export interface YapiAuth {
  host: string;
  token?: string;
  cookie?: string;
}

export interface YapiInterfaceSource extends YapiAuth {
  interfaceId: string;
}

export interface YapiProjectSource extends YapiAuth {
  projectId: string;
}

export interface ParsedYapiUrl {
  host: string;
  projectId: string;
  interfaceId: string;
}

export interface YapiMenuItem {
  id?: string | number;
  _id?: string | number;
  title?: string;
  method?: string;
  path?: string;
}

export interface YapiMenuCategory {
  id?: string | number;
  _id?: string | number;
  name?: string;
  list?: YapiMenuItem[];
}

export interface NormalizedYapiInterface {
  id: string | number | undefined;
  title: string;
  description: string;
  method: string;
  path: string;
  projectId: string | number | undefined;
  categoryId: string | number | undefined;
  headers: unknown[];
  query: unknown[];
  pathParams: unknown[];
  bodyForm: unknown[];
  bodyType: string;
  bodySchema: unknown;
  responseBodyType: string;
  responseSchema: unknown;
}

export interface FlattenedInterface {
  id: string | number | undefined;
  title: string;
  method: string;
  path: string;
  categoryId: string | number | undefined;
  categoryName: string;
}
