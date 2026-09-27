import { describe, expect, it } from 'vitest'
import { getCorrelationLevel } from './correlation-level'

describe('getCorrelationLevel', () => {
  it('returns "low" for indexes below 0.4', () => {
    expect(getCorrelationLevel(0)).toBe('low')
    expect(getCorrelationLevel(0.39)).toBe('low')
  })

  it('returns "medium" for indexes between 0.4 and 0.69', () => {
    expect(getCorrelationLevel(0.4)).toBe('medium')
    expect(getCorrelationLevel(0.69)).toBe('medium')
  })

  it('returns "high" for indexes 0.7 and above', () => {
    expect(getCorrelationLevel(0.7)).toBe('high')
    expect(getCorrelationLevel(1)).toBe('high')
  })
})
