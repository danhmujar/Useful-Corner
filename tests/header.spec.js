import { test, expect } from '@playwright/test'
import { apps } from '../src/data/apps.js'

test.describe('Header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('skip link and sticky header', async ({ page }) => {
    const skipLink = page.getByRole('link', { name: 'Skip to the tools' })
    await expect(skipLink).toBeAttached()
    await skipLink.focus()
    await expect(skipLink).toBeFocused()
    await expect(skipLink).toHaveAttribute('href', '#showcase')

    const header = page.locator('.site-header')
    await expect(header).toBeVisible()
    await expect(header).toHaveCSS('position', 'sticky')
  })

  test('brand and icon nav have accessible names and correct order', async ({ page }) => {
    const brand = page.getByRole('link', { name: /The Useful Corner/ })
    await expect(brand).toBeVisible()
    await expect(brand).toHaveAttribute('href', '#top')

    const nav = page.getByRole('navigation', { name: 'Jump to a tool' })
    await expect(nav).toBeVisible()

    const icons = page.locator('.icon-link')
    await expect(icons).toHaveCount(apps.length)

    for (let i = 0; i < apps.length; i++) {
      const link = icons.nth(i)
      await expect(link).toHaveAttribute('href', `#${apps[i].id}`)
      await expect(link).toHaveAttribute('aria-label', `Go to ${apps[i].name}`)
      await expect(link.locator('.tooltip')).toHaveText(apps[i].name)
    }

    const headerActions = page.locator('.header-actions')
    const navIndex = await headerActions.locator('nav').evaluate((el) => Array.from(el.parentElement.children).indexOf(el))
    const aboutIndex = await headerActions.locator('button').evaluate((el) => Array.from(el.parentElement.children).indexOf(el))
    expect(aboutIndex).toBeGreaterThan(navIndex)
  })

  test('all header controls meet 44px hit area', async ({ page }) => {
    for (const locator of [page.locator('.icon-link'), page.getByRole('button', { name: 'About', exact: true })]) {
      const count = await locator.count()
      for (let i = 0; i < count; i++) {
        const box = await locator.nth(i).boundingBox()
        expect(box.width).toBeGreaterThanOrEqual(44)
        expect(box.height).toBeGreaterThanOrEqual(44)
      }
    }
  })

  test('320px header remains usable', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 })
    await expect(page.locator('.site-header')).toBeVisible()
    await expect(page.locator('.brand-mark')).toBeVisible()
    const box = await page.locator('.brand-mark').boundingBox()
    expect(box.width).toBeLessThanOrEqual(24 + 2)
    await expect(page.locator('.icon-nav')).toBeVisible()
    const aboutTab = page.locator('.about-tab--header')
    await expect(aboutTab).toBeVisible()
    const aboutBox = await aboutTab.boundingBox()
    expect(aboutBox.width).toBeGreaterThanOrEqual(44)
    expect(aboutBox.height).toBeGreaterThanOrEqual(44)
    await expect(aboutTab).toHaveAttribute('aria-haspopup', 'dialog')
  })
})
