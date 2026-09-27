import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ComparisonResult } from './comparison-result'

describe('ComparisonResult', () => {
  it('renders the correlation index and each individual metric', () => {
    render(
      <ComparisonResult
        result={{
          labelA: 'a.txt',
          labelB: 'b.txt',
          correlationIndex: 0.5367,
          metrics: {
            jaccard: 0.2969,
            dice: 0.7496,
            cosine: 0.5635,
            semantic: 0.61,
          },
          stats: {
            wordCountA: 10,
            wordCountB: 10,
            uniqueWordsA: 9,
            uniqueWordsB: 9,
          },
          diff: null,
        }}
      />,
    )

    expect(screen.getByText('53.67%')).toBeInTheDocument()
    expect(screen.getByText('Jaccard')).toBeInTheDocument()
    expect(screen.getByText('29.69%')).toBeInTheDocument()
    expect(screen.getByText('Dice')).toBeInTheDocument()
    expect(screen.getByText('74.96%')).toBeInTheDocument()
    expect(screen.getByText('Cosseno')).toBeInTheDocument()
    expect(screen.getByText('56.35%')).toBeInTheDocument()
  })

  it('renders the diff view when a diff is present', () => {
    render(
      <ComparisonResult
        result={{
          labelA: 'a.txt',
          labelB: 'b.txt',
          correlationIndex: 1,
          metrics: { jaccard: 1, dice: 1, cosine: 1, semantic: 1 },
          stats: {
            wordCountA: 2,
            wordCountB: 2,
            uniqueWordsA: 2,
            uniqueWordsB: 2,
          },
          diff: {
            wordsA: [{ text: 'ola', matched: true }],
            wordsB: [{ text: 'ola', matched: true }],
          },
        }}
      />,
    )

    expect(screen.getByText('Comparação lado a lado')).toBeInTheDocument()
  })
})
