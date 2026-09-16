import { describe, expect, it } from 'vitest'
import { nextLogin, nextReferralNumber } from './utils'

describe('generowanie loginu użytkownika HR', () => {
  it('usuwa polskie znaki i zbędne odstępy w imieniu oraz nazwisku', () => {
    expect(nextLogin('  Łucja ', ' Żółkiewska  ', [])).toBe('lucja.zolkiewska')
  })

  it('dodaje pierwszy wolny numer, gdy login jest już zajęty', () => {
    expect(nextLogin('Anna', 'Nowak', ['anna.nowak', 'anna.nowak2'])).toBe('anna.nowak3')
  })
})

describe('numeracja skierowań', () => {
  it('wybiera kolejny numer po najwyższym istniejącym numerze', () => {
    expect(nextReferralNumber([
      'SK/2026/09/0002',
      'SK/2026/09/0012',
      'SK/2026/09/0008',
    ])).toMatch(/\/0013$/)
  })

  it('zaczyna numerację od 0001 dla pustej listy', () => {
    expect(nextReferralNumber([])).toMatch(/\/0001$/)
  })
})
