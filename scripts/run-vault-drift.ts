/**
 * One-shot script: run the vault drift detection and print results.
 * Usage: npx tsx --tsconfig tsconfig.json scripts/run-vault-drift.ts
 */
import path from "node:path";

// Ensure process.cwd() is the project root
process.chdir(path.resolve(import.meta.dirname, ".."));

import { loadVaultData } from "../src/lib/knowledgeVaultLoader.js";

const hardcodedTopics = [
  { category: "Dashboard Overview",                     keywords: ["dashboard", "online", "offline", "storage", "status"] },
  { category: "Create Network",                         keywords: ["network", "playlog interval", "background download"] },
  { category: "Create Location",                        keywords: ["location", "timezone", "zone", "subzone"] },
  { category: "Create Playlist",                        keywords: ["playlist", "normal", "fixed", "prime", "dependent"] },
  { category: "Create Layout",                          keywords: ["layout", "tag", "zone", "split screen", "screen type", "resolution"] },
  { category: "Create Device",                          keywords: ["device", "device manager", "verification code"] },
  { category: "Device Pairing",                         keywords: ["pair", "pairing", "verification", "code"] },
  { category: "Storage Management",                     keywords: ["storage", "upload", "media", "folder"] },
  { category: "Default Playlist",                       keywords: ["default playlist", "fallback", "image", "video"] },
  { category: "Schedule Content",                       keywords: ["schedule", "scheduling", "campaign", "daypart", "spot"] },
  { category: "Bundle Scheduling",                      keywords: ["bundle", "bundle schedule"] },
  { category: "Publish Content",                        keywords: ["publish", "publishing", "unable to publish", "error"] },
  { category: "Playlogs",                               keywords: ["playlog", "playlogs", "report", "proof of play"] },
  { category: "User Management",                        keywords: ["user", "roles", "permissions", "rbac"] },
  { category: "Basic Troubleshooting",                  keywords: ["troubleshoot", "troubleshooting", "black screen", "offline", "not playing", "wrong content", "old content", "missing playlog", "sync failure", "synchronization", "programmatic failure"] },
  { category: "Installation of LMX Content App",        keywords: ["android", "windows", "install", "installation", "apk", "installer", "verification code", "software render", "sr build"] },
  { category: "Supported Operating Systems & Hardware", keywords: ["requirements", "spec", "hardware", "operating system", "os", "webview", "ram", "storage", "android 11", "windows 10", "windows 11", "linux", "webos", "brightsign"] },
  { category: "Programmatic / VAST",                    keywords: ["programmatic", "vast", "url", "ima", "hivestack", "dv360", "ssp", "dsp", "no-fill", "impression", "webview", "html", "online zip", "offline zip"] },
];

const hardcodedSynonymGroupCount = 23;
const hardcodedPlaybookIds    = ["old-content", "black-screen", "offline-device", "missing-playlog", "publish-error"];
const hardcodedPlatformNames  = ["Android", "Windows", "Linux", "LG webOS", "BrightSign"];

const vault = loadVaultData();

const tag = "[vault-drift]";
let warnings = 0;
let infos    = 0;

function warn(msg: string) { console.log(`${tag} WARN   ${msg}`); warnings++; }
function info(msg: string) { console.log(`${tag} INFO   ${msg}`); infos++;    }
function ok(msg: string)   { console.log(`${tag} OK     ${msg}`); }

console.log(`\n${"─".repeat(72)}`);
console.log("VAULT DRIFT DETECTION REPORT");
console.log(`${"─".repeat(72)}\n`);

// ── Topics ────────────────────────────────────────────────────────────────────
console.log("[ TOPICS ]\n");
for (const entry of hardcodedTopics) {
  const vt = vault.topics.get(entry.category);

  if (!vt) {
    warn(`Topic "${entry.category}" — no vault frontmatter found.`);
    continue;
  }

  const missingKw = entry.keywords.filter(k => !vt.keywords.includes(k));
  const extraKw   = vt.keywords.filter(k => !entry.keywords.includes(k));

  if (missingKw.length) warn(`"${entry.category}" — keywords in hardcode NOT in vault:  [${missingKw.join(", ")}]`);
  if (extraKw.length)   info(`"${entry.category}" — keywords in vault NOT in hardcode (vault ahead): [${extraKw.join(", ")}]`);
  if (!missingKw.length && !extraKw.length) ok(`"${entry.category}" — keywords match (${vt.keywords.length} terms)`);

  if (!vt.confluenceUrls.length) warn(`"${entry.category}" — no confluence_urls in vault frontmatter.`);
  else ok(`"${entry.category}" — ${vt.confluenceUrls.length} Confluence link(s)`);

  if (!vt.nextStep) warn(`"${entry.category}" — next_step is empty.`);
}

for (const [category] of vault.topics) {
  if (!hardcodedTopics.some(e => e.category === category)) {
    info(`Topic "${category}" is in vault but not in hardcoded KB (vault is ahead).`);
  }
}

// ── Synonym groups ─────────────────────────────────────────────────────────────
console.log("\n[ SYNONYM GROUPS ]\n");
if (vault.synonymGroups.length !== hardcodedSynonymGroupCount) {
  warn(`Count mismatch — hardcoded: ${hardcodedSynonymGroupCount}, vault: ${vault.synonymGroups.length}`);
} else {
  ok(`${vault.synonymGroups.length} groups — count matches hardcoded.`);
}

// Spot-check: first term of each hardcoded group must exist in vault
const firstTerms = [
  "black screen", "device offline", "content not playing", "wrong content", "old content",
  "playlog", "publish", "schedule", "pairing", "storage", "default playlist", "programmatic",
  "hardware", "user management", "not approved", "ad tag", "bundle scheduling", "media format",
  "webview version", "pull to content", "download", "max dsp", "ssp overview"
];
for (const term of firstTerms) {
  const found = vault.synonymGroups.some(g => g.includes(term));
  if (!found) warn(`Synonym group with anchor term "${term}" not found in vault.`);
  else ok(`Synonym anchor "${term}" present in vault.`);
}

// ── Playbooks ──────────────────────────────────────────────────────────────────
console.log("\n[ PLAYBOOKS ]\n");
for (const id of hardcodedPlaybookIds) {
  const vp = vault.playbooks.find(p => p.id === id);
  if (!vp) {
    warn(`Playbook "${id}" — no vault file found.`);
  } else {
    const issues = [];
    if (!vp.triggers.length)   issues.push("no triggers");
    if (!vp.whatToCheck.length) issues.push("no whatToCheck");
    if (!vp.howToFix.length)   issues.push("no howToFix");
    if (!vp.clientResponse)    issues.push("no clientResponse");
    if (issues.length) warn(`Playbook "${id}" — incomplete: ${issues.join(", ")}`);
    else ok(`Playbook "${id}" — "${vp.title}" (${vp.triggers.length} triggers, ${vp.whatToCheck.length} checks, ${vp.howToFix.length} fixes)`);
  }
}

// ── Platforms ──────────────────────────────────────────────────────────────────
console.log("\n[ PLATFORMS ]\n");
for (const name of hardcodedPlatformNames) {
  const vp = vault.platforms.find(p => p.platform === name);
  if (!vp) {
    warn(`Platform "${name}" — no vault file found.`);
  } else {
    const issues = [];
    if (!vp.triggers.length)  issues.push("no triggers");
    if (!vp.osVersion)        issues.push("no os_version");
    if (!vp.memory.length)    issues.push("no memory");
    if (!vp.processor.length) issues.push("no processor");
    if (issues.length) warn(`Platform "${name}" — incomplete: ${issues.join(", ")}`);
    else ok(`Platform "${name}" — OS: "${vp.osVersion}" | ${vp.memory.length} memory tiers | ${vp.mediaFormats.length} format entries`);
  }
}

// ── Summary ────────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(72)}`);
console.log(`Vault loaded:       ${vault.topics.size} topics | ${vault.synonymGroups.length} synonym groups | ${vault.playbooks.length} playbooks | ${vault.platforms.length} platforms`);
console.log(`Warnings:           ${warnings}`);
console.log(`Info (vault ahead): ${infos}`);
console.log(`${"─".repeat(72)}\n`);
