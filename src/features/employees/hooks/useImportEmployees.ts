import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getEmployees, postEmployee } from '@/core/api'
import { queryKeys } from '@/core/queries'
import { importEmployees } from '@/features/employees/xlsx'
import { useTranslation } from '@/i18n'

export function useImportEmployees() {
  const queryClient = useQueryClient()
  const { translations } = useTranslation()

  return useMutation({
    mutationFn: async (file: File) => {
      const existing = await queryClient.ensureQueryData({
        queryKey: queryKeys.employees,
        queryFn: getEmployees,
      })
      return importEmployees(file, existing, postEmployee, translations.employees.xlsx)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.employees }),
  })
}
