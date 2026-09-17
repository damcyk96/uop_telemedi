import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { User } from '@/domain/types'
import { useGetUsers, usePostUser } from '@/core/queries'
import { useTranslation } from '@/i18n'
import { Button } from '@/ui/atoms'
import { PageHeader } from '@/ui/organisms'
import { AddUserDialog } from '@/features/users/components/AddUserDialog'
import { CredentialsDialog } from '@/features/users/components/CredentialsDialog'
import { UsersTable } from '@/features/users/components/UsersTable'

export default function UsersPage() {
  const { t } = useTranslation()
  const usersQuery = useGetUsers()
  const postUser = usePostUser()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [createdUser, setCreatedUser] = useState<User | null>(null)
  const users = usersQuery.data || []

  async function addUser(user: User) {
    await postUser.mutateAsync(user)
    setIsAddDialogOpen(false)
    setCreatedUser(user)
  }

  const pageActions = (
    <Button onClick={() => setIsAddDialogOpen(true)}>
      <Plus size={17} aria-hidden="true" />
      {t('users.page.create')}
    </Button>
  )

  return (
    <>
      <PageHeader
        eyebrow={t('users.page.eyebrow')}
        title={t('users.page.title')}
        description={t('users.page.description')}
        actions={pageActions}
      />
      <UsersTable users={users} loading={usersQuery.isLoading} />
      {isAddDialogOpen && (
        <AddUserDialog
          users={users}
          onClose={() => setIsAddDialogOpen(false)}
          onSave={addUser}
        />
      )}
      {createdUser && (
        <CredentialsDialog user={createdUser} onClose={() => setCreatedUser(null)} />
      )}
    </>
  )
}
