import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useBatchComparison } from './use-batch-comparison'
import * as api from '@/lib/api'

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof api>('@/lib/api')
  return { ...actual, compareOneToMany: vi.fn() }
})

const compareOneToManyMock = vi.mocked(api.compareOneToMany)

describe('useBatchComparison', () => {
  beforeEach(() => {
    compareOneToManyMock.mockReset()
  })

  it('starts empty and cannot compare', () => {
    const { result } = renderHook(() => useBatchComparison())

    expect(result.current.source).toBeNull()
    expect(result.current.candidateFiles).toEqual([])
    expect(result.current.canCompare).toBe(false)
  })

  it('adds and removes candidate files', () => {
    const { result } = renderHook(() => useBatchComparison())
    const fileA = new File(['a'], 'a.txt')
    const fileB = new File(['b'], 'b.txt')

    act(() => result.current.addCandidateFiles([fileA, fileB]))
    expect(result.current.candidateFiles).toEqual([fileA, fileB])

    act(() => result.current.removeCandidateFile(0))
    expect(result.current.candidateFiles).toEqual([fileB])
  })

  it('enables comparison once source and at least one candidate are set', () => {
    const { result } = renderHook(() => useBatchComparison())

    act(() => {
      result.current.setSource({ type: 'text', text: 'origem' })
      result.current.addCandidateFiles([new File(['a'], 'a.txt')])
    })

    expect(result.current.canCompare).toBe(true)
  })

  it('populates the result and calls onCompared on success', async () => {
    const apiResult = {
      sourceLabel: 'origem',
      results: [
        {
          labelA: 'origem',
          labelB: 'a.txt',
          correlationIndex: 0.5,
          metrics: { jaccard: 0.4, dice: 0.5, cosine: 0.5, semantic: 0.5 },
          stats: {
            wordCountA: 1,
            wordCountB: 1,
            uniqueWordsA: 1,
            uniqueWordsB: 1,
          },
          diff: null,
          rank: 1,
        },
      ],
    }
    compareOneToManyMock.mockResolvedValue(apiResult)
    const onCompared = vi.fn()

    const { result } = renderHook(() => useBatchComparison(onCompared))

    act(() => {
      result.current.setSource({ type: 'text', text: 'origem' })
      result.current.addCandidateFiles([new File(['a'], 'a.txt')])
    })

    await act(async () => {
      await result.current.compare()
    })

    await waitFor(() => expect(result.current.result).toEqual(apiResult))
    expect(onCompared).toHaveBeenCalledWith(apiResult)
  })

  it('sets an error message when the compare call fails', async () => {
    compareOneToManyMock.mockRejectedValue(new Error('Falha na API'))

    const { result } = renderHook(() => useBatchComparison())

    act(() => {
      result.current.setSource({ type: 'text', text: 'origem' })
      result.current.addCandidateFiles([new File(['a'], 'a.txt')])
    })

    await act(async () => {
      await result.current.compare()
    })

    expect(result.current.error).toBe('Falha na API')
  })

  it('does nothing when compare is called with missing inputs', async () => {
    const { result } = renderHook(() => useBatchComparison())

    await act(async () => {
      await result.current.compare()
    })

    expect(compareOneToManyMock).not.toHaveBeenCalled()
  })
})
