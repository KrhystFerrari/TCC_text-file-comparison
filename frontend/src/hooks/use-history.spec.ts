import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useHistory } from './use-history'
import * as api from '@/lib/api'

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof api>('@/lib/api')
  return { ...actual, getHistory: vi.fn() }
})

const getHistoryMock = vi.mocked(api.getHistory)

const sampleEntry: api.HistoryEntry = {
  id: 1,
  labelA: 'a.txt',
  labelB: 'b.txt',
  correlationIndex: 0.5,
  metrics: { jaccard: 0.4, dice: 0.6, cosine: 0.5, semantic: 0.55 },
  stats: { wordCountA: 3, wordCountB: 3, uniqueWordsA: 3, uniqueWordsB: 3 },
  createdAt: '2026-01-01T10:00:00.000Z',
}

describe('useHistory', () => {
  beforeEach(() => {
    getHistoryMock.mockReset()
  })

  it('loads entries on mount', async () => {
    getHistoryMock.mockResolvedValue([sampleEntry])

    const { result } = renderHook(() => useHistory())

    await waitFor(() => expect(result.current.entries).toEqual([sampleEntry]))
    expect(result.current.error).toBeNull()
  })

  it('sets an error message when loading fails', async () => {
    getHistoryMock.mockRejectedValue(new Error('Falha na API'))

    const { result } = renderHook(() => useHistory())

    await waitFor(() => expect(result.current.error).toBe('Falha na API'))
    expect(result.current.entries).toEqual([])
  })

  it('reloads entries when refresh is called again', async () => {
    getHistoryMock.mockResolvedValue([sampleEntry])
    const { result } = renderHook(() => useHistory())
    await waitFor(() => expect(result.current.entries).toHaveLength(1))

    getHistoryMock.mockResolvedValue([])
    await act(async () => {
      await result.current.refresh()
    })

    expect(result.current.entries).toEqual([])
  })
})
