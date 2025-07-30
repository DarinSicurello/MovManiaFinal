// Prop Utility for debugging  UPDATED
interface DebugProps {
  label: string;
  data?: any;
  level?: 'info' | 'error' | 'warn' | 'success';
}

// Logs debug UPDATED v5.5 to show New Console Logs instead of just "Error"
export function logDebug(label: string, data?: any, level: 'info' | 'error' | 'warn' | 'success' = 'info') {
  const prefixMap = {
    info: 'Info:',
    error: 'Error Bug!',
    warn: 'Warning:',
    success: 'Success:',
  };

  const prefix = prefixMap[level] || '🔍 Debug:';

  console.log(`${prefix} ${label}`, data ?? '');
}
