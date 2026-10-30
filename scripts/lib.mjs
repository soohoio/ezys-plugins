// Shared paths and helpers for scripts/check.mjs and scripts/sync-skill.mjs.
//
// There is one plugin (`docs`), so the manifests are written by hand instead
// of generated; check.mjs keeps them consistent with each other.

import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const PLUGIN_DIR = 'plugins/docs'

/** Every file that carries the plugin version. sync-skill.mjs bumps them together. */
export const VERSIONED = [`${PLUGIN_DIR}/plugin.json`, `${PLUGIN_DIR}/.claude-plugin/plugin.json`, `${PLUGIN_DIR}/.codex-plugin/plugin.json`, `${PLUGIN_DIR}/.cursor-plugin/plugin.json`]

export const MARKETPLACES = ['.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json', '.cursor-plugin/marketplace.json']

/** The skill is a copy of the one the docs site publishes; its only source is ezys-core apps/docs/agent/SKILL.md. */
export const SKILL_PATH = `${PLUGIN_DIR}/skills/ezys-docs/SKILL.md`
export const SKILL_URL = 'https://docs.ezys.io/SKILL.md'
export const MCP_URL = 'https://docs.ezys.io/mcp'

export const readJson = (rel) => JSON.parse(readFileSync(path.join(ROOT, rel), 'utf-8'))
export const writeJson = (rel, value) => writeFileSync(path.join(ROOT, rel), JSON.stringify(value, null, 2) + '\n')
export const readText = (rel) => readFileSync(path.join(ROOT, rel), 'utf-8')

export async function fetchText(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'ezys-plugins' } })
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
  return res.text()
}
