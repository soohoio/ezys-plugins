#!/usr/bin/env node
// Copy the published https://docs.ezys.io/SKILL.md into the plugin and, when
// it changed, bump the plugin's patch version in every manifest (clients
// update an installed plugin only when its version changes). Prints
// `changed=true|false` for the workflow.

import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { ROOT, SKILL_PATH, SKILL_URL, VERSIONED, fetchText, readJson, readText, writeJson } from './lib.mjs'

const published = await fetchText(SKILL_URL)
if (!/^---\nname: \S+\ndescription: \S/.test(published)) throw new Error(`${SKILL_URL} does not look like a SKILL.md`)
if (published === readText(SKILL_PATH)) {
  console.log('changed=false')
  process.exit(0)
}
writeFileSync(path.join(ROOT, SKILL_PATH), published)
const [major, minor, patch] = readJson(VERSIONED[0]).version.split('.').map(Number)
const next = `${major}.${minor}.${patch + 1}`
for (const f of VERSIONED) writeJson(f, { ...readJson(f), version: next })
console.log(`version=${next}`)
console.log('changed=true')
