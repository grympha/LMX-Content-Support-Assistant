import React from "react";
import { readRecentDiagnostics } from "@/lib/searchDiagnostics";
import type { SearchDiagEntry } from "@/lib/searchDiagnostics";
import DiagnosticsControls from "@/components/DiagnosticsControls";

export default function DiagnosticsPage() {
  const entries = readRecentDiagnostics(100) as Array<SearchDiagEntry | { raw: string }>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Search Diagnostics — Low Confidence Queries</h1>
      <p className="mb-4 text-sm text-slate-600">This page lists recent low-confidence queries logged by the local search engine.</p>
      <DiagnosticsControls />
      {entries.length === 0 ? (
        <div className="text-slate-500">No diagnostics recorded yet.</div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, idx: number) => {
            if ("raw" in entry) {
              return (
                <div key={idx} className="border rounded p-3 bg-white/5">
                  <div className="font-medium mt-1">Raw: {(entry as { raw: string }).raw}</div>
                </div>
              );
            }

            const e = entry as SearchDiagEntry;

            return (
              <div key={idx} className="border rounded p-3 bg-white/5">
                <div className="text-xs text-slate-400">{e.ts}</div>
                <div className="font-medium mt-1">{e.message}</div>
                <div className="text-sm mt-2">
                  <strong>Intake:</strong> {e.intake ? JSON.stringify(e.intake) : "-"}
                </div>
                <div className="text-sm mt-1">
                  <strong>Top matches:</strong>
                  <ul className="list-disc ml-6">
                    {(e.topMatches || []).map((m, i) => (
                      <li key={i}>{m.topic} — {m.heading} ({m.score})</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
