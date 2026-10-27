import clsx from 'clsx';
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

const fieldBase =
  'w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm text-text placeholder:text-text-muted/70 transition-colors focus-visible:outline-none focus-visible:border-aki-green-500 focus-visible:ring-2 focus-visible:ring-aki-green-500/30';

interface WrapperProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

export function FieldWrapper({ label, htmlFor, error, hint, required, children }: WrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-text">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="text-xs text-text-muted">{hint}</span>}
      {error && (
        <span role="alert" className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, required, className, ...props }: InputProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <input id={id} required={required} className={clsx(fieldBase, className)} {...props} />
    </FieldWrapper>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, id, required, className, ...props }: TextareaProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <textarea id={id} required={required} className={clsx(fieldBase, 'min-h-28 resize-y', className)} {...props} />
    </FieldWrapper>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Select({ label, error, hint, id, required, className, children, ...props }: SelectProps) {
  return (
    <FieldWrapper label={label} htmlFor={id} error={error} hint={hint} required={required}>
      <select id={id} required={required} className={clsx(fieldBase, 'cursor-pointer', className)} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
}
