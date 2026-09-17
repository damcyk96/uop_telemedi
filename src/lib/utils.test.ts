import { describe, expect, it } from 'vitest'
import { nextLogin } from './utils'

describe('generowanie loginu użytkownika HR', () => {
  it('usuwa polskie znaki i zbędne odstępy w imieniu oraz nazwisku', () => {
    expect(nextLogin('  Łucja ', ' Żółkiewska  ', [])).toBe('lucja.zolkiewska')
  })

  it('dodaje pierwszy wolny numer, gdy login jest już zajęty', () => {
    expect(nextLogin('Anna', 'Nowak', ['anna.nowak', 'anna.nowak2'])).toBe('anna.nowak3')
  })
})
