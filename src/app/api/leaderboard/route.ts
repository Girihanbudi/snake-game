import Player from "@/app/types/Player";
import { NextRequest, NextResponse } from "next/server";

interface Request extends Player {}

const MaxPlayer = 5;
let leaderboard: Player[] = [];

export const POST = async (req: NextRequest) => {
  const data = (await req.json()) as Request;
  console.log("data sent", data);

  const insertIndex = leaderboard.findIndex(
    (player) =>
      player.score < data.score ||
      (player.score === data.score && player.time > data.time)
  );

  // Insert the new value at the correct position
  leaderboard.splice(
    insertIndex === -1 ? leaderboard.length : insertIndex,
    0,
    data
  );

  // Keep only the top 5 highest values
  leaderboard.splice(MaxPlayer);

  return NextResponse.json({}, { status: 200 });
};

export const GET = async (req: NextRequest) => {
  return NextResponse.json(leaderboard, { status: 200 });
};
