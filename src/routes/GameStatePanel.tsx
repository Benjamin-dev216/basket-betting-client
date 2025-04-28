import React from "react";
import { ScoreFormat } from "../types/match";

type Props = {
  homeTeamName: string;
  awayTeamName: string;
  homeTeamColor: string;
  awayTeamColor: string;
  statsParsed: Record<string, string>;
  score: ScoreFormat;
};

export const GameStatePanel: React.FC<Props> = ({
  homeTeamName,
  awayTeamName,
  homeTeamColor,
  awayTeamColor,
  statsParsed,
  score,
}) => {
  const parseScore = (scoreString?: string) => {
    if (!scoreString) return { home: "0", away: "0" };
    const parts = scoreString.split(":").map((s) => s.trim());
    const home = parts[0] ?? "0";
    const away = parts[1] ?? "0";
    return { home, away };
  };

  const periods = ["Q1", "Q2", "H1", "Q3", "Q4", "OT", "T"] as const;

  return (
    <div className="bg-[#1f1f1f] rounded-lg p-4 space-y-6 text-white text-sm">
      {/* Scoreboard Header */}
      <div className="grid grid-cols-[2fr_repeat(7,1fr)] text-center text-xs text-gray-400">
        <div></div>
        {periods.map((p) => (
          <div key={p}>{p}</div>
        ))}
      </div>

      {/* Home and Away Scores */}
      {[homeTeamName, awayTeamName].map((team, idx) => {
        const isHome = idx === 0;
        const color = isHome ? homeTeamColor : awayTeamColor;

        return (
          <div
            key={team}
            className="grid grid-cols-[2fr_repeat(7,1fr)] items-center text-center font-semibold text-sm"
          >
            <div className="flex items-center gap-2 justify-start">
              <div
                className="w-1 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              {team}
            </div>
            {periods.map((p) => (
              <div key={p}>{score[p] ? score[p][isHome ? 0 : 1] : "-"}</div>
            ))}
          </div>
        );
      })}

      {/* Separator */}
      <div className="border-t border-gray-700 my-4" />

      {/* Team Stats Section */}
      <div className="space-y-3">
        {["Fouls", "2 Pts", "3 Pts"].map((stat) => {
          const { home, away } = parseScore(statsParsed[stat] || "0:0");
          return (
            <div
              key={stat}
              className="grid grid-cols-3 items-center text-center"
            >
              <div className="text-sm">{home}</div>
              <div className="text-xs text-gray-400">{stat}</div>
              <div className="text-sm">{away}</div>
            </div>
          );
        })}

        {/* Time Outs */}
        <div className="grid grid-cols-3 items-center text-center">
          <div className="flex justify-center">
            {Array(
              parseInt(parseScore(statsParsed["Time Outs#T.O"]).home || "0", 10)
            )
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="w-2 h-2 rounded-full bg-white mx-0.5"
                  style={{ backgroundColor: homeTeamColor }}
                />
              ))}
          </div>
          <div className="text-xs text-gray-400">Time Outs</div>
          <div className="flex justify-center">
            {Array(
              parseInt(parseScore(statsParsed["Time Outs#T.O"]).away || "0", 10)
            )
              .fill(0)
              .map((_, idx) => (
                <div
                  key={idx}
                  className="w-2 h-2 rounded-full bg-white mx-0.5"
                  style={{ backgroundColor: awayTeamColor }}
                />
              ))}
          </div>
        </div>

        {/* Free Throws */}
        <div className="grid grid-cols-3 items-center text-center">
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">
              {parseScore(statsParsed["Ft"]).home}
            </span>
            <span className="text-xs text-gray-400">
              {parseFloat(
                parseScore(statsParsed["Free Throws"]).home || "0"
              ).toFixed(1)}
              %
            </span>
          </div>
          <div className="text-xs text-gray-400">Free Throws</div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-sm">
              {parseScore(statsParsed["Ft"]).away}
            </span>
            <span className="text-xs text-gray-400">
              {parseFloat(
                parseScore(statsParsed["Free Throws"]).away || "0"
              ).toFixed(1)}
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
