import React, { useMemo, useRef, useState } from "react";
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type TanstackVirtualGridProps<T extends object> = {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  data: T[];
  columns: ColumnDef<T, any>[];
  isDark: boolean;
  textMuted: string;
  placeholderClass?: string;
  height?: number;
  ariaLabel?: string;
  searchPlaceholder?: string;
  rowsLabel?: string;
};

export function TanstackVirtualGrid<T extends object>(props: TanstackVirtualGridProps<T>) {
  const {
    title,
    subtitle,
    headerRight,
    data,
    columns,
    isDark,
    textMuted,
    placeholderClass,
    height = 420,
    ariaLabel,
    searchPlaceholder = "Search",
    rowsLabel = "rows",
  } = props;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();

  const headerBg = isDark ? "bg-black/35" : "bg-white/70";
  const rowHover = isDark ? "hover:bg-white/6" : "hover:bg-black/5";
  const rowDivider = isDark ? "border-white/10" : "border-black/10";
  const cellText = isDark ? "text-slate-50" : "text-slate-900";
  const chip = isDark ? "bg-white/8 ring-white/10" : "bg-white/75 ring-black/10";

  const colWidths = useMemo(() => {
    const widths: Record<string, number> = {};
    for (const col of table.getAllLeafColumns()) {
      widths[col.id] = Math.max(110, col.getSize?.() ?? 150);
    }
    return widths;
  }, [table]);

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
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              "h-10 w-[260px] rounded-2xl border-none ring-1",
              isDark ? "bg-white/10 ring-white/10" : "bg-white/85 ring-black/10",
              placeholderClass
            )}
            aria-label={searchPlaceholder}
          />
          <div className={cn("hidden rounded-2xl px-3 py-2 text-xs ring-1 sm:block", chip)}>
            <span className={cn("mr-2", textMuted)}>{rows.length}</span>
            <span className={textMuted}>{rowsLabel}</span>
          </div>
        </div>
      </div>

      <div
        ref={parentRef}
        className={cn(
          "mt-4 overflow-auto rounded-3xl ring-1",
          isDark ? "bg-black/25 ring-white/10" : "bg-white/70 ring-black/10"
        )}
        style={{ height }}
        aria-label={ariaLabel}
      >
        <table className={cn("w-full table-fixed border-collapse text-sm", cellText)}>
          <thead className={cn("sticky top-0 z-10 backdrop-blur-2xl", headerBg)}>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className={cn("border-b", rowDivider)}>
                {hg.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      className={cn(
                        "px-3 py-3 text-left text-xs font-semibold",
                        textMuted,
                        canSort ? "cursor-pointer select-none" : "cursor-default"
                      )}
                      style={{ width: colWidths[header.column.id] ?? 150 }}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      scope="col"
                    >
                      <div className="flex items-center gap-2">
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {sorted ? (
                          <span className={cn("text-[10px]", textMuted)} aria-hidden>
                            {sorted === "asc" ? "▲" : "▼"}
                          </span>
                        ) : null}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody
            className={cn("relative block w-full", cellText)}
            style={{ height: totalSize, minHeight: 44 }}
          >
            {virtualItems.map((vr) => {
              const row = rows[vr.index];
              return (
                <tr
                  key={row.id}
                  className={cn("absolute left-0 right-0 border-b", rowDivider, rowHover)}
                  style={{ transform: `translateY(${vr.start}px)`, height: vr.size, display: "table", tableLayout: "fixed", width: "100%" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 align-middle" style={{ width: colWidths[cell.column.id] ?? 150 }}>
                      <div className="truncate">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
