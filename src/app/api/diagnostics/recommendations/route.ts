import { NextResponse } from "next/server";
import { readRecentDiagnostics, type SearchDiagEntry } from "@/lib/searchDiagnostics";
import { analyzeDiagnostics } from "@/lib/diagnosticsAnalyzer";

export async function GET() {
  const entries = readRecentDiagnostics(200).filter(
    (entry): entry is SearchDiagEntry => typeof entry === "object" && entry !== null && "topMatches" in entry && Array.isArray(entry.topMatches)
  );
  const analysis = analyzeDiagnostics(entries);
  return NextResponse.json({ ok: true, analysis });
}
