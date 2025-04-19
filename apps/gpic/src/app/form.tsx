'use client'
import {useTrans} from "@/i18n";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import {Coins, Ellipsis, Layers, Menu, Minus, Pencil, Plus} from "lucide-react";
import {cn} from "@/lib/utils";
import {Label} from "@/components/ui/label";
import React, {use, useEffect, useState} from "react";
import {useStyles} from "@/hooks/use-styles";
import Style, {StyleForm} from "./style";
import {useFiles} from "@/hooks/use-file-upload";
import {useForm} from "react-hook-form";
import {z} from "zod";
import FileUploader from "./upload";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "@tanstack/react-query";
import {mutationKeys, queryClient, queryKeys, TaskCreateV2} from "@/lib/query";
import {useBalance} from "@/hooks/use-balance";
import {toast} from "sonner";
import { PendableButton } from "@/components/pendable-button";

type Size = 'auto' | '1x1' | '3x2' | '2x3'
// local style id
const formSchema = z.object({
  size: z.enum(['1x1', '3x2', '2x3', 'auto']).optional().default('auto'),
  count: z.coerce.number().min(1).optional().default(1),
  batch: z.boolean().default(false),
})

const useTaskForm = () => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: 'auto',
      count: 1,
      batch: false,
    }
  })
  const {styles, isLoading: isStyleLoading, selectedStyleIds, toggleStyle} = useStyles()
  const checkStyleSelected = (id: string) => {
    console.log("selectedStyleIds", selectedStyleIds)
    return selectedStyleIds.includes(id)
  }
  const {mutate: generateTask } = useMutation<unknown, unknown,TaskCreateV2>({
    mutationKey: mutationKeys.task.generate,
    onMutate: (variables) => {
      setSubmitting(true)
    },
    onSettled: () => {
      setSubmitting(false)
    }
  })

  const value = form.watch()
  const { count, batch } = value
  const setSize = (size: Size) => {
    form.setValue('size', size)
  }
  const toggleBatch = () => {
    if(selectedStyleIds.length > 1 && batch) {
      toast.error('multi-style must be batch mode')
    }else {

      form.setValue('batch', !batch)
    }
  }

  useEffect(() => {
    if(selectedStyleIds.length > 1 && !batch) {
      form.setValue('batch', true)
    }
  }, [selectedStyleIds])

  const addCount = () => {
    if(count < 10) {
      form.setValue('count', count+1)
    }
  }
  const minusCount = () => {
    if(count > 1) {
      form.setValue('count', count-1)
    }
  }
  const {files} = useFiles()
  const [submitting, setSubmitting] = useState(false)
  const onSubmit = () => {
    if(submitting) return
    setSubmitting(true)
    const {count, batch, size} = form.getValues()
    form.reset()
    const inputFiles = files.filter(it => it.state === 'UPLOADED')
      .map(it => it.url) as string[]
    const inputStyles = styles
      .filter(it => selectedStyleIds.includes(it.style.id))
      .map(it => {
        if(it.type === 'preset') {
          return {styleId: it.style.id}
        }
        return { prompt: it.style.prompt, reference: it.style.reference }
      })
    generateTask({
      files: inputFiles,
      styles: inputStyles,
      count,
      size,
      batch,
    })
    setSubmitting(false)
  }

  const creditNeed = count * files.length * selectedStyleIds.length * 5


  return {
    submitting,
    value,
    creditNeed,
    toggleBatch,
    addCount,
    minusCount,
    checkStyleSelected,
    styles,
    isStyleLoading,
    selectedStyleIds,
    toggleStyle,
    onSubmit,
    setSize
  }
}

export default function Form() {

  const {balance, isLoading} = useBalance()
  const {
    submitting,
    creditNeed,
    value,
    toggleBatch,
    addCount,
    minusCount,
    checkStyleSelected,
    styles,
    isStyleLoading,
    toggleStyle,
    onSubmit,
    setSize
  } = useTaskForm()
  const {t} = useTrans()

  return (<div className={'h-full flex flex-col gap-4'}>
<div className={'flex w-full flex-col'}>
  <div className={'flex w-full justify-between'}>
    <span className={' font-semibold text-2xl'}>{t('pages.home.label.upload')}</span>
    <div className={'inline-flex items-center gap-2 bg-black/30 rounded-full px-2'}>
      <Coins /> {balance}
    </div>
  </div>
  <div className={cn(
    'text-sm self-end', (balance >= creditNeed) && 'invisible'
  )}>
    😵‍💫no enough credit, need {creditNeed}
  </div>
</div>

    <FileUploader/>
    <div className={'font-semibold text-2xl'}>
      {t('pages.home.label.style')}
    </div>
    <ul className={'flex flex-wrap justify-start items-center gap-3'}>
      {
        isStyleLoading && Array.from({length: 3}).map((item, i) => <StyleSkeleton key={i}/>)
      }
      {
        !isStyleLoading && styles.map(style => <Style
          styleInfo={style}
          data-selected={checkStyleSelected(style.style.id)}
          onClick={() => {toggleStyle(style.style.id)}}
          key={style.style.id}
        />)
      }
      <StyleForm/>
    </ul>
    <div className={'font-semibold text-2xl'}>
      {t('pages.home.label.size')}
    </div>
    <div className={'flex gap-2 items-center '}>
      <RatioOption size={value.size} onChange={setSize}/>
    </div>
    <div className={'mt-auto w-full flex justify-end'}>

      <div className="flex items-center justify-end w-full gap-2">
        {
          value.batch && <div className="flex items-center gap-2">
                <Button
                    variant={'secondary'} size={'icon'} disabled={value.count < 2} onClick={() => minusCount()}><Minus/></Button>
                <span>{value.count}</span>
                <Button
                    variant={'secondary'} size={'icon'} disabled={value.count > 9} onClick={() => addCount()}><Plus/></Button>
            </div>
        }
        <Button
          variant={'secondary'}
          className={cn(
            'inline-flex items-center justify-center gap-1 rounded-full p-2 px-3 border border-white/30',
            'data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground',
            'bg-white/5 backdrop-blur-md border border-white/20',
            )}
            
          data-selected={value.batch}
          onClick={() => toggleBatch()}
        >
          <Layers className={'w-4 h-4'}/>
          <Label htmlFor={'batch'} className={'hidden md:inline'}>{t('pages.home.button.batch')}</Label>
        </Button>
        <PendableButton
          pending={submitting}
          variant='default'
          className=" inline-flex border border-white/30 backdrop-blur-xl items-center justify-center gap-1 rounded-full p-2"
          onClick={() => onSubmit()}
        >
          {
            !submitting ?
              <>
                  <Pencil className="h-4 w-4" /><span className={'hidden md:inline'}>{t('pages.home.button.draw')}</span>
              </>: <Ellipsis className="h-4 w-4"/>

          }
        </PendableButton>
      </div>
    </div>
  </div>)


}
function StyleSkeleton() {
  return <Skeleton className={'w-14 h-6 rounded-full backdrop-blur-xs bg-lime-50/40'}/>
}


type RatioOptionProps = {
  onChange: (value: Size) => void
  size: Size
}


function RatioOption({onChange, size}: RatioOptionProps) {
  const ratioStyle =
    cn(
      'px-2',
      'select-none rounded-full p-1 flex items-center justify-center bg-blend-soft-light',
      ' data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground bg-secondary text-secondary-foreground',
    )

  return <div className={'flex items-center text-sm gap-2 *:px-2 *:py-0.5 *:border *:border-white/30  *:backdrop-blur-md  *:bg-white/5'}>
    <div
      onClick={() => {onChange('auto')}}
      data-selected={size === 'auto'}
      className={cn(ratioStyle)}
    >
      Auto
    </div>
    <div
      onClick={() => {onChange('1x1')}}
      data-selected={size === '1x1'}
      className={cn(ratioStyle)}>
      1 : 1
    </div>
    <div
      data-selected={size === '2x3'}
      onClick={() => {onChange('2x3')}}
      className={cn(ratioStyle)}
    >
      2 : 3
    </div>
    <div
      onClick={() => {onChange('3x2')}}
      data-selected={size === '3x2'}
      className={cn(ratioStyle)}
    >
      3 : 2
    </div>
  </div>
}