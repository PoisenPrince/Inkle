import { FormEvent, useEffect, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { RequestRow } from './RequestsTable';

interface EditRequestModalProps {
  open: boolean;
  row: RequestRow | null;
  countries: string[];
  onClose: () => void;
  onSave: (
    row: RequestRow,
    updates: { name: string; country: string }
  ) => Promise<void> | void;
  saving?: boolean;
}

const EditRequestModal = ({
  open,
  row,
  countries,
  onClose,
  onSave,
  saving = false
}: EditRequestModalProps) => {
  const [name, setName] = useState(row?.name ?? '');
  const [country, setCountry] = useState(row?.country ?? '');

  useEffect(() => {
    setName(row?.name ?? '');
    setCountry(row?.country ?? '');
  }, [row, open]);

  const sortedCountries = useMemo(() => {
    const cleaned = [...countries, row?.country]
      .filter(Boolean)
      .map((value) => value!.trim())
      .filter(Boolean);

    return [...new Set(cleaned)].sort((a, b) => a.localeCompare(b));
  }, [countries, row?.country]);

  if (!open || !row) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName || !country) return;

    await onSave(row, { name: trimmedName, country });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-request-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h3 id="edit-request-title">Edit Customer</h3>
          </div>
          <Button
            variant="ghost"
            className="icon"
            aria-label="Close"
            onClick={onClose}
            size="sm"
          >
            <HiOutlineX size={18} />
          </Button>
        </header>

        <form className="modal-body" onSubmit={submit}>
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter name"
            required
            requiredLabel
            disabled={saving}
          />

          <div className="field">
            <label htmlFor="country" className="required">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              disabled={saving}
              className="input-control"
            >
              {sortedCountries.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequestModal;
