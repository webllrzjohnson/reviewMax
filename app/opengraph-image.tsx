import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Verdict — Unbiased product reviews for kitchen, tech, and fitness gear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#18181b",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "16px",
              backgroundColor: "#C98B1A",
              color: "#18181b",
              fontSize: "48px",
              fontWeight: 700,
            }}
          >
            V
          </div>
          <span style={{ color: "#C98B1A", fontSize: "44px", fontWeight: 700 }}>
            Verdict
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <span
            style={{
              color: "#fafafa",
              fontSize: "68px",
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            Unbiased product reviews you can trust
          </span>
          <span style={{ color: "#a1a1aa", fontSize: "32px" }}>
            Clear pros, cons, star ratings, and verdicts.
          </span>
        </div>

        <span style={{ color: "#71717a", fontSize: "26px" }}>
          Kitchen · Home Tech · Fitness
        </span>
      </div>
    ),
    size,
  );
}
