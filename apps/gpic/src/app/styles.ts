export type Style = {
  id: string,
  styleId: string,
  i18n: i18nCode,
  name: string,
  aliases?: string[],
  description?: string,
  examples: string[],
  reference: string[],
  prompt?: string,
  type: 'system' | 'user'
}

type i18nCode = 'zh-CN' | 'en-US' | 'ja-JP' | 'ko-KR'

// default lang 'en-US'
// getStyleByUserId, setLangToStyle

export const styles: Style[] = [
  // {
  //   id: 'ghibli',
  //   name: '吉卜力',
  //   aliases: ['宫崎骏'],
  //   description: "",
  //   reference: [],
  //   examples: []
  // },
  // {
  //   id: 'rick-and-morty',
  //   name:'瑞克和莫蒂',
  //   aliases: ['Rick and Morty', 'Rick & Morty', 'R&M'],
  //   examples: []
  // },
  // {
  //   name:'皮克斯3D',
  //   id: 'pixel',
  //   aliases: [''],
  //   examples: []
  // }
]