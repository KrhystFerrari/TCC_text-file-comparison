import '@testing-library/jest-dom/vitest'
import { beforeEach } from 'vitest'
import i18n from '@/i18n'

beforeEach(async () => {
  localStorage.setItem('language', 'pt-BR')
  await i18n.changeLanguage('pt-BR')
  document.documentElement.lang = 'pt-BR'
})
