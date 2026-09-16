import { expect, test } from "@playwright/test";

test("pracownik HR może dodać pracownika i wystawić mu skierowanie", async ({
  page,
}) => {
  await page.goto("/pracownicy");

  await page.getByRole("button", { name: "Dodaj pracownika" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Imię").fill("Ewa");
  await dialog.getByLabel("Nazwisko").fill("Testowa");
  await dialog
    .getByRole("textbox", { name: "PESEL", exact: true })
    .fill("99010112345");
  await dialog.getByLabel("Ulica i numer").fill("ul. Testowa 10");
  await dialog.getByLabel("Kod pocztowy").fill("00-100");
  await dialog.getByLabel("Miejscowość").fill("Warszawa");
  await dialog.getByLabel("Stanowisko").fill("Specjalistka QA");
  await dialog.getByRole("button", { name: "Zapisz pracownika" }).click();

  const employeeRow = page.getByRole("row").filter({ hasText: "Ewa Testowa" });
  await expect(employeeRow).toContainText("Specjalistka QA");
  await employeeRow.getByTitle("Wystaw skierowanie").click();

  await expect(page).toHaveURL(/\/skierowania\/nowe\?employeeId=/);
  await expect(page.getByLabel("Wybierz pracownika")).toContainText(
    "Ewa Testowa",
  );
  await page
    .getByLabel("Użyj szablonu")
    .selectOption({ label: "Prace biurowe" });
  await page.getByLabel("Termin dostarczenia orzeczenia").fill("2099-12-31");
  await page.getByRole("button", { name: "Wygeneruj skierowanie" }).click();

  await expect(page).toHaveURL(/\/skierowania$/);
  await expect(page.getByRole("status")).toHaveText(
    "Skierowanie zostało wystawione",
  );
  await expect(
    page.getByRole("row").filter({ hasText: "Ewa Testowa" }),
  ).toContainText("Wystawione");
  await expect(
    page.getByRole("heading", { name: /Podgląd · SK\// }),
  ).toBeVisible();
  await expect(page.locator(".pdf-shell iframe")).toHaveAttribute(
    "src",
    /^blob:/,
  );
});

test("nie można wystawić skierowania z terminem dostarczenia orzeczenia w przeszłości", async ({
  page,
}) => {
  let referralRequests = 0;
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().endsWith("/referrals")) {
      referralRequests += 1;
    }
  });

  await page.goto("/skierowania/nowe?employeeId=e1");
  const deadline = page.getByLabel("Termin dostarczenia orzeczenia");
  await deadline.fill("2000-01-01");
  await page.getByRole("button", { name: "Wygeneruj skierowanie" }).click();

  await expect(page).toHaveURL(/\/skierowania\/nowe\?employeeId=e1$/);
  await expect(page.getByRole("status")).toHaveText(
    "Termin dostarczenia orzeczenia nie może być datą przeszłą",
  );
  await expect(deadline).toHaveAttribute("aria-invalid", "true");
  expect(referralRequests).toBe(0);
});
