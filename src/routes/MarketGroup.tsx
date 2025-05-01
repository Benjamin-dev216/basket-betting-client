import React, { useState } from "react";
import { Market, Team } from "../types/match";
import { placeBet } from "../api/betting";
import { marketName } from "../utils/marketName";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthProvicer";

type Props = {
  markets: Market[];
  homeTeam: Team;
  awayTeam: Team;
  stop: number;
  matchId: string;
};
type PendingBet = {
  marketId: string | number;
  handicap?: string | null;
  outcomeName: string;
  odds: number | null;
  amount?: number; // 👈 new
};

export const MarketGroup: React.FC<Props> = ({
  markets,
  homeTeam,
  awayTeam,
  stop,
  matchId,
}) => {
  const { user } = useAuth();

  const [pendingBet, setPendingBet] = useState<PendingBet | null>(null);
  const [toastId, setToastId] = useState<string | number | null>(null);
  const [betAmount, setBetAmount] = useState<string>(""); // store amount input
  const [showAmountModal, setShowAmountModal] = useState(false); // control modal

  const getMarketName = (marketId: string | number) => {
    const found = marketName.find(
      (m) => m.id.toString() === marketId.toString()
    );
    return found?.name; // returns undefined if not found
  };

  // Group by market name (skip unknowns)
  const marketGroups = markets.reduce(
    (acc: Record<string, Market[]>, market) => {
      const name = getMarketName(market.marketId);
      if (!name) return acc; // skip unknown market

      if (!acc[name]) acc[name] = [];
      acc[name].push(market);
      return acc;
    },
    {}
  );

  const onBet = (
    marketId: string | number,
    handicap: string | undefined | null,
    outcomeName: string,
    odds: number | null
  ) => {
    if (stop > 0 || odds === undefined || odds === null) return;

    setPendingBet({ marketId, handicap, outcomeName, odds });
    setBetAmount(""); // reset input
    setShowAmountModal(true); // open modal
  };
  const confirmBet = () => {
    if (!pendingBet || !betAmount) return;

    const amountNumber = parseFloat(betAmount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setShowAmountModal(false);

    // start normal bet confirmation flow

    const id = toast.loading("Waiting for odds confirmation...");
    setToastId(id);

    const delay =
      Number(user?.pendingTime?.time1) * 1000 +
      Math.random() *
        (Number(user?.pendingTime?.time2) - Number(user?.pendingTime?.time1)) *
        1000;

    setTimeout(() => {
      const market = markets.find((m) => m.marketId === pendingBet.marketId);
      const outcome = market?.outcomes.find(
        (o) => o.name === pendingBet.outcomeName
      );
      if (outcome && outcome.liveValue === pendingBet.odds) {
        toast.update(id, {
          render: "✅ Bet confirmed!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        setPendingBet(null);
        placeBet({
          marketId: pendingBet.marketId,
          handicap: market?.handicap || null,
          outcomeName: pendingBet.outcomeName,
          odds: pendingBet.odds,
          amount: amountNumber, // 👈 pass amount
          matchId: matchId,
        });
      } else {
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
    <>
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
                              pendingBet !== null ||
                              outcome.liveValue === undefined ||
                              outcome.liveValue === null
                                ? "bg-[#383838] text-yellow-400 opacity-50 cursor-not-allowed"
                                : "bg-[#383838] hover:bg-[#4a4a4a] text-yellow-400"
                            } rounded-md py-1 text-sm text-center`}
                            disabled={
                              stop > 0 ||
                              pendingBet !== null ||
                              outcome.liveValue === undefined ||
                              outcome.liveValue === null
                            }
                            onClick={() =>
                              onBet(
                                market.marketId,
                                market.handicap,
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
                              pendingBet !== null ||
                              outcome.liveValue === undefined ||
                              outcome.liveValue === null
                                ? "bg-[#383838] text-yellow-400 opacity-50 cursor-not-allowed"
                                : "bg-[#383838] hover:bg-[#4a4a4a] text-yellow-400"
                            } rounded-md py-1 text-sm text-center`}
                            disabled={
                              stop > 0 ||
                              pendingBet !== null ||
                              outcome.liveValue === undefined ||
                              outcome.liveValue === null
                            }
                            onClick={() =>
                              onBet(
                                market.marketId,
                                market.handicap,
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
      {showAmountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-[#2f2f2f] rounded-lg p-4 w-[250px] shadow-lg border border-[#444] space-y-3">
            <h2 className="text-white text-base font-semibold text-center">
              Bet Amount
            </h2>
            <input
              type="number"
              placeholder="Amount"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              className="w-full p-2 rounded bg-[#3a3a3a] text-white text-left"
              autoFocus={true}
            />
            <div className="flex justify-between gap-2">
              <button
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white p-1 rounded text-sm"
                onClick={() => {
                  setShowAmountModal(false);
                  setPendingBet(null);
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black p-1 rounded text-sm"
                onClick={confirmBet}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
  return price > 0 ? `x${price.toFixed(2)}` : price.toFixed(2);
};
