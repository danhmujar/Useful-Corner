import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function AboutCorner() {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const closeRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const shell = document.querySelector('.site-shell')
    const hadInert = shell?.hasAttribute('inert')
    if (shell) {
      shell.setAttribute('inert', '')
      shell.inert = true
    }
    const timer = window.setTimeout(() => closeRef.current?.focus(), 50)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { setOpen(false); window.setTimeout(() => triggerRef.current?.focus(), 0) }
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('button, a[href]')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      if (shell && !hadInert) {
        shell.removeAttribute('inert')
        shell.inert = false
      }
    }
  }, [open])

  const close = () => { setOpen(false); window.setTimeout(() => triggerRef.current?.focus(), 0) }

  const dialog = <div className={`about-overlay${open ? ' is-open' : ''}`} role="dialog" aria-modal="true" aria-labelledby="about-heading" aria-hidden={!open} onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
      <div ref={dialogRef} className="about-dialog">
        <button ref={closeRef} className="about-dialog__close" type="button" aria-label="Close about dialog" onClick={close}>×</button>
        <p className="about-dialog__eyebrow">A personal collection</p>
        <h2 id="about-heading">Useful things, kept tidy.</h2>
        <p className="about-dialog__intro">Three independent browser tools for the fiddly jobs that interrupt a good day.</p>
        <div className="about-dialog__grid">
          <div><h3>In the corner</h3><ul><li>PDF Unlocker</li><li>Percentage Calculator</li><li>Text &amp; Markdown Formatter</li></ul></div>
          <div><h3>Tech stack</h3><ul><li>React + Vite</li><li>Responsive CSS</li><li>Lazy-loaded live previews</li><li>Static client-side hosting</li></ul></div>
          <div><h3>Privacy &amp; architecture</h3><ul><li>100% client-side tools</li><li>Files stay on your device</li><li>No account or cloud upload</li><li>Independent deployments</li></ul></div>
          <div><h3>Features</h3><ul><li>Live app previews</li><li>Responsive layouts</li><li>Keyboard-friendly controls</li><li>Thoughtful motion and focus states</li></ul></div>
          <div><h3>Limitations</h3><ul><li>Each tool has its own feature scope</li><li>No shared account or cloud sync</li><li>External tools may change independently</li></ul></div>
        </div>
        <div className="about-dialog__credit"><strong>Built by Danh Michael Mujar</strong><p>Analyst at WTW who believes every fiddly task deserves a shortcut. Powered by curiosity, caffeine, and Generative AI.</p><a href="https://www.linkedin.com/in/danhmujar" target="_blank" rel="noopener noreferrer">Connect on LinkedIn <span aria-hidden="true">→</span></a></div>
      </div>
    </div>
  return <><button ref={triggerRef} className="about-tab about-tab--header" type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>About</button>{createPortal(dialog, document.body)}</>
}

