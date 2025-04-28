import React, { useState } from "react";
import { Market, Team } from "../types/match";
import { placeBet } from "../api/betting";
import { marketName } from "../utils/marketName";
import { toast } from "react-toastify";

type Props = {
  markets: Market[];
  homeTeam: Team;
  awayTeam: Team;
  stop: number;
};
type PendingBet = {
  marketId: string | number;
  outcomeName: string;
  odds: number | null;
};

export const MarketGroup: React.FC<Props> = ({
  markets,
  homeTeam,
  awayTeam,
  stop,
}) => {
  const [pendingBet, setPendingBet] = useState<PendingBet | null>(null);
  const [toastId, setToastId] = useState<string | number | null>(null);

  const getMarketName = (marketId: string | number) => {
    const found = marketName.find(
      (m) => m.id.toString() === marketId.toString()
    );
    return found?.name || `Market ${marketId}`;
  };

  // Group by market name
  const marketGroups = markets.reduce(
    (acc: Record<string, Market[]>, market) => {
      const name = getMarketName(market.marketId);
      if (!acc[name]) acc[name] = [];
      acc[name].push(market);
      return acc;
    },
    {}
  );
  const onBet = (
    marketId: string | number,
    outcomeName: string,
    odds: number | null
  ) => {
    if (stop > 0 || odds === undefined || odds === null) return;

    console.log("Starting bet waiting period...");

    setPendingBet({ marketId, outcomeName, odds });

    // Show spinning toast immediately
    const id = toast.loading("Waiting for odds confirmation...");
    setToastId(id);

    const delay = 3000 + Math.random() * 2000; // 3-5s random

    setTimeout(() => {
      const market = markets.find((m) => m.marketId === marketId);
      const outcome = market?.outcomes.find((o) => o.name === outcomeName);

      if (outcome && outcome.liveValue === odds) {
        console.log("✅ Odds unchanged, confirming bet!");
        toast.update(id, {
          render: "✅ Bet confirmed!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setPendingBet(null);
        placeBet({ marketId, outcomeName, odds });
      } else {
        console.log("❌ Odds changed, cancelling bet.");
        toast.update(id, {
          render: "❌ Bet cancelled. Odds changed.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setPendingBet(null);
      }
    }, delay);
  };

  return (
    <div className="space-y-6">
      {Object.entries(marketGroups).map(([groupName, groupMarkets]) => {
        const isGrouped = groupMarkets.length > 1; // Only group if duplicate market names

        return (
          <div
            key={groupName}
            className="bg-[#2f2f2f] rounded-lg overflow-hidden shadow text-white"
          >
            {/* Group Title */}
            <div className="bg-[#3a3a3a] text-sm font-semibold p-3">
              {groupName}
            </div>

            {/* Header */}
            {isGrouped && (
              <div className="grid grid-cols-3 bg-[#292929] text-xs text-gray-400 py-2 px-3">
                <div className="text-center">Handicap</div>
                <div className="text-center">{homeTeam.name}</div>
                <div className="text-center">{awayTeam.name}</div>
              </div>
            )}

            {/* Body */}
            {isGrouped
              ? groupMarkets
                  .sort(
                    (a, b) =>
                      parseFloat(a.handicap || "0") -
                      parseFloat(b.handicap || "0")
                  ) // sort by handicap
                  .map((market, index) => (
                    <div
                      key={`${market.marketId}-${index}`}
                      className="grid grid-cols-3 px-3 py-2 border-t border-[#444] text-sm hover:bg-[#3a3a3a] transition"
                    >
                      <div className="text-center text-gray-300">
                        {formatHandicap(market.handicap)}
                      </div>
                      {market.outcomes.slice(0, 2).map((outcome, idx) => (
                        <button
                          key={idx}
                          className={`${
                            stop > 0 ||
                            outcome.liveValue === undefined ||
                            outcome.liveValue === null
                              ? "bg-[#383838] text-yellow-400 opacity-50 cursor-not-allowed"
                              : "bg-[#383838] hover:bg-[#4a4a4a] text-yellow-400"
                          } rounded-md py-1 text-sm text-center`}
                          disabled={
                            stop > 0 ||
                            outcome.liveValue === undefined ||
                            outcome.liveValue === null
                          }
                          onClick={() =>
                            onBet(
                              market.marketId,
                              outcome.name,
                              outcome.liveValue
                            )
                          }
                        >
                          {outcome.liveValue === undefined ||
                          outcome.liveValue === null ? (
                            <span className="flex justify-center items-center">
                              🔒
                            </span>
                          ) : (
                            formatPrice(outcome.liveValue)
                          )}
                        </button>
                      ))}
                    </div>
                  ))
              : groupMarkets.map((market, index) => (
                  <div
                    key={`${market.marketId}-${index}`}
                    className="bg-[#2f2f2f] rounded-lg overflow-hidden shadow text-white"
                  >
                    {/* Handicap Row */}
                    {market.handicap && (
                      <div className="grid grid-cols-1 px-3 py-2 border-t border-[#444] text-sm text-center">
                        <div className="text-gray-300">
                          {formatHandicap(market.handicap)}
                        </div>
                      </div>
                    )}

                    {/* Outcome Rows */}
                    <div className="grid grid-cols-2 px-3 py-2 border-t border-[#444] text-sm hover:bg-[#3a3a3a] transition gap-2">
                      {market.outcomes.map((outcome, idx) => (
                        <button
                          key={idx}
                          className={`${
                            stop > 0 ||
                            outcome.liveValue === undefined ||
                            outcome.liveValue === null
                              ? "bg-[#383838] text-yellow-400 opacity-50 cursor-not-allowed"
                              : "bg-[#383838] hover:bg-[#4a4a4a] text-yellow-400"
                          } rounded-md py-1 text-sm text-center`}
                          disabled={
                            stop > 0 ||
                            outcome.liveValue === undefined ||
                            outcome.liveValue === null
                          }
                          onClick={() =>
                            onBet(
                              market.marketId,
                              outcome.name,
                              outcome.liveValue
                            )
                          }
                        >
                          {outcome.name} <br />
                          <span className="text-white">
                            {outcome.liveValue === undefined ||
                            outcome.liveValue === null ? (
                              <span className="flex justify-center items-center">
                                🔒
                              </span>
                            ) : (
                              formatPrice(outcome.liveValue)
                            )}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
          </div>
        );
      })}
    </div>
  );
};

// helpers
const formatHandicap = (handicap?: string) => {
  if (handicap === undefined || handicap === null) return "-";
  const num = parseFloat(handicap);
  if (isNaN(num)) return handicap;
  return num > 0 ? `+${num}` : num.toString();
};

const formatPrice = (price?: number | null) => {
  if (price === undefined || price === null) return "-";
  return price > 0 ? `+${price.toFixed(2)}` : price.toFixed(2);
};
