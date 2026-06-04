"use client";
import React, { useState } from "react";

export default function DiagnosticsControls() {
  const [loading, setLoading] = useState(false);

  async function handleClear() {
    if (!confirm("Clear all search diagnostics? This cannot be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch("/api/diagnostics/clear", { method: "POST" });
      if (res.ok) {
        location.reload();
      } else {
        alert("Failed to clear diagnostics");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    setLoading(true);
    try {
      const res = await fetch("/api/diagnostics/export");
      if (!res.ok) {
        alert("No diagnostics to export or an error occurred.");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "search_diagnostics.jsonl";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-3 mb-4">
      <button onClick={handleExport} disabled={loading} className="btn btn-sm">
        {loading ? "Working..." : "Export diagnostics"}
      </button>
      <button onClick={handleClear} disabled={loading} className="btn btn-sm btn-ghost text-red-600">
        {loading ? "Working..." : "Clear diagnostics"}
      </button>
    </div>
  );
}
