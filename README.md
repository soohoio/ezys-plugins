# Ezys Plugins

Plugins for using the [Ezys documentation](https://docs.ezys.io/) with AI agents and developer tools.

## Status

The `docs` plugin (Claude Code, Codex and Cursor marketplace manifests) is in preparation. Its two parts are already available:

| | URL |
| --- | --- |
| Read-only MCP server (Streamable HTTP) | `https://docs.ezys.io/mcp` |
| Agent skill | https://docs.ezys.io/SKILL.md |

The MCP server provides `search`, `list_pages`, `read_page` and `get_api_operation` (one Partner API OpenAPI operation with its schemas resolved). It only reads the published documentation; it does not call the Ezys API or handle credentials.

Until the plugin is published, add the server directly:

```sh
# Claude Code
claude mcp add --transport http ezys-docs https://docs.ezys.io/mcp
```

Without MCP, agents can read [`llms.txt`](https://docs.ezys.io/llms.txt), [`llms-full.txt`](https://docs.ezys.io/llms-full.txt), or any page as Markdown by replacing `.html` with `.md` in its URL.
