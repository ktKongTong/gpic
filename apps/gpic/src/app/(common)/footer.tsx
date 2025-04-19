'use client'
import React, {Suspense, useEffect, useRef, useState} from 'react';
import Link from "next/link";
import UserProfile from "@/components/sign";
import {cn} from "@/lib/utils";
import {User} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer
      className={cn(
        'grid grid-cols-3 items-center justify-center mx-auto w-full transition mt-5 top-0 z-20',
        "bg-white/5 border-t h-32 border-white/30 backdrop-blur-3xl"
      )}>
      <div className={'flex items-center gap-2 flex-col'}>
        <Link href={'/'} className={"text-3xl font-black"}>
          GPIC
        </Link>

      </div>
      <div className={'flex items-center gap-2 flex-col'}>
        <Link href={'/pricing'} className={""}>
          Pricing
        </Link>
        <Link href={'/#faq'} className={""}>
          FAQ
        </Link>
      </div>
      <div className={'flex items-center gap-2 flex-col'}>
        <Link href={'/tos'} className={""}>
          Term of Service
        </Link>
        <Link href={'/privacy'} className={""}>
          Privacy Policy
        </Link>
      </div>

    </footer>
  );
};

export default Footer;
