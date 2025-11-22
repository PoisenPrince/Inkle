import { FormEvent, useEffect, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export type CreateRequestPayload = {
  name: string;
  gender: string;
  country: string;
  requestDate: string;
};

interface NewCustomerModalProps {
  open: boolean;
  countries: string[];
  saving?: boolean;
  error?: string | null;
  onClose: () => void;
  onSave: (payload: CreateRequestPayload) => Promise<void> | void;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const NewCustomerModal = ({ open, countries, saving = false, error, onClose, onSave }: NewCustomerModalProps) => {
  const defaultCountry = useMemo(() => countries[0] ?? '', [countries]);
  const [name, setName] = useState('');
  const [country, setCountry] = useState(defaultCountry);
  const [gender, setGender] = useState('Male');
  const [requestDate, setRequestDate] = useState(todayISO());
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName('');
      setCountry(defaultCountry);
      setGender('Male');
      setRequestDate(todayISO());
      setValidationError(null);
    }
  }, [open, defaultCountry]);

  if (!open) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setValidationError('Name is required.');
      return;
    }

    if (!country) {
      setValidationError('Country is required.');
      return;
    }

    if (!gender) {
      setValidationError('Gender is required.');
      return;
    }

    if (!requestDate) {
      setValidationError('Request date is required.');
      return;
    }

    setValidationError(null);
    await onSave({
      name: trimmedName,
      country,
      gender,
      requestDate
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-customer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <div>
            <h3 id="new-customer-title">New Customer</h3>
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
              <option value="" disabled>
                Select country
              </option>
              {[...new Set([country, ...countries].filter(Boolean))].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="gender" className="required">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
              disabled={saving}
              className="input-control"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="requestDate" className="required">
              Request date
            </label>
            <input
              id="requestDate"
              name="requestDate"
              type="date"
              value={requestDate}
              onChange={(event) => setRequestDate(event.target.value)}
              disabled={saving}
              className="input-control"
            />
          </div>

          {(validationError || error) && (
            <p className="form-error" role="alert">
              {validationError || error}
            </p>
          )}

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

export default NewCustomerModal;
