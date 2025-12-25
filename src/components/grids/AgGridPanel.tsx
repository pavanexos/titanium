import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import type { ColDef, GridReadyEvent } from "ag-grid-community";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, Download, Maximize2, RotateCcw, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

const __AG_KEY = "__gs_ag_registered__";
if (!(globalThis as any)[__AG_KEY]) {
  ModuleRegistry.registerModules([AllCommunityModule]);
  (globalThis as any)[__AG_KEY] = true;
}

type Density = "comfortable" | "compact";

function setGridOptionSafe(api: any, key: string, value: any) {
  if (!api) return;
  if (typeof api.setGridOption === "function") {
    api.setGridOption(key, value);
    return;
  }
  // Fallbacks for older APIs
  if (key === "quickFilterText" && typeof api.setQuickFilter === "function") {
    api.setQuickFilter(value);
  }
  if (key === "paginationPageSize" && typeof api.paginationSetPageSize === "function") {
    api.paginationSetPageSize(value);
  }
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
  placeholderClass?: string;
  searchPlaceholder?: string;
  rowsLabel?: string;
  selectedLabel?: string;
  uiText?: {
    options: string;
    optionsTooltip: string;
    menuGrid: string;
    menuPageSize: string;
    density: string;
    comfortable: string;
    compact: string;
    autoSizeColumns: string;
    exportCsv: string;
    resetGrid: string;
    noRows: string;
  };
};

export function AgGridPanel<T extends object>(props: AgGridPanelProps<T>) {
  const {
    title,
    subtitle,
    headerRight,
    isDark,
    textMuted,
    rowData,
    columnDefs,
    height = 420,
    ariaLabel,
    placeholderClass,
    searchPlaceholder = "Search rows",
    rowsLabel = "rows",
    selectedLabel = "selected",
    uiText,
  } = props;

  const ui = {
    options: "Options",
    optionsTooltip: "Grid options",
    menuGrid: "Grid",
    menuPageSize: "Page size",
    density: "Density",
    comfortable: "Comfortable",
    compact: "Compact",
    autoSizeColumns: "Auto-size columns",
    exportCsv: "Export CSV",
    resetGrid: "Reset grid",
    noRows: "No rows",
    ...(uiText ?? {}),
  };

  const apiRef = useRef<any>(null);

  const [quickFilter, setQuickFilter] = useState("");
  const [pageSize, setPageSize] = useState<number>(25);
  const [density, setDensity] = useState<Density>("comfortable");
  const [displayedCount, setDisplayedCount] = useState<number>(rowData.length);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const rowHeight = density === "compact" ? 36 : 44;
  const headerHeight = 44;

  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      sortable: true,
      filter: true,
      floatingFilter: true,
      resizable: true,
      flex: 1,
      minWidth: 120,
      filterParams: { debounceMs: 200 },
    }),
    []
  );

  // Make selection effortless (checkboxes) while keeping user's columns intact
  const enhancedCols = useMemo<ColDef<T>[]>(() => {
    if (!columnDefs?.length) return columnDefs;
    const [first, ...rest] = columnDefs;
    const firstCol: ColDef<T> = {
      ...first,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      pinned: "left",
      lockPinned: true,
      suppressMovable: true,
      width: Math.max(160, Number((first as any).width ?? 160)),
      minWidth: Math.max(160, Number((first as any).minWidth ?? 160)),
    };
    return [firstCol, ...rest];
  }, [columnDefs]);

  const syncCounts = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    try {
      if (typeof api.getDisplayedRowCount === "function") {
        setDisplayedCount(api.getDisplayedRowCount());
      }
      if (typeof api.getSelectedRows === "function") {
        setSelectedCount(api.getSelectedRows().length);
      }
    } catch {
      // ignore
    }
  }, []);

  const onGridReady = useCallback(
    (params: GridReadyEvent<T>) => {
      apiRef.current = params.api;

      setGridOptionSafe(params.api as any, "quickFilterText", quickFilter);
      setGridOptionSafe(params.api as any, "paginationPageSize", pageSize);

      window.requestAnimationFrame(() => {
        try {
          params.api.sizeColumnsToFit();
        } catch {
          // ignore
        }
      });

      syncCounts();
    },
    [pageSize, quickFilter, syncCounts]
  );

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    setGridOptionSafe(api, "quickFilterText", quickFilter);
    syncCounts();
  }, [quickFilter, syncCounts]);

  useEffect(() => {
    const api = apiRef.current;
    if (!api) return;
    setGridOptionSafe(api, "paginationPageSize", pageSize);
  }, [pageSize]);

  const exportCsv = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    try {
      api.exportDataAsCsv?.({ fileName: "glasssuite-data.csv" });
    } catch {
      // ignore
    }
  }, []);

  const autoSizeAll = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    try {
      const cols = api.getAllGridColumns?.() ?? [];
      const colIds = cols.map((c: any) => c.getColId?.()).filter(Boolean);
      if (colIds.length) api.autoSizeColumns?.(colIds, false);
    } catch {
      // ignore
    }
  }, []);

  const resetGrid = useCallback(() => {
    const api = apiRef.current;
    if (!api) return;
    try {
      api.setFilterModel?.(null);
      api.applyColumnState?.({ defaultState: { sort: null }, state: [], applyOrder: false });
      api.deselectAll?.();
      setQuickFilter("");
      setGridOptionSafe(api, "quickFilterText", "");
    } catch {
      // ignore
    }
    syncCounts();
  }, [syncCounts]);

  const chip = isDark ? "bg-white/8 ring-white/10" : "bg-white/75 ring-black/10";
  const themeClass = "ag-theme-quartz";

  return (
    <section className={cn("rounded-3xl p-5 ring-1", isDark ? "bg-white/8 ring-white/10" : "bg-black/5 ring-black/10")}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {title ? <div className="text-sm font-semibold">{title}</div> : null}
          {subtitle ? <div className={cn("mt-1 text-xs", textMuted)}>{subtitle}</div> : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {headerRight}

          <Input
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "h-10 w-[260px] rounded-2xl border-none ring-1 ring-inset",
              isDark ? "bg-white/10 ring-white/10" : "bg-white/85 ring-black/10",
              placeholderClass
            )}
            aria-label={searchPlaceholder}
          />

          <div className={cn("hidden rounded-2xl px-3 py-2 text-xs ring-1 sm:block", chip)}>
            <span className={cn("mr-2", textMuted)}>{displayedCount}</span>
            <span className={textMuted}>{rowsLabel}</span>
          </div>

          {selectedCount > 0 ? (
            <div className={cn("hidden rounded-2xl px-3 py-2 text-xs ring-1 sm:block", chip)}>
              <span className={cn("mr-2", textMuted)}>{selectedCount}</span>
              <span className={textMuted}>{selectedLabel}</span>
            </div>
          ) : null}

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className={cn(
                      "h-10 rounded-2xl px-3 ring-1 ring-inset",
                      isDark ? "bg-white/10 ring-white/10 hover:bg-white/15" : "bg-white/70 ring-black/10 hover:bg-white/80"
                    )}
                    aria-label={ui.optionsTooltip}
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">{ui.options}</span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>{ui.optionsTooltip}</TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>{ui.menuGrid}</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setDensity((d) => (d === "comfortable" ? "compact" : "comfortable"));
                }}
              >
                <Maximize2 className="mr-2 h-4 w-4" />
                {ui.density}: {density === "comfortable" ? ui.comfortable : ui.compact}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>{ui.menuPageSize}</DropdownMenuLabel>

              {[25, 50, 100].map((n) => (
                <DropdownMenuItem
                  key={n}
                  onSelect={(e) => {
                    e.preventDefault();
                    setPageSize(n);
                  }}
                >
                  {pageSize === n ? "✓ " : ""}
                  {n} {rowsLabel}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  autoSizeAll();
                }}
              >
                <Maximize2 className="mr-2 h-4 w-4" />
                {ui.autoSizeColumns}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  exportCsv();
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                {ui.exportCsv}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  resetGrid();
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                {ui.resetGrid}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 overflow-hidden rounded-3xl ring-1",
          isDark ? "bg-black/25 ring-white/10" : "bg-white/70 ring-black/10",
          "gs-ag-glass"
        )}
        style={{ height }}
        aria-label={ariaLabel}
      >
        <div className={cn("h-full w-full", themeClass)} style={{ height: "100%", width: "100%" }}>
          <AgGridReact<T>
            rowData={rowData}
            columnDefs={enhancedCols}
            defaultColDef={defaultColDef}
            animateRows
            rowHeight={rowHeight}
            headerHeight={headerHeight}
            pagination
            paginationPageSize={pageSize}
            suppressRowClickSelection
            suppressCellFocus={false}
            enableCellTextSelection
            tooltipShowDelay={500}
            tooltipHideDelay={1200}
            popupParent={document.body}
            onGridReady={onGridReady}
            onModelUpdated={syncCounts}
            onSelectionChanged={syncCounts}
            rowSelection={{ mode: "multiRow", enableClickSelection: false, checkboxes: true, headerCheckbox: true } as any}
            getRowId={(p) => String((p.data as any)?.id ?? (p.data as any)?.Id ?? (p.data as any)?._id ?? p.rowIndex)}
            overlayNoRowsTemplate={`<span style='padding:12px;opacity:.75'>${ui.noRows}</span>`}
          />
        </div>
      </div>
    </section>
  );
}
