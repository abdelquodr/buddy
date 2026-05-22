import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/signup');
  });

  test('should navigate to signup page', async ({ page }) => {
    await expect(page).toHaveURL('/signup');
  });

  test('should display signup choice screen', async ({ page }) => {
    await expect(page.locator('text=Register your account')).toBeVisible();
    await expect(page.locator('text=Sign up with email')).toBeVisible();
    await expect(page.locator('text=Sign up with Google')).toBeVisible();
  });

  test('should navigate to register page when clicking email signup', async ({
    page,
  }) => {
    await page.click('text=Sign up with email');
    await expect(page).toHaveURL('/signup/register');
  });

  test('should display register form', async ({ page }) => {
    await page.click('text=Sign up with email');
    await expect(page.locator('text=First Name')).toBeVisible();
    await expect(page.locator('text=Last Name')).toBeVisible();
    await expect(page.locator('text=Work email')).toBeVisible();
    await expect(page.locator('text=Password')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.click('text=Sign up with email');

    // Try to submit empty form
    await page.click('text=Create account');

    // Should show validation errors
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Email is required')).toBeVisible();
    await expect(page.locator('text=Password is required')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.click('text=Sign up with email');

    // Fill form with invalid email
    await page.fill('input[placeholder="Saif"]', 'John');
    await page.fill('input[placeholder="Ashrf"]', 'Doe');
    await page.fill('input[placeholder="saif@example.com"]', 'invalid-email');
    await page.fill('input[placeholder="••••••••"]', 'Password123');

    // Blur to trigger validation
    await page.fill('input[placeholder="saif@example.com"]', 'invalid');
    await page.press('input[placeholder="saif@example.com"]', 'Tab');

    await expect(
      page.locator('text=Please enter a valid email address')
    ).toBeVisible();
  });

  test('should validate password strength', async ({ page }) => {
    await page.click('text=Sign up with email');

    // Fill form with weak password
    await page.fill('input[placeholder="Saif"]', 'John');
    await page.fill('input[placeholder="Ashrf"]', 'Doe');
    await page.fill('input[placeholder="saif@example.com"]', 'john@example.com');
    await page.fill('input[placeholder="••••••••"]', 'weak');

    // Blur to trigger validation
    await page.press('input[placeholder="••••••••"]', 'Tab');

    await expect(
      page.locator('text=Password must be at least 8 characters')
    ).toBeVisible();
  });

  test('should submit valid form and navigate to check-mail', async ({
    page,
  }) => {
    await page.click('text=Sign up with email');

    // Fill form with valid data
    await page.fill('input[placeholder="Saif"]', 'John');
    await page.fill('input[placeholder="Ashrf"]', 'Doe');
    await page.fill('input[placeholder="saif@example.com"]', 'john@example.com');
    await page.fill('input[placeholder="••••••••"]', 'ValidPassword123');

    // Submit form
    await page.click('text=Create account');

    // Should navigate to check-mail page
    await expect(page).toHaveURL('/signup/check-mail');
    await expect(page.locator('text=Check your mailbox')).toBeVisible();
  });

  test('should navigate to verify page from check-mail', async ({ page }) => {
    await page.goto('/signup/check-mail');
    await page.click('text=Continue to verify');
    await expect(page).toHaveURL('/signup/verify');
  });

  test('should display OTP input on verify page', async ({ page }) => {
    await page.goto('/signup/verify');
    await expect(page.locator('text=Verify your email')).toBeVisible();

    // Should have 4 input fields for OTP
    const inputs = await page.locator('input[inputmode="numeric"]').count();
    expect(inputs).toBe(4);
  });

  test('should auto-submit OTP when all digits entered', async ({ page }) => {
    await page.goto('/signup/verify');

    // Get all OTP inputs
    const inputs = page.locator('input[inputmode="numeric"]');

    // Enter OTP digits one by one
    for (let i = 0; i < 4; i++) {
      await inputs.nth(i).fill(String(i + 1));
    }

    // Should navigate to verified page
    await expect(page).toHaveURL('/signup/verified', { timeout: 5000 });
  });

  test('should display success message on verified page', async ({ page }) => {
    await page.goto('/signup/verified');
    await expect(page.locator('text=Email verified')).toBeVisible();
    await expect(page.locator('text=Continue to dashboard')).toBeVisible();
  });

  test('should navigate to dashboard from verified page', async ({ page }) => {
    await page.goto('/signup/verified');
    await page.click('text=Continue to dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});

test.describe('Accessibility', () => {
  test('should have proper ARIA labels on signup', async ({ page }) => {
    await page.goto('/signup');

    // Check for proper heading
    await expect(page.locator('h2:has-text("Register your account")')).toBeVisible();
  });

  test('should have proper ARIA labels on register form', async ({ page }) => {
    await page.goto('/signup/register');

    // Check for labels
    await expect(page.locator('label:has-text("First Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Last Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Work email")')).toBeVisible();
    await expect(page.locator('label:has-text("Password")')).toBeVisible();
  });

  test('should have proper ARIA labels on OTP input', async ({ page }) => {
    await page.goto('/signup/verify');

    // Check for aria-labels on OTP inputs
    const inputs = page.locator('input[aria-label*="OTP digit"]');
    const count = await inputs.count();
    expect(count).toBe(4);
  });

  test('should announce validation errors to screen readers', async ({
    page,
  }) => {
    await page.goto('/signup/register');

    // Try to submit empty form
    await page.click('text=Create account');

    // Check for role="alert" on error messages
    const errors = page.locator('[role="alert"]');
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/signup');

    // Should still be able to navigate
    await page.click('text=Sign up with email');
    await expect(page).toHaveURL('/signup/register');

    // Form should be visible
    await expect(page.locator('text=First Name')).toBeVisible();
  });

  test('should hide left panel on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/signup');

    // Left panel should be hidden (lg: screen size)
    const leftPanel = page.locator('text=Buddy').first();
    await expect(leftPanel).not.toBeVisible();
  });
});
