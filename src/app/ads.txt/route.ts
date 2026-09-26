import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Serve ads.txt for AdSense / MCM.
 * Set ADSENSE_PUB_ID in Hostinger env (numbers only, e.g. 1234567890123456).
 * Format required by Google: google.com, pub-XXXXXXXX, DIRECT, f08c47fec0942fa0
 */
export async function GET() {
  const pub = (process.env.ADSENSE_PUB_ID || "").replace(/\D/g, "");
  const lines: string[] = [
    "# GlobalCareerHub ads.txt — update ADSENSE_PUB_ID after AdSense approval",
  ];
  if (pub.length >= 10) {
    lines.push(`google.com, pub-${pub}, DIRECT, f08c47fec0942fa0`);
  } else {
    // Placeholder line so the file exists (replace after you get a publisher ID)
    lines.push("# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0");
  }
  lines.push("");

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
