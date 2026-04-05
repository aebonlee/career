import { cn, getInitials } from '../../utils';

export default function Avatar({ src, name, size = 'md', className }) {
  if (src) {
    return (
      <div className={cn('avatar', `avatar--${size}`, className)}>
        <img src={src} alt={name || ''} />
      </div>
    );
  }

  return (
    <div className={cn('avatar', `avatar--${size}`, 'avatar--initials', className)}>
      {getInitials(name)}
    </div>
  );
}
