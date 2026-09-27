import type { TextInput } from '@/lib/api'

/** Indica se a entrada (arquivo ou texto colado) tem conteúdo utilizável. */
export function isTextInputFilled(input: TextInput | null): boolean {
  if (!input) return false
  return input.type === 'file'
    ? Boolean(input.file)
    : input.text.trim().length > 0
}
