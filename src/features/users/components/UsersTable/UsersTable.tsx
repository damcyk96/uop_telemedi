import { Users } from 'lucide-react'
import type { User } from '@/domain/types'
import { useTranslation } from '@/i18n'
import { datePL } from '@/lib/utils'
import { Badge } from '@/ui/atoms'
import { PersonCell } from '@/ui/molecules'
import { DataTable, type DataTableColumn } from '@/ui/organisms'

export interface UsersTableProps {
  users: User[]
  loading: boolean
}

export function UsersTable({ users, loading }: UsersTableProps) {
  const { t } = useTranslation()

  const columns: DataTableColumn[] = [
    { header: t('users.table.columns.user') },
    { header: t('users.table.columns.role') },
    { header: t('users.table.columns.login') },
    { header: t('users.table.columns.createdAt') },
  ]

  function renderUser(user: User) {
    return (
      <tr key={user.id}>
        <td><PersonCell firstName={user.firstName} lastName={user.lastName} /></td>
        <td>
          <Badge kind="role" tone={user.role === 'COORDINATOR' ? 'coordinator' : undefined}>
            {t(`domain.userRoles.${user.role}`)}
          </Badge>
        </td>
        <td className="mono">{user.login}</td>
        <td>{datePL(user.createdAt)}</td>
      </tr>
    )
  }

  return (
    <DataTable
      label={t('users.table.label')}
      caption={t('users.table.caption')}
      columns={columns}
      rows={users}
      loading={loading}
      empty={{ icon: Users, title: t('users.table.emptyTitle'), text: t('users.table.emptyText') }}
      renderRow={renderUser}
    />
  )
}
