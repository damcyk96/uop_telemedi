import { useQuery } from '@tanstack/react-query'
import type { Locale, Translations } from '@/i18n/types'
import { getTranslations } from '@/core/api'
import { queryKeys } from './queryKeys'
import type { QueryOptions } from './types'

export function useGetTranslations(locale: Locale, options?: QueryOptions<Translations>) {
  return useQuery({
    queryKey: queryKeys.translations(locale),
    queryFn: () => getTranslations(locale),
    staleTime: Infinity,
    ...options,
  })
}
