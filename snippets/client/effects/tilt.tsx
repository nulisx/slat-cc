"use client";

import * as React from "react";

import { cn } from "@slat/utils";
import { useTilt } from "@/lib/hooks/use-tilt";
import { BiolinkConfig } from "@/lib/types";

// components/biolink/profile-card/tilt-wrapper.tsx

export const TiltWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { tiltStyle, cardRef, handleMouseMove, handleMouseLeave } = useTilt();

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
      className={cn("w-full", className)}
    >
      <div
        ref={cardRef}
        style={{
          ...tiltStyle,
          transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
        className="w-full"
      >
        {children}
      </div>
    </div>
  );
};

export function ConditionalTiltWrapper({
  children,
  className,
  enabled,
}: {
  children?: React.ReactNode;
  className?: string;
  enabled: boolean;
}) {
  return enabled ? (
    <TiltWrapper className={className}>{children}</TiltWrapper>
  ) : (
    children
  );
}
