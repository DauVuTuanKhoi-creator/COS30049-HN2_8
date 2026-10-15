import type { ScanRecord } from './types';

// Mock dashboard datasets emulate backend-fed telemetry until APIs are wired.
export const mockHistory: ScanRecord[] = [
  { id: '1', preview: 'Hi team, Just a reminder about our meeting scheduled for tomorrow at 2 PM...', level: 'clean', score: 97, time: '2:34 PM', date: 'Today' },
  { id: '2', preview: 'CONGRATULATIONS!!! You have WON $1,000,000 in our LOTTERY! Click here NOW...', level: 'spam', score: 12, time: '1:15 PM', date: 'Today' },
  { id: '3', preview: 'URGENT: Your account has been suspended due to suspicious activity. Verify your identity...', level: 'phishing', score: 5, time: '11:02 AM', date: 'Today' },
  { id: '4', preview: '<script>eval(atob(...)', level: 'malware', score: 2, time: '9:48 AM', date: 'Today' },
  { id: '5', preview: 'Dear Sarah, Thank you for your inquiry. I have reviewed your proposal...', level: 'clean', score: 99, time: '8:30 AM', date: 'Today' },
  { id: '6', preview: 'Get 80% off all medications! No prescription needed. Order now...', level: 'spam', score: 8, time: '6:12 PM', date: 'Yesterday' },
  { id: '7', preview: 'Invoice #8842 attached. Payment due by end of month. Please review...', level: 'clean', score: 95, time: '3:45 PM', date: 'Yesterday' },
  { id: '8', preview: 'Your PayPal account requires immediate verification. Click link below...', level: 'phishing', score: 3, time: '11:20 AM', date: 'Yesterday' },
];

export const threatIntel = [
  { type: 'Phishing Campaign', source: 'banking-secure-login.ru', severity: 'critical', detected: '2h ago', count: 1847 },
  { type: 'Spam Wave', source: 'bulk-offers-network.com', severity: 'high', detected: '5h ago', count: 12400 },
  { type: 'Malware Distribution', source: 'free-software-hub.net', severity: 'critical', detected: '8h ago', count: 934 },
  { type: 'Credential Harvesting', source: 'account-verify-portal.xyz', severity: 'high', detected: '12h ago', count: 3210 },
];

export const weeklyData = [42, 78, 55, 91, 63, 87, 48];
export const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
