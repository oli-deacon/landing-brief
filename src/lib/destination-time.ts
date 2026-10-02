export function getDestinationTime(timeZone: string, now: Date, deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone) {
  const formatter = new Intl.DateTimeFormat("en-AU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });
  const offsetMinutes = (zone: string) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      timeZoneName: "longOffset"
    }).formatToParts(now);
    const offset = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
    const match = offset.match(/GMT([+-])(\d{2}):(\d{2})/);
    return match ? (Number(match[2]) * 60 + Number(match[3])) * (match[1] === "+" ? 1 : -1) : 0;
  };
  const difference = offsetMinutes(timeZone) - offsetMinutes(deviceTimeZone);
  const hours = Math.floor(Math.abs(difference) / 60);
  const minutes = Math.abs(difference) % 60;
  const duration = [hours ? `${hours}h` : "", minutes ? `${minutes}m` : ""].filter(Boolean).join(" ");

  return {
    time: formatter.format(now),
    date: new Intl.DateTimeFormat("en-AU", { timeZone, weekday: "short", day: "numeric", month: "short" }).format(now),
    difference: difference === 0 ? "Same time as your device" : `${duration} ${difference > 0 ? "ahead of" : "behind"} your device`,
    deviceTimeZone
  };
}
