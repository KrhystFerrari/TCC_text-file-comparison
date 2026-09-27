import { useEffect } from 'react'
import { FileSearch, GitCompareArrows, TriangleAlert } from 'lucide-react'
import { CandidateFilesInput } from '@/components/candidate-files-input'
import { ComparisonResult } from '@/components/comparison-result'
import { HistoryList } from '@/components/history-list'
import { LanguageSelector } from '@/components/language-selector'
import { RankedResultsList } from '@/components/ranked-results-list'
import { TextSourceInput } from '@/components/text-source-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useBatchComparison } from '@/hooks/use-batch-comparison'
import { useHistory } from '@/hooks/use-history'
import { useTextComparison } from '@/hooks/use-text-comparison'
import { useTranslation } from 'react-i18next'

function App() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = t('app.name')
  }, [t])
  const {
    entries,
    isLoading: isHistoryLoading,
    error: historyError,
    refresh,
  } = useHistory()
  const {
    inputA,
    inputB,
    setInputA,
    setInputB,
    result,
    error,
    isLoading,
    canCompare,
    compare,
  } = useTextComparison(() => {
    void refresh()
  })
  const {
    source: batchSource,
    setSource: setBatchSource,
    candidateFiles,
    addCandidateFiles,
    removeCandidateFile,
    result: batchResult,
    error: batchError,
    isLoading: isBatchLoading,
    canCompare: canCompareBatch,
    compare: compareBatch,
  } = useBatchComparison(() => {
    void refresh()
  })

  return (
    <div className="min-h-svh bg-linear-to-b from-muted/50 to-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <GitCompareArrows className="size-5 text-primary" />
            <span className="font-semibold">{t('app.name')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t('app.title')}
          </h1>
          <p className="text-muted-foreground">{t('app.description')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('app.inputs')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextSourceInput
                  title={t('input.textA')}
                  value={inputA}
                  onChange={setInputA}
                />
                <TextSourceInput
                  title={t('input.textB')}
                  value={inputB}
                  onChange={setInputB}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  <TriangleAlert className="size-4 shrink-0" />
                  {error}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={!canCompare}
                aria-busy={isLoading}
                onClick={compare}
              >
                {isLoading ? t('app.comparing') : t('app.compare')}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('app.result')}</CardTitle>
            </CardHeader>
            <CardContent aria-live="polite" aria-busy={isLoading}>
              {result ? (
                <ComparisonResult result={result} />
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                  <FileSearch className="size-6" />
                  {t('app.emptyResult')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {t('app.batchTitle')}
          </h2>
          <p className="text-muted-foreground">{t('app.batchDescription')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {t('app.batchInputs')}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <TextSourceInput
                title={t('input.source')}
                value={batchSource}
                onChange={setBatchSource}
              />
              <CandidateFilesInput
                files={candidateFiles}
                onAdd={addCandidateFiles}
                onRemove={removeCandidateFile}
              />

              {batchError && (
                <p
                  role="alert"
                  className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  <TriangleAlert className="size-4 shrink-0" />
                  {batchError}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={!canCompareBatch}
                aria-busy={isBatchLoading}
                onClick={compareBatch}
              >
                {isBatchLoading
                  ? t('app.batchComparing')
                  : t('app.batchCompare')}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('app.ranking')}</CardTitle>
            </CardHeader>
            <CardContent aria-live="polite" aria-busy={isBatchLoading}>
              {batchResult ? (
                <RankedResultsList
                  sourceLabel={batchResult.sourceLabel}
                  results={batchResult.results}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                  <FileSearch className="size-6" />
                  {t('app.emptyRanking')}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('app.history')}</CardTitle>
          </CardHeader>
          <CardContent aria-live="polite" aria-busy={isHistoryLoading}>
            <HistoryList
              entries={entries}
              isLoading={isHistoryLoading}
              error={historyError}
            />
          </CardContent>
        </Card>
      </main>
      <footer className="border-t px-4 py-4 text-center text-sm text-muted-foreground">
        by{' '}
        <a
          href="https://resume-krhyst-ferrari.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('footer.portfolioLink')}
          className="cursor-pointer font-medium text-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Krhyst Ferrari
        </a>
      </footer>
    </div>
  )
}

export default App
