'use client'
import React from 'react';
import Link from "next/link";
import UserProfile from "@/components/sign";

const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full py-4 px-4 md:px-8 lg:px-12 flex justify-between items-center animate-fade-in">
      <Link href="/" className="text-2xl font-black">
        GPIC
      </Link>
      <div className={'hidden sm:flex items-center gap-4'}>
        <nav className="hidden md:flex gap-8 items-center">
          <Link href={'/'} className={"text-white/80 hover:text-white transition-colors"}>
            Home
          </Link>
          <Link href={'/task'} className={"text-white/80 hover:text-white transition-colors"}>
            Home
          </Link>
          <Link href={'/gallery'} className={"text-white/80 hover:text-white transition-colors"}>
            Gallery
          </Link>
          <Link href={'/about'} className={"text-white/80 hover:text-white transition-colors"}>
            About
          </Link>
        </nav>
        <UserProfile/>
        <div>
        </div>
      </div>

    </header>
  );
};

export default Header;
