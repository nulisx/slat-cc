import type { Track } from "@/lib/types";
import { db, schema } from "@slat/db";
import { getUserIdFromToken } from "@/lib/auth/actions";
import { asc, eq } from "drizzle-orm";
import { formatTrack } from "@/lib/application/tracks/utils";

// lib/application/tracks/actions/fetch-tracks.ts

export async function fetchTracks(userId?: number): Promise<Track[]> {
  userId ??= await getUserIdFromToken();

  if (!userId) return [];

  const audios = await db
    .select()
    .from(schema.tracks)
    .where(eq(schema.tracks.userId, userId))
    .orderBy(asc(schema.tracks.order));

  return audios.map(formatTrack);
}
