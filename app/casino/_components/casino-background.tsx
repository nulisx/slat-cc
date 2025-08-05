export function CasinoBackground({ hue = 0, brightness = 1 }: { hue?: number; brightness?: number }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 min-h-screen bg-linear-to-br from-[#0D0289] via-[#320079] to-[#23108b] font-quantico tracking-widest"
      style={{
        filter: `hue-rotate(${hue}deg) brightness(${brightness})`,
      }}
    >
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-1/4 h-[500px] w-[500px] bg-[#7A33FF] opacity-50 blur-[200px]"></div>
        <div className="absolute bottom-1/4 right-1/3 h-[400px] w-[400px] bg-[#ee33ff] opacity-20 blur-[150px]"></div>
      </div>
      {/* particles */}
      <div className="pointer-events-none absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute h-[3px] w-[3px] animate-pulse rounded-full bg-white opacity-30 blur-sm"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random()}s`,
            }}
          ></div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-[825px]">
        {/* left vertical lines */}
        <div className="absolute right-0 top-0 h-full w-[2px] bg-linear-to-b from-[#7A33FF]/5">
          <div className="absolute right-px top-0 h-full w-[2px] bg-linear-to-b from-[#7e3afc]/5"></div>
        </div>
        <div className="h-full w-[2px] bg-linear-to-t from-[#7A33FF]/5">
          <div className="absolute -left-px top-0 h-full w-[2px] bg-linear-to-t from-[#7e3afc]/5"></div>
        </div>
      </div>
      {/* right vertical lines */}
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-(--breakpoint-lg)">
        <div className="absolute left-0 top-0 h-full w-[2px] bg-linear-to-b from-[#7A33FF]/5">
          <div className="absolute right-px top-0 h-full w-[2px] bg-linear-to-b from-[#7e3afc]/5"></div>
        </div>
        <div className="absolute right-0 top-0 h-full w-[2px] bg-linear-to-t from-[#7A33FF]/5">
          <div className="absolute -left-px top-0 h-full w-[2px] bg-linear-to-t from-[#7e3afc]/5"></div>
        </div>
      </div>
      {/* top horizontal lines */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full pt-24">
        <div className="h-[2px] w-full bg-linear-to-r from-transparent via-[#7A33FF]/10 to-transparent"></div>
        <div className="hidden h-[2px] w-full bg-linear-to-r from-transparent via-[#FF33A6]/5 to-transparent"></div>
      </div>
    </div>
  )
}
