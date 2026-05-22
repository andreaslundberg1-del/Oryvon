import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#020101",
          borderRadius: 36,
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="46" stroke="#eed078" strokeWidth="0.6" strokeDasharray="1.5 7" opacity="0.4" />
          <circle cx="50" cy="50" r="40" stroke="#eed078" strokeWidth="0.6" strokeDasharray="4 6" opacity="0.35" />
          <circle cx="50" cy="50" r="34" stroke="#eed078" strokeWidth="0.5" strokeDasharray="2 9" opacity="0.3" />
          <circle cx="50" cy="50" r="30" stroke="#ffe9a3" strokeWidth="7.5" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="#c59635" strokeWidth="3" fill="none" opacity="0.6" />
          <circle cx="50" cy="50" r="23" stroke="#eed078" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
          <circle cx="50" cy="50" r="18" stroke="#eed078" strokeWidth="0.9" opacity="0.4" strokeDasharray="1 3" />
          <line x1="50" y1="12" x2="50" y2="88" stroke="#eed078" strokeWidth="0.6" opacity="0.3" />
          <line x1="12" y1="50" x2="88" y2="50" stroke="#eed078" strokeWidth="0.6" opacity="0.3" />
          <circle cx="50" cy="50" r="13" fill="#ffe9a3" opacity="0.9" />
          <circle cx="50" cy="50" r="7" fill="#ffffff" opacity="0.97" />
          <circle cx="50" cy="50" r="3.2" fill="#ffffff" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
