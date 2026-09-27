import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HistoryList } from './history-list'

describe('HistoryList', () => {
  it('announces a loading status before entries arrive', () => {
    render(<HistoryList entries={[]} isLoading error={null} />)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Carregando histórico...',
    )
  })

  it('renders an empty state when there are no entries', () => {
    render(<HistoryList entries={[]} isLoading={false} error={null} />)

    expect(
      screen.getByText('Nenhuma comparação registrada ainda.'),
    ).toBeInTheDocument()
  })

  it('renders an error message when loading fails', () => {
    render(
      <HistoryList entries={[]} isLoading={false} error="Falha ao carregar" />,
    )

    expect(screen.getByText('Falha ao carregar')).toBeInTheDocument()
  })

  it('lists history entries with labels and correlation percentage', () => {
    render(
      <HistoryList
        entries={[
          {
            id: 1,
            labelA: 'a.txt',
            labelB: 'b.txt',
            correlationIndex: 0.8,
            metrics: { jaccard: 0.7, dice: 0.9, cosine: 0.8, semantic: 0.75 },
            stats: {
              wordCountA: 5,
              wordCountB: 5,
              uniqueWordsA: 5,
              uniqueWordsB: 5,
            },
            createdAt: '2026-01-01T10:00:00.000Z',
          },
        ]}
        isLoading={false}
        error={null}
      />,
    )

    expect(screen.getByText('a.txt vs b.txt')).toBeInTheDocument()
    expect(screen.getByText('80.00%')).toBeInTheDocument()
  })
})
