import {StyleInfo} from "@repo/service/shared";
import {useStyle } from "@/hooks/use-styles";
import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Image from "next/image";
export default function Style({styleInfo}:{
  styleInfo: StyleInfo,
}) {
  const {style} = useStyle(styleInfo)
return <Popover>
  <PopoverTrigger asChild>
  <div className={'rounded-full m-1 text-xs px-2 py-0.5  bg-black/40 absolute right-0 bottom-0 '}>
    {style.style.name}
  </div>
  </PopoverTrigger>
  <PopoverContent>
    <div className={'text-xs'}>{style.style.name}</div>
    {style?.style?.reference?.length > 0 && <div className={'text-xs'}>reference img</div>}
    <div className={'flex items-center gap-2 flex-wrap'}>{
      style?.style?.reference?.map(it => (
        <Image src={it} alt={"Refrence Image"} width={64} height={64} className={'size-16 rounded-lg object-cover'}/>
      ))
    }</div>
  </PopoverContent>
</Popover>
}