import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const left = searchParams.get("left") ?? "Product A";
  const right = searchParams.get("right") ?? "Product B";
  const leftRating = searchParams.get("lr");
  const rightRating = searchParams.get("rr");
  const category = searchParams.get("cat") ?? "";

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
          padding: "60px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "52px",
              height: "52px",
              borderRadius: "12px",
              backgroundColor: "#C98B1A",
              color: "#18181b",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            V
          </div>
          <span style={{ color: "#C98B1A", fontSize: "30px", fontWeight: 700 }}>
            Verdict
          </span>
          {category && (
            <span
              style={{
                marginLeft: "8px",
                color: "#71717a",
                fontSize: "22px",
                borderLeft: "1px solid #3f3f46",
                paddingLeft: "16px",
              }}
            >
              {category}
            </span>
          )}
        </div>

        {/* VS layout */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            flex: 1,
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          {/* Left product */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              backgroundColor: "#27272a",
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid #3f3f46",
            }}
          >
            <span
              style={{
                color: "#fafafa",
                fontSize: "30px",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {left.length > 60 ? left.slice(0, 60) + "…" : left}
            </span>
            {leftRating && (
              <span
                style={{
                  color: "#C98B1A",
                  fontSize: "40px",
                  fontWeight: 800,
                }}
              >
                ★ {leftRating}
              </span>
            )}
          </div>

          {/* VS badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: "#C98B1A",
              color: "#18181b",
              fontSize: "22px",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            VS
          </div>

          {/* Right product */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              backgroundColor: "#27272a",
              borderRadius: "20px",
              padding: "36px",
              border: "1px solid #3f3f46",
            }}
          >
            <span
              style={{
                color: "#fafafa",
                fontSize: "30px",
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {right.length > 60 ? right.slice(0, 60) + "…" : right}
            </span>
            {rightRating && (
              <span
                style={{
                  color: "#C98B1A",
                  fontSize: "40px",
                  fontWeight: 800,
                }}
              >
                ★ {rightRating}
              </span>
            )}
          </div>
        </div>

        <span style={{ color: "#71717a", fontSize: "22px" }}>
          Side-by-side comparison · verdict.reviews
        </span>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
