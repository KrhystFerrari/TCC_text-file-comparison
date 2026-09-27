import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TextSourceInput } from './text-source-input'

describe('TextSourceInput', () => {
  it('renders the file tab by default', () => {
    render(<TextSourceInput title="Texto A" value={null} onChange={vi.fn()} />)

    expect(screen.getByText('Texto A')).toBeInTheDocument()
    expect(
      screen.getByRole('tab', { name: 'Arquivo', selected: true }),
    ).toBeInTheDocument()
    expect(document.querySelector('input[type="file"]')).toHaveAttribute(
      'aria-label',
      'Texto A: selecionar arquivo .txt, .pdf ou .docx',
    )
  })

  it('calls onChange with a file input when a file is selected', async () => {
    const onChange = vi.fn()
    render(<TextSourceInput title="Texto A" value={null} onChange={onChange} />)

    const file = new File(['conteudo'], 'a.txt', { type: 'text/plain' })
    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement
    await userEvent.upload(input, file)

    expect(onChange).toHaveBeenCalledWith({ type: 'file', file })
  })

  it('shows the selected file name and clears it when removed', async () => {
    const onChange = vi.fn()
    const file = new File(['conteudo'], 'a.txt', { type: 'text/plain' })
    render(
      <TextSourceInput
        title="Texto A"
        value={{ type: 'file', file }}
        onChange={onChange}
      />,
    )

    expect(screen.getByText('a.txt')).toBeInTheDocument()

    await userEvent.click(
      screen.getByRole('button', { name: 'Remover arquivo' }),
    )
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('switches to the text tab and calls onChange while typing', async () => {
    const onChange = vi.fn()
    render(<TextSourceInput title="Texto A" value={null} onChange={onChange} />)

    await userEvent.click(screen.getByRole('tab', { name: 'Texto colado' }))
    expect(onChange).toHaveBeenCalledWith({ type: 'text', text: '' })
  })

  it('renders the pasted text value when in text mode', () => {
    render(
      <TextSourceInput
        title="Texto A"
        value={{ type: 'text', text: 'ola mundo' }}
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByDisplayValue('ola mundo')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Texto A' })).toBeInTheDocument()
  })
})
