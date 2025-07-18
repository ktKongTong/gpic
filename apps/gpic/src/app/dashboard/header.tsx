'use client'
import React, {Suspense, useEffect, useRef, useState} from 'react';
import Link from "next/link";
import UserProfile from "@/components/sign";
import {cn} from "@/lib/utils";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {User} from "lucide-react";
function useSticky() {
  const ref = useRef<HTMLDivElement>(null)

  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    if (!ref.current) {
      return
    }

    const observer = new IntersectionObserver(
      ([event]) => setIsSticky(event.intersectionRatio < 1),
      {threshold: [1], rootMargin: '-1px 0px 0px 0px',}
    )
    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return {ref, isSticky}
}
const Header: React.FC = () => {
  const {ref:stickyRef, isSticky} = useSticky()
  return (
    <header
      ref={stickyRef}
      className={cn(
        'flex mx-auto w-full transition mt-0 sticky top-0 border-b border-white/30 z-20',
        "bg-white/5 border-b border-white/30 backdrop-blur-3xl"
      )}>
      <div
        className={
          cn(
            "mx-auto z-50 w-full py-4 px-4 md:px-8 lg:px-12 flex justify-between items-center",
          )
        }>
          <SidebarTrigger/>
        <div className={'flex items-center gap-4'}>
          <nav className="flex gap-4 items-center">
            <Link href={'/'} className={"transition-colors"}>
              Home
            </Link>
            <Link href={'/dashboard/task'} className={"transition-colors"}>
              Dashboard
            </Link>
            <Link href={'/pricing'} className={"transition-colors"}>
              Pricing
            </Link>
          </nav>
          <Suspense fallback={<>
            <div className={'inline-flex justify-center items-center gap-2 w-8 h-8 bg-gray-400/40 rounded-full'}>
              <User className={'size-6'}/>
            </div>
          </>}>
            <UserProfile/>
          </Suspense>
          <div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
