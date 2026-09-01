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
    const brand = page.getByRole('link', { name: /The Tidy Corner/ })
    await expect(brand).toBeVisible()
    await expect(brand).toHaveAttribute('href', '#top')
    await expect(page).toHaveTitle(/The Tidy Corner/)
    await expect(page.locator('.footer-title')).toHaveText('The Tidy Corner')

    const nav = page.getByRole('navigation', { name: 'Jump to a tool' })
    await expect(nav).toBeVisible()

    const icons = page.locator('.icon-link')
    await expect(icons).toHaveCount(apps.length)

    for (let i = 0; i < apps.length; i++) {
      const link = icons.nth(i)
      await expect(link).toHaveAttribute('href', `#${apps[i].id}`)
      await expect(link).toHaveAttribute('aria-label', `Go to ${apps[i].name}`)
      await expect(link.locator('.tooltip')).toHaveText(apps[i].name)
      if (apps[i].status === 'coming-soon') {
        await expect(link.locator('.icon-link__coming-soon')).toHaveText('?')
        await expect(link.locator('img')).toHaveCount(0)
      } else {
        await expect(link.locator('img')).toHaveCount(1)
      }
    }

    const headerActions = page.locator('.header-actions')
    const navIndex = await headerActions.locator('nav').evaluate((el) => Array.from(el.parentElement.children).indexOf(el))
    const aboutIndex = await headerActions.locator('button').evaluate((el) => Array.from(el.parentElement.children).indexOf(el))
    expect(aboutIndex).toBeGreaterThan(navIndex)
  })

  test('local development loads header icon assets', async ({ page }) => {
    const brokenIcons = await page.locator('.icon-link img').evaluateAll((images) => images
      .filter((image) => image.naturalWidth === 0)
      .map((image) => image.currentSrc || image.src))
    expect(brokenIcons).toEqual([])
  })

  test('clicked and visible app icons expose the active state', async ({ page }) => {
    const icons = page.locator('.icon-link')
    const first = icons.nth(0)
    const second = icons.nth(1)

    await first.click()
    await expect(first).toHaveClass(/is-active/)
    await expect(first).toHaveAttribute('aria-current', 'location')

    await second.click()
    await expect(second).toHaveClass(/is-active/)
    await expect(second).toHaveAttribute('aria-current', 'location')
    await expect(first).not.toHaveClass(/is-active/)
    await expect(first).not.toHaveAttribute('aria-current', 'location')

    await page.locator('#formatter').evaluate((element) => element.scrollIntoView({ block: 'start' }))
    await expect(icons.nth(2)).toHaveAttribute('aria-current', 'location')
    await expect(second).not.toHaveClass(/is-active/)
  })

  test('app navigation keeps the selected spotlight below the sticky header', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 900 })

    await page.locator('.icon-link').first().click()
    await page.waitForTimeout(700)

    const positions = await page.locator('.spotlight').first().evaluate((spotlight) => ({
      sectionTop: spotlight.getBoundingClientRect().top,
      nextTop: spotlight.nextElementSibling.getBoundingClientRect().top,
      headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
    }))

    expect(positions.sectionTop).toBeGreaterThanOrEqual(positions.headerBottom - 1)
    expect(Math.abs(positions.sectionTop - positions.headerBottom)).toBeLessThanOrEqual(1)
    expect(positions.nextTop).toBeGreaterThanOrEqual(900)
  })

  test('direct app hash navigation restores the selected spotlight after render', async ({ page }) => {
    const directPage = await page.context().newPage()
    await directPage.setViewportSize({ width: 1920, height: 900 })
    await directPage.goto('/#unlocker')
    await directPage.waitForTimeout(700)

    const positions = await directPage.locator('#unlocker').evaluate((spotlight) => ({
      sectionTop: spotlight.getBoundingClientRect().top,
      heroBottom: document.querySelector('.hero').getBoundingClientRect().bottom,
      headerBottom: document.querySelector('.site-header').getBoundingClientRect().bottom,
    }))

    await directPage.close()

    expect(positions.sectionTop).toBeGreaterThanOrEqual(positions.headerBottom - 1)
    expect(Math.abs(positions.sectionTop - positions.headerBottom)).toBeLessThanOrEqual(1)
    expect(Math.abs(positions.heroBottom - positions.headerBottom)).toBeLessThanOrEqual(1)
  })

  test('formatter navigation brings the footer into the same viewport', async ({ page }) => {
    test.skip((await page.evaluate(() => window.innerWidth)) <= 320, 'Short mobile viewports use the readable-flow fallback')

    for (const viewport of [{ width: 1920, height: 900 }, { width: 2048, height: 1006 }]) {
      await page.setViewportSize(viewport)
      await page.goto('/')
      await page.locator('.icon-link').nth(2).click()
      await expect.poll(() => page.locator('#formatter').evaluate((spotlight) => {
        const header = document.querySelector('.site-header').getBoundingClientRect()
        return Math.abs(spotlight.getBoundingClientRect().top - header.bottom)
      }), { timeout: 3000 }).toBeLessThanOrEqual(1)

      const positions = await page.locator('#formatter').evaluate((spotlight) => {
        const header = document.querySelector('.site-header').getBoundingClientRect()
        const footer = document.querySelector('.site-footer').getBoundingClientRect()
        const section = spotlight.getBoundingClientRect()
        return {
          sectionTop: section.top,
          sectionBottom: section.bottom,
          headerBottom: header.bottom,
          footerTop: footer.top,
          footerBottom: footer.bottom,
          viewportBottom: window.innerHeight,
        }
      })

      expect(Math.abs(positions.sectionTop - positions.headerBottom)).toBeLessThanOrEqual(1)
      expect(positions.footerTop).toBeGreaterThanOrEqual(positions.sectionBottom - 1)
      expect(positions.footerTop).toBeLessThan(positions.viewportBottom)
      expect(positions.footerBottom).toBeGreaterThan(positions.footerTop)
    }
  })

  test('direct formatter hash navigation brings the footer into the same viewport', async ({ page }) => {
    const directPage = await page.context().newPage()
    await directPage.setViewportSize({ width: 1920, height: 900 })
    await directPage.goto('/#formatter')
    await expect.poll(() => directPage.locator('#formatter').evaluate((spotlight) => {
      const header = document.querySelector('.site-header').getBoundingClientRect()
      return Math.abs(spotlight.getBoundingClientRect().top - header.bottom)
    }), { timeout: 3000 }).toBeLessThanOrEqual(1)

    const positions = await directPage.locator('#formatter').evaluate((spotlight) => {
      const header = document.querySelector('.site-header').getBoundingClientRect()
      const footer = document.querySelector('.site-footer').getBoundingClientRect()
      const section = spotlight.getBoundingClientRect()
      return {
        sectionTop: section.top,
        headerBottom: header.bottom,
        footerTop: footer.top,
        viewportBottom: window.innerHeight,
      }
    })

    await directPage.close()

    expect(Math.abs(positions.sectionTop - positions.headerBottom)).toBeLessThanOrEqual(1)
    expect(positions.footerTop).toBeLessThan(positions.viewportBottom)
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
