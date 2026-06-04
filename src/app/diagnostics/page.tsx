import React from "react";
import { readRecentDiagnostics } from "@/lib/searchDiagnostics";
import { analyzeDiagnostics } from "@/lib/diagnosticsAnalyzer";
import type { SearchDiagEntry } from "@/lib/searchDiagnostics";
import DiagnosticsControls from "@/components/DiagnosticsControls";

function isSearchDiagEntry(entry: SearchDiagEntry | { raw: string }): entry is SearchDiagEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "ts" in entry &&
    Array.isArray((entry as SearchDiagEntry).topMatches)
  );
}

export default function DiagnosticsPage() {
  const rawEntries = readRecentDiagnostics(100);
  const entries = rawEntries.filter(isSearchDiagEntry);
  const analysis = analyzeDiagnostics(entries);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Search Diagnostics — Low Confidence Queries</h1>
      <p className="mb-4 text-sm text-slate-600">This page lists recent low-confidence queries logged by the local search engine and recommends search engine improvements.</p>
      <DiagnosticsControls />

      <div className="mb-6 rounded-lg border bg-slate-50 p-4">
        <h2 className="text-lg font-semibold mb-3">Recommendation engine</h2>
        {analysis.totalEntries === 0 ? (
          <p className="text-sm text-slate-500">No diagnostics to analyze yet. Use the assistant and capture some low-confidence queries first.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded border bg-white p-3">
                <div className="text-xs uppercase text-slate-500">Total entries</div>
                <div className="mt-2 text-2xl font-semibold">{analysis.totalEntries}</div>
              </div>
              <div className="rounded border bg-white p-3">
                <div className="text-xs uppercase text-slate-500">Average top score</div>
                <div className="mt-2 text-2xl font-semibold">{Math.round(analysis.averageTopScore)}</div>
              </div>
              <div className="rounded border bg-white p-3">
                <div className="text-xs uppercase text-slate-500">Low score ratio</div>
                <div className="mt-2 text-2xl font-semibold">{Math.round(analysis.lowScoreRatio * 100)}%</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Recommended changes</h3>
              <ul className="list-disc ml-6 mt-2 space-y-2 text-sm text-slate-700">
                {analysis.recommendations.map((recommendation, idx) => (
                  <li key={idx}>{recommendation}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold">Weight adjustment suggestions</h3>
              <ul className="list-disc ml-6 mt-2 space-y-2 text-sm text-slate-700">
                {analysis.weightAdjustments.map((adjustment, idx) => (
                  <li key={idx}>
                    <strong>{adjustment.parameter}:</strong> {adjustment.suggestedChange}. {adjustment.rationale}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-slate-500">No diagnostics recorded yet.</div>
      ) : (
        <div className="space-y-4">
          {entries.map((e, idx: number) => (
            <div key={idx} className="border rounded p-3 bg-white/5">
              <div className="text-xs text-slate-400">{e.ts}</div>
              <div className="font-medium mt-1">{e.message}</div>
              <div className="text-sm mt-2">
                <strong>Intake:</strong> {e.intake ? JSON.stringify(e.intake) : "-"}
              </div>
              <div className="text-sm mt-1">
                <strong>Top matches:</strong>
                <ul className="list-disc ml-6">
                  {e.topMatches.map((m, i) => (
                    <li key={i}>{m.topic} — {m.heading} ({m.score})</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
