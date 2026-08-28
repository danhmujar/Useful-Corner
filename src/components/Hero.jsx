import { useEffect, useRef } from 'react'

export function Hero() {
  const heroRef = useRef(null)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let revealTimer
    const show = () => {
      hero.classList.remove('is-visible')
      void hero.offsetWidth
      hero.classList.add('is-visible')
    }
    const reveal = () => {
      hero.classList.remove('hero--initial', 'hero--pending')
      show()
    }
    const scheduleReveal = () => {
      if (revealTimer) return
      hero.classList.remove('is-visible')
      hero.classList.add('hero--pending')
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
      hero.classList.remove('is-visible', 'hero--initial')
      hero.classList.remove('hero--pending')
    }
    if (reducedMotion.matches) {
      hero.classList.remove('hero--pending')
      return undefined
    }
    if (!('IntersectionObserver' in window)) {
      revealTimer = window.setTimeout(reveal, 250)
      return () => window.clearTimeout(revealTimer)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        scheduleReveal()
      } else {
        hide()
      }
    }, { threshold: 0.2 })
    observer.observe(hero)
    return () => {
      observer.disconnect()
      if (revealTimer) window.clearTimeout(revealTimer)
    }
  }, [])

  return <section id="top" className="hero hero--initial hero--pending" aria-labelledby="hero-title" ref={heroRef}><div className="hero-copy"><p className="kicker">A handy place for handy things</p><h1 id="hero-title">Three useful tools. One tidy corner.</h1><p className="hero-intro">Free up a PDF, find the number you need, or turn messy text into something polished. Pick a tool and get on with your day.</p><a className="text-link" href="#showcase">Meet the tools <span aria-hidden="true">↓</span></a></div><div className="hero-art" aria-hidden="true"><span className="hero-wedge" /><p>Useful<br />by design.</p></div></section>
}
