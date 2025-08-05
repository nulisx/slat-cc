'use client'

import { paths } from '@/lib/constants/paths'
import type { Biolink } from '@/lib/data/biolink/schemas'
import { useAudioVisualizer } from '@/lib/hooks/use-audio-visualizer'
import { createPath } from '@/lib/utils'

const getShadowOpacity = (biolink: Biolink): number => {
  const { shadowOpacity } = biolink.card

  if (biolink.enhancements.visualizeAudio && shadowOpacity === 0) return 35
  return Math.max(shadowOpacity * (2 / 3), 0)
}

export function AudioSource({ source, biolink }: { source: string; biolink: Biolink }) {
  const audioRef = useAudioVisualizer({
    shadowColor: biolink.card.shadowColor,
    shadowOpacity: getShadowOpacity(biolink),
  })

  return (
    <audio
      ref={audioRef}
      src={createPath(paths.api.audioProxy, {
        url: encodeURIComponent(source),
      })}
      crossOrigin="anonymous"
      loop
    />
  )
}
