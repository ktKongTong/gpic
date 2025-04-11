'use client'
import React, {useEffect, useRef, useState} from 'react';
import Link from "next/link";
import UserProfile from "@/components/sign";
import {cn} from "@/lib/utils";
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
      'flex mx-auto w-full transition mt-1 sticky top-0 ',
      isSticky && "bg-white/20 glass-container backdrop-blur-3xl"
    )}>
    <div
            className={
      cn(
        "max-w-4xl mx-auto z-50 w-full py-4 px-4 md:px-8 lg:px-12 flex justify-between items-center",
      )
            }>
      <div className="select-none cursor-default text-2xl font-black">
        GPIC
      </div>
      <div className={'flex items-center gap-4'}>
        <nav className="flex gap-8 items-center">
          <Link href={'/'} className={"transition-colors"}>
            Home
          </Link>
          <Link href={'/task'} className={"transition-colors"}>
            Task
          </Link>
        </nav>
        <UserProfile/>
        <div>
        </div>
      </div>

    </div>
    </header>
  );
};

export default Header;
