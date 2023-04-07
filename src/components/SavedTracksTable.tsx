import savedTracksData from '@/data/spotify';
import {
  formatDate,
  msToDuration,
  msToMinutes,
  relativeFormat,
} from '@/lib/datetime';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import TrackPreview from './TrackPreview';
import { AudioProvider } from '@/lib/providers/audio';

interface SavedTrackRow {
  id: string;
  image_url: string;
  title: string;
  artist: {
    id: string;
    name: string;
    url: string;
  }[];
  album: string;
  added_at: string;
  duration_ms: number;
  explicit: boolean;
  preview_url: string;
}

const columnHelper = createColumnHelper<SavedTrackRow>();

function getColumnMeta(columnDef: ReturnType<typeof columnHelper.display>) {
  return columnDef.meta as Record<string, string>;
}

const columns = [
  columnHelper.display({
    id: 'number',
    cell: ({ row }) => (
      <TrackPreview
        number={row.index + 1}
        title={row.original.title}
        artists={row.original.artist.map((artist) => artist.name)}
        previewUrl={row.original.preview_url}
      />
    ),
    header: '#',
    meta: { class: 'w-[6%] text-center tabular-nums' },
  }),
  columnHelper.accessor((row) => `${row.title} ${row.album}`, {
    cell: (info) => (
      <div className="flex items-center gap-4">
        <img
          alt={info.row.original.album}
          src={info.row.original.image_url}
          className="h-8 w-8"
        />
        <div className="min-w-0">
          <div
            title={info.row.original.title}
            className="overflow-hidden text-ellipsis"
          >
            {info.row.original.title}
          </div>
          <div className="text-sm">
            {info.row.original.artist
              .map<ReactNode>((artist) => (
                <a href={artist.url} key={artist.id}>
                  {artist.name}
                </a>
              ))
              .reduce((prev, curr) => [prev, ', ', curr])}
          </div>
        </div>
      </div>
    ),
    id: 'title',
    header: 'Title',
    meta: { class: 'text-left text-ellipsis overflow-hidden' },
  }),
  columnHelper.accessor('album', {
    cell: (info) => (
      <span className="text-sm" title={info.getValue()}>
        {info.getValue()}
      </span>
    ),
    header: 'Album',
    meta: { class: 'w-[25%] text-left text-ellipsis overflow-hidden' },
  }),
  columnHelper.accessor('added_at', {
    cell: (info) => (
      <time
        className="text-sm"
        dateTime={info.getValue()}
        title={formatDate(info.getValue())}
      >
        {relativeFormat(info.getValue())}
      </time>
    ),
    header: 'Date added',
    meta: { class: 'w-[15%] text-left' },
  }),
  columnHelper.accessor('duration_ms', {
    cell: (info) => (
      <time className="text-sm" dateTime={msToDuration(info.getValue())}>
        {msToMinutes(info.getValue())}
      </time>
    ),
    header: '⌛️',
    meta: { class: 'w-[5%] text-right tabular-nums' },
  }),
];

export default function SavedTracksTable({
  className,
}: {
  className?: string;
}) {
  const [data] = useState<SavedTrackRow[]>(() =>
    savedTracksData.tracks.map((track) => ({
      id: track.id,
      image_url: track.album.images[0].url,
      title: track.name,
      artist: track.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
        url: artist.external_urls.spotify,
      })),
      album: track.album.name,
      added_at: track.added_at,
      duration_ms: track.duration_ms,
      explicit: track.explicit,
      preview_url: track.preview_url,
    })),
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <AudioProvider>
      <div className={clsx('p-2', className)}>
        <table className="w-full table-fixed border-collapse whitespace-nowrap">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className={clsx(
                      getColumnMeta(header.column.columnDef)?.class,
                      'p-2',
                    )}
                    key={header.id}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="group">
                {row.getVisibleCells().map((cell) => (
                  <td
                    className={clsx(
                      getColumnMeta(cell.column.columnDef)?.class,
                      'p-2',
                    )}
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
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
      </div>
    </AudioProvider>
  );
}
