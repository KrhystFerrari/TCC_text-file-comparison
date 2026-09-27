import { useState } from 'react'
import {
  compareTexts,
  type CompareTextsResult,
  type TextInput,
} from '@/lib/api'
import { isTextInputFilled } from '@/lib/text-input'
import { useTranslation } from 'react-i18next'

export interface UseTextComparisonResult {
  inputA: TextInput | null
  inputB: TextInput | null
  setInputA: (value: TextInput | null) => void
  setInputB: (value: TextInput | null) => void
  result: CompareTextsResult | null
  error: string | null
  isLoading: boolean
  canCompare: boolean
  compare: () => Promise<void>
}

/** Orquestra o estado e a chamada à API de comparação, mantendo o componente de UI puramente apresentacional. */
export function useTextComparison(
  onCompared?: (result: CompareTextsResult) => void,
): UseTextComparisonResult {
  const { t } = useTranslation()
  const [inputA, setInputA] = useState<TextInput | null>(null)
  const [inputB, setInputB] = useState<TextInput | null>(null)
  const [result, setResult] = useState<CompareTextsResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const canCompare =
    isTextInputFilled(inputA) && isTextInputFilled(inputB) && !isLoading

  async function compare() {
    if (!inputA || !inputB) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await compareTexts(inputA, inputB)
      setResult(data)
      onCompared?.(data)
    } catch (err) {
      setError(
        err instanceof Error && !(err instanceof TypeError)
          ? err.message
          : t('errors.comparison'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    inputA,
    inputB,
    setInputA,
    setInputB,
    result,
    error,
    isLoading,
    canCompare,
    compare,
  }
}
