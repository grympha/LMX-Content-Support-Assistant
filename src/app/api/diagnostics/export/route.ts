import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const DIAG_PATH = path.join(process.cwd(), "search_diagnostics.jsonl");

export async function GET() {
  try {
    if (!fs.existsSync(DIAG_PATH)) {
      return new NextResponse("", { status: 204 });
    }
    const data = fs.readFileSync(DIAG_PATH, "utf8");
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/jsonl",
        "Content-Disposition": "attachment; filename=search_diagnostics.jsonl"
      }
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
