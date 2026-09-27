import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useTextComparison } from './use-text-comparison'
import * as api from '@/lib/api'

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof api>('@/lib/api')
  return { ...actual, compareTexts: vi.fn() }
})

const compareTextsMock = vi.mocked(api.compareTexts)

describe('useTextComparison', () => {
  beforeEach(() => {
    compareTextsMock.mockReset()
  })

  it('starts with empty inputs and cannot compare', () => {
    const { result } = renderHook(() => useTextComparison())

    expect(result.current.inputA).toBeNull()
    expect(result.current.inputB).toBeNull()
    expect(result.current.canCompare).toBe(false)
  })

  it('enables comparison once both inputs are filled', () => {
    const { result } = renderHook(() => useTextComparison())

    act(() => {
      result.current.setInputA({ type: 'text', text: 'texto A' })
      result.current.setInputB({ type: 'text', text: 'texto B' })
    })

    expect(result.current.canCompare).toBe(true)
  })

  it('populates result on a successful compare call', async () => {
    const apiResult = {
      labelA: 'Texto colado',
      labelB: 'Texto colado',
      correlationIndex: 0.8,
      metrics: { jaccard: 0.7, dice: 0.9, cosine: 0.8, semantic: 0.75 },
      stats: { wordCountA: 2, wordCountB: 2, uniqueWordsA: 2, uniqueWordsB: 2 },
      diff: null,
    }
    compareTextsMock.mockResolvedValue(apiResult)

    const { result } = renderHook(() => useTextComparison())

    act(() => {
      result.current.setInputA({ type: 'text', text: 'texto A' })
      result.current.setInputB({ type: 'text', text: 'texto B' })
    })

    await act(async () => {
      await result.current.compare()
    })

    await waitFor(() => expect(result.current.result).toEqual(apiResult))
    expect(result.current.error).toBeNull()
    expect(result.current.isLoading).toBe(false)
  })

  it('sets an error message when the compare call fails', async () => {
    compareTextsMock.mockRejectedValue(new Error('Falha na API'))

    const { result } = renderHook(() => useTextComparison())

    act(() => {
      result.current.setInputA({ type: 'text', text: 'texto A' })
      result.current.setInputB({ type: 'text', text: 'texto B' })
    })

    await act(async () => {
      await result.current.compare()
    })

    expect(result.current.error).toBe('Falha na API')
    expect(result.current.result).toBeNull()
  })

  it('does nothing when compare is called with missing inputs', async () => {
    const { result } = renderHook(() => useTextComparison())

    await act(async () => {
      await result.current.compare()
    })

    expect(compareTextsMock).not.toHaveBeenCalled()
  })

  it('calls onCompared with the result after a successful compare', async () => {
    const apiResult = {
      labelA: 'Texto colado',
      labelB: 'Texto colado',
      correlationIndex: 1,
      metrics: { jaccard: 1, dice: 1, cosine: 1, semantic: 1 },
      stats: { wordCountA: 1, wordCountB: 1, uniqueWordsA: 1, uniqueWordsB: 1 },
      diff: null,
    }
    compareTextsMock.mockResolvedValue(apiResult)
    const onCompared = vi.fn()

    const { result } = renderHook(() => useTextComparison(onCompared))

    act(() => {
      result.current.setInputA({ type: 'text', text: 'a' })
      result.current.setInputB({ type: 'text', text: 'b' })
    })

    await act(async () => {
      await result.current.compare()
    })

    expect(onCompared).toHaveBeenCalledWith(apiResult)
  })
})
