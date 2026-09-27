import { describe, expect, it } from 'vitest'
import { countWords } from './word-count'

describe('countWords', () => {
  it('returns 0 for empty or blank text', () => {
    expect(countWords('')).toBe(0)
    expect(countWords('   ')).toBe(0)
  })

  it('counts single words', () => {
    expect(countWords('ola')).toBe(1)
  })

  it('counts multiple words separated by varying whitespace', () => {
    expect(countWords('ola   mundo\tteste\nfinal')).toBe(4)
  })

  it('ignores leading/trailing whitespace', () => {
    expect(countWords('  ola mundo  ')).toBe(2)
  })
})
