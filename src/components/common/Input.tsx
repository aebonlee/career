import { cn } from '../../utils';

export default function Input({ label, error, helperText, icon, type = 'text', className, ...props }) {
  const inputClass = cn(
    type === 'textarea' ? 'form-textarea' : type === 'select' ? 'form-select' : 'form-input',
    icon && (type !== 'select' ? 'form-input--has-icon' : ''),
    error && (type === 'textarea' ? 'form-textarea--error' : 'form-input--error')
  );

  return (
    <div className={cn('form-group', className)}>
      {label && <label className="form-label">{label}</label>}
      <div className="form-input-wrapper">
        {icon && <span className="form-input-icon">{icon}</span>}
        {type === 'textarea' ? (
          <textarea className={inputClass} {...props} />
        ) : type === 'select' ? (
          <select className={inputClass} {...props} />
        ) : (
          <input type={type} className={inputClass} {...props} />
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {helperText && !error && <p className="form-helper">{helperText}</p>}
    </div>
  );
}
