export async function placeBet(payload: {
  marketId: string | number;
  outcomeName: string;
  odds: number | null;
}) {
  const res = await fetch("/api/bet", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}
