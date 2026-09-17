import { afterEach, describe, expect, it, vi } from 'vitest'
import { isReferralDeadlineInPast, localDateIso } from './referralDeadline'

const today = new Date(2026, 8, 16, 12, 0, 0)

afterEach(() => {
  vi.useRealTimers()
})

describe('termin dostarczenia orzeczenia', () => {
  it('odrzuca datę wcześniejszą niż dzisiaj', () => {
    expect(isReferralDeadlineInPast('2026-09-15', today)).toBe(true)
  })

  it('pozwala wybrać dzisiejszą datę', () => {
    expect(isReferralDeadlineInPast('2026-09-16', today)).toBe(false)
  })

  it('pozwala wybrać datę przyszłą', () => {
    expect(isReferralDeadlineInPast('2026-09-17', today)).toBe(false)
  })

  it('wyznacza dzisiejszą datę w lokalnej strefie czasowej', () => {
    expect(localDateIso(today)).toBe('2026-09-16')
  })

  it('nie traktuje pustego pola jako terminu z przeszłości', () => {
    expect(isReferralDeadlineInPast('', today)).toBe(false)
  })

  it('odrzuca ostatni dzień poprzedniego roku', () => {
    expect(
      isReferralDeadlineInPast('2025-12-31', new Date(2026, 0, 1, 8, 0, 0)),
    ).toBe(true)
  })

  it('pozwala wybrać pierwszy dzień kolejnego roku', () => {
    expect(
      isReferralDeadlineInPast('2027-01-01', new Date(2026, 11, 31, 8, 0, 0)),
    ).toBe(false)
  })

  it('odrzuca datę przeszłą jeszcze tuż przed północą', () => {
    expect(
      isReferralDeadlineInPast('2026-09-15', new Date(2026, 8, 16, 23, 59, 59)),
    ).toBe(true)
  })

  it('porównuje z bieżącą datą systemową, gdy nie podano punktu odniesienia', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 16, 23, 59, 59))

    expect(isReferralDeadlineInPast('2026-09-15')).toBe(true)
    expect(isReferralDeadlineInPast('2026-09-16')).toBe(false)
    expect(isReferralDeadlineInPast('2026-09-17')).toBe(false)
  })

  // Regresja: input[type=date] dopuszcza rok pięciocyfrowy (do 275760),
  // dla którego porównanie dat jako tekstu dawało zły wynik.
  it('nie uznaje roku pięciocyfrowego za datę przeszłą', () => {
    expect(isReferralDeadlineInPast('10000-01-01', today)).toBe(false)
  })

  it('nie uznaje maksymalnej daty pola typu date za datę przeszłą', () => {
    expect(isReferralDeadlineInPast('275760-09-13', today)).toBe(false)
  })

  it('odrzuca termin z bardzo odległej przeszłości', () => {
    expect(isReferralDeadlineInPast('0001-01-01', today)).toBe(true)
  })

  it('nie traktuje niepoprawnego formatu jako terminu z przeszłości', () => {
    expect(isReferralDeadlineInPast('nie-data', today)).toBe(false)
    expect(isReferralDeadlineInPast('16.09.2026', today)).toBe(false)
    expect(isReferralDeadlineInPast('2026-9-1', today)).toBe(false)
  })

  it('nie myli składowych miesiąca i dnia przy przejściu między miesiącami', () => {
    const firstOfOctober = new Date(2026, 9, 1, 8, 0, 0)
    expect(isReferralDeadlineInPast('2026-09-30', firstOfOctober)).toBe(true)
    expect(isReferralDeadlineInPast('2026-10-01', firstOfOctober)).toBe(false)
    expect(isReferralDeadlineInPast('2026-10-31', new Date(2026, 9, 2, 8, 0, 0))).toBe(
      false,
    )
  })
})

describe('lokalna data ISO', () => {
  it('uzupełnia zerami jednocyfrowy miesiąc i dzień', () => {
    expect(localDateIso(new Date(2026, 0, 5, 12, 0, 0))).toBe('2026-01-05')
  })

  it('używa daty lokalnej, a nie UTC, na początku i na końcu doby', () => {
    // W dowolnej strefie z przesunięciem != 0 co najmniej jedna z tych chwil
    // wypada w UTC w innym dniu kalendarzowym, więc toISOString() by tu poległ.
    expect(localDateIso(new Date(2026, 5, 10, 0, 30, 0))).toBe('2026-06-10')
    expect(localDateIso(new Date(2026, 5, 10, 23, 30, 0))).toBe('2026-06-10')
  })

  it('domyślnie zwraca dzisiejszą datę lokalną', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 16, 0, 15, 0))

    expect(localDateIso()).toBe('2026-09-16')
  })
})
