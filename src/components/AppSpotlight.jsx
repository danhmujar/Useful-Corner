import { useEffect, useRef } from 'react'

export function AppSpotlight({ app, index }) {
  const spotlightRef = useRef(null)
  const isComingSoon = app.status === 'coming-soon'

  useEffect(() => {
    const spotlight = spotlightRef.current
    if (!spotlight) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let revealTimer

    const reveal = () => {
      spotlight.classList.remove('spotlight--pending', 'is-visible')
      void spotlight.offsetWidth
      spotlight.classList.add('is-visible')
    }
    const scheduleReveal = () => {
      if (revealTimer) return
      spotlight.classList.add('spotlight--pending')
      revealTimer = window.setTimeout(() => {
        revealTimer = undefined
        reveal()
      }, 250)
    }
    const hide = () => {
      if (revealTimer) {
        window.clearTimeout(revealTimer)
        revealTimer = undefined
      }
      spotlight.classList.remove('is-visible')
      spotlight.classList.add('spotlight--pending')
    }

    if (reducedMotion.matches) {
      spotlight.classList.remove('spotlight--pending')
      return undefined
    }
    if (!('IntersectionObserver' in window)) {
      revealTimer = window.setTimeout(reveal, 250)
      return () => window.clearTimeout(revealTimer)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) scheduleReveal()
      else hide()
    }, { threshold: 0.2 })
    observer.observe(spotlight)

    return () => {
      observer.disconnect()
      if (revealTimer) window.clearTimeout(revealTimer)
    }
  }, [])

  return <section id={app.id} ref={spotlightRef} className={`spotlight spotlight--pending spotlight--${app.accent}${isComingSoon ? ' spotlight--coming-soon' : ''} ${index % 2 ? 'spotlight--reverse' : ''}`} aria-labelledby={`${app.id}-title`}><div className="spotlight-inner"><div className={`app-frame${isComingSoon ? ' app-frame--coming-soon' : ''}`}><span className="frame-corner frame-corner--one" aria-hidden="true" /><span className="frame-corner frame-corner--two" aria-hidden="true" />{isComingSoon ? <div className="app-frame__teaser" aria-hidden="true"><span className="app-frame__teaser-question">?</span><span className="app-frame__teaser-line app-frame__teaser-line--one" /><span className="app-frame__teaser-line app-frame__teaser-line--two" /><span className="app-frame__teaser-line app-frame__teaser-line--three" /></div> : <><img className="app-frame__identity" src={app.icon} alt="" aria-hidden="true" /><iframe className="app-frame__preview" src={app.href} title={`${app.name} live preview`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></>}<span className="frame-label" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{isComingSoon && <span className="app-frame__coming-soon">Coming soon</span>}</div><div className="spotlight-copy"><p className="eyebrow">{app.eyebrow}</p><h2 id={`${app.id}-title`}>{app.headline}</h2><p className="description">{app.description}</p><ul className="benefits">{app.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>{isComingSoon ? <span className="app-button app-button--disabled" aria-disabled="true">Coming soon</span> : <a className="app-button" href={app.href} target="_blank" rel="noopener noreferrer">Open app <span aria-hidden="true">↗</span></a>}</div></div></section>
}
