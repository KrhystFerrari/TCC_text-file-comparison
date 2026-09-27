import { History as HistoryIcon } from 'lucide-react'
import type { HistoryEntry } from '@/lib/api'
import { getCorrelationLevel } from '@/lib/correlation-level'
import { localizeSourceLabel } from '@/lib/source-label'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

const LEVEL_BADGE_CLASS = {
  low: 'bg-destructive/10 text-destructive',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  high: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
} as const

const DATE_LOCALES: Record<string, string> = {
  'pt-BR': 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
}

interface HistoryListProps {
  entries: HistoryEntry[]
  isLoading: boolean
  error: string | null
}

export function HistoryList({ entries, isLoading, error }: HistoryListProps) {
  const { t, i18n } = useTranslation()
  const dateFormatter = new Intl.DateTimeFormat(
    DATE_LOCALES[i18n.resolvedLanguage ?? 'pt-BR'] ?? 'pt-BR',
    { dateStyle: 'short', timeStyle: 'short' },
  )
  if (error) {
    return (
      <p role="alert" className="text-sm text-destructive">
        {error}
      </p>
    )
  }

  if (isLoading && entries.length === 0) {
    return (
      <p role="status" className="text-sm text-muted-foreground">
        {t('history.loading')}
      </p>
    )
  }

  if (!isLoading && entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
        <HistoryIcon className="size-5" />
        {t('history.empty')}
      </div>
    )
  }

  return (
    <ul className="flex max-h-72 flex-col gap-2 overflow-y-auto">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex items-center justify-between gap-3 rounded-lg border p-2.5 text-sm"
        >
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">
              {localizeSourceLabel(entry.labelA, t)} vs{' '}
              {localizeSourceLabel(entry.labelB, t)}
            </span>
            <span className="text-xs text-muted-foreground">
              {dateFormatter.format(new Date(entry.createdAt))}
            </span>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
              LEVEL_BADGE_CLASS[getCorrelationLevel(entry.correlationIndex)],
            )}
          >
            {(entry.correlationIndex * 100).toFixed(2)}%
          </span>
        </li>
      ))}
    </ul>
  )
}
