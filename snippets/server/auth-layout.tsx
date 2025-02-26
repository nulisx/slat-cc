import Image from "next/image";
import Link from "next/link";
import { TopLeftGradientOverlay } from "../(marketing)/_components/top-left-gradient-overlay";
import { Logo } from "@/components/ui/logo";
import { WEBSITE_NAV } from "@slat/utils";

// app/(website)/(auth)/layout.tsx

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid grid-cols-1 overflow-x-hidden lg:grid-cols-5">
      <TopLeftGradientOverlay />
      <div className="relative flex h-screen flex-col items-center justify-between p-4 lg:col-span-2 lg:items-start">
        <div />
        <div className="flex w-full flex-col items-center justify-center">
          <div className="w-full max-w-[350px] px-2">
            <div className="w-fit">
              <Logo className="h-24 w-fit" />
            </div>
            <div className="space-y-6">{children}</div>
          </div>
        </div>
        <div className="flex w-full flex-col-reverse items-center gap-4 text-xs opacity-50 md:flex-row md:justify-between">
          <div>Copyright © {new Date().getFullYear()}</div>
          <ul className="flex flex-row flex-wrap items-center gap-2">
            {WEBSITE_NAV.legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden p-4 pl-4 shadow-2xl lg:col-span-3 lg:flex">
        <div className="flex w-full items-end rounded-lg border bg-muted/40 pl-6">
          <Image
            src="/images/dashboard.png"
            width={1920}
            height={1080}
            alt="Auth"
            className="w-full rounded-tl-2xl border-l-[1px] border-t-[1px] object-cover shadow-[0px_0px_20px_rgba(0,0,0,0.5)]"
          />
        </div>
      </div>
    </div>
  );
}
