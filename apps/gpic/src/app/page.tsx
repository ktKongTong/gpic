import Form from "./form";
import Gallery from "@/components/gallery";
import FAQ from "@/components/FAQ";
import React from "react";
import localFont from 'next/font/local'
import {cn} from "@/lib/utils";
import { Sparkles } from "lucide-react";
import {FileCtxProvider} from "@/hooks/use-file-upload";

const beauty = localFont({
  src: './fonts/Pacifico-Regular.ttf',
  display: 'swap',
})

const handwrite = localFont({
  src: './fonts/FirstTimeWriting.woff2',
  display: 'swap',
})


export default function Page() {


  return <div className={' p-4 md:p-8 lg:p-12'}>
    <section className={'mb-8 grid md:grid-cols-5 gap-2 w-full items-center grow  justify-stretch'}>
      <div className={'grow flex flex-col items-center relative justify-center w-full h-full content-stretch md:col-span-3 self-stretch justify-items-stretch'}>
        <img src={'/pointer.png'} className={'hidden md:block absolute w-40 top-16 right-10'}/>
        <div className={cn(
          'absolute hidden md:block w-auto top-20 right-28 -rotate-30 text-xl font-bold',
          handwrite.className,
          )}>
          try it now
        </div>
        <div className={'text-5xl md:text-7xl italic'}>Make this into</div>
        <div className={cn(
          ' relative rounded-lg text-6xl py-12 transition-all px-8', beauty.className,
          'bg-gradient-to-r from-pink-200 via-indigo-200 to-blue-200 text-clip text-transparent bg-clip-text'
        )}>
          <div className={'absolute inset-0  rounded-full backdrop-blur-md'}></div>
          <span>ghibli</span>
          <span className={' transition-all'}>style</span>
        </div>
        <div className={'text-lg text-white inline-flex items-center'}>With Powerful AI Models<Sparkles className={'bg-gradient-to-r text-xs w-4 h-4 ml-2 '}/></div>
      </div>

      <div className={cn(
        'grow content-stretch md:col-span-2 self-stretch justify-items-stretch p-2',
        'glass-container p-4 rounded-2xl backdrop-blur-md bg-card/40 shadow-xl'
      )}>
        <FileCtxProvider>
          <Form/>
        </FileCtxProvider>

      </div>
    </section>
    <section id="gallery" className="w-full max-w-4xl mx-auto mb-20 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-8 ">
        Gallery
      </h2>
      <Gallery />
    </section>
    <section id="faq" className="w-full max-w-4xl mx-auto mb-20 scroll-mt-24">
      <h2 className="text-3xl font-bold mb-8">
        FAQ
      </h2>
      <div className="glass-container p-8 rounded-2xl backdrop-blur-md bg-card/40 shadow-xl">
        <FAQ />
      </div>
    </section>

  </div>
}