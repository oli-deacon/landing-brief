export type Connection = {
  airport: string;
  arrivalTerminal: string;
  departureTerminal: string;
  flight: string;
  onward: "international" | "domestic" | "unknown";
  booking: "one" | "separate" | "unknown";
  bags: "through" | "collect" | "none" | "unknown";
  boardingPass: "yes" | "no" | "unknown";
};
export type ConnectionPlan = { title: string; steps: string[]; note: string; reviewedDate: string; sources: { label: string; url: string }[] };
export function newConnection(airport: string): Connection {
  return { airport, arrivalTerminal: "", departureTerminal: "", flight: "", onward: "unknown", booking: "unknown", bags: "unknown", boardingPass: "unknown" };
}
export function buildConnectionPlan(c: Connection, countryCode: string): ConnectionPlan {
  const plan: ConnectionPlan = { title: "Confirm your connection", steps: [], note: "Check your airline’s check-in and gate deadlines. Terminal travel time is only one part of a connection; this plan does not assess whether you have enough time.", reviewedDate: "2026-10-07", sources: [] };
  const changi = countryCode === "sg" && c.airport === "Singapore Changi (SIN)";
  if (!changi) {
    plan.steps = ["Ask your airline to confirm the arrival airport, both terminals and whether your onward flight leaves from the same airport.", "Confirm where to clear immigration, whether to collect and recheck bags, and where to obtain your onward boarding pass.", "Follow the airport’s signed connection route once confirmed. International-to-domestic transfers may require border checks and baggage collection."];
    plan.note = "Detailed terminal directions are currently available for Singapore Changi only. These are questions to resolve, not a confirmed transfer route.";
    return plan;
  }
  plan.sources = [
    { label: "Changi transit requirements", url: "https://www.changiairport.com/cn/en/fly/transit-guide.html" },
    { label: "Changi terminal connections", url: "https://www.changiairport.com/en/at-changi/transport-and-directions/transferring-between-terminals-jewel.html" }
  ];
  if (c.onward === "domestic") {
    plan.steps = ["Singapore has no domestic flights. Check the airport and onward destination on your booking before choosing a route."];
    return plan;
  }
  const landside = c.bags === "collect" || c.booking === "separate";
  const transit = c.booking === "one" && (c.bags === "through" || c.bags === "none");
  if (!landside && !transit) {
    plan.steps = ["Before following an exit route, ask the transfer desk whether your booking and baggage allow you to remain in transit.", "Confirm whether you need to collect bags or check in again. Keep your onward booking available."];
    return plan;
  }
  plan.title = landside ? "Plan for a landside connection" : "Your transit connection";
  plan.steps.push(landside
    ? "Confirm your self-transfer with the airline and check that you meet Singapore entry requirements before travelling. Plan to clear arrival immigration; collect any bags requiring recheck and pass customs."
    : "Follow Transfer signs and remain in the transit area. Keep your onward booking and baggage receipt handy.");
  if (!landside && c.boardingPass !== "yes") plan.steps.push("Visit your airline’s transfer desk for your onward boarding pass before continuing.");
  const from = c.arrivalTerminal, to = c.departureTerminal;
  const known = [from, to].every(t => ["T1", "T2", "T3", "T4"].includes(t));
  if (!known) plan.steps.push("Confirm both terminals with your airline, then update this card for terminal directions.");
  else if (from === to) plan.steps.push(`Stay in ${to}; follow ${landside ? "Departures signs to your airline’s check-in area" : "signs for your onward gate"}.`);
  else if (from === "T4" || to === "T4") {
    const pickup: Record<string, string> = landside
      ? { T1: "T1 Departure Central Kerbside", T2: "T2 Arrival Pick-up Door 1", T3: "T2 via the public link bridge (overnight, check the T3 shuttle signs)", T4: "T4 Arrival Bus Lounge" }
      : { T1: "T1 Gate C21", T2: "T2 Arrival Immigration Hall F", T3: "T3 Arrival Immigration Hall A", T4: "T4 Transfer Lounge" };
    plan.steps.push(`Take the complimentary ${landside ? "public" : "transit"} T4 shuttle. From ${from}, use ${pickup[from]}; follow signs for ${to}${landside && to === "T3" ? " via T2 and the public link bridge during daytime" : ""}. Check the displayed route before boarding.`);
  } else plan.steps.push(`Follow ${landside ? "public-area" : "transit-area"} signs from ${from} to ${to}. Use the free Skytrain (normally 05:00–02:00) or signed walking links; check local service notices.`);
  plan.steps.push(landside ? "At the departure terminal, check in and drop any bags, then follow departure immigration, security and gate instructions." : "Check the departure screens for your gate and follow security instructions. Allow time to reach the gate before boarding closes.");
  return plan;
}
