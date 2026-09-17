import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('łączy tylko prawdziwe nazwy klas', () => {
    expect(cn('button', false, 'primary', undefined, null)).toBe('button primary')
  })

  it('zwraca undefined dla pustego wyniku', () => {
    expect(cn(false, undefined)).toBeUndefined()
  })
})
