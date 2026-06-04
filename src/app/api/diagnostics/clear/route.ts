import { NextResponse } from "next/server";
import { clearDiagnostics } from "@/lib/searchDiagnostics";

export async function POST() {
  try {
    clearDiagnostics();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
