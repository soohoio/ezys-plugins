#!/usr/bin/env node
// Consistency checks for the marketplace and plugin manifests.
//
//   node scripts/check.mjs           # offline: manifests agree with each other
//   node scripts/check.mjs --live    # also: the skill copy equals the published
//                                    # SKILL.md and the MCP server answers
//
// `claude plugin validate --strict .` (validate.yml) checks the Claude Code
// schema; this checks what no single schema can: that the four plugin
// manifests, three marketplaces and two MCP configs describe the same plugin.

import { existsSync } from 'node:fs'
import path from 'node:path'
import { MARKETPLACES, MCP_URL, PLUGIN_DIR, ROOT, SKILL_PATH, SKILL_URL, VERSIONED, fetchText, readJson, readText } from './lib.mjs'

const problems = []
const fail = (m) => problems.push(m)

const manifests = Object.fromEntries(VERSIONED.map((f) => [f, readJson(f)]))
const base = manifests[`${PLUGIN_DIR}/plugin.json`]
for (const [f, m] of Object.entries(manifests)) {
  for (const key of ['name', 'version', 'description', 'homepage', 'repository']) {
    if (JSON.stringify(m[key]) !== JSON.stringify(base[key])) fail(`${f}: ${key} ${JSON.stringify(m[key])} differs from plugin.json ${JSON.stringify(base[key])}`)
  }
  if (!/^\d+\.\d+\.\d+$/.test(m.version)) fail(`${f}: version ${m.version} is not x.y.z`)
  for (const key of ['skills', 'mcpServers', 'icon', 'logo']) {
    if (typeof m[key] === 'string' && !existsSync(path.join(ROOT, PLUGIN_DIR, m[key]))) fail(`${f}: ${key} ${m[key]} does not exist`)
  }
  for (const key of ['composerIcon', 'logo']) {
    const v = m.interface?.[key]
    if (v && !existsSync(path.join(ROOT, PLUGIN_DIR, v))) fail(`${f}: interface.${key} ${v} does not exist`)
  }
}

for (const f of MARKETPLACES) {
  const mp = readJson(f)
  if (mp.name !== 'ezys') fail(`${f}: marketplace name ${mp.name}, expected ezys (install id docs@ezys)`)
  const entry = mp.plugins.find((p) => p.name === base.name)
  if (!entry) {
    fail(`${f}: no entry for ${base.name}`)
    continue
  }
  const source = typeof entry.source === 'string' ? entry.source : entry.source?.path
  if (path.normalize(source ?? '') !== PLUGIN_DIR) fail(`${f}: source ${JSON.stringify(entry.source)} is not ${PLUGIN_DIR}`)
  if (entry.description !== undefined && entry.description !== base.description) fail(`${f}: description differs from plugin.json`)
}

for (const f of [`${PLUGIN_DIR}/.mcp.json`, `${PLUGIN_DIR}/mcp.json`]) {
  const servers = Object.values(readJson(f).mcpServers ?? {})
  if (servers.length !== 1 || servers[0].url !== MCP_URL) fail(`${f}: expected exactly one server at ${MCP_URL}`)
}

const skill = readText(SKILL_PATH)
const name = skill.match(/^---\n[\s\S]*?^name: (\S+)$/m)?.[1]
if (name !== path.basename(path.dirname(SKILL_PATH))) fail(`${SKILL_PATH}: frontmatter name ${name} must equal its directory name`)

if (process.argv.includes('--live')) {
  const published = await fetchText(SKILL_URL)
  if (published !== skill) fail(`${SKILL_PATH} differs from ${SKILL_URL} — run node scripts/sync-skill.mjs`)
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'user-agent': 'ezys-plugins' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'ezys-plugins-check', version: '1' } } })
  })
  const body = res.ok ? await res.json() : null
  if (body?.result?.serverInfo?.name !== 'ezys-docs') fail(`${MCP_URL}: initialize did not answer as ezys-docs (HTTP ${res.status})`)
}

if (problems.length) {
  console.error(`check FAILED (${problems.length}):`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log(`check OK — ${base.name}@${base.version}, ${VERSIONED.length} manifests, ${MARKETPLACES.length} marketplaces${process.argv.includes('--live') ? ', skill and MCP live' : ''}`)
