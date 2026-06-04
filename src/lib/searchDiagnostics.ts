import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const DIAG_PATH = path.join(process.cwd(), "search_diagnostics.jsonl");

export type SearchDiagEntry = {
  ts: string;
  message: string;
  intake?: Record<string, unknown>;
  queryTerms: string[];
  topMatches: { topic: string; heading: string; score: number }[];
};

export function logLowConfidenceQuery(entry: Omit<SearchDiagEntry, "ts">) {
  try {
    const record = { ts: new Date().toISOString(), ...entry };
    appendFileSync(DIAG_PATH, JSON.stringify(record) + "\n", { encoding: "utf8" });
  } catch (err) {
    // Swallow logging errors to avoid impacting search behavior
    // eslint-disable-next-line no-console
    console.warn("Failed to write search diagnostic", err);
  }
}

export function clearDiagnostics() {
  try {
    writeFileSync(DIAG_PATH, "", { encoding: "utf8" });
  } catch {
    // ignore
  }
}

export function readRecentDiagnostics(limit = 50): Array<SearchDiagEntry | { raw: string }> {
  if (!existsSync(DIAG_PATH)) return [];
  try {
    const raw = readFileSync(DIAG_PATH, "utf8").trim();
    if (!raw) return [];
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const last = lines.slice(-limit).map((line) => {
      try {
        return JSON.parse(line) as SearchDiagEntry;
      } catch {
        return { raw: line };
      }
    });
    return last.reverse();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Failed to read search diagnostics", err);
    return [];
  }
}

const searchDiagnostics = { logLowConfidenceQuery, readRecentDiagnostics };

export default searchDiagnostics;
