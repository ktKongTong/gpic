import React from "react";
import Header from "@/components/header";
import Gallery from "@/components/gallery";
import FAQ from "@/components/FAQ";
import { ListTodo, LucideImage } from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import TaskView from "@/components/task/view";
import {Tool} from "@/app/tool";

export default function DrawPage() {

  return (

      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        <section id="tools" className="w-full max-w-4xl mx-auto mb-20 scroll-mt-24">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Make Style Image
            </h1>
            <p className="text-lg text-white/90">
              Upload, enhance, and transform your images with powerful gpt-4o
            </p>
          </div>
          <div className="glass-container p-8 rounded-2xl backdrop-blur-md bg-card/40 shadow-xl ">
            <Tool/>
          </div>
        </section>
        <section id="gallery" className="w-full max-w-4xl mx-auto mb-20 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Gallery
          </h2>
          <Gallery />
        </section>
        <section id="faq" className="w-full max-w-4xl mx-auto mb-20 scroll-mt-24">
          <h2 className="text-3xl font-bold mb-8">
            Frequently Asked Questions
          </h2>
          <div className="glass-container p-8 rounded-2xl backdrop-blur-md bg-card/40 shadow-xl">
            <FAQ />
          </div>
        </section>
      </main>
  )
}