import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";
import {create} from "zustand";
import { typeid } from 'typeid-js';
import {StyleInfo} from "@repo/service/shared";
import {friendlyWords} from "friendlier-words";
import {useEffect} from "react";
const createLocalId = () => typeid('style_local').toString();


type PresetStyle = {
  id: string,
  styleId: string,
  version: number,
  i18n: string,
  name: string,
  aliases: string[],
  examples: string[],
  prompt: string,
  reference: string[],
}
type LocalStyle = {
  id: string,
  name: string,
  prompt: string,
  reference: string[],
}
type StyleStore = {
  styles: Record<string, Style>,
  selectedStyles: string[]
}
type Style = {
  type: 'preset',
  style: PresetStyle
} | {
  type: 'local',
  style: LocalStyle
}

type StyleAction = {
  addLocalStyle: (name: string, reference:string[], prompt: string) => string
  syncRemoteStyle: (preset: PresetStyle[]) => void
  removeLocalStyle: (id: string) => void
  toggleStyle:(id: string) => void
}

const useStyleStore = create<StyleStore & StyleAction>((set, get) => ({
    styles: {},
    selectedStyles: [],
    addLocalStyle: (name, reference:string[], prompt: string) => {
      const id = createLocalId()
      set({
        styles: {
          ...get().styles,
          [id]: {
            type: 'local',
            style: { name, reference, prompt, id }
          }
        }
      })
      return id
    },
    syncRemoteStyle: (presetStyles: PresetStyle[]) => {
      const presetRecords = {} as Record<string, Style>
      presetStyles.forEach(preset => {
        presetRecords[preset.styleId] = {
          type: 'preset',
          style: preset,
        }
      })
      set({ styles: { ...get().styles, ...presetRecords } })
    },
    removeLocalStyle: (id: string) => {
      const styles = get().styles
      delete styles[id]
      set({ styles: styles, selectedStyles: get().selectedStyles.filter(it => it !== id) })
    },
    toggleStyle: (id: string) => {
      console.log('toggleStyle', id)

      const selected = get().selectedStyles
      console.log('selected', selected)
      
      if (selected.includes(id)) {
        set({ selectedStyles: selected.filter(it => it !== id) })
      }else {
        set({ selectedStyles: [...selected, id] })
      }
    }
  }),
)

// )(
  // persist(
//   {
//     name: 'style-storage',
//     version: 1,
//     partialize: (state) => ({ styles: state.styles }),
//   },)
const staticArr = [] as any[]
const s = {}
export const useStyles = () => {
  const syncRemoteStyle = useStyleStore(state => state.syncRemoteStyle)
  const addLocalStyle =  useStyleStore(state => state.addLocalStyle)
  const removeLocalStyle = useStyleStore(state => state.removeLocalStyle)
  const toggleStyle = useStyleStore(state => state.toggleStyle)
  const selectedStyleIds = useStyleStore(state => state.selectedStyles)
  const stylesMap = useStyleStore(state => state.styles)
  const styles = Object.values(stylesMap)
  const {data, isLoading, isSuccess} = useQuery({
    queryKey: ['styles'],
    retry: false,
    queryFn: async () => {
      const res = await api.getStyles()
      return res
    }
  })
  useEffect(() => {
    if(isSuccess) {
      syncRemoteStyle(data ?? [])
    }
  },[isSuccess])
  return {
    styles: styles,
    toggleStyle,
    removeLocalStyle,
    addLocalStyle,
    selectedStyleIds,
    isLoading: isLoading,
  }
}


export const useStyleAction = () => {
  const addLocalStyle =  useStyleStore(state => state.addLocalStyle)
  const removeLocalStyle = useStyleStore(state => state.removeLocalStyle)
  const toggleStyle = useStyleStore(state => state.toggleStyle)
  return {
    addLocalStyle,
    removeLocalStyle,
    toggleStyle
  }
}

export const useStyle = (info: StyleInfo) => {
  const stylesMap = useStyleStore(state => state.styles)
  const styles = Object.values(stylesMap)
  const id = (info as any).styleId
  let style = styles.find(it => it.style.id === id)
  if (!style) {
    style = {
      type: 'local',
      style: {
        ...info as unknown as any,
        id: createLocalId(),
        name: friendlyWords()
      }
    }
  }
  return {
    style
  }
}