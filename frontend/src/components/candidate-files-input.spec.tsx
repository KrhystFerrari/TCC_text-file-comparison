import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateFilesInput } from './candidate-files-input'

describe('CandidateFilesInput', () => {
  it('renders the dropzone label with no files initially', () => {
    render(
      <CandidateFilesInput files={[]} onAdd={vi.fn()} onRemove={vi.fn()} />,
    )

    expect(
      screen.getByText('Adicionar arquivos candidatos (.txt, .pdf, .docx)'),
    ).toBeInTheDocument()
  })

  it('calls onAdd when files are selected', async () => {
    const onAdd = vi.fn()
    render(<CandidateFilesInput files={[]} onAdd={onAdd} onRemove={vi.fn()} />)

    const file = new File(['conteudo'], 'a.txt', { type: 'text/plain' })
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    await userEvent.upload(input, file)

    expect(onAdd).toHaveBeenCalled()
  })

  it('lists selected files and calls onRemove when clicking the remove button', async () => {
    const onRemove = vi.fn()
    const file = new File(['conteudo'], 'a.txt', { type: 'text/plain' })
    render(
      <CandidateFilesInput
        files={[file]}
        onAdd={vi.fn()}
        onRemove={onRemove}
      />,
    )

    expect(screen.getByText('a.txt')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Remover a.txt' }))
    expect(onRemove).toHaveBeenCalledWith(0)
  })
})
