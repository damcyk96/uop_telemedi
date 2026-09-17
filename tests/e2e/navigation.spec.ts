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

test('po utworzeniu dostępu pokazuje spójne podsumowanie danych logowania', async ({ page }) => {
  await page.goto('/uzytkownicy')
  await page.getByRole('button', { name: 'Dodaj osobę HR' }).click()
  await page.getByLabel('Imię').fill('Jan')
  await page.getByLabel('Nazwisko').fill('Testowy')
  await page.getByRole('button', { name: 'Wygeneruj dostęp' }).click()

  const dialog = page.getByRole('dialog', { name: 'Dostęp został utworzony' })
  await expect(dialog.getByRole('heading', { name: 'Dostęp dla Jan Testowy' })).toBeVisible()
  await expect(dialog.getByText('jan.testowy', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Kopiuj dane logowania' })).toBeVisible()

  await dialog.getByRole('button', { name: 'Gotowe' }).click()
  await expect(dialog).not.toBeVisible()
})

test('mobilna nawigacja nie powoduje poziomego przewijania strony', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/skierowania')

  await expect(page.getByRole('button', { name: 'Otwórz menu' })).toBeVisible()
  await page.getByRole('button', { name: 'Otwórz menu' }).click()
  await page.getByRole('link', { name: 'Pracownicy', exact: true }).click()

  await expect(page.getByRole('heading', { name: 'Pracownicy', level: 1 })).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
})
