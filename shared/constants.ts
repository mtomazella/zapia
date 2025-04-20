import { MaterialColor, TActionType } from './types'

export const ACTION_TYPE_DISPLAY_TEXT: Record<TActionType, string> = {
  add: 'Adicionar',
  substitute: 'Substituir',
  variable: 'Variável',
}

export const ACTION_TYPE_COLORS: Record<TActionType, MaterialColor> = {
  add: 'success',
  substitute: 'error',
  variable: 'warning',
}

export const LOCAL_STORAGE_KEY = 'rpg-dice-data'
export const DEFAULT_SPACE = 'Padrão'
export const CONNECTION_STORAGE_KEY = 'rpg-dice-connection'
export const COLAPSES_STORAGE_KEY = 'rpg-dice-colapses'

export const SPACE_PAGE_ROUTE = ''
export const EDIT_SITUATION_PAGE_ROUTE = 'situation'
export const HELP_PAGE_ROUTE = 'help'
export const EDIT_SPACES_PAGE_ROUTE = 'spaces'
export const CONNECTION_CONFIG_ROUTE = 'connection'
export const CUSTOMIZATION_PAGE_ROUTE = 'customization'

export const BOT_URL =
  'https://discord.com/api/oauth2/authorize?client_id=1190519346708086954&permissions=8&scope=bot%20applications.commands'

export const DIE_COLORS: Record<string, { color: string; name: string }> =
  Array.from({ length: 30 })
    .map((_, i) => ({
      color: ((h = 0, s = 0, l = 0) => {
        l /= 100
        const a = (s * Math.min(l, 1 - l)) / 100
        const f = (n: any) => {
          const k = (n + h / 30) % 12
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
          return Math.round(255 * color)
            .toString(16)
            .padStart(2, '0') // convert to Hex and prefix "0" if needed
        }
        return `#${f(0)}${f(8)}${f(4)}`
      })(...[i * 10, 80, 50]),
      name: (i * 10).toString(),
    }))
    .reduce<Record<string, any>>((acc, color) => {
      acc[color.name] = color
      return acc
    }, {})

export type DieColor = keyof typeof DIE_COLORS
export const DEFAULT_DIE_COLOR: DieColor = '170'
