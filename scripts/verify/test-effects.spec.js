const { test, expect } = require('@playwright/test');

test.describe('Preserved Effects Tests', () => {
  test('Hero photo hover parity', async ({ page }) => {
    // Check old build
    await page.goto('http://localhost:4000');
    const oldImg = page.locator('img[alt*="Bhavya Kansal"]').first();
    await oldImg.hover();
    await page.waitForTimeout(600);
    const oldTransform = await oldImg.evaluate((el) => window.getComputedStyle(el).transform);
    
    // Check new build
    await page.goto('http://localhost:4001');
    const newImg = page.locator('img[alt*="Bhavya Kansal"]').first();
    await newImg.hover();
    await page.waitForTimeout(600);
    const newTransform = await newImg.evaluate((el) => window.getComputedStyle(el).transform);
    
    expect(newTransform).toEqual(oldTransform);
  });

  test('Navbar cursor-tracking eyes', async ({ page }) => {
    // Test new build dots logic
    await page.goto('http://localhost:4001');
    // Ensure navbar is loaded
    await page.waitForTimeout(500);
    
    // Move mouse to top left
    await page.mouse.move(0, 0);
    await page.waitForTimeout(200);
    const eyesLocators = page.locator('.bg-white.dark\\:bg-gray-800.border').locator('.bg-black.dark\\:bg-white.absolute');
    
    // Evaluate position
    const leftPupilPos1 = await eyesLocators.nth(0).evaluate(el => window.getComputedStyle(el).transform);
    
    // Move mouse to bottom right
    await page.mouse.move(1000, 1000);
    await page.waitForTimeout(200);
    const leftPupilPos2 = await eyesLocators.nth(0).evaluate(el => window.getComputedStyle(el).transform);
    
    expect(leftPupilPos1).not.toEqual(leftPupilPos2); // It should move!
  });
});
