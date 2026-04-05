export default function LoadingSpinner({ size = 'md', text }) {
  return (
    <div className="loading-spinner">
      <div className={`loading-spinner__circle loading-spinner__circle--${size}`} />
      {text && <p className="loading-spinner__text">{text}</p>}
    </div>
  );
}
