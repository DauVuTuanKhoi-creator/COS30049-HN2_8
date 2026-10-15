import { Shield, AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';
import { DetectionResult } from '@/app/utils/detection';

interface DetectionCardProps {
  result: DetectionResult;
}

export function DetectionCard({ result }: DetectionCardProps) {
  const getThreatColor = () => {
    switch (result.threatLevel) {
      case 'critical':
        return 'border-red-200 bg-red-50 dark:border-red-500/60 dark:bg-red-500/10';
      case 'high':
        return 'border-orange-200 bg-orange-50 dark:border-orange-500/60 dark:bg-orange-500/10';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 dark:border-yellow-500/60 dark:bg-yellow-500/10';
      case 'low':
        return 'border-blue-200 bg-blue-50 dark:border-blue-500/60 dark:bg-blue-500/10';
      default:
        return 'border-green-200 bg-green-50 dark:border-green-500/60 dark:bg-green-500/10';
    }
  };

  const getThreatIcon = () => {
    switch (result.threatLevel) {
      case 'critical':
      case 'high':
        return <AlertOctagon className="size-8 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="size-8 text-yellow-500" />;
      case 'low':
        return <Info className="size-8 text-blue-500" />;
      default:
        return <CheckCircle2 className="size-8 text-green-500" />;
    }
  };

  const getDetectionLabel = () => {
    if (result.isMalware && result.isSpam) return 'Spam + Malware';
    if (result.isMalware) return 'Malware';
    if (result.isSpam) return 'Spam / Phishing';
    return 'Safe';
  };

  const getThreatTitle = () => {
    if (result.isMalware && result.isSpam) return 'Malware & Spam Detected';
    if (result.isMalware) return 'Malware Detected';
    if (result.isSpam) return 'Spam / Phishing Detected';
    return 'Content is Safe';
  };

  const getRecommendation = () => {
    if (result.isMalware && result.isSpam) {
      return result.threatLevel === 'critical'
        ? 'This looks like a phishing message carrying malicious content. Delete it immediately and avoid opening links or attachments.'
        : 'This content mixes spam-style lures with malware indicators. Do not interact with it.';
    }

    if (result.isMalware) {
      return result.threatLevel === 'critical'
        ? 'Critical malware risk detected. Delete or quarantine this file immediately and do not run it.'
        : result.threatLevel === 'high'
        ? 'High malware risk detected. Avoid opening, downloading, or sharing this content.'
        : 'Potential malware indicators were found. Proceed carefully and rescan if needed.';
    }

    if (result.isSpam) {
      return result.threatLevel === 'critical' || result.threatLevel === 'high'
        ? 'This message strongly resembles spam or phishing. Do not click links, open attachments, or reply.'
        : result.threatLevel === 'medium'
        ? 'Possible spam detected. Be cautious with links, requests for money, or urgent calls to action.'
        : 'Low-risk spam indicators were found. Verify the sender before interacting.';
    }

    return result.threatLevel === 'safe'
      ? 'This content appears to be safe. No action required.'
      : result.threatLevel === 'low'
      ? 'Exercise caution. While mostly safe, some minor risk factors were detected.'
      : result.threatLevel === 'medium'
      ? 'Proceed with caution. Avoid clicking links or downloading attachments.'
      : result.threatLevel === 'high'
      ? 'High risk detected. Do not interact with this content or open any attachments.'
      : 'Critical threat detected. Delete immediately and do not interact with this content.';
  };

  return (
    <div className={`border rounded-xl p-6 ${getThreatColor()}`}>
      <div className="flex items-start gap-4 mb-6">
        {getThreatIcon()}
        <div className="flex-1">
          <h3 className="mb-2 text-xl text-slate-950 dark:text-white">{getThreatTitle()}</h3>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Threat Level:</span>
              <span className="ml-2 uppercase text-slate-950 dark:text-white">
                {result.threatLevel}
              </span>
            </div>
            <div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Confidence:</span>
              <span className="ml-2 text-slate-950 dark:text-white">
                {(result.confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Safety Score:</span>
              <span className="ml-2 text-slate-950 dark:text-white">
                {result.details.safetyScore}/100
              </span>
            </div>
            <div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Detection Type:</span>
              <span className="ml-2 text-slate-950 dark:text-white">
                {getDetectionLabel()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm text-slate-600 dark:text-slate-400">
          <span>Safety Score</span>
          <span>{result.details.safetyScore}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className={`h-full transition-all ${
              result.details.safetyScore >= 70
                ? 'bg-green-500'
                : result.details.safetyScore >= 40
                ? 'bg-yellow-500'
                : 'bg-red-500'
            }`}
            style={{ width: `${result.details.safetyScore}%` }}
          />
        </div>
      </div>

      {/* Analysis */}
      <div className="space-y-4">
        <div>
          <h4 className="mb-2 text-sm text-slate-700 dark:text-slate-300">Analysis Summary</h4>
          <ul className="space-y-1">
            {result.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                <span className="mt-1 text-slate-400 dark:text-slate-500">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {result.details.suspiciousPatterns.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm text-slate-700 dark:text-slate-300">Suspicious Patterns</h4>
            <ul className="space-y-1">
              {result.details.suspiciousPatterns.map((pattern, index) => (
                <li key={index} className="text-sm text-red-400 flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span>{pattern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.details.riskFactors.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm text-slate-700 dark:text-slate-300">Risk Factors</h4>
            <ul className="space-y-1">
              {result.details.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-yellow-500 dark:text-yellow-400">
                  <span className="mt-1 text-yellow-500">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendation */}
      <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <Shield className="mt-0.5 size-5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
          <div>
            <h4 className="mb-1 text-sm text-slate-700 dark:text-slate-300">Recommendation</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{getRecommendation()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
