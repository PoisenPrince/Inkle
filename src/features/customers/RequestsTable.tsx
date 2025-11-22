import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { HiOutlinePencil, HiOutlineRefresh, HiOutlineFilter } from 'react-icons/hi';
import clsx from 'clsx';
import Button from '../../components/ui/Button';
import EditRequestModal from './EditRequestModal';

// --------------------------------------------------
// Types
// --------------------------------------------------

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

// --------------------------------------------------
// Helpers
// --------------------------------------------------

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

// --------------------------------------------------
// Column meta type fix
// --------------------------------------------------

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData extends unknown, TValue> {
    align?: 'center' | 'right';
  }
}

// --------------------------------------------------
// Gender Badge
// --------------------------------------------------

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

// --------------------------------------------------
// Component
// --------------------------------------------------

const RequestsTable = () => {
  const [rows, setRows] = useState<RequestRow[]>(fallbackRows);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>(() =>
    [...new Set(fallbackRows.map((row) => row.country))].sort()
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [editingRow, setEditingRow] = useState<RequestRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 6 });

  // --------------------------------------------------
  // Load requests
  // --------------------------------------------------

  const loadRequests = useCallback(async ({ silent }: { silent?: boolean } = {}) => {
    silent ? setRefreshing(true) : setLoading(true);

    try {
      const response = await fetch('https://685013d7e7c42cfd17974a33.mockapi.io/taxes');

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data: ApiRow[] = await response.json();
      const normalized = data.map(normalizeRow);
      setRows(normalized);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setRows(fallbackRows);
    } finally {
      silent ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  // --------------------------------------------------
  // Load countries
  // --------------------------------------------------

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      try {
        const response = await fetch('https://685013d7e7c42cfd17974a33.mockapi.io/countries');

        if (!response.ok) throw new Error('Failed to load countries');

        const data: { name?: string }[] = await response.json();
        if (!active) return;

        const names = data.map((c) => c.name).filter(Boolean) as string[];
        if (names.length) setCountries([...new Set(names)].sort());
      } catch {
        if (!active) return;
      }
    };

    loadCountries();
    return () => {
      active = false;
    };
  }, []);

  // --------------------------------------------------
  // Table columns
  // --------------------------------------------------

  const columns = useMemo<ColumnDef<RequestRow>[]>(() => {
    return [
      {
        id: 'name',
        accessorKey: 'name',
        header: 'Entity',
        cell: (info) => <span className="entity">{info.getValue<string>()}</span>
      },
      {
        id: 'gender',
        accessorKey: 'gender',
        header: 'Gender',
        meta: { align: 'center' },
        cell: (info) => <GenderBadge gender={info.getValue<string>()} />
      },
      {
        id: 'requestDate',
        accessorKey: 'requestDate',
        header: 'Request date',
        cell: (info) => <span>{formatDate(info.getValue<string>())}</span>
      },
      {
        id: 'country',
        accessorKey: 'country',
        header: 'Country',
        filterFn: (row, id, filterValues) => {
          if (!Array.isArray(filterValues) || filterValues.length === 0) return true;
          return filterValues.includes(row.getValue(id));
        }
      },
      {
        id: 'edit',
        header: '',
        meta: { align: 'right' },
        cell: (info) => (
          <Button
            variant="icon"
            aria-label="Edit"
            onClick={() => setEditingRow(info.row.original)}
            size="sm"
          >
            <HiOutlinePencil size={18} />
          </Button>
        )
      }
    ];
  }, []);

  // --------------------------------------------------
  // Table Instance
  // --------------------------------------------------

  const table = useReactTable({
    data: rows,
    columns,
    state: { columnFilters, pagination },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const countryFilter =
    (table.getColumn('country')?.getFilterValue() as string[]) ?? [];

  const toggleCountry = (country: string) => {
    const next = countryFilter.includes(country)
      ? countryFilter.filter((c) => c !== country)
      : [...countryFilter, country];

    table.getColumn('country')?.setFilterValue(next);
  };

  const clearCountryFilter = () => {
    table.getColumn('country')?.setFilterValue([]);
  };

  // --------------------------------------------------
  // Save updated row
  // --------------------------------------------------

  const handleSave = async (
    row: RequestRow,
    updates: { name: string; country: string }
  ) => {
    setSaving(true);

    const payload = { ...row, ...updates };

    try {
      const response = await fetch(
        `https://685013d7e7c42cfd17974a33.mockapi.io/taxes/${row.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) throw new Error('Failed to update');

      setEditingRow(null);
      await loadRequests({ silent: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating');
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Render UI
  // --------------------------------------------------

  const visibleRows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;
  const start = totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const end = totalRows === 0 ? 0 : Math.min(start + pagination.pageSize - 1, totalRows);

  return (
    <div className="card">
      {/* Toolbar */}
      <div className="table-toolbar">
        <div>
          <h2>Requests</h2>
          <p className="table-subtitle">Latest customer tax submissions</p>
        </div>

        <div className="toolbar-actions">
          {/* Filter Button */}
          <div className="filter" data-open={showCountryFilter}>
            <Button
              type="button"
              variant="icon"
              aria-label="Filter by country"
              aria-haspopup="listbox"
              aria-expanded={showCountryFilter}
              onClick={() => setShowCountryFilter((prev) => !prev)}
              size="sm"
            >
              <HiOutlineFilter size={18} />
            </Button>

            {showCountryFilter && (
              <div className="popover animate-in" role="listbox">
                <div className="popover-title">Country</div>
                <div className="divider" />
                <ul className="popover-list">
                  {countries.map((country) => (
                    <li key={country}>
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={countryFilter.includes(country)}
                          onChange={() => toggleCountry(country)}
                        />
                        <span>{country}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="divider" />
                <Button variant="primary" className="clear-button" onClick={clearCountryFilter}>
                  Clear selection
                </Button>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="status-group">
            {loading && <span className="pill muted">Loading…</span>}
            {error && <span className="pill error">Using fallback data</span>}
          </div>

          {/* Refresh Button */}
          <Button
            type="button"
            variant="secondary"
            onClick={() => loadRequests({ silent: true })}
            loading={refreshing}
            size="sm"
          >
            <HiOutlineRefresh size={18} />
            <span className="btn-text">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
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

          {/* Body */}
          {loading ? (
            <tbody>
              {[...Array(4)].map((_, idx) => (
                <tr key={idx} className="skeleton-row">
                  {columns.map((col) => (
                    <td key={col.id}>
                      <div className="skeleton" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : visibleRows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="empty">
                  No requests match this view.
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {visibleRows.map((row) => (
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
          )}
        </table>
      </div>

      {/* Footer */}
      <div className="table-footer">
        <div className="pagination-meta">
          <p>
            Showing <strong>{start}</strong> – <strong>{end}</strong> of{' '}
            <strong>{totalRows}</strong>
          </p>

          <label className="page-size">
            Rows per page
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(e.target.value)
                }))
              }
            >
              {[4, 6, 8, 10].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="pagination-controls">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      <EditRequestModal
        open={!!editingRow}
        row={editingRow}
        countries={countries}
        saving={saving}
        onClose={() => setEditingRow(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default RequestsTable;
