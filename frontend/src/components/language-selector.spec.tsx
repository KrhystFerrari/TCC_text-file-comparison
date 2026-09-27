import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import { LanguageSelector } from './language-selector'

describe('LanguageSelector', () => {
  afterEach(async () => {
    localStorage.setItem('language', 'pt-BR')
    await act(async () => {
      await i18n.changeLanguage('pt-BR')
    })
    document.documentElement.lang = 'pt-BR'
  })

  it('changes the selected language and persists it', async () => {
    render(<LanguageSelector />)

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Idioma' }),
        'en',
      )
    })

    expect(
      await screen.findByRole('combobox', { name: 'Language' }),
    ).toHaveValue('en')
    expect(localStorage.getItem('language')).toBe('en')
    expect(document.documentElement.lang).toBe('en')

    await act(async () => {
      await userEvent.selectOptions(
        screen.getByRole('combobox', { name: 'Language' }),
        'es',
      )
    })

    expect(await screen.findByRole('combobox', { name: 'Idioma' })).toHaveValue(
      'es',
    )
    expect(localStorage.getItem('language')).toBe('es')
    expect(document.documentElement.lang).toBe('es')
  })
})
