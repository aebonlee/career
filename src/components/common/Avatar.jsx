import { cn, getInitials } from '../../utils';

const colors = ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED', '#DB2777'];

function getColor(name) {
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function Avatar({ src, name, size = 'md', className }) {
  if (src) {
    return (
      <div className={cn('avatar', `avatar--${size}`, className)}>
        <img src={src} alt={name || ''} />
      </div>
    );
  }

  return (
    <div
      className={cn('avatar', `avatar--${size}`, className)}
      style={{ background: getColor(name), color: '#fff' }}
    >
      {getInitials(name)}
    </div>
  );
}
