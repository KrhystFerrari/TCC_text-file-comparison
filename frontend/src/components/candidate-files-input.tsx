import { FileText, Upload, X } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

interface CandidateFilesInputProps {
  files: File[]
  onAdd: (files: FileList | File[]) => void
  onRemove: (index: number) => void
}

export function CandidateFilesInput({
  files,
  onAdd,
  onRemove,
}: CandidateFilesInputProps) {
  const inputId = useId()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <input
        id={inputId}
        type="file"
        multiple
        accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="peer sr-only"
        aria-label={t('batch.addCandidates')}
        onChange={(event) => {
          if (event.target.files?.length) {
            onAdd(event.target.files)
            event.target.value = ''
          }
        }}
      />
      <label
        htmlFor={inputId}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed p-2.5 text-sm text-muted-foreground transition-colors hover:border-ring hover:bg-muted/50 hover:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
      >
        <Upload className="size-4" />
        {t('batch.addCandidates')}
      </label>

      {files.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-lg border p-2 text-sm"
            >
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                aria-label={t('batch.removeCandidate', { name: file.name })}
                className="ml-auto cursor-pointer rounded-sm p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onRemove(index)}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
