import { cn } from '../../utils';

export default function StarRating({ rating = 0, maxStars = 5, size = 'md', interactive, onChange }) {
  return (
    <span className={cn('star-rating', `star-rating--${size}`, interactive && 'star-rating--interactive')}>
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          key={i}
          className={cn('star-rating__star', i < Math.round(rating) && 'star-rating__star--filled')}
          onClick={interactive ? () => onChange?.(i + 1) : undefined}
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `${i + 1}점` : undefined}
        >
          <i className={i < Math.round(rating) ? 'fa-solid fa-star' : 'fa-regular fa-star'} />
        </span>
      ))}
    </span>
  );
}
