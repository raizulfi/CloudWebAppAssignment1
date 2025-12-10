import { test, expect } from '@playwright/test';

test.describe('Navigation and tabs flow', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('navigates to About from header', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByLabel('Student number')).toContainText('22586503');

    await page.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
  });

  test('creates a tab and sees generated output', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Tabs Generator' })).toBeVisible();

    await page.getByRole('button', { name: '+ Add' }).click();
    await expect(page.getByRole('button', { name: 'Step 1' })).toBeVisible();
    await expect(page.locator('textarea')).toBeVisible();

    const outputPreview = page.locator('pre').first();
    await expect(outputPreview).toContainText('<!DOCTYPE html>');
  });
});
