import { cn } from "@/lib/utils";

export type GridEngine = "tanstack" | "aggrid";

export function GridEngineToggle(props: {
  engine: GridEngine;
  setEngine: (v: GridEngine) => void;
  isDark: boolean;
  label: string;
  tanstackLabel: string;
  agLabel: string;
}) {
  const { engine, setEngine, isDark, label, tanstackLabel, agLabel } = props;

  const shell = cn(
    "inline-flex items-center gap-1 rounded-2xl p-1 ring-1",
    isDark ? "bg-white/6 ring-white/10" : "bg-black/5 ring-black/10"
  );

  const btn = (active: boolean) =>
    cn(
      "h-9 rounded-xl px-3 text-xs font-semibold transition",
      active
        ? isDark
          ? "bg-white/14 text-slate-50"
          : "bg-white text-slate-900"
        : isDark
          ? "text-slate-200/70 hover:bg-white/10"
          : "text-slate-700/80 hover:bg-black/10"
    );

  return (
    <div className="flex items-center gap-2">
      <div className={cn("text-xs font-semibold", isDark ? "text-slate-200/70" : "text-slate-700/70")}>{label}</div>
      <div className={shell} role="group" aria-label={label}>
        <button type="button" className={btn(engine === "tanstack")} onClick={() => setEngine("tanstack")}>
          {tanstackLabel}
        </button>
        <button type="button" className={btn(engine === "aggrid")} onClick={() => setEngine("aggrid")}>
          {agLabel}
        </button>
      </div>
    </div>
  );
}
