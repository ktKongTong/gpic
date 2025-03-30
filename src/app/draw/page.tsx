'use client'

import React, {Fragment, HTMLProps, useState} from "react";
import {ImageUpload} from "@/components/file-upload";
import { useFileUpload } from "@/hooks/use-file-upload";
import {Button} from "@headlessui/react";
import {cn} from "@/lib/utils";
import {z} from "zod";
import {Form} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import {styles} from "@/api/services/styles";
import {states, useGenerate} from "@/hooks/use-generate";
import { Glassmorphism } from "./style";
import { toast } from "sonner";

const formSchema = z.object({
  image: z.any(),
  styles: z.string(),
});

export default function DrawPage() {
  const {files, uploadFile} = useFileUpload();
  const {generate, state, progress, url} = useGenerate()
  const [image, setImageFile] = useState<File | null>(null);
  const gen = async () => {
    // if(state !=='not-start') {
    //   toast('别催啦别催啦，正在加急绘制中...')
    //   return
    // }
    // if(!image) {
    //   toast('开始之前，至少上传一张图片吧')
    //   return
    // }
    // files
    // generate(key, selectedStyle)
  }  
  const [selectedStyle, setStyle] = useState<string>('rick-and-morty');
  const toggleStyles = (id: string) => {
    const selected = styles.find(style => style.id === id)
    if(selected) {
      setStyle(selected.id)
    }
  }
  return <>
    <div className={cn(
      'min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex flex-col items-center justify-center p-4'
    )}>
    <Glassmorphism className="min-h-96 w-80 p-4 flex items-center flex-col">
         <ImageUpload onImageSelect={setImageFile} image={image} />
          <ul className={'flex flex-wrap gap-2 my-2 text-sm font-medium mx-2'}>
            {
              styles.map(style => <li
                key={style.id}
                data-selected={selectedStyle === style.id}
                className={'border rounded-full px-2 p-1 data-[selected=true]:bg-black/40 cursor-pointer'}
                onClick={()=>toggleStyles(style.id)}>{style.name}</li>)
            }
          </ul>
          <ul className="flex gap-2 relative overflow-invisiby m-2 ">
            {
              Array.from({length: 7}).map((_, index) => 
                <li className="" key={index}>
              <div className="h-16 aspect-9/16 bg-red-300/40 rounded-lg"></div>
            </li>
              )
            }
          </ul>
          <div className="w-full flex justify-between items-center">
            <div>{getStateText(state)}</div>
          <Btn onClick={() => gen()} disabled={ state != states.NOT_START } className={'self-end'}/>
          </div>

    </Glassmorphism>
      <div className={'flex items-center justify-center flex-col'}>
        
        {
          state === states.SUCCESS &&
          <div className="flex gap-2">
            <img src={url} alt=""/>
          </div>
        }
      </div>

    </div>
  </>
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

const Btn = ({className, ...rest}: HTMLProps<HTMLButtonElement>) => {
  return   <Button as={Fragment}>
  {({ hover, active }) => (
    // @ts-ignore
    <button
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none",
        'data-[focus]:outline-1 data-[focus]:outline-white backdrop-blur-2xl',
        'rounded py-2 px-4 text-sm text-white',
        'bg-black/20 backdrop-blur-lg rounded-xl border border-white/10',
        !hover && !active && '',
        hover && !active && 'bg-black/50 border-gray-600',
        active && 'bg-black/70 border-gray-500',
        className
      )}
      {...rest}
    >
      开画✍️
    </button>
  )}
</Button>
}