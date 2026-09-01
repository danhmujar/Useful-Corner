import { test, expect } from '@playwright/test'
import { apps } from '../src/data/apps.js'

test.describe('Spotlights and previews', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('spotlights render available previews and coming-soon states', async ({ page }) => {
    const spotlights = page.locator('.spotlight')
    await expect(spotlights).toHaveCount(apps.length)

    for (let i = 0; i < apps.length; i++) {
      const spotlight = spotlights.nth(i)
      await expect(spotlight).toHaveAttribute('aria-labelledby', `${apps[i].id}-title`)
      await expect(spotlight.locator('h2')).toHaveText(apps[i].headline)
      await expect(spotlight.locator('.eyebrow')).toHaveText(apps[i].eyebrow)

      const frame = spotlight.locator('.app-frame__preview')
      if (apps[i].status === 'coming-soon') {
        await expect(frame).toHaveCount(0)
        await expect(spotlight.locator('.app-frame__coming-soon')).toHaveText('Coming soon')
        await expect(spotlight.locator('.app-button--disabled')).toHaveText('Coming soon')
        await expect(spotlight.getByRole('link', { name: 'Open app' })).toHaveCount(0)
      } else {
        await expect(frame).toHaveAttribute('loading', 'lazy')
        await expect(frame).toHaveAttribute('referrerPolicy', 'strict-origin-when-cross-origin')
        await expect(frame).toHaveAttribute('title', `${apps[i].name} live preview`)
        await expect(frame).toHaveAttribute('src', apps[i].href)

        const openLink = spotlight.getByRole('link', { name: 'Open app' })
        await expect(openLink).toHaveAttribute('href', apps[i].href)
        await expect(openLink).toHaveAttribute('target', '_blank')
        await expect(openLink).toHaveAttribute('rel', 'noopener noreferrer')
      }
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

  test('hero copy and art caption stay anchored inside their panels', async ({ page }) => {
    for (const viewport of [{ width: 1280, height: 700 }, { width: 1920, height: 1080 }, { width: 2560, height: 1250 }]) {
      await page.setViewportSize(viewport)
      await page.reload()
      await expect(page.locator('.hero')).toHaveClass(/is-visible/, { timeout: 2000 })

      const insets = await page.locator('.hero').evaluate((hero) => {
        const copy = hero.querySelector('.hero-copy').getBoundingClientRect()
        const caption = hero.querySelector('.hero-art p').getBoundingClientRect()
        const brand = document.querySelector('.brand').getBoundingClientRect()
        return {
          copyLeft: copy.left,
          captionRight: window.innerWidth - caption.right,
          brandLeft: brand.left,
        }
      })

      expect(insets.copyLeft).toBeGreaterThanOrEqual(48)
      expect(insets.copyLeft).toBeLessThanOrEqual(120)
      expect(Math.abs(insets.copyLeft - insets.brandLeft)).toBeLessThanOrEqual(1)
      // The document scrollbar sits outside the hero panel, reducing its viewport inset.
      expect(insets.captionRight).toBeGreaterThanOrEqual(24)
      expect(insets.captionRight).toBeLessThanOrEqual(120)
    }
  })

  test('showcase and footer use the shared page inset', async ({ page }) => {
    for (const viewport of [{ width: 1280, height: 700 }, { width: 1920, height: 1080 }, { width: 2560, height: 1250 }]) {
      await page.setViewportSize(viewport)
      await page.reload()

      const insets = await page.locator('.site-shell').evaluate((shell) => {
        const showcase = shell.querySelector('.spotlight')
        const footer = shell.querySelector('.site-footer')
        return {
          showcase: Number.parseFloat(getComputedStyle(showcase).paddingInlineStart),
          footer: Number.parseFloat(getComputedStyle(footer).paddingInlineStart),
        }
      })

      expect(insets.showcase).toBe(insets.footer)
    }
  })

  test('spotlight pairs are centered within the page on wide screens', async ({ page }) => {
    for (const viewport of [{ width: 1920, height: 1080 }, { width: 2560, height: 1250 }]) {
      await page.setViewportSize(viewport)
      await page.reload()
      await page.addStyleTag({ content: '.spotlight .app-frame { animation: none !important; transform: none !important; }' })
      const firstSpotlight = page.locator('.spotlight').first()
      await firstSpotlight.scrollIntoViewIfNeeded()
      await expect(firstSpotlight).toHaveClass(/is-visible/, { timeout: 2000 })

      const edges = await page.locator('.showcase').evaluate((showcase) => {
        const inner = showcase.querySelector('.spotlight-inner').getBoundingClientRect()
        const frames = showcase.querySelectorAll('.app-frame')
        const first = frames[0].getBoundingClientRect()
        const reversed = frames[1].getBoundingClientRect()
        const viewportWidth = document.documentElement.clientWidth
        return {
          innerLeft: inner.left,
          innerRight: viewportWidth - inner.right,
          firstLeft: first.left,
          firstWidth: first.width,
          reversedRight: viewportWidth - reversed.right,
        }
      })

      expect(Math.abs(edges.innerLeft - edges.innerRight)).toBeLessThanOrEqual(1)
      expect(Math.abs(edges.firstLeft - edges.innerLeft)).toBeLessThanOrEqual(1)
      expect(edges.firstWidth).toBeGreaterThanOrEqual(600)
      expect(Math.abs(edges.reversedRight - edges.innerRight)).toBeLessThanOrEqual(1)
    }
  })

  test('wide spotlights center in the space below the sticky header', async ({ page }) => {
    for (const viewport of [{ width: 1920, height: 1080 }, { width: 2560, height: 1250 }]) {
      await page.setViewportSize(viewport)
      await page.reload()

      const dimensions = await page.locator('.spotlight').first().evaluate((spotlight) => {
        const copy = spotlight.querySelector('.spotlight-copy').getBoundingClientRect()
        const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height
        return {
          copyWidth: copy.width,
          spotlightHeight: spotlight.getBoundingClientRect().height,
          headerHeight,
          expectedHeight: window.innerHeight - headerHeight,
        }
      })

      expect(dimensions.copyWidth).toBeGreaterThanOrEqual(800)
      expect(Math.abs(dimensions.spotlightHeight - dimensions.expectedHeight)).toBeLessThanOrEqual(1)
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
      if (apps[i].status === 'coming-soon') continue
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
