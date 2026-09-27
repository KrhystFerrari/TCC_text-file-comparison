import { Info } from 'lucide-react'
import { TextDiffView } from '@/components/text-diff-view'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { CompareTextsResult } from '@/lib/api'
import { getCorrelationLevel } from '@/lib/correlation-level'
import { localizeSourceLabel } from '@/lib/source-label'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface ComparisonResultProps {
  result: CompareTextsResult
}

const LEVEL_BADGE_CLASS = {
  low: 'bg-destructive/10 text-destructive',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  high: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
} as const

export function ComparisonResult({ result }: ComparisonResultProps) {
  const { t } = useTranslation()
  const level = getCorrelationLevel(result.correlationIndex)

  return (
    <TooltipProvider>
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-medium">
              {t('result.correlation')}
            </span>
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-xs font-medium',
                LEVEL_BADGE_CLASS[level],
              )}
            >
              {t(`result.${level}`)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums">
              {(result.correlationIndex * 100).toFixed(2)}%
            </span>
          </div>
          <Progress value={result.correlationIndex * 100} />
        </div>

        <dl className="grid grid-cols-2 gap-3 text-sm text-muted-foreground sm:grid-cols-4">
          {(
            Object.entries(result.metrics) as [
              'jaccard' | 'dice' | 'cosine' | 'semantic',
              number,
            ][]
          ).map(([key, value]) => {
            const label = t(`result.${key}`)
            return (
              <div key={key}>
                <dt className="flex items-center gap-1 font-medium text-foreground">
                  {label}
                  <Tooltip>
                    <TooltipTrigger
                      aria-label={t('result.tooltip.metricLabel', {
                        metric: label,
                      })}
                      className="cursor-help rounded-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Info className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {t(`result.tooltip.${key}`)}
                    </TooltipContent>
                  </Tooltip>
                </dt>
                <dd>{(value * 100).toFixed(2)}%</dd>
              </div>
            )
          })}
        </dl>

        <dl className="grid grid-cols-2 gap-3 border-t pt-3 text-xs text-muted-foreground">
          <div>
            <dt className="font-medium text-foreground">
              {localizeSourceLabel(result.labelA, t)}
            </dt>
            <dd>
              {t('result.stats', {
                count: result.stats.wordCountA,
                unique: result.stats.uniqueWordsA,
              })}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">
              {localizeSourceLabel(result.labelB, t)}
            </dt>
            <dd>
              {t('result.stats', {
                count: result.stats.wordCountB,
                unique: result.stats.uniqueWordsB,
              })}
            </dd>
          </div>
        </dl>

        {result.diff && (
          <div className="border-t pt-3">
            <TextDiffView
              labelA={localizeSourceLabel(result.labelA, t)}
              labelB={localizeSourceLabel(result.labelB, t)}
              wordsA={result.diff.wordsA}
              wordsB={result.diff.wordsB}
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
