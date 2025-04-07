'use client'
import React from 'react';
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import UserProfile from "@/components/sign";

const Header: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full py-4 px-4 md:px-8 lg:px-12 flex justify-between items-center glass-container animate-fade-in">
      <Link href="/" className="text-2xl font-bold">
        Gpic
      </Link>
      <nav className="hidden md:flex space-x-8">
        <Link href={'/task'} className={"text-white/80 hover:text-white transition-colors"}>
          Tasks
        </Link>
        <button
          onClick={() => scrollToSection('gallery')}
          className="text-white/80 hover:text-white transition-colors"
        >
          Gallery
        </button>
        <button
          onClick={() => scrollToSection('faq')}
          className="text-white/80 hover:text-white transition-colors"
        >
          FAQ
        </button>
      </nav>
      <UserProfile/>
      <div>
      </div>
    </header>
  );
};

export default Header;
