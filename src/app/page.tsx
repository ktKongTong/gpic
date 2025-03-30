'use client'

import React, { useState } from "react";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {styles} from "@/api/services/styles";
import {states, useGenerate} from "@/hooks/use-generate";
import { toast } from "sonner";
import Header from "@/components/header";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import FileUploader from "@/components/file-uploader";
import Gallery from "@/components/gallery";
import FAQ from "@/components/FAQ";
import { Pencil } from "lucide-react";
import {useFiles} from "@/hooks/use-file-upload";

const formSchema = z.object({
  image: z.any(),
  styles: z.string(),
  refImage: z.any().optional(),
  prompt: z.string().optional(),
});

export default function DrawPage() {
  const [prompt, setPrompt] = useState('');
  const {files} = useFiles()
  const {generate, state, progress, url, save} = useGenerate()
  const [selectedStyle, setStyle] = useState<string|undefined>(undefined);
  const gen = async () => {
    if(state != states.NOT_START) {
      toast('在画了..在画了！')
      return
    }
    generate({
      files: files.filter(it => it.state === 'UPLOADED').map(it => it.url) as string[],
      style: selectedStyle,
      prompt: prompt,
    })
  }

  const toggleStyles = (id: string) => {
    const selected = styles.find(style => style.id === id)
    if(selected) {
      setStyle(selected.id)
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-ghibli-background bg-cover bg-fixed">
      <Header />

      <main className="flex-1 flex flex-col items-center p-4 md:p-8">
        {/* Section 1: Tool Area */}
        <section id="tools" className="w-full max-w-4xl mx-auto mb-20 scroll-mt-24">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Make Style Image
            </h1>
            <p className="text-lg text-white/90">
              Upload, enhance, and transform your images with powerful gpt-4o
            </p>
          </div>

          <div className="glass-container p-8 rounded-2xl backdrop-blur-md bg-card/40 shadow-xl">
            <FileUploader />
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="prompt" className="text-white mb-2 block">Enter your instructions</Label>
                <Input
                  id="prompt"
                  placeholder="Make this ghibili style..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-white/10 border-white/20 text-white focus:ring-0"
                />
              </div>
              {/*preset style prompt*/}
              <ul className={'flex w-full overflow-scroll flex-wrap gap-2 my-2 text-sm font-medium mx-2'}>
                {
                  styles.map(style => <li
                    key={style.id}
                    data-selected={selectedStyle === style.id}
                    className={'border data-[selected=true]:bg-black/40 border-border/40 rounded-full px-2 p-1 cursor-pointer'}
                    onClick={()=>toggleStyles(style.id)}>{style.name}</li>)
                }
              </ul>
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  className="bg-black/30 border-white/20 hover:bg-black/50 hover:border-white/30 text-white"
                  onClick={() => gen()}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Draw it ✍️
                </Button>
              </div>
              {
                url ? (
                  <div className={'w-64 h-64 mx-auto bg-black/20 rounded-lg relative'}>
                    {
                      state === states.DRAWING &&
                      <div
                        className={'absolute h-1 top-0 bg-white/80 rounded-lg left-0 transition-[width]'}
                        style={{width: `${progress}%`}}
                      >
                      </div>
                    }
                    <img className={'inset-0 rounded-lg'} src={url} />
                    <button
                      onClick={() => {save()}}
                      className={'absolute px-2 m-2 py-1 w-fit bottom-0 right-0 bg-black/30 rounded-full'}
                    >
                      保存
                    </button>
                  </div>
                ):(
                <>
                  {
                    state !== states.NOT_START &&
                    <div className={'w-64 h-64 mx-auto bg-black/20 rounded-lg relative'}>
                      <div
                        className={'absolute h-1 top-0 bg-white/80 rounded-lg left-0 transition-[width]'}
                        style={{width: `${progress}%`}}
                      >
                      </div>
                    </div>
                  }
                </>
                )
              }

            </div>
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

    </div>
  )
  // return <>
  //   <div className={cn(
  //     'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex flex-col items-center justify-center p-4'
  //   )}>
  //     <Glassmorphism className="min-h-96 w-80 p-4 flex items-center flex-col">
  //       <ImageUpload onImageSelect={setImageFile} image={image} />
  //
  //       <div className="w-full flex justify-between items-center">
  //         <ul className={'flex  basis-full break-keep overflow-scroll gap-2 my-2 text-sm font-medium mx-2'}>
  //           {
  //             styles.map(style => <li
  //               key={style.id}
  //               data-selected={selectedStyle === style.id}
  //               className={'border rounded-full px-2 p-1 data-[selected=true]:bg-black/40 cursor-pointer'}
  //               onClick={()=>toggleStyles(style.id)}>{style.name}</li>)
  //           }
  //         </ul>
  //         <Btn onClick={() => gen()} disabled={state != 'not-start'} className={'self-end w-24 break-keep'}/>
  //       </div>
  //       <div className="flex gap-2 m-2">
  //         <div className={'from-red-200 via-35% bg-gradient-to-br via-green-100 to-blue-50 rounded-lg w-72 aspect-square'}>
  //
  //         </div>
  //       </div>
  //       {
  //         state === 'success' &&
  //           <div className="flex gap-2 ">
  //               <img src={url} alt="" className={'rounded-lg'}/>
  //           </div>
  //       }
  //     </Glassmorphism>
  //     <div className={'flex items-center justify-center flex-col'}>
  //       {
  //         state === 'drawing' && <div className="flex gap-2">
  //           progress: {progress}
  //           </div>
  //       }
  //
  //     </div>
  //
  //   </div>
  // </>
}

const getStateText = (state: string) => {
  switch (state) {
    case 'not-start':
      return ''
    case 'generating':
      return '正在加急绘制中...'
    case 'done':
      return '生成完成'
  }
}

// const Btn = ({className, ...rest}: HTMLProps<HTMLButtonElement>) => {
//   return   <Button as={Fragment}>
//     {({ hover, active }) => (
//       // @ts-ignore
//       <button
//         className={cn(
//           "inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none",
//           'data-[focus]:outline-1 data-[focus]:outline-white backdrop-blur-2xl',
//           'rounded py-2 px-4 text-sm text-white',
//           'bg-black/20 backdrop-blur-lg rounded-xl border border-white/10',
//           !hover && !active && '',
//           hover && !active && 'bg-black/50 border-gray-600',
//           active && 'bg-black/70 border-gray-500',
//           className
//         )}
//         {...rest}
//       >
//         开画✍️
//       </button>
//     )}
//   </Button>
// }