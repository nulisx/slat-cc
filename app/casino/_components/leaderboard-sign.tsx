import Link from 'next/link'

export const LeaderboardSign: React.FC = () => {
  return (
    <div className="relative h-fit w-fit overflow-hidden">
      <div className="absolute left-0 top-2 z-10 h-[3px] w-full animate-pulse bg-linear-to-r from-white via-[#EDEDED] to-white drop-shadow-[0_0_3px_#FFFFFF] duration-700" />
      <div className="absolute left-0 top-4 z-10 h-[3px] w-full animate-pulse bg-linear-to-r from-white via-[#EDEDED] to-white drop-shadow-[0_0_3px_#FFFFFF] duration-700" />
      <div className="absolute bottom-2 left-0 z-10 h-[3px] w-full animate-pulse bg-linear-to-r from-white via-[#EDEDED] to-white drop-shadow-[0_0_3px_#FFFFFF] duration-700" />
      <div className="absolute bottom-4 left-0 z-10 h-[3px] w-full animate-pulse bg-linear-to-r from-white via-[#EDEDED] to-white drop-shadow-[0_0_3px_#FFFFFF] duration-700" />
      <Link
        href="/leaderboard"
        className="relative mx-auto flex w-fit items-center justify-center border-2 border-transparent bg-[#F712E9]/15 px-6 py-6 shadow-lg duration-200 hover:border-white"
      >
        <div className="relative z-10">
          <h2 className="font-press-start-2p text-[18px] uppercase text-[#F712E9] drop-shadow-[2px_2px_0px_#2E1A47]">
            Leaderboard
          </h2>
        </div>
      </Link>
    </div>
  )
}
