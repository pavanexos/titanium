import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef } from "ag-grid-community";

import { cn } from "@/lib/utils";

const __AG_KEY = "__gs_ag_registered__";
if (!(globalThis as any)[__AG_KEY]) {
  ModuleRegistry.registerModules([AllCommunityModule]);
  (globalThis as any)[__AG_KEY] = true;
}

export type AgGridPanelProps<T extends object> = {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  isDark: boolean;
  textMuted: string;
  rowData: T[];
  columnDefs: ColDef<T>[];
  height?: number;
  ariaLabel?: string;
};

export function AgGridPanel<T extends object>(props: AgGridPanelProps<T>) {
  const { title, subtitle, headerRight, isDark, textMuted, rowData, columnDefs, height = 420, ariaLabel } = props;

  const defaultColDef = useMemo<ColDef<T>>(
    () => ({ sortable: true, filter: true, resizable: true, flex: 1, minWidth: 120 }),
    []
  );

  // Use a single exported theme CSS and drive dark mode via CSS variables (see src/index.css)
  const themeClass = "ag-theme-quartz";

  return (
    <section className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {title ? <div className="text-sm font-semibold">{title}</div> : null}
          {subtitle ? <div className={cn("mt-1 text-xs", textMuted)}>{subtitle}</div> : null}
        </div>
        {headerRight ? <div className="flex items-center gap-2">{headerRight}</div> : null}
      </div>

      <div
        className={cn(
          "mt-4 overflow-hidden rounded-3xl ring-1",
          isDark ? "bg-black/25 ring-white/10" : "bg-white/70 ring-black/10"
        )}
        style={{ height }}
        aria-label={ariaLabel}
      >
        <div className={cn("h-full w-full", themeClass)} style={{ height: "100%", width: "100%" }}>
          <AgGridReact<T>
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            animateRows
            rowHeight={44}
            headerHeight={44}
            suppressCellFocus={false}
            suppressMovableColumns
            suppressRowClickSelection
          />
        </div>
      </div>
    </section>
  );
}
