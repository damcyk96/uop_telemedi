import { describe, expect, it } from 'vitest'
import { datePL, nextLogin } from './utils'

describe('generowanie loginu użytkownika HR', () => {
  it('usuwa polskie znaki i zbędne odstępy w imieniu oraz nazwisku', () => {
    expect(nextLogin('  Łucja ', ' Żółkiewska  ', [])).toBe('lucja.zolkiewska')
  })

  it('dodaje pierwszy wolny numer, gdy login jest już zajęty', () => {
    expect(nextLogin('Anna', 'Nowak', ['anna.nowak', 'anna.nowak2'])).toBe('anna.nowak3')
  })
})

describe('formatowanie daty', () => {
  it('formatuje datę w polskim formacie', () => {
    expect(datePL('2026-09-16T12:00:00')).toBe('16.09.2026')
  })

  it('nie rzuca wyjątku dla niepoprawnej daty', () => {
    expect(datePL('10000-01-01T12:00:00')).toBeUndefined()
  })
})
