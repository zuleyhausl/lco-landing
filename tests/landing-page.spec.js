// @ts-check
const { test, expect } = require('@playwright/test');

const MANAGER_TYPES = ['The Tactician', 'The Scout', 'The Builder', 'The Closer'];

test.describe('LCO Landing Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  // ---------- Test 1: Page loads correctly ----------
  test('page loads with correct title and key sections', async ({ page }) => {
    // Title contains the brand name
    await expect(page).toHaveTitle(/Legendary Club Owner/i);

    // All major sections are present in the DOM
    await expect(page.locator('section.hero')).toBeVisible();
    await expect(page.locator('#how-it-works')).toBeAttached();
    await expect(page.locator('#why-lco')).toBeAttached();
    await expect(page.locator('#quiz')).toBeAttached();
    await expect(page.locator('#signup')).toBeAttached();
    await expect(page.locator('footer.footer')).toBeAttached();

    // Hero headline is visible and contains the hook copy
    await expect(page.locator('.hero__title')).toContainText('Run the club');
    await expect(page.locator('.hero__title')).toContainText('Win real money');
  });

  // ---------- Test 2: Quiz happy path ----------
  test('quiz flows through 5 questions and shows a valid manager type result', async ({ page }) => {
    // Scroll to the quiz section
    await page.locator('#quiz').scrollIntoViewIfNeeded();

    // Click "Start the quiz"
    const startBtn = page.locator('#startQuizBtn');
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // Question state should now be active
    await expect(page.locator('[data-state="question"]')).toBeVisible();
    await expect(page.locator('#quizQuestionTotal')).toHaveText('5');

    // Answer all 5 questions by clicking the first option each time
    for (let i = 1; i <= 5; i++) {
      // Verify question number
      await expect(page.locator('#quizQuestionNumber')).toHaveText(String(i));

      // Verify 4 options are rendered
      const options = page.locator('#quizOptions .quiz__option');
      await expect(options).toHaveCount(4);

      // Click the first option
      await options.first().click();
    }

    // After the 5th answer, the result state should appear (allow 1s for the progress-bar delay)
    const resultState = page.locator('[data-state="result"]');
    await expect(resultState).toBeVisible({ timeout: 3000 });

    // Result title should be one of the four valid manager types
    const resultTitle = await page.locator('#quizResultTitle').textContent();
    expect(MANAGER_TYPES).toContain(resultTitle?.trim());

    // Description and stats should be populated
    await expect(page.locator('#quizResultDesc')).not.toBeEmpty();
    await expect(page.locator('#quizResultStats .quiz__resultStat')).toHaveCount(3);

    // Retake button should be visible and functional
    const retakeBtn = page.locator('#quizRetakeBtn');
    await expect(retakeBtn).toBeVisible();
    await retakeBtn.click();

    // After retake, we should be back at the intro state
    await expect(page.locator('[data-state="intro"]')).toBeVisible();
    await expect(page.locator('#startQuizBtn')).toBeVisible();
  });

  // ---------- Test 3: Hero email form ----------
  test('hero email form shows confirmation on submit', async ({ page }) => {
    const heroForm = page.locator('#notifyForm');
    await expect(heroForm).toBeVisible();

    const heroInput = heroForm.locator('input[type="email"]');
    const heroButton = heroForm.locator('button[type="submit"]');

    // Capture the original button text
    const originalText = await heroButton.textContent();
    expect(originalText).toContain('Notify Me at Launch');

    // Fill in an email and submit
    await heroInput.fill('test@example.com');
    await heroButton.click();

    // Button text should change to confirmation
    await expect(heroButton).toContainText("You're on the list", { timeout: 2000 });

    // Input should be cleared
    await expect(heroInput).toHaveValue('');
  });

  // ---------- Test 4: Signup section email form ----------
  test('signup section email form shows confirmation on submit', async ({ page }) => {
    // Scroll to the signup section
    await page.locator('#signup').scrollIntoViewIfNeeded();

    const signupForm = page.locator('#signupForm');
    await expect(signupForm).toBeVisible();

    const input = signupForm.locator('input[type="email"]');
    const button = signupForm.locator('button[type="submit"]');

    await input.fill('alex@example.com');
    await button.click();

    await expect(button).toContainText("You're on the list", { timeout: 2000 });
    await expect(input).toHaveValue('');
  });

  // ---------- Test 5: Footer links point to correct external URLs ----------
  test('footer links point to the correct No Surrender Studio and social URLs', async ({ page }) => {
    await page.locator('footer.footer').scrollIntoViewIfNeeded();

    const expectedLinks = [
      { text: 'Studio', href: 'https://nosurrender.studio/' },
      { text: 'Contact', href: 'https://nosurrender.studio/contact/' },
      { text: 'X / Twitter', href: 'https://x.com/efsanebaskanapp' },
      { text: 'Instagram', href: 'https://www.instagram.com/efsanebaskanapp/' },
    ];

    for (const { text, href } of expectedLinks) {
      const link = page.locator('footer.footer .footer__link', { hasText: text });
      await expect(link).toHaveAttribute('href', href);
      // All footer external links should open in a new tab
      await expect(link).toHaveAttribute('target', '_blank');
      // And use noopener for security
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

});
