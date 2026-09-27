import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RankedResultsList } from './ranked-results-list'

describe('RankedResultsList', () => {
  it('renders the source label and each ranked candidate', () => {
    render(
      <RankedResultsList
        sourceLabel="origem.txt"
        results={[
          {
            labelA: 'origem.txt',
            labelB: 'alto.txt',
            correlationIndex: 0.9,
            metrics: { jaccard: 0.9, dice: 0.9, cosine: 0.9, semantic: 0.9 },
            stats: {
              wordCountA: 5,
              wordCountB: 5,
              uniqueWordsA: 5,
              uniqueWordsB: 5,
            },
            diff: null,
            rank: 1,
          },
          {
            labelA: 'origem.txt',
            labelB: 'baixo.txt',
            correlationIndex: 0.1,
            metrics: { jaccard: 0.1, dice: 0.1, cosine: 0.1, semantic: 0.1 },
            stats: {
              wordCountA: 5,
              wordCountB: 5,
              uniqueWordsA: 5,
              uniqueWordsB: 5,
            },
            diff: null,
            rank: 2,
          },
        ]}
      />,
    )

    expect(
      screen.getByText('Ranking de similaridade com origem.txt'),
    ).toBeInTheDocument()
    expect(screen.getByText('alto.txt')).toBeInTheDocument()
    expect(screen.getByText('90.00%')).toBeInTheDocument()
    expect(screen.getByText('baixo.txt')).toBeInTheDocument()
    expect(screen.getByText('10.00%')).toBeInTheDocument()
  })
})
