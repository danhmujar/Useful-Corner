import { useEffect, useState } from 'react'
import { AboutCorner } from './AboutCorner'

export function Header({ apps }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const targets = ['top', ...apps.map((app) => app.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    if (!targets.length || !('IntersectionObserver' in window)) return undefined

    const visibility = new Map()
    const updateActive = () => {
      const visible = targets
        .filter((target) => visibility.get(target.id)?.isIntersecting)
        .sort((a, b) => {
          const ratioDelta = (visibility.get(b.id)?.intersectionRatio ?? 0) - (visibility.get(a.id)?.intersectionRatio ?? 0)
          if (ratioDelta) return ratioDelta
          return Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top)
        })[0]
      const nextId = visible?.id === 'top' ? '' : visible?.id ?? ''
      setActiveId((current) => current === nextId ? current : nextId)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibility.set(entry.target.id, entry))
      updateActive()
    }, { rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-height').trim()} 0px -55% 0px`, threshold: [0, 0.1, 0.5, 1] })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [apps])

  return <header className="site-header"><a className="brand" href="#top" aria-label="The Useful Corner — back to top"><span className="brand-mark" aria-hidden="true" /><span>The Useful Corner</span></a><div className="header-actions"><nav aria-label="Jump to a tool"><ul className="icon-nav">{apps.map((app) => { const isActive = activeId === app.id; const isComingSoon = app.status === 'coming-soon'; return <li key={app.id}><a className={`icon-link${isActive ? ' is-active' : ''}`} href={`#${app.id}`} aria-label={`Go to ${app.name}`} aria-current={isActive ? 'location' : undefined} onClick={() => setActiveId(app.id)}>{isComingSoon ? <span className="icon-link__coming-soon" aria-hidden="true">?</span> : <img src={app.icon} alt="" />}<span className="tooltip" aria-hidden="true">{app.name}</span></a></li> })}</ul></nav><AboutCorner /></div></header>
}
