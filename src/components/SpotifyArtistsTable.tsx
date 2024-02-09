import {
  Row,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { AudioProvider } from '@/lib/providers/audio';
import Link from './Link';
import Search from './Search';
import {
  IconArrowDown,
  IconArrowUp,
  IconChartBar,
  IconMusic,
} from '@tabler/icons-react';

const columnHelper = createColumnHelper<SpotifyApi.ArtistObjectFull>();

function getColumnMeta(columnDef: ReturnType<typeof columnHelper.display>) {
  return columnDef.meta as Record<string, string>;
}

const separator = '|SEP|';

const columns = [
  columnHelper.display({
    id: 'number',
    cell: ({ row: { index } }) => <span>{index + 1}</span>,
    header: () => <span aria-label="Artist number">#</span>,
    meta: {
      label: 'Artist number',
      class: 'w-[6.5%] text-center tabular-nums',
      headerClass: 'justify-center',
    },
  }),
  columnHelper.accessor(
    (row) => {
      const genres = row.genres.join(', ');
      return `${row.name} ${separator} ${genres}`;
    },
    {
      cell: ({ row: { original: row } }) => (
        <div className="flex items-center gap-4">
          <img
            src={
              row.images
                .filter(
                  (image) =>
                    row.images.length === 1 ||
                    (image && image.width && image.width > 100),
                )
                .at(-1)?.url
            }
            alt={row.name}
            className="h-24 w-24"
          />
          <div className="min-w-0">
            <Link
              title={row.name}
              className="text-primary block overflow-hidden text-ellipsis hover:underline"
              href={row.external_urls.spotify}
            >
              {row.name}
            </Link>
            <div className="whitespace-pre-wrap text-sm">
              {row.genres.join(', ')}
            </div>
          </div>
        </div>
      ),
      id: 'name',
      header: 'Name',
      meta: { class: 'text-left text-ellipsis overflow-hidden' },
    },
  ),
  columnHelper.accessor('popularity', {
    cell: (info) => (
      <span className="text-secondary text-sm">{info.getValue()}</span>
    ),
    header: () => (
      <span title="Popularity">
        <IconChartBar aria-label="Popularity" width={16} height={16} />
      </span>
    ),
    meta: {
      label: 'Popularity',
      class: 'w-[6%] text-right tabular-nums',
      headerClass: 'justify-end',
    },
    enableGlobalFilter: false,
  }),
];

const defaultSortingState: SortingState = [{ id: 'name', desc: true }];

interface SpotifyArtistsTableProps {
  className?: string;
  data: SpotifyApi.ArtistObjectFull[];
  defaultSorting?: SortingState;
}

export default function SpotifyArtistsTable({
  className,
  data,
  defaultSorting = defaultSortingState,
}: SpotifyArtistsTableProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sorting.length ? sorting : defaultSorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => tableContainerRef.current,
    count: rows.length,
    estimateSize: () => 64,
    overscan: 32,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <AudioProvider>
      <Search
        onChange={({ target: { value } }) => setGlobalFilter(String(value))}
        value={globalFilter}
        className="mb-8 w-full"
        placeholder="Search…"
      />
      <div
        ref={tableContainerRef}
        className={clsx(
          'h-[max(calc(100vh-14rem),16rem)] overflow-auto',
          className,
        )}
      >
        {
          // Assume that the table is never empty if the data is loaded, unless
          // a search query is specified.
          !virtualRows.length ? (
            <div className="flex h-full flex-col items-center justify-center gap-4">
              <IconMusic
                aria-hidden
                width={128}
                height={128}
                strokeWidth={1.5}
              />
              <p>
                No artists available
                {globalFilter ? ' for the given search query' : ''}.
              </p>
            </div>
          ) : (
            <table className="w-[55rem] table-fixed border-separate border-spacing-0 whitespace-nowrap">
              <thead className="bg-primary sticky top-0">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const meta = getColumnMeta(header.column.columnDef);
                      const label =
                        meta.label || header.column.columnDef.header;
                      const sortable = header.column.getCanSort();
                      const sortDirection = header.column.getIsSorted();
                      const sortInfo = {
                        asc: {
                          component: IconArrowUp,
                          otherLabel: 'descending',
                        },
                        desc: {
                          component: IconArrowDown,
                          otherLabel: 'ascending',
                        },
                      }[sortDirection as string];

                      const buttonDirectionLabel =
                        sortInfo?.otherLabel || 'descending';
                      const buttonLabel = sortable
                        ? `Sort ${buttonDirectionLabel} by ${label}`
                        : undefined;

                      return (
                        <th
                          className={clsx(
                            meta.class,
                            'border-b border-slate-400 border-opacity-50 p-2',
                          )}
                          key={header.id}
                        >
                          {header.isPlaceholder ? null : (
                            <button
                              className={clsx(
                                'flex w-full items-center gap-1',
                                meta.headerClass,
                                { 'cursor-pointer select-none': sortable },
                              )}
                              disabled={!sortable}
                              aria-label={buttonLabel}
                              type="button"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                              {sortInfo?.component ? (
                                <sortInfo.component
                                  aria-hidden
                                  strokeWidth={2.5}
                                  width={16}
                                  height={16}
                                />
                              ) : null}
                            </button>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {paddingTop > 0 ? (
                  <tr>
                    <td style={{ height: `${paddingTop}px` }} />
                  </tr>
                ) : null}
                {virtualRows.map((virtualRow) => {
                  const row = rows[
                    virtualRow.index
                  ] as Row<SpotifyApi.ArtistObjectFull>;
                  return (
                    <tr
                      key={row.original.id}
                      className="group/row focus-within:bg-blue-300 focus-within:bg-opacity-10 hover:bg-blue-300 hover:bg-opacity-10"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          className={clsx(
                            getColumnMeta(cell.column.columnDef)?.class,
                            'p-2 first-of-type:rounded-l last-of-type:rounded-r',
                          )}
                          key={cell.id}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                {paddingBottom > 0 ? (
                  <tr>
                    <td style={{ height: `${paddingBottom}px` }} />
                  </tr>
                ) : null}
              </tbody>
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext(),
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            </table>
          )
        }
      </div>
    </AudioProvider>
  );
}
