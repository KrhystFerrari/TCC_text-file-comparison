import type { RankedComparison } from '@/lib/api'
import { getCorrelationLevel } from '@/lib/correlation-level'
import { localizeSourceLabel } from '@/lib/source-label'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const LEVEL_BADGE_CLASS = {
  low: 'bg-destructive/10 text-destructive',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  high: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
} as const

interface RankedResultsListProps {
  sourceLabel: string
  results: RankedComparison[]
}

export function RankedResultsList({
  sourceLabel,
  results,
}: RankedResultsListProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        {t('batch.rankingWith', {
          source: localizeSourceLabel(sourceLabel, t),
        })}
      </p>
      <ol className="flex flex-col gap-2">
        {results.map((result) => (
          <li
            key={result.rank}
            className="flex items-center justify-between gap-3 rounded-lg border p-2.5 text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {result.rank}
              </span>
              <span className="truncate font-medium">{result.labelB}</span>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                LEVEL_BADGE_CLASS[getCorrelationLevel(result.correlationIndex)],
              )}
            >
              {(result.correlationIndex * 100).toFixed(2)}%
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
