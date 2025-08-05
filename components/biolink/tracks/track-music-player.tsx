'use client'

import { Card } from '@/components/biolink/card'
import { SmallImage } from '@/components/biolink/small-image'
import { PlayPauseButton, SkipBackButton, SkipForwardButton } from '@/components/biolink/tracks/track-controls'
import { ProgressBar } from '@/components/biolink/tracks/track-progress-bar'
import type { MusicPlayerLayout } from '@/lib/data/biolink/constants'
import type { Biolink } from '@/lib/data/biolink/schemas'
import type { Track } from '@/lib/data/tracks/schemas'
import { useMusicPlayer, type MusicPlayer } from '@/lib/hooks/use-music-player'
import { isHexDark } from '@/lib/utils'
import { isNil } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaDeezer } from 'react-icons/fa'
import { match } from 'ts-pattern'

type Colors = {
  text: string
  name: string
  theme: string
}

type MusicPlayerProps = {
  card: Biolink['card']
  colors: Colors
  player: MusicPlayer
}

const getPlayerComponent = (layout: MusicPlayerLayout) => {
  return match(layout)
    .with('default', () => DefaultMusicPlayer)
    .with('compact', () => CompactMusicPlayer)
    .with('banner', () => BannerMusicPlayer)
    .with('stacked', () => StackedMusicPlayer)
    .with('vinyl', () => VinylMusicPlayer)
    .otherwise(() => DefaultMusicPlayer)
}

export function MusicPlayer({
  tracks,
  card,
  colors,
  layout,
}: {
  tracks: Track[]
  card: Biolink['card']
  colors: Colors
  layout: MusicPlayerLayout
}) {
  const player = useMusicPlayer(tracks)

  const PlayerComponent = getPlayerComponent(layout)

  return (
    <>
      {player.currentUrl && (
        <audio ref={player.audioRef} className="hidden" src={player.currentUrl} autoPlay={player.isPlaying} />
      )}
      <PlayerComponent colors={colors} player={player} card={card} />
    </>
  )
}

const DefaultMusicPlayer = ({ card, colors, player }: MusicPlayerProps) => {
  return (
    <Card
      card={card}
      className="relative flex w-full flex-col items-center gap-2 p-4 pt-8"
      style={{
        color: colors.text,
      }}
    >
      {player.currentTrack.deezerTrackId && (
        <Link
          href={`https://www.deezer.com/track/${player.currentTrack.deezerTrackId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4"
        >
          <FaDeezer />
        </Link>
      )}
      <SmallImage
        src={player.currentTrack.cover}
        alt={player.currentTrack.title}
        borderRadius={card.borderRadius}
        card={card}
        className="size-20"
      />
      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-1">
        <div className="overflow-hidden text-center">
          <div
            className="line-clamp-1 text-base font-semibold hover:underline"
            style={{
              color: colors.name,
            }}
          >
            {player.currentTrack.title}
          </div>
          <p className="line-clamp-1 text-sm">{player.currentTrack.artist}</p>
        </div>
        <ProgressBar
          themeColor={colors.theme}
          duration={player.currentTrack.deezerTrackId ? 29 : player.currentTrack.duration}
          progress={player.progress}
        />
        <div className="flex items-center justify-center gap-x-3">
          <SkipBackButton onClick={player.prevTrack} className="size-3.5" disabled={player.length === 1} />
          <PlayPauseButton
            onClick={player.toggleAudio}
            playing={player.isPlaying}
            className="size-[20px]"
            disabled={!player.currentUrl}
          />
          <SkipForwardButton onClick={player.nextTrack} className="size-3.5" disabled={player.length === 1} />
        </div>
      </div>
    </Card>
  )
}

const CompactMusicPlayer = ({ colors, card, player }: MusicPlayerProps) => {
  return (
    <Card
      card={card}
      className="relative flex w-full items-center gap-3 p-3"
      style={{
        color: colors.text,
      }}
    >
      <SmallImage
        src={player.currentTrack.cover}
        alt={player.currentTrack.title}
        borderRadius={card.borderRadius}
        card={card}
        className="size-20"
      />
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-1">
        <div className="w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <div
              className="line-clamp-1 text-base font-semibold hover:underline"
              style={{
                color: colors.name,
              }}
            >
              {player.currentTrack.title}
            </div>
            {player.currentTrack.deezerTrackId && <FaDeezer />}
          </div>
          <p className="line-clamp-1 text-sm">{player.currentTrack.artist}</p>
        </div>
        <div className="mt-1.5 flex w-full items-center justify-center gap-x-3">
          <ProgressBar
            themeColor={colors.theme}
            duration={player.currentTrack.deezerTrackId ? 29 : player.currentTrack.duration}
            progress={player.progress}
          />
          <div className="flex items-center justify-center gap-x-3">
            <SkipBackButton onClick={player.prevTrack} className="size-3" disabled={player.length === 1} />
            <PlayPauseButton
              onClick={player.toggleAudio}
              playing={player.isPlaying}
              className="size-[16px]"
              disabled={!player.currentUrl}
            />
            <SkipForwardButton onClick={player.nextTrack} className="size-3" disabled={player.length === 1} />
          </div>
        </div>
      </div>
    </Card>
  )
}

const BannerMusicPlayer = ({ card, player, colors }: MusicPlayerProps) => {
  return (
    <Card
      card={card}
      className="flex w-full flex-col items-center overflow-hidden p-0"
      style={{
        color: colors.text,
      }}
    >
      <div
        className="relative w-full bg-white/5 p-4"
        style={{
          backgroundColor: card.backgroundColor,
        }}
      >
        <div className="relative flex w-full items-end gap-4">
          <SmallImage
            src={player.currentTrack.cover}
            alt={player.currentTrack.title}
            card={card}
            borderRadius={card.borderRadius}
            className="size-20"
          />
          <div className="flex w-full flex-col items-start gap-3 overflow-hidden">
            <div className="w-full">
              <div className="flex items-center justify-between gap-2">
                <h5
                  className="line-clamp-1 text-base font-semibold hover:underline"
                  style={{
                    color: isHexDark(card.backgroundColor) ? '#fff' : '#000',
                  }}
                >
                  {player.currentTrack.title}
                </h5>
                {player.currentTrack.deezerTrackId && <FaDeezer className="shrink-0" />}
              </div>
              <p
                className="line-clamp-1 text-sm"
                style={{
                  color: isHexDark(card.backgroundColor) ? '#fff' : '#000',
                }}
              >
                {player.currentTrack.artist}
              </p>
            </div>
            <div className="flex items-center justify-center gap-x-4">
              <SkipBackButton onClick={player.prevTrack} className="size-3" disabled={player.length === 1} />
              <PlayPauseButton
                onClick={player.toggleAudio}
                playing={player.isPlaying}
                className="size-4"
                disabled={!player.currentUrl}
              />
              <SkipForwardButton onClick={player.nextTrack} className="size-3" disabled={player.length === 1} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4">
        <ProgressBar
          themeColor={colors.theme}
          duration={player.currentTrack.deezerTrackId ? 29 : player.currentTrack.duration}
          progress={player.progress}
          column
        />
      </div>
    </Card>
  )
}
const StackedMusicPlayer = ({ colors, card, player }: MusicPlayerProps) => {
  return (
    <Card
      card={card}
      className="mx-auto flex w-full flex-col items-center gap-3 p-4"
      style={{
        color: colors.text,
      }}
    >
      <div className="w-full text-center">
        <div
          className="line-clamp-1 text-base font-semibold hover:underline sm:text-lg"
          style={{
            color: colors.name,
          }}
        >
          {player.currentTrack.title}
        </div>
        <p className="line-clamp-1 text-sm sm:text-base">{player.currentTrack.artist}</p>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        <SkipBackButton onClick={player.prevTrack} className="size-4 md:size-5" disabled={player.length === 1} />
        <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-full md:size-24">
          <Image
            unoptimized
            src={player.currentTrack.cover}
            alt={player.currentTrack.title}
            width={100}
            height={100}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <PlayPauseButton
            onClick={player.toggleAudio}
            playing={player.isPlaying}
            className="relative size-3 md:size-5"
            disabled={!player.currentUrl}
          />
        </div>
        <SkipForwardButton onClick={player.nextTrack} className="size-4 md:size-5" disabled={player.length === 1} />
      </div>

      <ProgressBar
        hideDuration
        themeColor={colors.theme}
        duration={player.currentTrack.deezerTrackId ? 29 : player.currentTrack.duration}
        progress={player.progress}
      />
    </Card>
  )
}

const VinylMusicPlayer = ({ colors, card, player }: MusicPlayerProps) => {
  const [rotation, setRotation] = React.useState(0)
  const requestRef = React.useRef<number>()
  const lastTimeRef = React.useRef<number>()
  const isPlaying = player.isPlaying && player.currentUrl

  const animate = React.useCallback((time: number) => {
    if (!isNil(lastTimeRef.current)) {
      const delta = time - lastTimeRef.current
      const degreesPerMs = 360 / 3000 // 360 degrees every 3s
      setRotation((prev) => (prev + delta * degreesPerMs) % 360)
    }
    lastTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [])

  React.useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      lastTimeRef.current = undefined
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [animate, isPlaying])

  return (
    <Card
      card={card}
      className="flex w-full flex-col items-center justify-between gap-4 p-4 sm:flex-row sm:items-center sm:justify-start sm:gap-x-12 sm:p-6"
      style={{
        color: colors.text,
      }}
    >
      <div className="drop-shadow-[0px_0px_20px_rgba(0,0,0,0.25)]">
        <div
          className="relative flex size-36 items-center justify-center overflow-hidden rounded-full sm:size-40"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isPlaying ? 'none' : 'transform 0.3s ease',
          }}
        >
          <Image
            unoptimized
            src={player.currentTrack.cover}
            alt={player.currentTrack.title}
            width={100}
            height={100}
            className="relative z-10 size-24 rounded-full border border-[#111111] bg-[#000000] object-cover p-1 shadow-xl sm:size-28"
          />
          <Image
            unoptimized
            src="/images/vinyl.png"
            alt={player.currentTrack.title}
            width={100}
            height={100}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.5]"
          />
        </div>
      </div>
      <div className="flex w-full justify-between gap-4 sm:flex-col">
        <div>
          <div
            className="line-clamp-1 text-base font-semibold hover:underline sm:text-2xl"
            style={{
              color: colors.name,
            }}
          >
            {player.currentTrack.title}
          </div>
          <p className="line-clamp-1 text-sm sm:text-lg">{player.currentTrack.artist}</p>
        </div>
        <div className="flex items-center justify-end gap-x-3 pr-3 sm:justify-start">
          <SkipBackButton onClick={player.prevTrack} className="size-4 sm:size-5" disabled={player.length === 1} />
          <PlayPauseButton
            onClick={player.toggleAudio}
            playing={player.isPlaying}
            className="size-5 sm:size-8"
            disabled={!player.currentUrl}
          />
          <SkipForwardButton onClick={player.nextTrack} className="size-4 sm:size-5" disabled={player.length === 1} />
        </div>
      </div>
    </Card>
  )
}
