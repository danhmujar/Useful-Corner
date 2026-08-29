import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('page has no detectable a11y violations and supports keyboard', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hero')).toHaveClass(/is-visible/, { timeout: 5000 })

    await page.waitForTimeout(1000)

    const accessibilityScanResults = await new AxeBuilder({ page })
      .exclude('.app-frame__preview')
      .analyze()
    expect(accessibilityScanResults.violations).toEqual([])

    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: 'Skip to the tools' })
    await expect(skipLink).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('#showcase')).toBeFocused()

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const aboutTrigger = page.locator('.about-tab--header')
    await aboutTrigger.focus()
    await expect(aboutTrigger).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
  })

  test('modal has correct semantics and focus management', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hero')).toHaveClass(/is-visible/, { timeout: 5000 })
    await page.locator('.about-tab--header').click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toHaveAttribute('aria-labelledby', 'about-heading')
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(page.getByRole('heading', { name: 'Useful things, kept tidy.' })).toBeVisible()

    const results = await new AxeBuilder({ page })
      .include('.about-overlay')
      .disableRules(['color-contrast'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test('core text contrast meets AA (computed)', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hero')).toHaveClass(/is-visible/, { timeout: 5000 })
    const contrasts = await page.evaluate(() => {
      const parse = (c) => {
        if (c.startsWith('#')) {
          const hex = c.slice(1)
          const value = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex
          return value.match(/../g).map((part) => Number.parseInt(part, 16))
        }
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
        if (!m) throw new Error(`Unsupported color format: ${c}`)
        return [Number(m[1]), Number(m[2]), Number(m[3])]
      }
      const luminance = ([r, g, b]) => {
        const toLinear = (v) => {
          const s = v / 255
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
        }
        const [R, G, B] = [r, g, b].map(toLinear)
        return 0.2126 * R + 0.7152 * G + 0.0722 * B
      }
      const contrast = (fg, bg) => {
        const L1 = luminance(parse(fg))
        const L2 = luminance(parse(bg))
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
      }
      const bg = 'rgb(255, 255, 255)'
      return {
        aubergine: contrast(getComputedStyle(document.documentElement).getPropertyValue('--aubergine').trim() || '#48086f', bg),
        purple: contrast('#7f35b2', bg),
        magenta: contrast('#d124b8', bg),
        secondary: contrast('#525255', bg),
      }
    })
    expect(contrasts.aubergine).toBeGreaterThanOrEqual(7)
    expect(contrasts.purple).toBeGreaterThanOrEqual(4.5)
    expect(contrasts.magenta).toBeGreaterThanOrEqual(4.5)
    expect(contrasts.secondary).toBeGreaterThanOrEqual(4.5)
  })

  test('About modal text contrast meets AA over its translucent surface', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hero')).toHaveClass(/is-visible/, { timeout: 5000 })
    await page.locator('.about-tab--header').click()

    const contrastResults = await page.evaluate(() => {
      const parse = (value) => {
        const rgba = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
        if (rgba) return { r: Number(rgba[1]), g: Number(rgba[2]), b: Number(rgba[3]), a: rgba[4] === undefined ? 1 : Number(rgba[4]) }
        const hex = value.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1]
        if (!hex) throw new Error('Unsupported color format: ' + value)
        const expanded = hex.length === 3 ? hex.split('').map((part) => part + part).join('') : hex
        return { r: Number.parseInt(expanded.slice(0, 2), 16), g: Number.parseInt(expanded.slice(2, 4), 16), b: Number.parseInt(expanded.slice(4, 6), 16), a: 1 }
      }
      const composite = (foreground, background) => ({
        r: foreground.r * foreground.a + background.r * (1 - foreground.a),
        g: foreground.g * foreground.a + background.g * (1 - foreground.a),
        b: foreground.b * foreground.a + background.b * (1 - foreground.a),
        a: 1,
      })
      const luminance = ({ r, g, b }) => {
        const linear = (channel) => {
          const value = channel / 255
          return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
        }
        return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
      }
      const contrast = (foreground, background) => {
        const foregroundL = luminance(foreground)
        const backgroundL = luminance(background)
        return (Math.max(foregroundL, backgroundL) + 0.05) / (Math.min(foregroundL, backgroundL) + 0.05)
      }

      const overlay = parse(getComputedStyle(document.querySelector('.about-overlay')).backgroundColor)
      const pageBackground = parse(getComputedStyle(document.body).backgroundColor)
      const dialog = document.querySelector('.about-dialog')
      const dialogBackground = composite(parse(getComputedStyle(dialog).backgroundColor), composite(overlay, pageBackground))
      const selectors = [
        '.about-dialog__eyebrow', '.about-dialog h2', '.about-dialog__intro',
        '.about-dialog h3', '.about-dialog li', '.about-dialog__credit strong',
        '.about-dialog__credit p', '.about-dialog__credit a',
      ]
      return selectors.map((selector) => {
        const element = document.querySelector(selector)
        return { selector, ratio: contrast(parse(getComputedStyle(element).color), dialogBackground) }
      })
    })

    for (const result of contrastResults) {
      expect(result.ratio, result.selector + ' contrast').toBeGreaterThanOrEqual(4.5)
    }
  })
})
