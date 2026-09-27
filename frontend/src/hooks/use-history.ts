import { useCallback, useEffect, useState } from 'react'
import { getHistory, type HistoryEntry } from '@/lib/api'
import { useTranslation } from 'react-i18next'

export interface UseHistoryResult {
  entries: HistoryEntry[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

/** Carrega o histórico de comparações persistido no backend e permite atualizá-lo sob demanda. */
export function useHistory(): UseHistoryResult {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadHistory = useCallback(async () => {
    try {
      const data = await getHistory()
      setEntries(data)
      setError(null)
    } catch (err) {
      setError(
        err instanceof Error && !(err instanceof TypeError)
          ? err.message
          : t('errors.history'),
      )
    } finally {
      setIsLoading(false)
    }
  }, [t])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    await loadHistory()
  }, [loadHistory])

  useEffect(() => {
    let isSubscribed = true

    getHistory()
      .then((data) => {
        if (!isSubscribed) return
        setEntries(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (!isSubscribed) return
        setError(
          err instanceof Error && !(err instanceof TypeError)
            ? err.message
            : t('errors.history'),
        )
      })
      .finally(() => {
        if (isSubscribed) setIsLoading(false)
      })

    return () => {
      isSubscribed = false
    }
  }, [t])

  return { entries, isLoading, error, refresh }
}
