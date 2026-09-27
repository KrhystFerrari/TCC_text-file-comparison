import type { DiffWord } from '@/lib/api'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface TextDiffViewProps {
  labelA: string
  labelB: string
  wordsA: DiffWord[]
  wordsB: DiffWord[]
}

export function TextDiffView({
  labelA,
  labelB,
  wordsA,
  wordsB,
}: TextDiffViewProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-medium">
        <span>{t('result.diffTitle')}</span>
        <span className="flex items-center gap-3 text-xs font-normal text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-sm bg-emerald-500/40" />
            {t('result.common')}
          </span>
          <span className="flex items-center gap-1">
            <span className="size-2.5 rounded-sm bg-amber-500/40" />
            {t('result.different')}
          </span>
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <DiffColumn label={labelA} words={wordsA} />
        <DiffColumn label={labelB} words={wordsB} />
      </div>
    </div>
  )
}

function DiffColumn({ label, words }: { label: string; words: DiffWord[] }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="mb-2 truncate text-xs font-medium text-muted-foreground">
        {label}
      </p>
      <p className="text-sm leading-relaxed">
        {words.map((word, index) => (
          <span
            key={index}
            className={cn(
              'rounded-sm px-0.5',
              word.matched ? 'bg-emerald-500/20' : 'bg-amber-500/30',
            )}
          >
            {word.text}{' '}
          </span>
        ))}
      </p>
    </div>
  )
}
