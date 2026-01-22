/**
 * Format number as Bangladeshi Taka (BDT)
 */
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('bn-BD')}`;
}

/**
 * Format date to relative time in Bangla
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'এইমাত্র';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} মিনিট আগে`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ঘন্টা আগে`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} দিন আগে`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} সপ্তাহ আগে`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} মাস আগে`;
  }
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} বছর আগে`;
}

/**
 * Format date to Bangla date string
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('bn-BD', options);
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
  // Format: 01XXX-XXXXXX
  if (phone.length === 11) {
    return `${phone.slice(0, 5)}-${phone.slice(5)}`;
  }
  return phone;
}

/**
 * Get payment method label in Bangla
 */
export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: 'ক্যাশ',
    bkash: 'বিকাশ',
    nagad: 'নগদ (Nagad)',
  };
  return labels[method] || method;
}

/**
 * Get status label in Bangla
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: 'পেন্ডিং',
    confirmed: 'নিশ্চিত',
    rejected: 'বাতিল',
  };
  return labels[status] || status;
}
