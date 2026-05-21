import assert from "node:assert/strict";
import test from "node:test";
import { flattenInterfaceMenu, normalizeInterface, parseJsonLike } from "../src/normalize.js";
import { parseYapiUrl } from "../src/yapi-url.js";

test("parseYapiUrl extracts host, project ID, and interface ID", () => {
  assert.deepEqual(parseYapiUrl("https://yapi.example.com/project/12/interface/api/345"), {
    host: "https://yapi.example.com",
    projectId: "12",
    interfaceId: "345",
  });
});

test("parseYapiUrl supports query fallback", () => {
  assert.deepEqual(parseYapiUrl("https://yapi.example.com/api?id=345&project_id=12"), {
    host: "https://yapi.example.com",
    projectId: "12",
    interfaceId: "345",
  });
});

test("parseJsonLike parses JSON strings and preserves plain text", () => {
  assert.deepEqual(parseJsonLike('{"type":"object"}'), { type: "object" });
  assert.equal(parseJsonLike("not json"), "not json");
  assert.equal(parseJsonLike(""), null);
});

test("normalizeInterface returns stable interface metadata", () => {
  const normalized = normalizeInterface({
    _id: 345,
    title: "Create order",
    method: "POST",
    path: "/orders",
    req_body_type: "json",
    req_body_other: '{"type":"object","required":["name"]}',
    res_body_type: "json",
    res_body: '{"type":"object","properties":{"id":{"type":"number"}}}',
  });

  assert.equal(normalized.id, 345);
  assert.equal(normalized.method, "POST");
  assert.equal(normalized.path, "/orders");
  assert.deepEqual(normalized.bodySchema, { type: "object", required: ["name"] });
  assert.deepEqual(normalized.responseSchema, {
    type: "object",
    properties: {
      id: {
        type: "number",
      },
    },
  });
});

test("flattenInterfaceMenu flattens category lists", () => {
  assert.deepEqual(
    flattenInterfaceMenu([
      {
        _id: 1,
        name: "Orders",
        list: [
          {
            _id: 345,
            title: "Create order",
            method: "POST",
            path: "/orders",
          },
        ],
      },
    ]),
    [
      {
        id: 345,
        title: "Create order",
        method: "POST",
        path: "/orders",
        categoryId: 1,
        categoryName: "Orders",
      },
    ],
  );
});
