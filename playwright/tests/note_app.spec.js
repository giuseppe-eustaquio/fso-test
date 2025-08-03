const { test, describe, expect, beforeEach } = require('@playwright/test');

describe('Note app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('https://localhost:5173');
  });

  test('front page can be opened', async ({ page }) => {
    const locator = await page.getByText('Notes');
    await expect(locator).toBeVisible();
    await expect(
      page.getByText(
        'Note app, Department of Computer Science, University of Helsinki 2025'
      )
    ).toBeVisible();
  });

  test('login form can be opened', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click();

    await page.getByTestId('username').fill('newuser');
    await page.getByTestId('password').fill('salainen');
    await page.getByRole('button', { name: 'login' }).click();
    await expect(page.getByText('Create a new note')).toBeVisible();
  });
});
