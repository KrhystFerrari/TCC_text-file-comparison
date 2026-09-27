import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TextDiffView } from './text-diff-view'

describe('TextDiffView', () => {
  it('renders both labels and all words from each side', () => {
    render(
      <TextDiffView
        labelA="Texto A"
        labelB="Texto B"
        wordsA={[
          { text: 'o', matched: true },
          { text: 'gato', matched: true },
          { text: 'subiu', matched: false },
        ]}
        wordsB={[
          { text: 'o', matched: true },
          { text: 'gato', matched: true },
          { text: 'desceu', matched: false },
        ]}
      />,
    )

    expect(screen.getByText('Texto A')).toBeInTheDocument()
    expect(screen.getByText('Texto B')).toBeInTheDocument()
    expect(screen.getByText('subiu')).toBeInTheDocument()
    expect(screen.getByText('desceu')).toBeInTheDocument()
  })
})
