# YApi MCP

<p>
  <a href="./README.md"><strong>中文</strong></a>
  ·
  <a href="./README.en.md">English</a>
</p>

用于读取 YApi 接口元数据的 MCP server。你可以通过 YApi 页面 URL、接口 ID 或项目 ID 获取接口路径、请求参数、请求体、响应结构等信息。

它刻意保持项目无关：这个 MCP 只负责从 YApi 拉取结构化数据，至于如何生成 `services`、TypeScript 类型、model 或 API client，可以交给你的编码 agent 或项目专用生成器完成。

<!-- mcp-name: io.github.xiaozhi666666/yapi-mcp -->

## 功能

- 通过 YApi 页面 URL 或接口 ID 获取单个接口详情。
- 读取 YApi 项目的接口目录。
- 按关键字分页搜索项目接口。
- 支持 YApi 项目 token 鉴权和 cookie/session 鉴权。
- 返回归一化后的请求/响应元数据，也可按需返回原始 YApi 数据。

## 安装

```bash
npm install -g yapi-fetch-mcp
```

本地开发：

```bash
git clone https://github.com/xiaozhi666666/yapi-mcp.git
cd yapi-mcp
npm install
npm run build
```

## 配置

如果你的 YApi 支持项目 token，推荐使用：

```bash
export YAPI_HOST="https://yapi.example.com"
export YAPI_TOKEN="project-token"
```

如果你的 YApi 只能通过登录态访问，可以复制浏览器 cookie：

```bash
export YAPI_HOST="https://yapi.example.com"
export YAPI_COOKIE="_yapi_token=...; _yapi_uid=..."
```

工具参数里也可以直接传 `host`、`token` 和 `cookie`。

## MCP 客户端配置

推荐用 `npx`：

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

如果已经全局安装，也可以直接使用命令：

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

从源码运行：

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

## 工具

### `get_interface`

通过 URL 或接口 ID 获取单个接口详情。

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

返回字段包括：

- `method`
- `path`
- `headers`
- `query`
- `pathParams`
- `bodySchema`
- `responseSchema`
- 当 `includeRaw` 为 `true` 时返回原始 YApi 数据

### `list_project_interfaces`

读取 YApi 项目的接口目录。

```json
{
  "url": "https://yapi.example.com/project/12/interface/api/345"
}
```

### `search_project_interfaces`

按关键字分页搜索项目接口。

```json
{
  "projectId": 12,
  "keyword": "order",
  "page": 1,
  "limit": 20
}
```

## MCP Registry

仓库已经包含 `server.json` 和 `package.json#mcpName`，npm 包发布后可以继续走 MCP Registry 发布流程。

常见发布流程：

```bash
npm publish --access public
mcp-publisher login github
mcp-publisher publish
```

npm 包名：

```text
yapi-fetch-mcp
```

Registry server name：

```text
io.github.xiaozhi666666/yapi-mcp
```

## 说明

当前使用的常见 YApi API：

- `/api/interface/get?id=:interfaceId`
- `/api/interface/list_menu?project_id=:projectId`
- `/api/interface/list?project_id=:projectId&page=1&limit=20`

部分私有化 YApi 可能改造过鉴权方式。如果 token 不可用，可以尝试 `YAPI_COOKIE`。

## License

MIT
