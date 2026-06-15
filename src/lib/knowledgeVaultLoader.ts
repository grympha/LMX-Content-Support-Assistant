/**
 * knowledgeVaultLoader.ts — Phase 1 Vault Loader
 *
 * Reads structured metadata from knowledge/ frontmatter at startup.
 * Runs in parallel with the existing hardcoded KB — does NOT replace it yet.
 *
 * Activate drift detection by setting VAULT_KB=true in your environment.
 * When active, discrepancies between vault and hardcoded data are written
 * to console as [vault-drift] lines so they appear in Render server logs.
 *
 * Phase 2 will replace the hardcoded arrays with this loader's output.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// ─── Output types ───────────────────────────────────────────────────────────

export type VaultSourceLink = { label: string; url: string };

export type VaultTopicMeta = {
  category: string;
  keywords: string[];
  confluenceUrls: VaultSourceLink[];
  nextStep: string;
  /** The markdown filename this metadata was loaded from */
  sourceFile: string;
};

export type VaultPlaybook = {
  id: string;
  title: string;
  triggers: string[];
  summary: string;
  whatToCheck: string[];
  howToFix: string[];
  nextSteps: string[];
  clientResponse: string;
};

export type VaultPlatform = {
  platform: string;
  triggers: string[];
  osVersion: string;
  processor: string[];
  systemType: string;
  memory: string[];
  mediaFormats: string[];
  programmaticNotes: string[];
  confluenceUrls: VaultSourceLink[];
};

export type VaultData = {
  /** Map of IssueCategory string → topic metadata (from topics/ frontmatter) */
  topics: Map<string, VaultTopicMeta>;
  /** Synonym groups loaded from knowledge/config/synonyms.md */
  synonymGroups: string[][];
  /** Support playbooks loaded from knowledge/playbooks/ */
  playbooks: VaultPlaybook[];
  /** Platform requirement profiles loaded from knowledge/platforms/ */
  platforms: VaultPlatform[];
};

// ─── Paths ───────────────────────────────────────────────────────────────────

const knowledgeRoot = path.join(process.cwd(), "knowledge");
const topicsDir = path.join(knowledgeRoot, "topics");
const playbooksDir = path.join(knowledgeRoot, "playbooks");
const platformsDir = path.join(knowledgeRoot, "platforms");
const synonymsFile = path.join(knowledgeRoot, "config", "synonyms.md");

// ─── Loaders ─────────────────────────────────────────────────────────────────

function loadTopics(): Map<string, VaultTopicMeta> {
  const map = new Map<string, VaultTopicMeta>();

  if (!existsSync(topicsDir)) {
    console.warn("[vault] topics/ directory not found at", topicsDir);
    return map;
  }

  for (const file of readdirSync(topicsDir)) {
    if (!file.endsWith(".md")) continue;

    const filePath = path.join(topicsDir, file);
    try {
      const { data } = matter(readFileSync(filePath, "utf8"));

      if (!data["category"]) continue; // skip files without frontmatter category

      const category = String(data["category"]);
      const keywords = Array.isArray(data["keywords"])
        ? (data["keywords"] as unknown[]).map(String)
        : [];
      const rawUrls = data["confluence_urls"];
      const confluenceUrls: VaultSourceLink[] = Array.isArray(rawUrls)
        ? (rawUrls as Array<{ label?: unknown; url?: unknown }>)
            .filter((u) => u && typeof u === "object" && u.label && u.url)
            .map((u) => ({ label: String(u.label), url: String(u.url) }))
        : [];
      const nextStep = data["next_step"] ? String(data["next_step"]) : "";

      map.set(category, { category, keywords, confluenceUrls, nextStep, sourceFile: file });
    } catch (err) {
      console.warn(`[vault] Failed to parse frontmatter in topics/${file}:`, err);
    }
  }

  return map;
}

function loadSynonymGroups(): string[][] {
  if (!existsSync(synonymsFile)) {
    console.warn("[vault] synonyms.md not found at", synonymsFile);
    return [];
  }

  try {
    const { data } = matter(readFileSync(synonymsFile, "utf8"));
    const raw = data["synonyms"];

    if (!Array.isArray(raw)) {
      console.warn("[vault] synonyms.md frontmatter 'synonyms' is not an array");
      return [];
    }

    return (raw as unknown[])
      .filter(Array.isArray)
      .map((group) => (group as unknown[]).map(String));
  } catch (err) {
    console.warn("[vault] Failed to load synonyms.md:", err);
    return [];
  }
}

function loadPlaybooks(): VaultPlaybook[] {
  if (!existsSync(playbooksDir)) {
    console.warn("[vault] playbooks/ directory not found at", playbooksDir);
    return [];
  }

  const playbooks: VaultPlaybook[] = [];

  for (const file of readdirSync(playbooksDir)) {
    if (!file.endsWith(".md")) continue;

    try {
      const { data } = matter(readFileSync(path.join(playbooksDir, file), "utf8"));

      if (!data["id"]) continue;

      const toStrArr = (v: unknown) =>
        Array.isArray(v) ? (v as unknown[]).map(String) : [];

      playbooks.push({
        id: String(data["id"]),
        title: String(data["title"] ?? ""),
        triggers: toStrArr(data["triggers"]),
        summary: String(data["summary"] ?? ""),
        whatToCheck: toStrArr(data["what_to_check"]),
        howToFix: toStrArr(data["how_to_fix"]),
        nextSteps: toStrArr(data["next_steps"]),
        clientResponse: String(data["client_response"] ?? "")
      });
    } catch (err) {
      console.warn(`[vault] Failed to parse playbook playbooks/${file}:`, err);
    }
  }

  return playbooks;
}

function loadPlatforms(): VaultPlatform[] {
  if (!existsSync(platformsDir)) {
    console.warn("[vault] platforms/ directory not found at", platformsDir);
    return [];
  }

  const platforms: VaultPlatform[] = [];

  for (const file of readdirSync(platformsDir)) {
    if (!file.endsWith(".md")) continue;

    try {
      const { data } = matter(readFileSync(path.join(platformsDir, file), "utf8"));

      if (!data["platform"]) continue;

      const toStrArr = (v: unknown) =>
        Array.isArray(v) ? (v as unknown[]).map(String) : [];

      const rawUrls = data["confluence_urls"];
      const confluenceUrls: VaultSourceLink[] = Array.isArray(rawUrls)
        ? (rawUrls as Array<{ label?: unknown; url?: unknown }>)
            .filter((u) => u && typeof u === "object" && u.label && u.url)
            .map((u) => ({ label: String(u.label), url: String(u.url) }))
        : [];

      platforms.push({
        platform: String(data["platform"]),
        triggers: toStrArr(data["triggers"]),
        osVersion: String(data["os_version"] ?? ""),
        processor: toStrArr(data["processor"]),
        systemType: String(data["system_type"] ?? ""),
        memory: toStrArr(data["memory"]),
        mediaFormats: toStrArr(data["media_formats"]),
        programmaticNotes: toStrArr(data["programmatic_notes"]),
        confluenceUrls
      });
    } catch (err) {
      console.warn(`[vault] Failed to parse platform platforms/${file}:`, err);
    }
  }

  return platforms;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

let _cache: VaultData | null = null;

/**
 * Load all vault metadata. Memoized — reads files once per process lifetime.
 * Safe to call multiple times; subsequent calls return the cached result.
 */
export function loadVaultData(): VaultData {
  if (_cache) return _cache;

  _cache = {
    topics: loadTopics(),
    synonymGroups: loadSynonymGroups(),
    playbooks: loadPlaybooks(),
    platforms: loadPlatforms()
  };

  return _cache;
}

// ─── Drift detection ─────────────────────────────────────────────────────────

/**
 * Compare vault data against the currently hardcoded KB arrays.
 * Logs discrepancies to console using the [vault-drift] prefix so they are
 * easily searchable in Render server logs.
 *
 * Call this at module init in localSearchEngine.ts when VAULT_KB=true.
 * It is read-only — no changes to hardcoded data.
 */
export function compareVaultWithHardcoded(opts: {
  hardcodedTopics: Array<{ category: string; keywords: string[] }>;
  hardcodedSynonymGroupCount: number;
  hardcodedPlaybookIds: string[];
  hardcodedPlatformNames: string[];
}): void {
  const vault = loadVaultData();
  const tag = "[vault-drift]";

  // ── Topics ──
  for (const entry of opts.hardcodedTopics) {
    const vt = vault.topics.get(entry.category);

    if (!vt) {
      console.warn(`${tag} MISSING  Topic "${entry.category}" has no vault frontmatter.`);
      continue;
    }

    const missingKw = entry.keywords.filter((k) => !vt.keywords.includes(k));
    const extraKw = vt.keywords.filter((k) => !entry.keywords.includes(k));

    if (missingKw.length) {
      console.warn(`${tag} KEYWORD  "${entry.category}": in hardcode but not vault → [${missingKw.join(", ")}]`);
    }
    if (extraKw.length) {
      console.info(`${tag} KEYWORD+ "${entry.category}": in vault but not hardcode (vault is ahead) → [${extraKw.join(", ")}]`);
    }
    if (!vt.confluenceUrls.length) {
      console.warn(`${tag} LINKS    "${entry.category}": no confluence_urls in vault frontmatter.`);
    }
  }

  // Topics in vault but not in hardcoded list
  for (const [category] of vault.topics) {
    if (!opts.hardcodedTopics.some((e) => e.category === category)) {
      console.info(`${tag} NEW      Topic "${category}" is in vault but not in hardcoded KB (vault is ahead).`);
    }
  }

  // ── Synonym groups ──
  if (vault.synonymGroups.length !== opts.hardcodedSynonymGroupCount) {
    console.warn(
      `${tag} SYNONYMS Synonym group count mismatch: hardcoded=${opts.hardcodedSynonymGroupCount}, vault=${vault.synonymGroups.length}`
    );
  } else {
    console.info(`${tag} SYNONYMS OK — ${vault.synonymGroups.length} groups in vault match hardcoded count.`);
  }

  // ── Playbooks ──
  for (const id of opts.hardcodedPlaybookIds) {
    if (!vault.playbooks.some((p) => p.id === id)) {
      console.warn(`${tag} MISSING  Playbook "${id}" is in hardcoded KB but not in knowledge/playbooks/.`);
    }
  }
  for (const pb of vault.playbooks) {
    if (!opts.hardcodedPlaybookIds.includes(pb.id)) {
      console.info(`${tag} NEW      Playbook "${pb.id}" is in vault but not in hardcoded KB (vault is ahead).`);
    }
  }

  // ── Platforms ──
  for (const name of opts.hardcodedPlatformNames) {
    if (!vault.platforms.some((p) => p.platform === name)) {
      console.warn(`${tag} MISSING  Platform "${name}" is in hardcoded KB but not in knowledge/platforms/.`);
    }
  }
  for (const pf of vault.platforms) {
    if (!opts.hardcodedPlatformNames.includes(pf.platform)) {
      console.info(`${tag} NEW      Platform "${pf.platform}" is in vault but not in hardcoded KB.`);
    }
  }

  const topicsOk = vault.topics.size;
  const playbooksOk = vault.playbooks.length;
  const platformsOk = vault.platforms.length;

  console.info(
    `${tag} SUMMARY  Loaded ${topicsOk} topics, ${vault.synonymGroups.length} synonym groups, ` +
    `${playbooksOk} playbooks, ${platformsOk} platforms from vault.`
  );
}
