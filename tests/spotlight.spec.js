import { test, expect } from '@playwright/test'
import { apps } from '../src/data/apps.js'

test.describe('Spotlights and previews', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('spotlights render with metadata, lazy iframes, and safe links', async ({ page }) => {
    const spotlights = page.locator('.spotlight')
    await expect(spotlights).toHaveCount(apps.length)

    for (let i = 0; i < apps.length; i++) {
      const spotlight = spotlights.nth(i)
      await expect(spotlight).toHaveAttribute('aria-labelledby', `${apps[i].id}-title`)
      await expect(spotlight.locator('h2')).toHaveText(apps[i].headline)
      await expect(spotlight.locator('.eyebrow')).toHaveText(apps[i].eyebrow)

      const frame = spotlight.locator('.app-frame__preview')
      await expect(frame).toHaveAttribute('loading', 'lazy')
      await expect(frame).toHaveAttribute('referrerPolicy', 'strict-origin-when-cross-origin')
      await expect(frame).toHaveAttribute('title', `${apps[i].name} live preview`)
      await expect(frame).toHaveAttribute('src', apps[i].href)

      const openLink = spotlight.getByRole('link', { name: 'Open app' })
      await expect(openLink).toHaveAttribute('href', apps[i].href)
      await expect(openLink).toHaveAttribute('target', '_blank')
      await expect(openLink).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('hero composition fits desktop viewports', async ({ page }) => {
    for (const viewport of [{ width: 1280, height: 700 }, { width: 2560, height: 1250 }]) {
      await page.setViewportSize(viewport)
      await page.reload()
      await expect(page.locator('.hero')).toHaveClass(/is-visible/, { timeout: 2000 })
      await page.waitForTimeout(900)
      const bounds = await page.locator('.hero').evaluate((hero) => {
        const elements = [hero, hero.querySelector('.hero-copy'), hero.querySelector('.hero-art'), hero.querySelector('.hero-art p')]
        return elements.map((element) => {
          const rect = element.getBoundingClientRect()
          return { top: rect.top, bottom: rect.bottom, right: rect.right }
        })
      })
      for (const element of bounds) {
        expect(element.top).toBeGreaterThanOrEqual(-1)
        expect(element.bottom).toBeLessThanOrEqual(viewport.height + 1)
        expect(element.right).toBeLessThanOrEqual(viewport.width + 1)
      }
    }
  })
  test('hero and spotlight reveal replay on intersection', async ({ page }) => {
    const hero = page.locator('.hero')
    await expect(hero).toBeVisible()

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(hero).toHaveClass(/is-visible/)

    const firstSpotlight = page.locator('.spotlight').first()
    await firstSpotlight.scrollIntoViewIfNeeded()
    await expect(firstSpotlight).toHaveClass(/is-visible/, { timeout: 2000 })

    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(400)
  })

  test('orb field is decorative and does not capture pointer', async ({ page }) => {
    const orbField = page.locator('.orb-field')
    await expect(orbField).toBeAttached()
    await expect(orbField).toHaveCSS('pointer-events', 'none')

    const cursorOrb = page.locator('.cursor-orb')
    await expect(cursorOrb).toHaveCSS('pointer-events', 'none')

    const shells = page.locator('.orb-shell')
    await expect(shells).toHaveCount(7)
  })

  test('previews suppress cursor orb interaction boundary', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'pointerenter suppression check is flaky on webkit')
    const finePointer = await page.evaluate(() => window.matchMedia('(pointer: fine)').matches)
    test.skip(!finePointer, 'cursor orb is disabled for coarse pointers')
    const preview = page.locator('.app-frame__preview').first()
    await preview.hover()
    const cursorOrb = page.locator('.cursor-orb')
    await expect(cursorOrb).toHaveCSS('opacity', '0')

    await page.mouse.move(100, 100)
    await expect(cursorOrb).toHaveCSS('opacity', '1')
    const transform = await cursorOrb.evaluate((element) => element.style.transform)
    expect(transform).not.toContain('-1000px')

    await page.evaluate(() => window.dispatchEvent(new MouseEvent('mouseleave')))
    await expect(cursorOrb).toHaveCSS('opacity', '0')
  })

  test('CSP allows every configured preview origin', async ({ page }) => {
    const policy = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content')
    expect(policy).toBeTruthy()
    for (const app of apps) {
      expect(policy).toContain(new URL(app.href).origin)
    }
  })

  test('configured previews load under the active CSP', async ({ page }) => {
    const cspErrors = []
    page.on('console', (message) => {
      if (message.type() === 'error' && /content security policy|blocked by/i.test(message.text())) {
        cspErrors.push(message.text())
      }
    })

    for (let i = 0; i < apps.length; i++) {
      const spotlight = page.locator('.spotlight').nth(i)
      await spotlight.scrollIntoViewIfNeeded()
      const origin = new URL(apps[i].href).origin
      await expect.poll(
        () => page.frames().some((frame) => frame.url().startsWith(origin)),
        { timeout: 20_000, message: 'preview did not load from ' + origin },
      ).toBe(true)
    }

    expect(cspErrors).toEqual([])
  })
  test('showcase anchor respects sticky header offset', async ({ page }) => {
    await page.getByRole('link', { name: 'Meet the tools' }).click()
    await expect(page.locator('#showcase')).toBeInViewport()
  })
})
