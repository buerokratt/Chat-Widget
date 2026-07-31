export interface HolidaysData {
  holidays: string[];
  holidayNames: string;
}

function getEaster(year: number): [number, number] {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31);
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return [month, day];
}

function formatDate(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function addDays(year: number, month: number, day: number, delta: number): string {
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + delta);
  return formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function getHolidays(): HolidaysData {
  const year = new Date().getFullYear();
  const [easterMonth, easterDay] = getEaster(year);
  const easterStr = formatDate(year, easterMonth, easterDay);

  const fixed: Array<[string, string]> = [
    ["01-01", "uusaasta"],
    ["02-24", "iseseisvuspäev"],
    ["05-01", "kevadpüha"],
    ["06-23", "võidupüha"],
    ["06-24", "jaanipäev"],
    ["08-20", "taasiseseisvumispäev"],
    ["12-24", "jõululaupäev"],
    ["12-25", "esimene jõulupüha"],
    ["12-26", "teine jõulupüha"],
  ];

  const entries: Array<{ date: string; name: string }> = [
    ...fixed.map(([mmdd, name]) => {
      const [m, d] = mmdd.split("-").map(Number);
      return { date: formatDate(year, m, d), name };
    }),
    { date: addDays(year, easterMonth, easterDay, -2), name: "suur reede" },
    { date: easterStr, name: "lihavõtted" },
    { date: addDays(year, easterMonth, easterDay, 49), name: "nelipühade 1. püha" },
  ];

  const sorted = entries.sort((a, b) => a.date.localeCompare(b.date));
  const holidays = sorted.map((e) => e.date);
  const holidayNames = sorted.map((e) => `${e.date}-${e.name}`).join(",");

  return { holidays, holidayNames };
}

export default getHolidays;
