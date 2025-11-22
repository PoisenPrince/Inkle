import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  requiredLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, className, requiredLabel, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="field">
        {label && (
          <label htmlFor={inputId} className={clsx({ required: requiredLabel || props.required })}>
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={clsx('input-control', className)} {...props} />
        {hint && <p className="hint">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
