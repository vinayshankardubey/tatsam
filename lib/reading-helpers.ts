import type { ReadingMessage, ReadingStatus } from "./supabase/types";

export const STAGE_ORDER: ReadingStatus[] = ["pending", "in_review", "delivered"];

export const STAGE_LABEL: Record<ReadingStatus, string> = {
  pending: "Requested",
  in_review: "Being read",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function stageIndex(status: ReadingStatus): number {
  const i = STAGE_ORDER.indexOf(status);
  return i === -1 ? 0 : i;
}

/**
 * Human-friendly "how long ago" — tuned to the 3 cadences that matter in
 * this app: minutes (fresh request), hours (same-day), days (aging queue).
 */
export function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function timeInState(iso: string): string {
  // Same as timeAgo but phrased as a duration, e.g. "2d 3h".
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  if (hrs < 24) return rem > 0 ? `${hrs}h ${rem}m` : `${hrs}h`;
  const days = Math.floor(hrs / 24);
  const remH = hrs % 24;
  return remH > 0 ? `${days}d ${remH}h` : `${days}d`;
}

/** Messages where sender is not me — i.e., replies I haven't sent. */
export function repliesNotFromMe(messages: ReadingMessage[], myUserId: string): number {
  return messages.filter((m) => m.sender_id !== myUserId).length;
}

export function timeOfDayGreeting(now = new Date()): string {
  const h = now.getHours();
  if (h < 5) return "Still awake";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 21) return "Good evening";
  return "Peaceful night";
}
