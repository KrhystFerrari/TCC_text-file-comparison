import { FileText, Upload, X } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import type { TextInput } from '@/lib/api'
import { countWords } from '@/lib/word-count'

interface TextSourceInputProps {
  title: string
  value: TextInput | null
  onChange: (value: TextInput | null) => void
}

export function TextSourceInput({
  title,
  value,
  onChange,
}: TextSourceInputProps) {
  const { t } = useTranslation()
  const fileInputId = useId()
  const mode = value?.type ?? 'file'
  const selectedFile = value?.type === 'file' ? value.file : null
  const pastedText = value?.type === 'text' ? value.text : ''

  function handleModeChange(nextMode: string) {
    onChange(nextMode === 'text' ? { type: 'text', text: '' } : null)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{title}</Label>
      <Tabs value={mode} onValueChange={handleModeChange}>
        <TabsList className="w-full">
          <TabsTrigger value="file">{t('input.fileTab')}</TabsTrigger>
          <TabsTrigger value="text">{t('input.textTab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <input
            id={fileInputId}
            type="file"
            aria-label={t('input.fileInputLabel', { title })}
            accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="peer sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0]
              onChange(file ? { type: 'file', file } : null)
            }}
          />
          {selectedFile ? (
            <div className="flex items-center gap-2 rounded-lg border p-2.5 text-sm">
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{selectedFile.name}</span>
              <button
                type="button"
                aria-label={t('input.removeFile')}
                className="ml-auto cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onChange(null)}
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor={fileInputId}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed p-2.5 text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-muted/50 hover:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
            >
              <Upload className="size-4" />
              {t('input.chooseFile')}
            </label>
          )}
        </TabsContent>
        <TabsContent value="text">
          <div className="relative">
            <Textarea
              placeholder={t('input.placeholder')}
              aria-label={title}
              className="min-h-32 pb-6"
              value={pastedText}
              onChange={(event) =>
                onChange({ type: 'text', text: event.target.value })
              }
            />
            <span className="pointer-events-none absolute right-2 bottom-2 text-xs text-muted-foreground">
              {t('input.words', { count: countWords(pastedText) })}
            </span>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
