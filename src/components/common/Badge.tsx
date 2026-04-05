import { cn } from '../../utils';

export default function Badge({ children, variant = 'primary', className }: any) {
  return (
    <span className={cn('badge', `badge--${variant}`, className)}>
      {children}
    </span>
  );
}
