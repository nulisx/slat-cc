import { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: number
}

export function BetAmountInput({ value, placeholder, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      <label className="block w-full pb-1.5 text-left text-[7px] text-white">Bet Amount</label>
      <input
        type="number"
        min="1"
        value={value}
        onChange={props.onChange}
        className={cn(
          'h-10 w-full rounded-md border border-white/5 bg-white/5 px-2 text-foreground shadow-lg',
          props.disabled && 'opacity-50',
          className
        )}
        placeholder={placeholder || 'Enter bet amount'}
        disabled={props.disabled}
      />
    </div>
  )
}
