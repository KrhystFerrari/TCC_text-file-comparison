import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import App from './App'
import * as api from '@/lib/api'

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual<typeof api>('@/lib/api')
  return {
    ...actual,
    compareTexts: vi.fn(),
    compareOneToMany: vi.fn(),
    getHistory: vi.fn(),
  }
})

const compareTextsMock = vi.mocked(api.compareTexts)
const compareOneToManyMock = vi.mocked(api.compareOneToMany)
const getHistoryMock = vi.mocked(api.getHistory)

describe('App', () => {
  beforeEach(() => {
    compareTextsMock.mockReset()
    compareOneToManyMock.mockReset()
    getHistoryMock.mockReset()
    getHistoryMock.mockResolvedValue([])
  })

  it('keeps the compare button disabled until both texts are filled', async () => {
    render(<App />)

    const compareButton = screen.getByRole('button', { name: 'Comparar' })
    expect(compareButton).toBeDisabled()

    await userEvent.click(
      screen.getAllByRole('tab', { name: 'Texto colado' })[0],
    )
    await userEvent.click(
      screen.getAllByRole('tab', { name: 'Texto colado' })[1],
    )

    const textareas = document.querySelectorAll('textarea')
    await userEvent.type(textareas[0], 'texto A')
    await userEvent.type(textareas[1], 'texto B')

    expect(compareButton).toBeEnabled()
  })

  it('displays the comparison result after a successful call', async () => {
    compareTextsMock.mockResolvedValue({
      labelA: 'Texto colado',
      labelB: 'Texto colado',
      correlationIndex: 0.75,
      metrics: { jaccard: 0.6, dice: 0.8, cosine: 0.85, semantic: 0.7 },
      stats: { wordCountA: 2, wordCountB: 2, uniqueWordsA: 2, uniqueWordsB: 2 },
      diff: null,
    })

    render(<App />)

    await userEvent.click(
      screen.getAllByRole('tab', { name: 'Texto colado' })[0],
    )
    await userEvent.click(
      screen.getAllByRole('tab', { name: 'Texto colado' })[1],
    )
    const textareas = document.querySelectorAll('textarea')
    await userEvent.type(textareas[0], 'texto A')
    await userEvent.type(textareas[1], 'texto B')

    await userEvent.click(screen.getByRole('button', { name: 'Comparar' }))

    expect(await screen.findByText('75.00%')).toBeInTheDocument()
  })

  it('displays an error message when the comparison fails', async () => {
    compareTextsMock.mockRejectedValue(new Error('Falha ao comparar'))

    render(<App />)

    await userEvent.click(
      screen.getAllByRole('tab', { name: 'Texto colado' })[0],
    )
    await userEvent.click(
      screen.getAllByRole('tab', { name: 'Texto colado' })[1],
    )
    const textareas = document.querySelectorAll('textarea')
    await userEvent.type(textareas[0], 'texto A')
    await userEvent.type(textareas[1], 'texto B')

    await userEvent.click(screen.getByRole('button', { name: 'Comparar' }))

    expect(await screen.findByText('Falha ao comparar')).toBeInTheDocument()
  })

  it('renders the 1-to-N ranked results after comparing candidates', async () => {
    compareOneToManyMock.mockResolvedValue({
      sourceLabel: 'Texto de origem',
      results: [
        {
          labelA: 'Texto de origem',
          labelB: 'candidato-alto.txt',
          correlationIndex: 0.9,
          metrics: { jaccard: 0.8, dice: 0.9, cosine: 0.9, semantic: 1 },
          stats: {
            wordCountA: 5,
            wordCountB: 5,
            uniqueWordsA: 5,
            uniqueWordsB: 5,
          },
          diff: null,
          rank: 1,
        },
      ],
    })

    render(<App />)

    await userEvent.click(
      screen.getAllByRole('tab', { name: 'Texto colado' })[2],
    )
    const textareas = document.querySelectorAll('textarea')
    await userEvent.type(textareas[0], 'texto de origem')

    const candidate = new File(['texto parecido'], 'candidato-alto.txt', {
      type: 'text/plain',
    })
    const candidatesInput = document.querySelector(
      'input[type="file"][multiple]',
    ) as HTMLInputElement
    await userEvent.upload(candidatesInput, candidate)

    await userEvent.click(
      screen.getByRole('button', { name: 'Comparar com candidatos' }),
    )

    expect(await screen.findAllByText('candidato-alto.txt')).toHaveLength(2)
    expect(screen.getByText('90.00%')).toBeInTheDocument()
  })

  it('translates the main interface when the language changes', async () => {
    render(<App />)

    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Idioma' }),
      'en',
    )

    expect(
      await screen.findByRole('heading', { name: 'Compare two texts' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Input texts')).toBeInTheDocument()
  })

  it('shows the portfolio attribution link in the footer', async () => {
    render(<App />)

    const portfolioLink = screen.getByRole('link', {
      name: 'Visitar o portfólio de Krhyst Ferrari (abre em nova aba)',
    })
    expect(portfolioLink).toHaveAttribute(
      'href',
      'https://resume-krhyst-ferrari.vercel.app/',
    )
    expect(portfolioLink).toHaveAttribute('target', '_blank')
    expect(portfolioLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(
      await screen.findByText('Nenhuma comparação registrada ainda.'),
    ).toBeInTheDocument()
  })
})
