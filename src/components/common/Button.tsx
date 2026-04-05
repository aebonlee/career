import { cn } from '../../utils';

export default function Button({
  children, variant = 'primary', size = 'md', fullWidth, loading, disabled, onClick, type = 'button', className, style, ...rest
}: any) {
  return (
    <button
      type={type}
      className={cn(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--full-width',
        loading && 'btn--loading',
        className
      )}
      style={style}
      onClick={onClick}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="btn__spinner" />}
      {children}
    </button>
  );
}
