export type Page = 'overview' | 'scanner' | 'history' | 'threats' | 'settings' | 'reports';

export type ThreatLevel = 'clean' | 'spam' | 'malware' | 'phishing';

export interface ScanRecord {
  id: string;
  preview: string;
  level: ThreatLevel;
  score: number;
  time: string;
  date: string;
}

export interface DashboardScanResult {
  level: ThreatLevel;
  score: number;
  details: string;
  flags: string[];
}
