import { typeid } from 'typeid-js'

export const parseIntOrDefault = (value:string, fallback:number = 0) => {
  let res = parseInt(value)
  return Number.isNaN(res) ? fallback : res
}

// export function uniqueId() {
//   return typeid()
// }

export const uniqueId = typeid
export * from './env'
export * from './validator-wrapper'