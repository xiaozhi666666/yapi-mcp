# YApi MCP

<p>
  <a href="./README.md">中文</a>
  ·
  <a href="./README.en.md"><strong>English</strong></a>
</p>

Reusable MCP server for reading YApi interface metadata from a URL, interface ID, or project ID.

It is intentionally project-agnostic: this server fetches structured YApi data, while your coding agent or project-specific generator decides how to create `services`, TypeScript types, models, or API clients.

<!-- mcp-name: io.github.xiaozhi666666/yapi-mcp -->

## Features

- Fetch one YApi interface by page URL or interface ID.
- List all interfaces from a YApi project menu.
- Search/list project interfaces with pagination.
- Supports YApi project token auth and cookie/session auth.
- Returns normalized request/response metadata plus optional raw YApi payloads.

## Install

```bash
npm install -g yapi-fetch-mcp
```

For local development:

```bash
git clone https://github.com/xiaozhi666666/yapi-mcp.git
cd yapi-mcp
npm install
npm run build
```

## Configure

Use a YApi project token when available:

```bash
export YAPI_HOST="https://yapi.example.com"
export YAPI_TOKEN="project-token"
```

For YApi instances that require browser login, copy your login cookie:

```bash
export YAPI_HOST="https://yapi.example.com"
export YAPI_COOKIE="_yapi_token=...; _yapi_uid=..."
```

Tool arguments can also pass `host`, `token`, and `cookie` directly.

## MCP Client Example

Recommended `npx` setup:

```json
{
  "mcpServers": {
    "yapi": {
      "command": "npx",
      "args": ["-y", "yapi-fetch-mcp"],
      "env": {
        "YAPI_HOST": "https://yapi.example.com",
        "YAPI_TOKEN": "project-token"
      }
    }
  }
}
```

If installed globally, you can also use the binary directly:

```json
{
  "mcpServers": {
    "yapi": {
      "command": "yapi-fetch-mcp",
      "env": {
        "YAPI_HOST": "https://yapi.example.com",
        "YAPI_TOKEN": "project-token"
      }
    }
  }
}
```

When running from source:

```json
{
  "mcpServers": {
    "yapi": {
      "command": "node",
      "args": ["/absolute/path/to/yapi-mcp/build/src/index.js"],
      "env": {
        "YAPI_HOST": "https://yapi.example.com",
        "YAPI_TOKEN": "project-token"
      }
    }
  }
}
```

## Tools

### `get_interface`

Fetch one interface by URL or ID.

```json
{
  "url": "https://yapi.example.com/project/12/interface/api/345"
}
```

```json
{
  "host": "https://yapi.example.com",
  "interfaceId": 345,
  "token": "project-token"
}
```

Returns:

- `method`
- `path`
- `headers`
- `query`
- `pathParams`
- `bodySchema`
- `responseSchema`
- optional raw YApi payload when `includeRaw` is true

### `list_project_interfaces`

Fetch a project's YApi interface menu.

```json
{
  "url": "https://yapi.example.com/project/12/interface/api/345"
}
```

### `search_project_interfaces`

Search/list project interfaces with pagination.

```json
{
  "projectId": 12,
  "keyword": "order",
  "page": 1,
  "limit": 20
}
```

## MCP Registry

This repository includes `server.json` and `package.json#mcpName` so it is ready for the MCP Registry flow after the npm package is published.

Typical publish flow:

```bash
npm publish --access public
mcp-publisher login github
mcp-publisher publish
```

The npm package name is:

```text
yapi-fetch-mcp
```

The registry server name is:

```text
io.github.xiaozhi666666/yapi-mcp
```

## Notes

Common YApi API endpoints used here:

- `/api/interface/get?id=:interfaceId`
- `/api/interface/list_menu?project_id=:projectId`
- `/api/interface/list?project_id=:projectId&page=1&limit=20`

Some private YApi deployments customize auth. If token auth fails, use `YAPI_COOKIE`.

## License

MIT
