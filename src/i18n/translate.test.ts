import { describe, expect, it } from 'vitest'
import { pl } from './locales/pl'
import { createTranslator } from './translate'

const t = createTranslator(pl, 'pl')

describe('createTranslator', () => {
  it('zwraca tekst dla klucza z kropkami', () => {
    expect(t('employees.page.title')).toBe('Pracownicy')
  })

  it('podstawia parametry', () => {
    expect(t('users.credentials.heading', { name: 'Jan Testowy' })).toBe('Dostęp dla Jan Testowy')
  })

  it('dobiera polską formę liczby mnogiej', () => {
    expect(t('exposureFactors.card.count', { count: 1 })).toBe('1 czynnik')
    expect(t('exposureFactors.card.count', { count: 3 })).toBe('3 czynniki')
    expect(t('exposureFactors.card.count', { count: 5 })).toBe('5 czynników')
    expect(t('exposureFactors.card.count', { count: 22 })).toBe('22 czynniki')
  })

  it('zwraca klucz, gdy tłumaczenia brakuje w odpowiedzi z API', () => {
    const partial = createTranslator({ ...pl, common: { ...pl.common, loading: undefined as unknown as string } }, 'pl')
    expect(partial('common.loading')).toBe('common.loading')
  })
})
