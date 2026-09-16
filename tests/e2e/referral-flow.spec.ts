import { expect, test } from "@playwright/test";

/** Lokalna data w formacie akceptowanym przez input[type=date]. */
function localDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Zlicza i zapamiętuje zapytania POST tworzące skierowanie. */
function trackReferralRequests(page: import("@playwright/test").Page) {
  const payloads: Array<Record<string, unknown>> = [];
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().endsWith("/referrals")) {
      payloads.push(request.postDataJSON());
    }
  });
  return payloads;
}

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

test("pole terminu ogranicza wybór do dzisiejszej daty i oznacza datę przeszłą bez wysyłania formularza", async ({
  page,
}) => {
  await page.goto("/skierowania/nowe?employeeId=e1");
  const deadline = page.getByLabel("Termin dostarczenia orzeczenia");

  await expect(deadline).toHaveAttribute("min", localDate());
  await expect(deadline).toHaveAttribute("aria-invalid", "false");
  await expect(page.getByRole("status")).toHaveCount(0);

  await deadline.fill(localDate(-1));
  await expect(deadline).toHaveAttribute("aria-invalid", "true");
});

test("komunikat o przeszłym terminie jest wyróżniony jako błąd", async ({
  page,
}) => {
  await page.goto("/skierowania/nowe?employeeId=e1");

  await page.getByLabel("Termin dostarczenia orzeczenia").fill(localDate(-30));
  await page.getByRole("button", { name: "Wygeneruj skierowanie" }).click();

  const toast = page.getByRole("status");
  await expect(toast).toHaveText(
    "Termin dostarczenia orzeczenia nie może być datą przeszłą",
  );
  await expect(toast).toHaveClass(/\berror\b/);
});

test("można wystawić skierowanie z dzisiejszym terminem dostarczenia orzeczenia", async ({
  page,
}) => {
  const payloads = trackReferralRequests(page);
  const today = localDate();

  await page.goto("/skierowania/nowe?employeeId=e1");
  await page.getByLabel("Termin dostarczenia orzeczenia").fill(today);
  await page.getByRole("button", { name: "Wygeneruj skierowanie" }).click();

  await expect(page).toHaveURL(/\/skierowania$/);
  await expect(page.getByRole("status")).toHaveText(
    "Skierowanie zostało wystawione",
  );
  await expect(
    page.getByRole("heading", { name: /Podgląd · SK\// }),
  ).toBeVisible();
  expect(payloads).toHaveLength(1);
  expect(payloads[0].resultDeadline).toBe(today);
});

test("po poprawieniu przeszłego terminu błąd znika i skierowanie zostaje wystawione", async ({
  page,
}) => {
  const payloads = trackReferralRequests(page);
  const future = localDate(14);

  await page.goto("/skierowania/nowe?employeeId=e2");
  const deadline = page.getByLabel("Termin dostarczenia orzeczenia");
  const issue = page.getByRole("button", { name: "Wygeneruj skierowanie" });

  await deadline.fill(localDate(-1));
  await issue.click();
  await expect(page.getByRole("status")).toBeVisible();
  expect(payloads).toHaveLength(0);

  await deadline.fill(future);
  await expect(deadline).toHaveAttribute("aria-invalid", "false");
  // Toast znika po poprawieniu pola, a nie dopiero po automatycznym wygaśnięciu (3,5 s).
  await expect(page.getByRole("status")).toHaveCount(0, { timeout: 1000 });

  await issue.click();
  await expect(page).toHaveURL(/\/skierowania$/);
  expect(payloads).toHaveLength(1);
  expect(payloads[0].resultDeadline).toBe(future);
});

// Regresja: input[type=date] w Chrome dopuszcza rok pięciocyfrowy, a formatowanie
// takiej daty w podsumowaniu terminu wywracało całą stronę (RangeError).
test(
  "pięciocyfrowy rok w terminie nie powinien wywracać formularza",
  async ({ page }) => {
    const crashes: string[] = [];
    page.on("pageerror", (error) => crashes.push(error.message));

    await page.goto("/skierowania/nowe?employeeId=e1");
    await page.getByLabel("Termin dostarczenia orzeczenia").fill("10000-01-01");

    await expect(
      page.getByRole("heading", { name: "Wystaw skierowanie", level: 1 }),
    ).toBeVisible({ timeout: 2000 });
    expect(crashes).toEqual([]);
  },
);
