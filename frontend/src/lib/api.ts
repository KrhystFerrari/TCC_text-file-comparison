import i18n from '@/i18n'

export interface DiffWord {
  text: string
  matched: boolean
}

export interface CompareTextsResult {
  labelA: string
  labelB: string
  correlationIndex: number
  metrics: {
    jaccard: number
    dice: number
    cosine: number
    semantic: number
  }
  stats: {
    wordCountA: number
    wordCountB: number
    uniqueWordsA: number
    uniqueWordsB: number
  }
  diff: {
    wordsA: DiffWord[]
    wordsB: DiffWord[]
  } | null
}

export type TextInput =
  { type: 'file'; file: File } | { type: 'text'; text: string }

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export async function compareTexts(
  inputA: TextInput,
  inputB: TextInput,
): Promise<CompareTextsResult> {
  const formData = new FormData()
  appendInput(formData, 'A', inputA)
  appendInput(formData, 'B', inputB)

  const response = await fetch(`${API_URL}/text-comparison/compare`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      i18n.language === 'pt-BR' && typeof body?.message === 'string'
        ? body.message
        : i18n.t('errors.invalidRequest')
    throw new Error(message)
  }

  return response.json()
}

export interface HistoryEntry {
  id: number
  labelA: string
  labelB: string
  correlationIndex: number
  metrics: {
    jaccard: number
    dice: number
    cosine: number
    semantic: number
  }
  stats: {
    wordCountA: number
    wordCountB: number
    uniqueWordsA: number
    uniqueWordsB: number
  }
  createdAt: string
}

export async function getHistory(limit = 20): Promise<HistoryEntry[]> {
  const response = await fetch(`${API_URL}/history?limit=${limit}`)

  if (!response.ok) {
    throw new Error(i18n.t('errors.history'))
  }

  return response.json()
}

function appendInput(formData: FormData, side: 'A' | 'B', input: TextInput) {
  if (input.type === 'file') {
    formData.append(`file${side}`, input.file)
  } else {
    formData.append(`text${side}`, input.text)
  }
}

export interface RankedComparison extends CompareTextsResult {
  rank: number
}

export interface CompareManyResult {
  sourceLabel: string
  results: RankedComparison[]
}

export async function compareOneToMany(
  source: TextInput,
  candidateFiles: File[],
): Promise<CompareManyResult> {
  const formData = new FormData()
  if (source.type === 'file') {
    formData.append('sourceFile', source.file)
  } else {
    formData.append('sourceText', source.text)
  }
  candidateFiles.forEach((file) => formData.append('candidateFiles', file))

  const response = await fetch(`${API_URL}/text-comparison/compare-many`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      i18n.language === 'pt-BR' && typeof body?.message === 'string'
        ? body.message
        : i18n.t('errors.invalidRequest')
    throw new Error(message)
  }

  return response.json()
}
