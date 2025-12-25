export type CustomerRow = {
  id: number;
  name: string;
  email: string;
  country: string;
  created_at: string;
};

export type OrderRow = {
  id: number;
  customer_id: number;
  status: "open" | "processing" | "shipped" | "cancelled";
  total: number;
  created_at: string;
};

export type InvoiceRow = {
  id: number;
  order_id: number;
  amount: number;
  paid: boolean;
  issued_at: string;
};

export type UserRow = {
  id: number;
  name: string;
  role: "Admin" | "Analyst" | "Operator" | "Viewer";
  active: boolean;
  created_at: string;
};

export type ReportRunRow = {
  id: string;
  report: string;
  owner: string;
  status: "success" | "running" | "failed";
  updated: string;
  duration_ms: number;
};

export type QueryEntity = "Customers" | "Orders" | "Invoices" | "Users";

function mulberry32(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const FIRST = ["Ava", "Mia", "Liam", "Noah", "Olivia", "Ethan", "Zoe", "Mason", "Sofia", "Leo", "Iris", "Aria", "Theo", "Nina", "Omar"];
const LAST = ["Johnson", "Patel", "Kim", "Garcia", "Chen", "Williams", "Nguyen", "Brown", "Singh", "Khan", "Lopez", "Miller", "Davis"];
const COUNTRIES = ["US", "DE", "FR", "GB", "CA", "IN", "SG", "AU", "NL", "SE", "JP"];
const ROLES: UserRow["role"][] = ["Admin", "Analyst", "Operator", "Viewer"];
const STATUSES: OrderRow["status"][] = ["open", "processing", "shipped", "cancelled"];
const RUN_STATUSES: ReportRunRow["status"][] = ["success", "running", "failed"];

function pick<T>(rnd: () => number, arr: readonly T[]) {
  return arr[Math.floor(rnd() * arr.length)] as T;
}

function dateISO(rnd: () => number, daysBack = 60) {
  const now = Date.now();
  const delta = Math.floor(rnd() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - delta).toISOString().slice(0, 10);
}

export function makeQueryRows(
  entity: QueryEntity,
  count: number,
  seedKey: string = entity
): Array<CustomerRow | OrderRow | InvoiceRow | UserRow> {
  const rnd = mulberry32(hashString(seedKey));
  const rows: Array<CustomerRow | OrderRow | InvoiceRow | UserRow> = [];

  for (let i = 0; i < count; i++) {
    const id = i + 1;
    if (entity === "Customers") {
      const first = pick(rnd, FIRST);
      const last = pick(rnd, LAST);
      const name = `${first} ${last}`;
      const email = `${first.toLowerCase()}.${last.toLowerCase()}${(id % 97) + 1}@example.com`;
      rows.push({
        id,
        name,
        email,
        country: pick(rnd, COUNTRIES),
        created_at: dateISO(rnd, 180),
      });
      continue;
    }
    if (entity === "Orders") {
      rows.push({
        id,
        customer_id: Math.floor(rnd() * 900) + 1,
        status: pick(rnd, STATUSES),
        total: Math.round((rnd() * 9800 + 50) * 100) / 100,
        created_at: dateISO(rnd, 120),
      });
      continue;
    }
    if (entity === "Invoices") {
      const amount = Math.round((rnd() * 12500 + 25) * 100) / 100;
      rows.push({
        id,
        order_id: Math.floor(rnd() * 1500) + 1,
        amount,
        paid: rnd() > 0.22,
        issued_at: dateISO(rnd, 90),
      });
      continue;
    }

    const first = pick(rnd, FIRST);
    const last = pick(rnd, LAST);
    rows.push({
      id,
      name: `${first} ${last}`,
      role: pick(rnd, ROLES),
      active: rnd() > 0.12,
      created_at: dateISO(rnd, 365),
    });
  }

  return rows;
}

export function makeReportRunRows(reportTitle: string, count: number, seedKey = reportTitle): ReportRunRow[] {
  const rnd = mulberry32(hashString(seedKey));
  const rows: ReportRunRow[] = [];
  for (let i = 0; i < count; i++) {
    const first = pick(rnd, FIRST);
    const last = pick(rnd, LAST);
    const status = pick(rnd, RUN_STATUSES);
    rows.push({
      id: `run_${i + 1}`,
      report: reportTitle,
      owner: `${first} ${last}`,
      status,
      updated: dateISO(rnd, 45),
      duration_ms: Math.floor(rnd() * 34000) + (status === "running" ? 22000 : 1800),
    });
  }
  return rows;
}
