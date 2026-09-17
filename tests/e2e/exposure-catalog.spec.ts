import { expect, test } from '@playwright/test'

test('usunięcie własnego czynnika odpina go z szablonów', async ({ page }) => {
  const factorName = 'Obsługa wózków jezdniowych'
  const templateName = 'Magazynier E2E'

  await page.goto('/czynniki')
  await page.getByLabel('Nowy czynnik w kategorii Inne').fill(factorName)
  await page.getByRole('button', { name: 'Dodaj czynnik w kategorii Inne' }).click()
  await expect(page.getByText(factorName, { exact: true })).toBeVisible()

  await page.getByRole('link', { name: 'Szablony', exact: true }).click()
  await page.getByRole('button', { name: 'Nowy szablon' }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Nazwa szablonu').fill(templateName)
  await dialog.getByText(factorName, { exact: true }).click()
  await dialog.getByRole('button', { name: 'Zapisz szablon' }).click()
  const templateCard = page.getByRole('article').filter({ hasText: templateName })
  await expect(templateCard).toContainText(factorName)

  await page.getByRole('link', { name: 'Czynniki narażenia', exact: true }).click()
  page.once('dialog', confirmation => confirmation.accept())
  await page.getByRole('button', { name: `Usuń czynnik: ${factorName}` }).click()
  await expect(page.getByText(factorName, { exact: true })).toHaveCount(0)

  await page.getByRole('link', { name: 'Szablony', exact: true }).click()
  await expect(templateCard).toBeVisible()
  await expect(templateCard).not.toContainText(factorName)
})
