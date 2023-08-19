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
import Layout from '@/components/Layout';
import Link from '@/components/Link';
import Search from '@/components/Search';
import { AlbumSimplified } from '@/lib/models/spotify';
import { getSpotifyDataURL } from '@/lib/spotify/data';
import { InferGetStaticPropsType } from 'next';
import { formatDate, relativeFormat } from '@/lib/datetime';
import { ReactNode, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, BarChart, Music } from 'react-feather';
import clsx from 'clsx';

export async function getStaticProps() {
  const { albums: data }: { albums: AlbumSimplified[] } = await fetch(
    getSpotifyDataURL('albums_simplified'),
  ).then((res) => res.json());
  return {
    props: { data },
  };
}

function getColumnMeta(columnDef: ReturnType<typeof columnHelper.display>) {
  return columnDef.meta as Record<string, string>;
}

const columnHelper = createColumnHelper<AlbumSimplified>();

const separator = '|SEP|';

const getColumns = (useTitle = true) => [
  columnHelper.display({
    id: 'number',
    cell: ({ row: { index } }) => index + 1,
    header: () => <span aria-label="Album number">#</span>,
    meta: {
      label: 'Album number',
      class: 'w-[6%] text-center tabular-nums',
      headerClass: 'justify-center',
    },
  }),
  columnHelper.accessor(
    (row) => {
      const artists = row.artists.map(({ name }) => name).join(' ');
      return useTitle
        ? `${row.name} ${separator} ${artists}`
        : `${artists} ${separator} ${row.name}`;
    },
    {
      cell: ({ row: { original: row } }) => (
        <div className="flex items-center gap-4">
          <img src={row.image_url} alt={row.name} className="h-16 w-16" />
          <div className="min-w-0">
            <Link
              title={row.name}
              className="text-primary block overflow-hidden text-ellipsis hover:underline"
              href={row.url}
            >
              {row.name}
            </Link>
            <div className="text-primary overflow-hidden text-ellipsis text-sm">
              {row.artists
                .map<ReactNode>((artist) => (
                  <Link
                    key={artist.id}
                    className="text-secondary hover:underline"
                    href={artist.url}
                  >
                    {artist.name}
                  </Link>
                ))
                .reduce((prev, curr) => [prev, ', ', curr])}
            </div>
          </div>
        </div>
      ),
      id: useTitle ? 'name' : 'artist',
      header: useTitle ? 'Name' : 'Artist',
      meta: { class: 'text-left text-ellipsis overflow-hidden' },
    },
  ),
  columnHelper.accessor('added_at', {
    cell: (info) => (
      <time
        className="text-secondary text-sm"
        dateTime={info.getValue()}
        title={formatDate(info.getValue())}
      >
        {relativeFormat(info.getValue())}
      </time>
    ),
    header: 'Date added',
    sortDescFirst: true,
    meta: { class: 'w-[15%] text-left' },
  }),
  columnHelper.accessor('popularity', {
    cell: (info) => (
      <span className="text-secondary text-sm">{info.getValue()}</span>
    ),
    header: () => (
      <span title="Popularity">
        <BarChart aria-label="Popularity" width={16} height={16} />
      </span>
    ),
    meta: {
      label: 'Popularity',
      class: 'w-[7%] text-right tabular-nums',
      headerClass: 'justify-end',
    },
    enableGlobalFilter: false,
  }),
];

const columnsWithTitle = getColumns(true);
const columnsWithArtist = getColumns(false);

const defaultSortingState: SortingState = [{ id: 'added_at', desc: true }];

export default function Albums({
  data,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [useTitle, setUseTitle] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns: useTitle ? columnsWithTitle : columnsWithArtist,
    state: {
      sorting: sorting.length ? sorting : defaultSortingState,
      globalFilter,
    },
    onSortingChange: (v) => {
      if (
        sorting.length &&
        (sorting[0].id === 'name' || sorting[0].id === 'artist') &&
        sorting[0].desc
      ) {
        setUseTitle(!useTitle);
        if (sorting[0].id === 'name') {
          setSorting([{ id: 'artist', desc: false }]);
          return;
        }
      }
      setSorting(v);
    },
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
    estimateSize: () => 80,
    overscan: 40,
  });
  const virtualRows = rowVirtualizer.getVirtualItems();
  const totalSize = rowVirtualizer.getTotalSize();
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <Layout
      customMeta={{
        title: 'Albums',
        description: `Here are all the albums I've saved my Spotify account.`,
      }}
    >
      <div className="bleed flex min-h-screen w-full max-w-4xl flex-col gap-8 place-self-center">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Albums</h1>
          <p>Here are all the albums I've saved my Spotify account.</p>
        </div>
        <Search
          onChange={({ target: { value } }) => setGlobalFilter(String(value))}
          value={globalFilter}
          className="mb-8 w-full"
          placeholder="Search…"
        />
        <div
          ref={tableContainerRef}
          className={clsx('h-[max(calc(100vh-14rem),16rem)] overflow-auto')}
        >
          {
            // Assume that the table is never empty if the data is loaded, unless
            // a search query is specified.
            !virtualRows.length ? (
              <div className="flex h-full flex-col items-center justify-center gap-4">
                <Music aria-hidden width={128} height={128} strokeWidth={1.5} />
                <p>
                  No tracks available
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
                          asc: { component: ArrowUp, otherLabel: 'descending' },
                          desc: {
                            component: ArrowDown,
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
                    const row = rows[virtualRow.index] as Row<AlbumSimplified>;
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
      </div>
    </Layout>
  );
}
