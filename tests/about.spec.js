import { test, expect } from '@playwright/test'

test.describe('About dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('opens via header About button, traps focus, and isolates background', async ({ page }) => {
    const trigger = page.locator('.about-tab--header')
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toContainText('About')

    await trigger.click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')

    const closeButton = page.getByRole('button', { name: 'Close about dialog' })
    await expect(closeButton).toBeFocused()

    const shell = page.locator('.site-shell')
    await expect(shell).toHaveAttribute('inert', '')
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    await expect(page.getByRole('heading', { name: 'Useful things, kept tidy.' })).toBeVisible()
  })

  test('focus loop stays inside dialog', async ({ page }) => {
    await page.locator('.about-tab--header').click()
    const closeButton = page.getByRole('button', { name: 'Close about dialog' })
    const linkedin = page.getByRole('link', { name: /Connect on LinkedIn/ })
    await expect(closeButton).toBeFocused()

    await page.keyboard.press('Shift+Tab')
    await expect(linkedin).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(closeButton).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(linkedin).toBeFocused()
  })

  test('closes on Escape and restores focus and inert', async ({ page }) => {
    const trigger = page.locator('.about-tab--header')
    await trigger.click()
    await expect(page.getByRole('dialog')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(trigger).toBeFocused()
    await expect(page.locator('.site-shell')).not.toHaveAttribute('inert', '')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })

  test('closes on backdrop click and on close button', async ({ page }) => {
    const trigger = page.locator('.about-tab--header')
    await trigger.click()
    const overlay = page.locator('.about-overlay')
    await expect(overlay).toHaveClass(/is-open/)

    await overlay.click({ position: { x: 10, y: 10 } })
    await expect(page.getByRole('dialog')).toBeHidden()

    await trigger.click()
    await page.getByRole('button', { name: 'Close about dialog' }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test('background is not keyboard reachable while open', async ({ page }) => {
    await page.locator('.about-tab--header').click()
    const shell = page.locator('.site-shell')
    await expect(shell).toHaveAttribute('inert', '')

    const firstIconLink = page.locator('.icon-link').first()
    const isInert = await firstIconLink.evaluate((el) => el.closest('[inert]') !== null)
    expect(isInert).toBeTruthy()

    await expect(page.getByRole('button', { name: 'Close about dialog' })).toBeFocused()
    await page.keyboard.press('Tab')
    const activeInside = await page.evaluate(() => !!document.activeElement?.closest('.about-dialog'))
    expect(activeInside).toBeTruthy()
    await expect(firstIconLink).not.toBeFocused()
  })
})
