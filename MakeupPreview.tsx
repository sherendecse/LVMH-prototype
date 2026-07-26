"use client";

import type { MakeupLook } from "@/types";

type Props = {
  look: MakeupLook;
};

export function MakeupPreview({ look }: Props) {
  const style = {
    "--eye-tone": look.eyeTone,
    "--cheek-tone": look.cheekTone,
    "--lip-tone": look.lipTone,
    "--glow-strength": String(look.glow),
    "--eye-intensity": String(look.eyeIntensity),
    "--lip-intensity": String(look.lipIntensity)
  } as React.CSSProperties;

  return (
    <div className={`makeup-preview preview-${look.key}`} style={style}>
      <span className="preview-label">SIMULATED PREVIEW</span>

      <div className="preview-face">
        <div className="brow brow-left" />
        <div className="brow brow-right" />
        <div className="eye-shadow eye-shadow-left" />
        <div className="eye-shadow eye-shadow-right" />
        <div className="eye-line eye-line-left" />
        <div className="eye-line eye-line-right" />
        <div className="cheek cheek-left" />
        <div className="cheek cheek-right" />
        <div className="highlight highlight-left" />
        <div className="highlight highlight-right" />
        <div className="lips" />
      </div>

      <p>
        This is a style illustration, not a preview of the user&apos;s own face.
      </p>
    </div>
  );
}
