import { describe, expect, it } from 'vitest'
import { isTextInputFilled } from './text-input'

describe('isTextInputFilled', () => {
  it('returns false for null input', () => {
    expect(isTextInputFilled(null)).toBe(false)
  })

  it('returns true when a file is present', () => {
    const file = new File(['conteudo'], 'a.txt', { type: 'text/plain' })
    expect(isTextInputFilled({ type: 'file', file })).toBe(true)
  })

  it('returns true for non-blank pasted text', () => {
    expect(isTextInputFilled({ type: 'text', text: 'ola' })).toBe(true)
  })

  it('returns false for blank pasted text', () => {
    expect(isTextInputFilled({ type: 'text', text: '   ' })).toBe(false)
  })
})
