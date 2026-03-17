import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

// Format price in Korean Won
export function formatPrice(amount) {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
}

// Format date
export function formatDate(dateStr, pattern = 'yyyy.MM.dd') {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, pattern, { locale: ko });
}

// Format datetime
export function formatDateTime(dateStr) {
  return formatDate(dateStr, 'yyyy.MM.dd HH:mm');
}

// Relative time (e.g., "3시간 전")
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

// Format duration in minutes to readable string
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

// Generate merchant UID for payments
export function generateMerchantUid() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `career_${timestamp}_${random}`;
}

// Truncate text
export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

// Get initials from name
export function getInitials(name) {
  if (!name) return '?';
  return name.charAt(0).toUpperCase();
}

// Validate email
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone (Korean)
export function isValidPhone(phone) {
  return /^01[0-9]-?\d{3,4}-?\d{4}$/.test(phone);
}

// Debounce
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Get status label in Korean
export function getBookingStatusLabel(status) {
  const labels = {
    pending: '대기중',
    confirmed: '확정',
    completed: '완료',
    cancelled: '취소됨',
    no_show: '노쇼',
  };
  return labels[status] || status;
}

export function getPaymentStatusLabel(status) {
  const labels = {
    pending: '결제대기',
    paid: '결제완료',
    failed: '결제실패',
    refunded: '환불완료',
    cancelled: '취소됨',
  };
  return labels[status] || status;
}

export function getDocumentStatusLabel(status) {
  const labels = {
    submitted: '제출완료',
    in_review: '검토중',
    reviewed: '검토완료',
  };
  return labels[status] || status;
}

// Classnames helper
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
