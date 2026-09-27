import { useTranslation } from 'react-i18next'

const SUPPORTED_LANGUAGES = ['pt-BR', 'en', 'es'] as const

export function LanguageSelector() {
  const { t, i18n } = useTranslation()
  const language = i18n.resolvedLanguage ?? i18n.language

  async function changeLanguage(nextLanguage: string) {
    if (
      !SUPPORTED_LANGUAGES.includes(
        nextLanguage as (typeof SUPPORTED_LANGUAGES)[number],
      )
    ) {
      return
    }
    await i18n.changeLanguage(nextLanguage)
    localStorage.setItem('language', nextLanguage)
    document.documentElement.lang = nextLanguage
  }

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="sr-only">{t('language.label')}</span>
      <select
        aria-label={t('language.label')}
        className="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={language}
        onChange={(event) => void changeLanguage(event.target.value)}
      >
        <option value="pt-BR">{t('language.pt')}</option>
        <option value="en">{t('language.en')}</option>
        <option value="es">{t('language.es')}</option>
      </select>
    </label>
  )
}
