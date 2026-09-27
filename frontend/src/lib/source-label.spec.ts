import { describe, expect, it, vi } from 'vitest'
import { localizeSourceLabel } from './source-label'

describe('localizeSourceLabel', () => {
  it('translates the generic pasted-text label', () => {
    const translate = vi.fn(() => 'Pasted text')

    expect(localizeSourceLabel('Texto colado', translate)).toBe('Pasted text')
    expect(translate).toHaveBeenCalledWith('input.pastedLabel')
  })

  it('preserves uploaded filenames', () => {
    const translate = vi.fn(() => 'Pasted text')

    expect(localizeSourceLabel('report.pdf', translate)).toBe('report.pdf')
    expect(translate).not.toHaveBeenCalled()
  })
})
