import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import { clsx } from 'clsx';

export type RequestRow = {
  id: string;
  name: string;
  gender: string;
  requestDate: string;
  country: string;
};

type ApiRow = {
  id?: string;
  entity?: string;
  name?: string;
  gender?: string;
  requestDate?: string;
  date?: string;
  createdAt?: string;
  country?: string;
  location?: string;
};

const fallbackRows: RequestRow[] = [
  { id: '1', name: 'Marco Huel', gender: 'Male', requestDate: '2025-01-20', country: 'India' },
  { id: '2', name: 'Alex Morgan', gender: 'Female', requestDate: '2025-01-18', country: 'US' },
  { id: '3', name: 'Priya Singh', gender: 'Female', requestDate: '2025-01-12', country: 'UK' },
  { id: '4', name: 'Hiro Tanaka', gender: 'Male', requestDate: '2025-01-04', country: 'Japan' }
];

const formatDate = (input: string) => {
  if (!input) return '—';

  const parsed = new Date(input);
  if (Number.isNaN(parsed.getTime())) return input;

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const normalizeRow = (row: ApiRow): RequestRow => ({
  id: row.id ?? crypto.randomUUID(),
  name: row.name ?? row.entity ?? '—',
  gender: row.gender ?? '—',
  requestDate: row.requestDate ?? row.date ?? row.createdAt ?? '',
  country: row.country ?? row.location ?? '—'
});

const GenderBadge = ({ gender }: { gender: string }) => {
  const isMale = /^male$/i.test(gender);
  const isFemale = /^female$/i.test(gender);

  return (
    <span
      className={clsx('badge', {
        male: isMale,
        female: isFemale,
        neutral: !isMale && !isFemale
      })}
    >
      {gender || '—'}
    </span>
  );
};

const RequestsTable = () => {
  const [rows, setRows] = useState<RequestRow[]>(fallbackRows);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch('https://685013d7e7c42cfd17974a33.mockapi.io/taxes');

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data: ApiRow[] = await response.json();
        if (!active) return;

        const normalized = data.map(normalizeRow);
        setRows(normalized);
        setError(null);
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        setRows(fallbackRows);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const columns = useMemo<ColumnDef<RequestRow>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Entity',
        cell: (info) => <span className="entity">{info.getValue<string>()}</span>
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        cell: (info) => <GenderBadge gender={info.getValue<string>()} />,
        meta: { align: 'center' }
      },
      {
        accessorKey: 'requestDate',
        header: 'Request date',
        cell: (info) => <span>{formatDate(info.getValue<string>())}</span>
      },
      {
        accessorKey: 'country',
        header: 'Country'
      },
      {
        id: 'edit',
        header: '',
        cell: () => (
          <button className="icon-button" aria-label="Edit">
            <HiOutlinePencil size={18} />
          </button>
        ),
        meta: { align: 'right' }
      }
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  const content = loading ? (
    <tbody>
      {[...Array(4)].map((_, index) => (
        <tr key={index} className="skeleton-row">
          {columns.map((column) => (
            <td key={column.id ?? column.accessorKey?.toString()}>
              <div className="skeleton" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  ) : (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className={clsx({
                center: cell.column.columnDef.meta?.align === 'center',
                right: cell.column.columnDef.meta?.align === 'right'
              })}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="card">
      <div className="table-toolbar">
        <div>
          <h2>Requests</h2>
          <p className="table-subtitle">Latest customer tax submissions</p>
        </div>
        {error && <span className="error-pill">Using fallback data</span>}
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={clsx({
                      center: header.column.columnDef.meta?.align === 'center',
                      right: header.column.columnDef.meta?.align === 'right'
                    })}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          {content}
        </table>
      </div>
    </div>
  );
};

export default RequestsTable;
