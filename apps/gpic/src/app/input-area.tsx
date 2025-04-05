import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import React, {useState} from "react";
import {useFiles} from "@/hooks/use-file-upload";
import {styles} from "@/app/styles";



const useGenImageForm = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyles, setStyle] = useState<string[]>([]);
  const {files} = useFiles()

  const toggleStyles = (id: string) => {
    const selected = styles.find(style => style.id === id)
    if(selected) {
      setStyle(s => s.filter(style => style !== id))
    }else {
      setStyle(s => [...s, id])
    }
  }
  const [batch, setBatch] = useState(false);

  const value = {
    files: files.filter(it => it.state === 'UPLOADED').map(it => it.url) as string[],
    style: selectedStyles,
    prompt: prompt,
    batch: batch,
  }

  return {
    value: value,
    toggleStyles,
    setPrompt,
    setBatch
  }
}



export const InputArea = () => {

  const {value, setPrompt, toggleStyles, setBatch} = useGenImageForm()

  return <>
    <div className={'relative border-white border p-2 rounded-lg'}>
      <textarea
        className={
          cn('w-full px-2 resize-none @[480px]/input:px-3 bg-transparent focus:outline-none text-primary align-bottom min-h-14 pt-5 my-0 mb-5')
        }
        placeholder={"Make this Ghibli style"}
      />
      <div className="flex items-center justify-end w-full gap-2">
        <div
          className={cn(
            'flex items-center justify-center gap-1 rounded-full p-2 px-3 m-2 border border-white/50',
            value.batch && 'bg-primary/30'
          )}
          onClick={() => {setBatch(b => !b)}}
        >
          <Label htmlFor={'batch'}>Batch</Label>
        </div>
        <Button
          variant="ghost"
          className=" hover:bg-black/40 hover:text-white rounded-full "
          onClick={() => {}}
        >
          <Pencil className="h-4 w-4" />Draw️ it
        </Button>
      </div>
    </div>

    </>

//   batch, style, check。

}