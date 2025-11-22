import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { HiOutlineFunnel, HiOutlinePencil } from 'react-icons/hi';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import EditRequestModal from './EditRequestModal';
import NewCustomerModal, { CreateRequestPayload } from './NewCustomerModal';

export type RequestsTableHandle = {
  refresh: () => void;
  openNewCustomer: () => void;
};
import { useCallback, useEffect, useMemo, useState } from 'react';
import { HiOutlineFunnel, HiOutlinePencil, HiOutlineRefresh } from 'react-icons/hi';
import { clsx } from 'clsx';
import Button from '../../components/ui/Button';
import EditRequestModal from './EditRequestModal';

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

const RequestsTable = forwardRef<RequestsTableHandle>((_, ref) => {
  const [rows, setRows] = useState<RequestRow[]>(fallbackRows);
  const [loading, setLoading] = useState(true);
const RequestsTable = () => {
  const [rows, setRows] = useState<RequestRow[]>(fallbackRows);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<string[]>(() => [
    ...new Set(fallbackRows.map((row) => row.country))
  ].sort());
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [editingRow, setEditingRow] = useState<RequestRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 6 });

  const loadRequests = useCallback(async ({ silent }: { silent?: boolean } = { silent: false }) => {
    if (!silent) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 6 });

  const loadRequests = useCallback(async ({ silent }: { silent?: boolean } = { silent: false }) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch('https://685013d7e7c42cfd17974a33.mockapi.io/taxes');

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data: ApiRow[] = await response.json();
      const normalized = data.map(normalizeRow);
      setRows(normalized);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setRows(fallbackRows);
    } finally {
      if (!silent) {
      if (silent) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      try {
        const response = await fetch('https://685013d7e7c42cfd17974a33.mockapi.io/countries');
        if (!response.ok) {
          throw new Error('Failed to load countries');
        }

        const data: { name?: string }[] = await response.json();
        if (!active) return;

        const names = data
          .map((country) => country.name)
          .filter(Boolean) as string[];

        if (names.length) {
          setCountries([...new Set(names)].sort());
        }
      } catch (err) {
        if (!active) return;
        setCountries((prev) => [...new Set(prev)].sort());
      }
    };

    loadCountries();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [rows, columnFilters]);

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
        header: 'Country',
        filterFn: (row, columnId, filterValue) => {
          if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
          const value = row.getValue<string>(columnId);
          return filterValue.includes(value);
        }
      },
      {
        id: 'edit',
        header: '',
        cell: (info) => (
          <Button
            variant="icon"
            aria-label="Edit"
            onClick={() => setEditingRow(info.row.original)}
            size="sm"
          >
            <HiOutlinePencil size={18} />
          </Button>
        ),
        meta: { align: 'right' }
      }
    ],
    []
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      columnFilters,
      pagination
    },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  });

  const countryFilter =
    (table.getColumn('country')?.getFilterValue() as string[] | undefined) ?? [];

  const toggleCountry = (country: string) => {
    const next = countryFilter.includes(country)
      ? countryFilter.filter((item) => item !== country)
      : [...countryFilter, country];

    table.getColumn('country')?.setFilterValue(next);
  };

  const clearCountryFilter = () => {
    table.getColumn('country')?.setFilterValue([]);
  };

  const handleSave = async (
    row: RequestRow,
    updates: { name: string; country: string }
  ) => {
    setSaving(true);

    const payload = {
      ...row,
      name: updates.name,
      country: updates.country
    };

    try {
      const response = await fetch(
        `https://685013d7e7c42cfd17974a33.mockapi.io/taxes/${row.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update request');
      }

      setEditingRow(null);
      await loadRequests({ silent: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update request';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async (payload: CreateRequestPayload) => {
    setCreating(true);
    setCreateError(null);

    try {
      const parsedDate = new Date(payload.requestDate);
      const requestDate = Number.isNaN(parsedDate.getTime())
        ? payload.requestDate
        : parsedDate.toISOString();

      const response = await fetch('https://685013d7e7c42cfd17974a33.mockapi.io/taxes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...payload, requestDate })
      });

      if (!response.ok) {
        throw new Error('Failed to create request');
      }

      setNewModalOpen(false);
      await loadRequests({ silent: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create request';
      setCreateError(message);
    } finally {
      setCreating(false);
    }
  };

  const openNewModal = () => {
    setCreateError(null);
    setNewModalOpen(true);
  };

  const closeNewModal = () => {
    setNewModalOpen(false);
    setCreateError(null);
  };

  useImperativeHandle(ref, () => ({
    refresh: () => loadRequests({ silent: true }),
    openNewCustomer: openNewModal
  }));

  const visibleRows = table.getRowModel().rows;
  const totalRows = table.getFilteredRowModel().rows.length;
  const start = totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const end = totalRows === 0 ? 0 : Math.min(start + pagination.pageSize - 1, totalRows);

  const content = loading ? (
    <tbody aria-busy="true">
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
  );

  return (
    <div className="card">
      <div className="table-toolbar">
        <div>
          <h2>Requests</h2>
          <p className="table-subtitle">Latest customer tax submissions</p>
        </div>
        <div className="toolbar-actions">
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
              <HiOutlineFunnel size={18} />
            </Button>
            {showCountryFilter && (
              <div
                className="popover animate-in"
                role="listbox"
                aria-label="Filter by country"
              >
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
          <div className="status-group">
            {loading && <span className="pill muted">Loading…</span>}
            {error && (
              <span className="pill error" role="status">
                Using fallback data
              </span>
            )}
          </div>
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
      {error && (
        <div className="alert" role="alert">
          <strong>Could not load live data.</strong> Showing fallback entries instead.
        </div>
      )}
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
      <div className="table-footer">
        <div className="pagination-meta">
          <p>
            Showing <strong>{start}</strong> - <strong>{end}</strong> of <strong>{totalRows}</strong>
          </p>
          <label className="page-size">
            Rows per page
            <select
              value={pagination.pageSize}
              onChange={(event) =>
                setPagination((prev) => ({ ...prev, pageSize: Number(event.target.value) }))
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
        open={Boolean(editingRow)}
        row={editingRow}
        countries={countries}
        saving={saving}
        onClose={() => setEditingRow(null)}
        onSave={handleSave}
      />
      <NewCustomerModal
        open={newModalOpen}
        countries={countries}
        saving={creating}
        error={createError}
        onClose={closeNewModal}
        onSave={handleCreate}
      />
    </div>
  );
});

RequestsTable.displayName = 'RequestsTable';
    </div>
  );
};

export default RequestsTable;
