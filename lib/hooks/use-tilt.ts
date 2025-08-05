import * as React from 'react'

export const useTilt = (enabled = true) => {
  const [tiltStyle, setTiltStyle] = React.useState({ transform: 'rotateX(0deg) rotateY(0deg)' })
  const cardRef = React.useRef<HTMLDivElement | null>(null)
  const requestRef = React.useRef<number | null>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!cardRef.current || !enabled) return

    if (requestRef.current) cancelAnimationFrame(requestRef.current)

    requestRef.current = requestAnimationFrame(() => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()
      const cardWidth = rect.width
      const cardHeight = rect.height

      const centerX = rect.left + cardWidth / 2
      const centerY = rect.top + cardHeight / 2

      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      const rotateX = (mouseY / cardHeight) * -20
      const rotateY = (mouseX / cardWidth) * 20

      setTiltStyle({
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      })
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({ transform: 'rotateX(0deg) rotateY(0deg)' })
  }

  React.useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return { tiltStyle, cardRef, handleMouseMove, handleMouseLeave }
}
