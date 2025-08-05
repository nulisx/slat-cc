'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function GameLoadingScreen({ name, hexColor }: { name: string; hexColor: string }) {
  const [loading, setLoading] = React.useState(true)
  const [showStart, setShowStart] = React.useState(false)
  const [randomMessage, setRandomMessage] = React.useState('')

  React.useEffect(() => {
    const loadingMessages = [
      'Leveling up your experience...',
      'Loading the fun... Get ready!',
      'Setting the stage...',
      'Gathering loot...',
      'Sharpening your skills...',
      'Rolling out the red carpet...',
      'Generating infinite possibilities...',
      'Loading pixels... Just a few more!',
      'The adventure begins shortly...',
      'Powering up...',
      'Summoning good vibes...',
      'Calibrating epicness...',
      'Drawing the map... Almost there!',
      'Your journey starts soon...',
      'Rolling out excitement...',
      'Synchronizing with the universe...',
      'Getting the game ready...',
      'Bringing the world to life...',
      'Loading the magic...',
      'Creating the ultimate experience...',
    ]
    const randomIndex = Math.floor(Math.random() * loadingMessages.length)
    setRandomMessage(loadingMessages[randomIndex])

    const timer = setTimeout(() => {
      setShowStart(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    if (!loading) return
    setLoading(false)
  }

  return (
    <div
      onClick={dismiss}
      className={cn(
        'fixed inset-0 flex min-h-screen w-full flex-col items-center justify-center text-foreground duration-300',
        loading ? 'z-50 bg-black/50 opacity-100 backdrop-blur-md' : 'pointer-events-none z-0 bg-black/50 opacity-0'
      )}
    >
      {loading && (
        <>
          {!showStart && (
            <>
              <motion.h1
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5 }}
                className="mb-1.5 font-press-start-2p text-base uppercase"
              >
                {name}
              </motion.h1>
              <motion.p
                className="mb-4 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {randomMessage}
              </motion.p>
              <motion.div
                className="relative mb-2 h-[5px] w-full max-w-xs bg-[#FFFFFF20]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  exit={{ width: '0%' }}
                  className="h-full"
                  style={{ backgroundColor: hexColor, filter: `drop-shadow(0 0 5px ${hexColor})` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.div>
            </>
          )}
          {showStart && (
            <motion.div
              onClick={dismiss}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 rounded px-4 py-2 font-press-start-2p uppercase text-foreground drop-shadow-[2px_2px_0px_#000]"
              style={{
                filter: `drop-shadow(0 0 5px white)`,
              }}
            >
              Press Anywhere to Start
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
