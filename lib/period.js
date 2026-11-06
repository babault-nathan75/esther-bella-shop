const DAY = 86400000;

// Abidjan vit en UTC : les jours du tableau de bord sont donc des jours UTC
export function parsePeriod(searchParams) {
  const today = new Date().toISOString().slice(0, 10);
  const toText = searchParams.get("to") || today;
  const fromText = searchParams.get("from") || new Date(Date.parse(toText) - 29 * DAY).toISOString().slice(0, 10);
  const from = new Date(`${fromText}T00:00:00.000Z`);
  const to = new Date(`${toText}T23:59:59.999Z`);
  if (isNaN(from) || isNaN(to) || from > to) return null;
  const length = to.getTime() - from.getTime() + 1;
  return { from, to, previousFrom: new Date(from.getTime() - length), previousTo: new Date(from.getTime() - 1) };
}

export function daysBetween(from, to) {
  const days = [];
  for (let t = from.getTime(); t <= to.getTime(); t += DAY) days.push(new Date(t).toISOString().slice(0, 10));
  return days;
}
