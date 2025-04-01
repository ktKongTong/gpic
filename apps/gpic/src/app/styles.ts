export type Style = {
  name: string,
  id: string,
  aliases?: string[],
  examples?: string[],
}
export const styles: Style[] = [
  {
    name:'吉卜力',
    id: ' ghibli',
    aliases: ['宫崎骏'],
    examples: []
  },
  {
    name:'瑞克和莫蒂',
    id: ' rick-and-morty',
    aliases: ['Rick and Morty', 'Rick & Morty', 'R&M'],
    examples: []
  },
  {
    name:'皮克斯3D',
    id: ' pixel',
    aliases: [''],
    examples: []
  }
]