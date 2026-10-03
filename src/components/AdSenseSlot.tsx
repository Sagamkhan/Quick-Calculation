import React from "react";

export type AdFormat = "horizontal" | "vertical" | "rectangle" | "leaderboard" | "in-article";

interface AdSenseSlotProps {
  id?: string;
  format?: AdFormat;
  className?: string;
  slotId?: string;
}

/**
 * AdSenseSlot: Returns null for clean, 100% ad-free interface.
 */
export default function AdSenseSlot(_props?: AdSenseSlotProps) {
  return null;
}
