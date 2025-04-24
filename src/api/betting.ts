export async function placeBet(payload: {
  matchId: string;
  marketId: string;
  outcome: string;
  stake: number;
}) {
  const res = await fetch("/api/bet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
