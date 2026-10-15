# Spam Dataset Intersection EDA

## Source Summary

| Source | File | Encoding | Rows Loaded | Rows Used | Spam Rate | Unique Messages |
|---|---|---:|---:|---:|---:|---:|
| emails | emails.csv | utf-8 | 5728 | 5728 | 23.88% | 5532 |
| mail_data | mail_data.csv | utf-8 | 5613 | 5613 | 13.68% | 5186 |
| mail_dataset | mail_dataset.csv | utf-8 | 6018 | 6018 | 50.37% | 58 |
| spam | spam.csv | latin-1 | 5572 | 5572 | 13.41% | 5157 |

## Pairwise Overlap on Normalized Text

| Left | Right | Overlap Messages | Left Overlap | Right Overlap | Jaccard |
|---|---|---:|---:|---:|---:|
| emails | mail_data | 0 | 0.00% | 0.00% | 0.00% |
| emails | mail_dataset | 0 | 0.00% | 0.00% | 0.00% |
| emails | spam | 0 | 0.00% | 0.00% | 0.00% |
| mail_data | mail_dataset | 0 | 0.00% | 0.00% | 0.00% |
| mail_data | spam | 4557 | 87.87% | 88.37% | 78.76% |
| mail_dataset | spam | 0 | 0.00% | 0.00% | 0.00% |

## Label Contradictions

- Contradictory messages: 0 / 11376 (0.00%)
- Recommendation: do not merge without resolving contradictions above your acceptable threshold.

## Domain Compatibility Signals

| Source | Mean Chars | P95 Chars | URL Rate | Uppercase Ratio | Digit Ratio |
|---|---:|---:|---:|---:|---:|
| emails | 1556.8 | 4554.5 | 0.00% | 0.17% | 2.46% |
| mail_data | 80.3 | 160.0 | 2.12% | 6.58% | 1.93% |
| mail_dataset | 36.3 | 60.0 | 0.03% | 5.08% | 2.94% |
| spam | 80.1 | 161.0 | 1.90% | 6.64% | 1.92% |

## Merge Gate (Suggested)

- Block merge if contradiction rate > 0.5%.
- Block merge if any one source overlap > 20% with another source without deduplication policy.
- Block merge if domain metrics diverge significantly and no stratified split/domain weighting is planned.