import { useEffect, useRef } from 'react'

const orbs = [
  { x: '6%', y: '13%', size: 320, color: 'pink', delay: '-5s' }, { x: '33%', y: '6%', size: 210, color: 'violet', delay: '-11s' }, { x: '72%', y: '18%', size: 390, color: 'lilac', delay: '-2s' }, { x: '84%', y: '58%', size: 270, color: 'pink', delay: '-14s' }, { x: '47%', y: '73%', size: 380, color: 'violet', delay: '-8s' }, { x: '7%', y: '77%', size: 240, color: 'lilac', delay: '-17s' }, { x: '26%', y: '44%', size: 180, color: 'pink', delay: '-9s' },
]

export function AmbientOrbField() {
  const orbRefs = useRef([])
  const cursorOrbRef = useRef(null)
  const pointer = useRef({ x: -1000, y: -1000 })
  const cursorPosition = useRef({ x: -1000, y: -1000 })
  const hasPointer = useRef(false)
  const offsets = useRef(orbs.map(() => ({ x: 0, y: 0 })))
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !window.matchMedia('(pointer: fine)').matches) return undefined
    let frameId
    const onPointerMove = (event) => {
      pointer.current = { x: event.clientX, y: event.clientY }
      hasPointer.current = true
    }
    const onPointerLeave = () => {
      pointer.current = { x: -1000, y: -1000 }
      hasPointer.current = false
    }
    const update = () => {
      const cursorOrb = cursorOrbRef.current
      if (cursorOrb) {
        const current = cursorPosition.current
        const targetX = hasPointer.current ? pointer.current.x : -1000
        const targetY = hasPointer.current ? pointer.current.y : -1000
        current.x += (targetX - current.x) * 0.12
        current.y += (targetY - current.y) * 0.12
        cursorOrb.style.opacity = hasPointer.current ? '1' : '0'
        cursorOrb.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
      }
      orbRefs.current.forEach((element, index) => {
        if (!element) return
        const rect = element.getBoundingClientRect()
        const current = offsets.current[index]
        const dx = rect.left + rect.width / 2 - current.x - pointer.current.x
        const dy = rect.top + rect.height / 2 - current.y - pointer.current.y
        const distance = Math.hypot(dx, dy)
        const strength = distance < 230 ? (1 - distance / 230) * 42 : 0
        const targetX = distance && strength ? (dx / distance) * strength : 0
        const targetY = distance && strength ? (dy / distance) * strength : 0
        current.x += (targetX - current.x) * 0.09
        current.y += (targetY - current.y) * 0.09
        element.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`
      })
      frameId = window.requestAnimationFrame(update)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('mouseleave', onPointerLeave)
    frameId = window.requestAnimationFrame(update)
    return () => { window.cancelAnimationFrame(frameId); window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('mouseleave', onPointerLeave) }
  }, [])
  return <><div className="orb-field" aria-hidden="true">{orbs.map((orb, index) => <div className="orb-shell" key={`${orb.x}-${orb.y}`} ref={(element) => { orbRefs.current[index] = element }} style={{ left: orb.x, top: orb.y, width: orb.size, height: orb.size }}><span className={`orb orb--${orb.color}`} style={{ animationDelay: orb.delay }} /></div>)}</div><span className="cursor-orb" ref={cursorOrbRef} aria-hidden="true" /></>
}
