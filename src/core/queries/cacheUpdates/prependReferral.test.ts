import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import type { Referral } from '@/domain/types'
import { queryKeys } from '@/core/queries/queryKeys'
import { prependReferral } from './prependReferral'

function referral(id: string) {
  return { id } as Referral
}

describe('prependReferral', () => {
  it('dodaje skierowanie na początek listy i usuwa jego wcześniejszą kopię', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(queryKeys.referrals, [referral('a'), referral('b')])

    prependReferral(queryClient, referral('b'))

    expect(queryClient.getQueryData<Referral[]>(queryKeys.referrals)?.map(item => item.id)).toEqual(['b', 'a'])
  })

  it('tworzy listę, gdy cache jest pusty', () => {
    const queryClient = new QueryClient()

    prependReferral(queryClient, referral('a'))

    expect(queryClient.getQueryData<Referral[]>(queryKeys.referrals)).toEqual([referral('a')])
  })
})
