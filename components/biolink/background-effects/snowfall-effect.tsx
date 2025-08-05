import { FaRegSnowflake } from 'react-icons/fa'
import { IoIosSnow } from 'react-icons/io'
import { BsSnow, BsSnow2 } from 'react-icons/bs'
import { LiaSnowflake } from 'react-icons/lia'
import { WiSnowflakeCold } from 'react-icons/wi'
import { TiWeatherSnow } from 'react-icons/ti'
import { getEffectColor } from '@/lib/utils'
import { cn } from '@/lib/utils'

export const SnowfallEffect: React.FC<{
  className?: string
  hueDeg?: number
}> = ({ className, hueDeg = 0 }) => {
  const snowflakes = Array.from({ length: 50 })
  const icons = [FaRegSnowflake, IoIosSnow, BsSnow, LiaSnowflake, BsSnow2, WiSnowflakeCold, TiWeatherSnow]

  return (
    <div className={cn('fixed inset-0', className)}>
      {snowflakes.map((_, index) => {
        const Icon = icons[index % icons.length]
        return (
          <div key={index} className="falling-animation">
            <Icon
              size={30}
              style={{
                color: getEffectColor(hueDeg),
                filter: `hue-rotate(${hueDeg}deg)`,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
