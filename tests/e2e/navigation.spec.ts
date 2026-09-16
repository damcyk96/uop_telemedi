import { expect, test } from '@playwright/test'

test('główne moduły aplikacji są dostępne z nawigacji', async ({ page }) => {
  await page.goto('/skierowania')
  await expect(page.getByRole('heading', { name: 'Skierowania', level: 1 })).toBeVisible()

  for (const [link, heading] of [
    ['Pracownicy', 'Pracownicy'],
    ['Czynniki narażenia', 'Czynniki narażenia'],
    ['Szablony', 'Szablony skierowań'],
    ['Użytkownicy', 'Użytkownicy'],
  ]) {
    await page.getByRole('link', { name: link, exact: true }).click()
    await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible()
  }
})
