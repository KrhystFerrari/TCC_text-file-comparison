import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { ThemeToggle } from './theme-toggle'

describe('ThemeToggle', () => {
  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('switches the accessible label after a click', async () => {
    render(<ThemeToggle />)

    const button = screen.getByRole('button', { name: 'Ativar tema escuro' })
    await userEvent.click(button)

    expect(
      screen.getByRole('button', { name: 'Ativar tema claro' }),
    ).toBeInTheDocument()
  })
})
