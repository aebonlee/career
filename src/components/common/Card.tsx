import { cn } from '../../utils';

export default function Card({ children, className, hoverable, padding = 'md', onClick, style }: any) {
  return (
    <div
      className={cn('card', `card--${padding}`, hoverable && 'card--hoverable', className)}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
