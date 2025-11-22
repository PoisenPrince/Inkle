import { FormEvent, useEffect, useMemo, useState } from 'react';
import { RequestRow } from './RequestsTable';
import { HiOutlineX } from 'react-icons/hi';

interface EditRequestModalProps {
  open: boolean;
  row: RequestRow | null;
  countries: string[];
  onClose: () => void;
}

const EditRequestModal = ({ open, row, countries, onClose }: EditRequestModalProps) => {
  const [name, setName] = useState(row?.name ?? '');
  const [country, setCountry] = useState(row?.country ?? '');

  useEffect(() => {
    setName(row?.name ?? '');
    setCountry(row?.country ?? '');
  }, [row, open]);

  const sortedCountries = useMemo(() => {
    const cleaned = [...countries].filter(Boolean);
    if (!cleaned.length && row?.country) return [row.country];
    return cleaned.sort((a, b) => a.localeCompare(b));
  }, [countries, row?.country]);

  if (!open || !row) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onClose();
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
            <p className="eyebrow">Edit entry</p>
            <h3 id="edit-request-title">{row.name}</h3>
          </div>
          <button className="ghost icon" aria-label="Close" onClick={onClose}>
            <HiOutlineX size={18} />
          </button>
        </header>

        <form className="modal-body" onSubmit={submit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter name"
            />
          </div>

          <div className="field">
            <label htmlFor="country">Country</label>
            <select
              id="country"
              name="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
            >
              {sortedCountries.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary">
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequestModal;
