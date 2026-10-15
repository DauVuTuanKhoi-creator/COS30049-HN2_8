import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getScanHistory, type ScanHistory } from '../../utils/detection';
import { mockHistory } from './data';
import type { ThreatLevel } from './types';

export const LIVE_SCAN_UPDATED_EVENT = 'secureguard:scan-updated';

export interface AnalyticsRecord {
  id: string;
  preview: string;
  level: ThreatLevel;
  safetyScore: number;
  timestamp: Date;
}

export interface UseLiveTelemetryOptions {
  autoRefresh: boolean;
  refreshEverySec: number;
}

// Central severity mapper keeps overview charts and history rows in sync.
export function mapScanToLevel(scan: ScanHistory): ThreatLevel {
  if (scan.result.isMalware) {
    return 'malware';
  }
  if (scan.result.isSpam && ['critical', 'high', 'medium'].includes(scan.result.threatLevel)) {
    return 'phishing';
  }
  if (scan.result.isSpam || scan.result.threatLevel === 'low') {
    return 'spam';
  }
  return 'clean';
}

// Seed records ensure pages are still usable when history API is empty/unavailable.
function fallbackSeedRecords(): AnalyticsRecord[] {
  const now = Date.now();
  return mockHistory.map((entry, index) => ({
    id: entry.id,
    preview: entry.preview,
    level: entry.level,
    safetyScore: entry.score,
    timestamp: new Date(now - index * 1000 * 60 * 90),
  }));
}

export function useLiveTelemetry(options: UseLiveTelemetryOptions) {
  const { autoRefresh, refreshEverySec } = options;
  const [records, setRecords] = useState<AnalyticsRecord[]>(() => fallbackSeedRecords());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loadingLiveData, setLoadingLiveData] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const isRefreshingRef = useRef(false);

  // Lock-based refresh prevents overlapping interval/manual requests from racing each other.
  const refreshFromApi = useCallback(async () => {
    if (isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;
    setLoadingLiveData(true);
    try {
      const history = await getScanHistory();
      const nextRecords = history.map((scan) => ({
        id: scan.id,
        preview: scan.preview,
        level: mapScanToLevel(scan),
        safetyScore: scan.result.details.safetyScore,
        timestamp: scan.timestamp,
      }));

      setRecords(nextRecords.length > 0 ? nextRecords : fallbackSeedRecords());
      setLastUpdated(new Date());
      setRefreshError(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown history refresh error.';
      setRefreshError(message);
    } finally {
      isRefreshingRef.current = false;
      setLoadingLiveData(false);
    }
  }, []);

  useEffect(() => {
    void refreshFromApi();
  }, [refreshFromApi]);

  const refreshMs = useMemo(() => Math.max(5, refreshEverySec) * 1000, [refreshEverySec]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = window.setInterval(() => {
      void refreshFromApi();
    }, refreshMs);

    return () => window.clearInterval(timer);
  }, [autoRefresh, refreshMs, refreshFromApi]);

  // Scanner page dispatches this event after successful saves so dashboards refresh immediately.
  useEffect(() => {
    const onScanUpdated = () => {
      void refreshFromApi();
    };

    window.addEventListener(LIVE_SCAN_UPDATED_EVENT, onScanUpdated);
    return () => window.removeEventListener(LIVE_SCAN_UPDATED_EVENT, onScanUpdated);
  }, [refreshFromApi]);

  return {
    records,
    lastUpdated,
    loadingLiveData,
    refreshError,
    refreshFromApi,
  };
}
