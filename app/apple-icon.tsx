import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#18181b",
          color: "#C98B1A",
          fontSize: "120px",
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        V
      </div>
    ),
    size,
  );
}
