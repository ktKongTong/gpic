
import Form from "./form";
import Balance from "@/app/balance";
import Gallery from "@/components/gallery";
import FAQ from "@/components/FAQ";
import React from "react";

export default function Page() {


  return <div className={' p-4 md:p-8 lg:p-12'}>
    <section className={'mb-8 grid md:grid-cols-3 md:grid-rows-4 gap-2 w-full items-center grow  justify-stretch'}>
      <div className={'grow content-stretch md:col-span-2 md:row-span-full self-stretch justify-items-stretch'}>
        <Form/>
      </div>

      <div className={'hidden md:block grow md:col-span-1 row-span-2 self-stretch'}>
        <Balance />
      </div>
      <div className={'hidden md:block grow md:col-span-1 row-span-2 self-stretch'}>
        {/*price*/}
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