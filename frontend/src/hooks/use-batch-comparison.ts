import { useState } from 'react'
import {
  compareOneToMany,
  type CompareManyResult,
  type TextInput,
} from '@/lib/api'
import { isTextInputFilled } from '@/lib/text-input'
import { useTranslation } from 'react-i18next'

export interface UseBatchComparisonResult {
  source: TextInput | null
  setSource: (value: TextInput | null) => void
  candidateFiles: File[]
  addCandidateFiles: (files: FileList | File[]) => void
  removeCandidateFile: (index: number) => void
  result: CompareManyResult | null
  error: string | null
  isLoading: boolean
  canCompare: boolean
  compare: () => Promise<void>
}

/** Orquestra a comparação 1-para-N (um texto de origem contra vários candidatos). */
export function useBatchComparison(
  onCompared?: (result: CompareManyResult) => void,
): UseBatchComparisonResult {
  const { t } = useTranslation()
  const [source, setSource] = useState<TextInput | null>(null)
  const [candidateFiles, setCandidateFiles] = useState<File[]>([])
  const [result, setResult] = useState<CompareManyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const canCompare =
    isTextInputFilled(source) && candidateFiles.length > 0 && !isLoading

  function addCandidateFiles(files: FileList | File[]) {
    setCandidateFiles((current) => [...current, ...Array.from(files)])
  }

  function removeCandidateFile(index: number) {
    setCandidateFiles((current) => current.filter((_, i) => i !== index))
  }

  async function compare() {
    if (!source || candidateFiles.length === 0) return

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await compareOneToMany(source, candidateFiles)
      setResult(data)
      onCompared?.(data)
    } catch (err) {
      setError(
        err instanceof Error && !(err instanceof TypeError)
          ? err.message
          : t('errors.batch'),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return {
    source,
    setSource,
    candidateFiles,
    addCandidateFiles,
    removeCandidateFile,
    result,
    error,
    isLoading,
    canCompare,
    compare,
  }
}
