import {useQuery} from "@tanstack/react-query";
import {api} from "@/lib/api";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import { typeid } from 'typeid-js';
const createLocalId = () => typeid('style_local').toString();


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

const useStyleStore = create<StyleStore & StyleAction>()(
  persist((set, get) => ({
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
      presetRecords[preset.friendlyStyleId] = {
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
    const selected = get().selectedStyles
    if (selected.includes(id)) {
      set({ selectedStyles: selected.filter(it => it !== id) })
    }else {
      set({ selectedStyles: [...selected, id] })
    }
  }
}),
  {
    name: 'style-storage',
    version: 1,
    partialize: (state) => ({ styles: state.styles }),
  },
))

export const useStyles = () => {
  const syncRemoteStyle = useStyleStore(state => state.syncRemoteStyle)
  const addLocalStyle =  useStyleStore(state => state.addLocalStyle)
  const removeLocalStyle = useStyleStore(state => state.removeLocalStyle)
  const toggleStyle = useStyleStore(state => state.toggleStyle)
  const selectedStyleIds = useStyleStore(state => state.selectedStyles)
  const stylesMap = useStyleStore(state => state.styles)
  const styles = Object.values(stylesMap)
  const {data, isLoading} = useQuery({
    queryKey: ['styles'],
    queryFn: async () => {
      const res = await api.getStyles()
      syncRemoteStyle(res)
      return res
    },
  })
  return {
    styles: styles,
    toggleStyle,
    removeLocalStyle,
    addLocalStyle,
    selectedStyleIds,
    isLoading: isLoading,
  }
}