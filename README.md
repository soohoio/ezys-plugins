# Ezys Plugins

Plugins for using the [Ezys documentation](https://docs.ezys.io/) with AI agents and developer tools.

## Plugins

| Plugin | Description |
| --- | --- |
| [`docs`](./plugins/docs) | Search and read the Ezys documentation and look up Partner API operations through the hosted, read-only MCP server. |

The `docs` plugin bundles two things:

- **MCP server** `https://docs.ezys.io/mcp` (Streamable HTTP) with the tools `search`, `list_pages`, `read_page` and `get_api_operation` (one OpenAPI operation with its schemas and authentication resolved). It only reads the published documentation; it does not call the Ezys API or handle credentials.
- **Skill** `ezys-docs`: which pages to read for which task, and rules for staying grounded in them. It is a copy of https://docs.ezys.io/SKILL.md.

## Usage

```sh
# Claude Code
claude plugin marketplace add soohoio/ezys-plugins
claude plugin install docs@ezys
# or, inside Claude Code 2.1.275 or later, in one step:
/plugin install docs --marketplace soohoio/ezys-plugins

# Codex
codex plugin marketplace add soohoio/ezys-plugins
codex plugin add docs@ezys
```

The repository also contains a Cursor marketplace manifest (`.cursor-plugin/`).

Only the MCP server, without the plugin:

```sh
claude mcp add --transport http ezys-docs https://docs.ezys.io/mcp
```

Without MCP, agents can read [`llms.txt`](https://docs.ezys.io/llms.txt), [`llms-full.txt`](https://docs.ezys.io/llms-full.txt), or any page as Markdown by replacing `.html` with `.md` in its URL.

## Development

```sh
node scripts/check.mjs          # manifests, marketplaces and MCP configs agree
node scripts/check.mjs --live   # also: the skill copy equals the published SKILL.md, the MCP server answers
claude plugin validate --strict .
```

The manifests are written by hand; `scripts/check.mjs` keeps the four plugin manifests (`plugin.json`, `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`) on the same name, version and description.

Do not edit `plugins/docs/skills/ezys-docs/SKILL.md` here. Its source is `apps/docs/agent/SKILL.md` in the Ezys core repository, published at https://docs.ezys.io/SKILL.md. `.github/workflows/sync-skill.yml` checks the published file daily and opens a pull request that copies it and bumps the plugin's patch version.
