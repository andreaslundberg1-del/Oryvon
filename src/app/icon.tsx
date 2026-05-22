import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020101",
          borderRadius: 6,
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer dashed ring */}
          <circle cx="50" cy="50" r="46" stroke="#eed078" strokeWidth="0.8" strokeDasharray="2 8" opacity="0.45" />
          {/* Mid orbit */}
          <circle cx="50" cy="50" r="40" stroke="#eed078" strokeWidth="0.7" strokeDasharray="4 6" opacity="0.35" />
          {/* Main gold ring */}
          <circle cx="50" cy="50" r="30" stroke="#ffe9a3" strokeWidth="7.5" fill="none" />
          {/* Gold gradient overlay ring */}
          <circle cx="50" cy="50" r="30" stroke="#c59635" strokeWidth="3" fill="none" opacity="0.6" />
          {/* Inner dashed ring */}
          <circle cx="50" cy="50" r="23" stroke="#eed078" strokeWidth="0.9" strokeDasharray="4 4" opacity="0.55" />
          {/* Crosshairs */}
          <line x1="50" y1="14" x2="50" y2="86" stroke="#eed078" strokeWidth="0.7" opacity="0.35" />
          <line x1="14" y1="50" x2="86" y2="50" stroke="#eed078" strokeWidth="0.7" opacity="0.35" />
          {/* Central glow */}
          <circle cx="50" cy="50" r="12" fill="#ffe9a3" opacity="0.85" />
          <circle cx="50" cy="50" r="7" fill="#ffffff" opacity="0.95" />
          <circle cx="50" cy="50" r="3" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
