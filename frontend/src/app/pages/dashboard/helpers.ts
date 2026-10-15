import type { DetectionResult } from '../../utils/detection';
import type { DashboardScanResult, ThreatLevel } from './types';

const threatColorMap: Record<ThreatLevel, string> = {
  clean: '#10B981',
  spam: '#F59E0B',
  malware: '#EF4444',
  phishing: '#8B5CF6',
};

export const threatColor = (level: ThreatLevel): string => threatColorMap[level];

const threatBgMap: Record<ThreatLevel, string> = {
  clean: 'rgba(16,185,129,0.1)',
  spam: 'rgba(245,158,11,0.1)',
  malware: 'rgba(239,68,68,0.1)',
  phishing: 'rgba(139,92,246,0.1)',
};

export const threatBg = (level: ThreatLevel): string => threatBgMap[level];

export const severityColor = (severity: string): string => ({
  critical: '#EF4444',
  high: '#F59E0B',
  medium: '#3B82F6',
}[severity] ?? '#6B7280');

const MAX_FLAG_LENGTH = 180;

const normalizeDisplayText = (text: string): string => {
  // Collapse whitespace first so chips/details never preserve huge spacing from raw payloads.
  const compact = text.replace(/\s+/g, ' ').trim();
  if (!compact) {
    return '';
  }

  const alphaChars = compact.match(/[A-Za-z]/g)?.length ?? 0;
  const upperChars = compact.match(/[A-Z]/g)?.length ?? 0;
  const upperRatio = alphaChars > 0 ? upperChars / alphaChars : 0;

  // If text is mostly uppercase, present it in sentence case for readability.
  const readable = upperRatio > 0.65 ? compact.toLowerCase() : compact;
  return readable.length > MAX_FLAG_LENGTH ? `${readable.slice(0, MAX_FLAG_LENGTH)}...` : readable;
};

// Converts normalized backend scores into dashboard-specific severity buckets.
export const mapDetectionToDashboardResult = (result: DetectionResult): DashboardScanResult => {
  let level: ThreatLevel = 'clean';

  if (result.isMalware) {
    level = 'malware';
  } else if (result.isSpam && ['critical', 'high', 'medium'].includes(result.threatLevel)) {
    level = 'phishing';
  } else if (result.isSpam || result.threatLevel === 'low') {
    level = 'spam';
  }

  const detailsSource = result.reasons.length ? result.reasons.join(' ') : 'No suspicious behavior detected.';
  const details = normalizeDisplayText(detailsSource);
  const flags = [...result.details.suspiciousPatterns, ...result.details.riskFactors]
    .map(normalizeDisplayText)
    .filter((flag) => flag.length > 0);

  return {
    level,
    score: result.details.safetyScore,
    details,
    flags,
  };
};
