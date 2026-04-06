interface FormFieldProps {
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

const baseInput =
  'w-full rounded-none border border-vinho/20 bg-offwhite px-4 py-3 font-body text-vinho ' +
  'placeholder:text-vinho/40 focus:border-caramelo focus:outline-none focus:ring-1 focus:ring-caramelo ' +
  'transition-colors duration-200';

export const FormField = ({
  type = 'text',
  label,
  name,
  placeholder,
  required = false,
  options = [],
  value,
  onChange,
  error,
  className = '',
}: FormFieldProps) => {
  const errorStyle = error ? 'border-status-red focus:border-status-red focus:ring-status-red' : '';

  const errorId = error ? `${name}-error` : undefined;

  const inputProps = {
    id: name,
    name,
    placeholder,
    required,
    value,
    'aria-required': required || undefined,
    'aria-invalid': error ? true as const : undefined,
    'aria-describedby': errorId,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange?.(e.target.value),
    className: `${baseInput} ${errorStyle}`,
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={name}
        className="block font-headline text-sm font-semibold uppercase tracking-wider text-vinho"
      >
        {label}
        {required && <span className="ml-1 text-vinho">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea {...inputProps} rows={4} className={`${inputProps.className} resize-none`} />
      ) : type === 'select' ? (
        <select {...inputProps}>
          <option value="" disabled>
            {placeholder || 'Selecione...'}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input {...inputProps} type={type} />
      )}

      {error && <p id={errorId} role="alert" className="text-sm text-status-red">{error}</p>}
    </div>
  );
};
