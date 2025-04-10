import {cn} from "@/lib/utils";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Dice1, Dices, Plus, X} from "lucide-react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {friendlyWords} from "friendlier-words";
import {FileCtxProvider, useFiles} from "@/hooks/use-file-upload";
import {useRef, useState} from "react";
import {ImagePreview, useFileUploader} from "@/app/v2/upload";
import {Switch} from "@/components/ui/switch";
import {useStyles} from "@/hooks/use-styles";
import { Textarea } from "@/components/ui/textarea";
import {zodResolver} from "@hookform/resolvers/zod";

const randomName = () => friendlyWords(2, ' ')

type PresetStyle = {
  id: string,
  friendlyStyleId: string,
  version: number,
  i18n: string,
  name: string,
  aliases: string[],
  examples: string[],
  prompt: string,
  reference: string[],
}

// one time style

type CustomStyle = {
  id: string,
  name?: string,
  prompt: string,
  // imageUrls
  reference: string[],
  save?: boolean
}

type Style = {
  type: 'preset',
  style: PresetStyle,
}|{
  type: 'local',
  style: CustomStyle
}

type StyleProps = {
  styleInfo: Style,
}
  &
  React.ComponentProps<'div'>

export default function Style({styleInfo,className, ...rest}: StyleProps) {
  const {removeLocalStyle} = useStyles()
  return <div className={cn(
    'border border-white/30',
    'data-[selected=true]:bg-accent',
    'inline-flex gap-1 select-none  cursor-default items-center px-2 py-0.5 rounded-full  backdrop-blur-xs',
    className
  )} {...rest}>
    <span>{styleInfo.style.name}</span>
    {
      styleInfo.type !== 'preset' && <X className={'w-4 h-4'} onClick={() => {removeLocalStyle(styleInfo.style.id)}}/>
    }
  </div>
}

const localStyleFormSchema = z.object({
  name: z.string().min(1, {
    message: 'name it please🥺'
  }),
  prompt: z.string().min(1, {
    message: "👋还没写 prompt 呢"
  }),
  reference: z.string().array().default([]),
  save: z.coerce.boolean().default(false),
})

export function StyleForm() {
  return <FileCtxProvider><StyleFormInternal/></FileCtxProvider>
}

function StyleFormInternal() {
  const {addLocalStyle} = useStyles()
  const { files, removeAll } = useFiles()

  const form = useForm<z.infer<typeof localStyleFormSchema>>({
    resolver: zodResolver(localStyleFormSchema),
    defaultValues: {
      name: randomName(),
      prompt: '',
      reference: [],
      save: false,
    },
    mode: 'onSubmit'
  })
  const onSubmit = () => {
    const {name, prompt} = form.getValues()
    const references = files.filter(it => it.state === 'UPLOADED').map(it=>it.url!)
    addLocalStyle(name, references, prompt)
    removeAll()
    form.reset()
  }
  const {fileInputRef, handleFileInput, triggerFileInput, handleDrop, handleDragLeave, handleDragOver, isDragging } = useFileUploader()
  const [open, setOpen] = useState(false)
  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger><Plus/></PopoverTrigger>
    <PopoverContent className={'backdrop-blur-sm border-border'}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col gap-4 items-start justify-end *:w-full'}>
        <Form  {...form}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <div className={'relative'}>
                    <Input placeholder="name this style" {...field}/>
                    <Button type={'button'} onClick={() => form.setValue('name', randomName())} className={'absolute right-0 top-0'} variant={'ghost'} size={'icon'} ><Dices/></Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Textarea className={'resize-none'} {...field}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={'reference'}
            render={({ field}) => <>
              <FormItem>
                <FormLabel>参考图片</FormLabel>
                <FormControl>
                  <div className={'flex items-center gap-2'}>
                    <div className={'flex flex-wrap gap-2 justify-center items-center p-2'}>
                      {files.map((file) => (
                          <div className=" overflow-hidden" key={file.id}>
                            <ImagePreview file={file}/>
                          </div>
                        ))}
                      <div
                        className={'w-20 h-20 flex items-center justify-center rounded-lg backdrop-blur-sm '}
                        onClick={triggerFileInput}
                      >
                        <Plus/>
                      </div>
                      <input type='file' multiple={true} className={'hidden'} onChange={handleFileInput} accept="image/*" ref={fileInputRef}/>
                    </div>
                  </div>

                </FormControl>
                <FormMessage />
              </FormItem>
            </>}
          />

          <Button>Submit</Button>
        </Form>

      </form>
    </PopoverContent>
  </Popover>
}